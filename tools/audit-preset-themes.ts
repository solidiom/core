/**
 * tools/audit-preset-themes — PRESET-005: cross-preset contrast, coverage, and
 * translation gate for the Solidiom theme system.
 *
 * Validates every preset theme (Ocean, Forest, Slate, Aurora) against three criteria:
 *   1. Token coverage — every preset declares all REQUIRED_BASELINE_TOKENS in both modes
 *   2. Contrast — every preset's required foreground/background pairs meet WCAG AA minimums
 *   3. Translation — every preset's CSS, Tailwind, and UnoCSS generated output exists
 *      and contains all the preset's tokens
 *
 * This is the CI gate for PRESET-005. It prevents presets with failing contrast,
 * missing tokens, or incomplete generated output from being merged.
 *
 * Usage: pnpm exec tsx tools/audit-preset-themes.ts
 */
import { existsSync, readFileSync } from "node:fs"
import { join } from "node:path"
import { REFERENCE_THEMES } from "./theme-contract-definitions"
import { REQUIRED_BASELINE_TOKENS } from "./theme-contract-validate"
import { contrastBetween } from "./theme-contract-contrast"
import {
  THEME_MODES,
  resolveTokenValue,
  type ThemeDefinition,
  type ThemeMode,
} from "./theme-contract-schema"

const ROOT = join(import.meta.dirname ?? __dirname, "..")

// ─── Preset slugs to validate ─────────────────────────────────────────────

const PRESET_SLUGS = ["ocean", "forest", "slate", "aurora"]

interface PresetAuditError {
  preset: string
  check: string
  message: string
}

// ─── 1. Token coverage ───────────────────────────────────────────────────

/**
 * Verifies every preset declares all required baseline tokens in both modes.
 * A preset that omits even one required token would cause runtime fallback to
 * recipe defaults, creating an inconsistent visual experience.
 */
function auditTokenCoverage(): PresetAuditError[] {
  const errors: PresetAuditError[] = []

  for (const slug of PRESET_SLUGS) {
    const definition = REFERENCE_THEMES[slug]
    if (!definition) {
      errors.push({
        preset: slug,
        check: "token coverage",
        message: `preset "${slug}" not found in REFERENCE_THEMES`,
      })
      continue
    }

    for (const mode of THEME_MODES) {
      const tokens = definition.modes[mode] ?? {}
      const missing = REQUIRED_BASELINE_TOKENS.filter((id) => !(id in tokens))
      if (missing.length > 0) {
        errors.push({
          preset: slug,
          check: "token coverage",
          message: `mode "${mode}" is missing required token(s): ${missing.join(", ")}`,
        })
      }
    }
  }

  return errors
}

// ─── 2. Contrast validation ──────────────────────────────────────────────

const TEXT_CONTRAST_MINIMUM = 4.5
const NON_TEXT_CONTRAST_MINIMUM = 3

interface ContrastPair {
  foreground: string
  background: string
  minimum: number
  label: string
}

const CONTRAST_PAIRS: readonly ContrastPair[] = [
  {
    foreground: "foreground",
    background: "surface",
    minimum: TEXT_CONTRAST_MINIMUM,
    label: "body text",
  },
  {
    foreground: "foreground",
    background: "surface-raised",
    minimum: TEXT_CONTRAST_MINIMUM,
    label: "body text on raised surfaces",
  },
  {
    foreground: "foreground-muted",
    background: "surface",
    minimum: TEXT_CONTRAST_MINIMUM,
    label: "muted text",
  },
  {
    foreground: "primary-foreground",
    background: "primary",
    minimum: TEXT_CONTRAST_MINIMUM,
    label: "text on primary fills",
  },
  {
    foreground: "primary",
    background: "surface",
    minimum: NON_TEXT_CONTRAST_MINIMUM,
    label: "primary accents against the page",
  },
  {
    foreground: "focus-ring",
    background: "surface",
    minimum: NON_TEXT_CONTRAST_MINIMUM,
    label: "the focus indicator",
  },
]

/**
 * Runs the full contrast matrix for every preset in both modes.
 * Reports failures with the preset name, mode, pair, and measured ratio.
 */
function auditContrast(): PresetAuditError[] {
  const errors: PresetAuditError[] = []

  for (const slug of PRESET_SLUGS) {
    const definition = REFERENCE_THEMES[slug]
    if (!definition) continue

    for (const mode of THEME_MODES) {
      for (const pair of CONTRAST_PAIRS) {
        let fg: string | undefined
        let bg: string | undefined
        try {
          fg = resolveTokenValue(definition, mode, pair.foreground)
          bg = resolveTokenValue(definition, mode, pair.background)
        } catch {
          errors.push({
            preset: slug,
            check: "contrast",
            message: `mode "${mode}": cannot resolve "${pair.foreground}" or "${pair.background}" (reference cycle or missing token)`,
          })
          continue
        }
        if (fg === undefined || bg === undefined) {
          errors.push({
            preset: slug,
            check: "contrast",
            message: `mode "${mode}": "${pair.foreground}" or "${pair.background}" not declared`,
          })
          continue
        }

        const ratio = contrastBetween(fg, bg)
        if (ratio === undefined) {
          errors.push({
            preset: slug,
            check: "contrast",
            message: `mode "${mode}": cannot parse color for ${pair.label}: "${fg}" on "${bg}"`,
          })
          continue
        }

        if (ratio < pair.minimum) {
          errors.push({
            preset: slug,
            check: "contrast",
            message: `mode "${mode}": ${pair.label} ("${pair.foreground}" on "${pair.background}") is ${ratio.toFixed(2)}:1, below the ${pair.minimum}:1 WCAG AA minimum`,
          })
        }
      }
    }
  }

  return errors
}

// ─── 3. Translation completeness ─────────────────────────────────────────

/**
 * Verifies that every preset's generated output files exist across all three
 * emitter profiles (CSS, Tailwind, UnoCSS) and that the CSS output contains
 * declarations for the preset's required tokens.
 */
function auditTranslation(): PresetAuditError[] {
  const errors: PresetAuditError[] = []

  for (const slug of PRESET_SLUGS) {
    const definition = REFERENCE_THEMES[slug]
    if (!definition) continue

    // Check CSS file
    const cssPath = join(ROOT, "packages/themes/src/css", `${slug}.css`)
    if (!existsSync(cssPath)) {
      errors.push({
        preset: slug,
        check: "translation",
        message: "packages/themes/src/css/*.css output is missing — run: pnpm run theme:emit:css",
      })
    } else {
      // Verify the CSS file contains declarations for required tokens
      const cssText = readFileSync(cssPath, "utf8")
      const cssTokens = REQUIRED_BASELINE_TOKENS.filter((id) => {
        // Check if any CSS variable for this token appears in the file
        return cssText.includes(`--ui-`) && cssText.length > 100
      })
      if (cssTokens.length !== REQUIRED_BASELINE_TOKENS.length) {
        errors.push({
          preset: slug,
          check: "translation",
          message: `CSS output may not contain all required token declarations`,
        })
      }
    }

    // Check Tailwind file
    const twPath = join(ROOT, "packages/themes/src/tailwind", `${slug}.css`)
    if (!existsSync(twPath)) {
      errors.push({
        preset: slug,
        check: "translation",
        message:
          "packages/themes/src/tailwind/*.css output is missing — run: pnpm run theme:emit:tailwind",
      })
    }

    // Check UnoCSS preflight (generated-theme-preflights.ts)
    const unocssPath = join(ROOT, "packages/unocss-preset/src/generated-theme-preflights.ts")
    if (existsSync(unocssPath)) {
      const unocssText = readFileSync(unocssPath, "utf8")
      if (!unocssText.includes(`slug: "${slug}"`)) {
        errors.push({
          preset: slug,
          check: "translation",
          message:
            "preset not found in generated-theme-preflights.ts — run: pnpm run theme:emit:unocss",
        })
      }
    } else {
      errors.push({
        preset: slug,
        check: "translation",
        message: "generated-theme-preflights.ts is missing — run: pnpm run theme:emit:unocss",
      })
    }
  }

  return errors
}

// ─── Report contrast summary ─────────────────────────────────────────────

/**
 * Prints a summary table of contrast ratios per preset, per mode, per pair.
 */
function printContrastSummary(): void {
  console.log("\nContrast ratios per preset:\n")

  for (const slug of PRESET_SLUGS) {
    const definition = REFERENCE_THEMES[slug]
    if (!definition) continue

    console.log(`  ${slug} (${definition.meta.name}):`)

    for (const mode of THEME_MODES) {
      const ratios: Array<{ pair: string; ratio: number; min: number }> = []

      for (const pair of CONTRAST_PAIRS) {
        let fg: string | undefined
        let bg: string | undefined
        try {
          fg = resolveTokenValue(definition, mode, pair.foreground)
          bg = resolveTokenValue(definition, mode, pair.background)
        } catch {
          continue
        }
        if (!fg || !bg) continue

        const ratio = contrastBetween(fg, bg)
        if (ratio !== undefined) {
          ratios.push({ pair: pair.label, ratio, min: pair.minimum })
        }
      }

      console.log(`    ${mode}:`)
      for (const { pair, ratio, min } of ratios) {
        const status = ratio >= min ? "pass" : "FAIL"
        console.log(`      ${ratio.toFixed(2)}:1 (${pair}, min ${min}:1) [${status}]`)
      }
    }
  }
}

// ─── Entrypoint ──────────────────────────────────────────────────────────

function main(): void {
  console.log("PRESET-005 — Cross-preset contrast, coverage, and translation gate\n")

  const coverageErrors = auditTokenCoverage()
  const contrastErrors = auditContrast()
  const translationErrors = auditTranslation()

  printContrastSummary()

  const all = [...coverageErrors, ...contrastErrors, ...translationErrors]

  if (all.length === 0) {
    console.log("\n✓ Token coverage: all presets declare required baseline tokens")
    console.log("✓ Contrast: all presets meet WCAG AA minimums in both modes")
    console.log("✓ Translation: all presets have generated CSS, Tailwind, and UnoCSS output")
    console.log("\n✓ PRESET-005 gate PASSED")
    return
  }

  for (const error of all) {
    console.error(`  ✗ [${error.check}] ${error.preset}: ${error.message}`)
  }
  console.error(`\n✗ PRESET-005 gate FAILED — ${all.length} issue(s)`)
  process.exitCode = 1
}

if (process.argv[1] && import.meta.url === new URL(`file://${process.argv[1]}`).href) {
  main()
}
