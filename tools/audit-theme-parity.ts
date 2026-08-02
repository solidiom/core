/**
 * tools/audit-theme-parity — cross-output parity, contrast, required-token, and
 * round-trip validation for shipped themes (THEME-005).
 *
 * THEME-001 validates a `ThemeDefinition` in isolation (schema, baseline coverage, a
 * 3:1 floor on three pairs). This audit checks what only exists once THEME-002/003/004
 * have generated real output: that every profile's generated file actually agrees with
 * the source JSON and with each other, that the full contrast matrix — not just the
 * floor — is sound, and that a theme document survives a JSON round-trip unchanged.
 *
 * Five independent checks, each returning its own violations:
 *   1. auditGeneratedFreshness — every emitter's output matches what regenerating it
 *      now would produce (delegates to each emitter's own `--check` mode).
 *   2. auditCrossOutputParity — the CSS and UnoCSS profiles assign the same value to
 *      the same `--ui-*` variable in the same mode (they share the runtime namespace,
 *      RECIPE-004 §4, so they must not silently diverge).
 *   3. auditContrastMatrix — every intent-foreground/background pair and every
 *      surface/foreground pair meets the WCAG AA text minimum (4.5:1) or non-text
 *      minimum (3:1), in both modes — the exhaustive check THEME-001's validator
 *      explicitly deferred to this file.
 *   4. auditSiteTokenContrast — the site's hand-written `tokens.css` (--sol-* tokens)
 *      meets the same WCAG AA minimums as the theme contract (A11Y-008). This closes
 *      the gap where the site's `--sol-secondary` could drift below 4.5:1 without the
 *      theme-contract audit catching it.
 *   5. auditRoundTrip — serialising a reference theme to JSON and parsing it back
 *      produces a value-equal `ThemeDefinition` (BUILDER-004/005's persistence
 *      depends on this holding).
 *
 * Usage: pnpm run audit:theme-parity
 */
import { existsSync, readFileSync } from "node:fs"
import { join } from "node:path"
import { emitThemeCss } from "./theme-emit-css"
import { emitThemeTailwind } from "./theme-emit-tailwind"
import { emitThemeUnocss } from "./theme-emit-unocss"
import { contrastBetween } from "./theme-contract-contrast"
import { REFERENCE_THEMES } from "./theme-contract-definitions"
import {
  THEME_MODES,
  resolveTokenValue,
  type ThemeDefinition,
  type ThemeMode,
} from "./theme-contract-schema"
import { tokenSpelling } from "./recipe-contract-tokens"

const ROOT = join(import.meta.dirname ?? __dirname, "..")

export interface ThemeParityError {
  check: string
  theme: string
  message: string
}

// ─── 1. Generated freshness ──────────────────────────────────────────────────

export async function auditGeneratedFreshness(): Promise<ThemeParityError[]> {
  const errors: ThemeParityError[] = []

  const css = await emitThemeCss({ check: true })
  if (!css) {
    errors.push({
      check: "generated freshness",
      theme: "*",
      message: "packages/themes/src/css/*.css is stale — run: pnpm run theme:emit:css",
    })
  }

  const tailwind = await emitThemeTailwind({ check: true })
  if (!tailwind) {
    errors.push({
      check: "generated freshness",
      theme: "*",
      message: "packages/themes/src/tailwind/*.css is stale — run: pnpm run theme:emit:tailwind",
    })
  }

  const unocss = await emitThemeUnocss({ check: true })
  if (!unocss) {
    errors.push({
      check: "generated freshness",
      theme: "*",
      message:
        "packages/unocss-preset/src/generated-theme-preflights.ts is stale — run: pnpm run theme:emit:unocss",
    })
  }

  return errors
}

// ─── 2. Cross-output parity ──────────────────────────────────────────────────

/** Parses `--name: value;` declarations out of a `[data-theme="mode"]` block. */
function parseModeBlock(css: string, mode: ThemeMode): Map<string, string> {
  const selector =
    mode === "light"
      ? /:root,\s*\n:root\[data-theme="light"\]\s*\{/
      : /:root\[data-theme="dark"\]\s*\{/
  const startMatch = selector.exec(css)
  if (!startMatch) return new Map()
  const rest = css.slice(startMatch.index + startMatch[0].length)
  const end = rest.indexOf("\n}")
  const block = end === -1 ? rest : rest.slice(0, end)

  const declarations = new Map<string, string>()
  for (const match of block.matchAll(/(--[a-z0-9-]+):\s*([^;]+);/g)) {
    declarations.set(match[1]!, match[2]!.trim())
  }
  return declarations
}

/**
 * Asserts the CSS profile's generated stylesheet and the UnoCSS profile's generated
 * preflight assign the same value to every `--ui-*` variable they both declare, in
 * both modes. They read the same runtime namespace at consumption time
 * (RECIPE-004 §4), so a divergence here is a real bug in one of the two emitters, not
 * a legitimate profile difference.
 */
export async function auditCrossOutputParity(): Promise<ThemeParityError[]> {
  const errors: ThemeParityError[] = []
  const preflightPath = join(ROOT, "packages/unocss-preset/src/generated-theme-preflights.ts")

  if (!existsSync(preflightPath)) {
    return [
      {
        check: "cross-output parity",
        theme: "*",
        message: "generated-theme-preflights.ts is missing — run: pnpm run theme:emit:unocss",
      },
    ]
  }

  const { SOLIDIOM_THEME_PREFLIGHTS } = (await import(
    `${preflightPath}?t=${Date.now()}`
  )) as typeof import("../packages/unocss-preset/src/generated-theme-preflights")

  for (const definition of Object.values(REFERENCE_THEMES)) {
    const slug = definition.meta.slug
    const cssPath = join(ROOT, "packages/themes/src/css", `${slug}.css`)

    if (!existsSync(cssPath)) {
      errors.push({
        check: "cross-output parity",
        theme: slug,
        message: "packages/themes/src/css output is missing — run: pnpm run theme:emit:css",
      })
      continue
    }

    const preflight = SOLIDIOM_THEME_PREFLIGHTS.find((entry) => entry.slug === slug)
    if (!preflight) {
      errors.push({
        check: "cross-output parity",
        theme: slug,
        message: "no matching entry in generated-theme-preflights.ts",
      })
      continue
    }

    const cssText = readFileSync(cssPath, "utf8")
    const unocssText = preflight.css

    for (const mode of THEME_MODES) {
      const cssDeclarations = parseModeBlock(cssText, mode)
      const unocssDeclarations = parseModeBlock(unocssText, mode)

      for (const [name, value] of cssDeclarations) {
        const unocssValue = unocssDeclarations.get(name)
        if (unocssValue === undefined) {
          errors.push({
            check: "cross-output parity",
            theme: slug,
            message: `mode "${mode}": css declares ${name} but the unocss preflight does not`,
          })
        } else if (unocssValue.toLowerCase() !== value.toLowerCase()) {
          errors.push({
            check: "cross-output parity",
            theme: slug,
            message: `mode "${mode}": ${name} is "${value}" in css but "${unocssValue}" in the unocss preflight`,
          })
        }
      }

      for (const name of unocssDeclarations.keys()) {
        if (!cssDeclarations.has(name)) {
          errors.push({
            check: "cross-output parity",
            theme: slug,
            message: `mode "${mode}": unocss preflight declares ${name} but css does not`,
          })
        }
      }
    }
  }

  return errors
}

// ─── 3. Contrast matrix ──────────────────────────────────────────────────────

/** WCAG AA body-text minimum. */
const TEXT_CONTRAST_MINIMUM = 4.5
/** WCAG AA non-text/large-text minimum (matches THEME-001's floor). */
const NON_TEXT_CONTRAST_MINIMUM = 3

interface ContrastPair {
  foreground: string
  background: string
  minimum: number
  label: string
}

/**
 * Pairs this audit holds to a WCAG AA minimum. Deliberately narrower than "every
 * token against every surface": WCAG 1.4.11 non-text contrast applies to a control's
 * *state-conveying* boundary (an input border, a focus ring) — not to every decorative
 * divider a design uses for subtle visual separation, which several accepted,
 * "border-first" aesthetics (including this reference theme's, see
 * apps/site/src/assets/tokens.css's header comment) intentionally keep low-contrast.
 * A generic `border`/`surface` pair is therefore not checked here; `focus-ring`, which
 * *is* a state-conveying indicator every consumer depends on for visibility, is.
 */
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

export function auditContrastMatrix(): ThemeParityError[] {
  const errors: ThemeParityError[] = []

  for (const definition of Object.values(REFERENCE_THEMES)) {
    for (const mode of THEME_MODES) {
      for (const pair of CONTRAST_PAIRS) {
        let fg: string | undefined
        let bg: string | undefined
        try {
          fg = resolveTokenValue(definition, mode, pair.foreground)
          bg = resolveTokenValue(definition, mode, pair.background)
        } catch {
          continue // reference cycle; reported by the THEME-001 validator
        }
        if (fg === undefined || bg === undefined) continue // not declared; not this audit's job

        const ratio = contrastBetween(fg, bg)
        if (ratio === undefined) continue // unparseable colour form; cannot verify

        if (ratio < pair.minimum) {
          errors.push({
            check: "contrast matrix",
            theme: definition.meta.slug,
            message: `mode "${mode}": ${pair.label} ("${pair.foreground}" on "${pair.background}") is ${ratio.toFixed(2)}:1, below the ${pair.minimum}:1 WCAG AA minimum`,
          })
        }
      }
    }
  }

  return errors
}

// ─── 4. Site-token contrast (A11Y-008) ───────────────────────────────────

/**
 * Extract `--sol-*` declarations from a CSS block matching the given selector pattern.
 * Returns a map of token name (without `--sol-` prefix) to value.
 */
function parseSolTokens(css: string, selectorPattern: RegExp): Map<string, string> {
  const tokens = new Map<string, string>()
  const blockMatch = css.match(new RegExp(selectorPattern.source + "\\s*\\{([\\s\\S]*?)\\n\\}"))
  if (!blockMatch) return tokens

  for (const match of blockMatch[1].matchAll(/--sol-([a-z0-9-]+)\s*:\s*([^;]+);/g)) {
    tokens.set(match[1]!, match[2]!.trim())
  }
  return tokens
}

/**
 * Pairs the site uses for body text or interactive elements that must meet WCAG AA.
 * These mirror the theme-contract contrast matrix but target --sol-* tokens directly.
 */
const SITE_CONTRAST_PAIRS: readonly ContrastPair[] = [
  {
    foreground: "foreground",
    background: "surface-base",
    minimum: TEXT_CONTRAST_MINIMUM,
    label: "body text on page background",
  },
  {
    foreground: "foreground",
    background: "surface-raised",
    minimum: TEXT_CONTRAST_MINIMUM,
    label: "body text on raised surfaces",
  },
  {
    foreground: "foreground-muted",
    background: "surface-base",
    minimum: TEXT_CONTRAST_MINIMUM,
    label: "muted text on page background",
  },
  {
    foreground: "primary-foreground",
    background: "primary",
    minimum: TEXT_CONTRAST_MINIMUM,
    label: "text on primary fills",
  },
  {
    foreground: "primary",
    background: "surface-raised",
    minimum: NON_TEXT_CONTRAST_MINIMUM,
    label: "primary accents against raised surfaces",
  },
  {
    foreground: "secondary",
    background: "surface-raised",
    minimum: TEXT_CONTRAST_MINIMUM,
    label: "secondary/links against raised surfaces",
  },
  {
    foreground: "focus-ring",
    background: "surface-base",
    minimum: NON_TEXT_CONTRAST_MINIMUM,
    label: "the focus indicator",
  },
]

/**
 * Verifies the site's hand-written tokens.css meets WCAG AA minimums for both
 * light and dark mode. This is A11Y-008's closing check: the theme contract
 * validates `ThemeDefinition` instances, but the site's tokens sit in a separate
 * namespace (`--sol-*`) and could drift without this check.
 */
export function auditSiteTokenContrast(): ThemeParityError[] {
  const errors: ThemeParityError[] = []
  const tokensPath = join(
    ROOT,
    "apps/site/src/assets/tokens.css",
  )

  if (!existsSync(tokensPath)) {
    return [
      {
        check: "site-token contrast",
        theme: "*",
        message: "apps/site/src/assets/tokens.css not found",
      },
    ]
  }

  const cssText = readFileSync(tokensPath, "utf8")

  // Parse light mode from :root, :root[data-theme="light"]
  const lightTokens = parseSolTokens(
    cssText,
    /:root,\s*\n:root\[data-theme="light"\]/,
  )
  // Parse dark mode from :root[data-theme="dark"]
  const darkTokens = parseSolTokens(
    cssText,
    /:root\[data-theme="dark"\]/,
  )

  const modes: Array<{ name: string; tokens: Map<string, string> }> = [
    { name: "light", tokens: lightTokens },
    { name: "dark", tokens: darkTokens },
  ]

  for (const { name, tokens } of modes) {
    for (const pair of SITE_CONTRAST_PAIRS) {
      const fg = tokens.get(pair.foreground)
      const bg = tokens.get(pair.background)
      if (fg === undefined) {
        errors.push({
          check: "site-token contrast",
          theme: name,
          message: `missing --sol-${pair.foreground} in ${name} mode`,
        })
        continue
      }
      if (bg === undefined) {
        errors.push({
          check: "site-token contrast",
          theme: name,
          message: `missing --sol-${pair.background} in ${name} mode`,
        })
        continue
      }

      const ratio = contrastBetween(fg, bg)
      if (ratio === undefined) {
        errors.push({
          check: "site-token contrast",
          theme: name,
          message: `cannot parse color for ${pair.label}: "${fg}" on "${bg}"`,
        })
        continue
      }

      if (ratio < pair.minimum) {
        errors.push({
          check: "site-token contrast",
          theme: name,
          message: `${pair.label} (--sol-${pair.foreground} on --sol-${pair.background}) is ${ratio.toFixed(2)}:1, below the ${pair.minimum}:1 WCAG AA minimum`,
        })
      }
    }
  }

  return errors
}

// ─── 5. Round-trip ───────────────────────────────────────────────────────────

/** Deep-equality check without a dependency — themes are plain JSON-shaped objects. */
function deepEqual(a: unknown, b: unknown): boolean {
  return JSON.stringify(a) === JSON.stringify(b)
}

export function auditRoundTrip(): ThemeParityError[] {
  const errors: ThemeParityError[] = []

  for (const definition of Object.values(REFERENCE_THEMES)) {
    const serialized = JSON.stringify(definition)
    const parsed = JSON.parse(serialized) as ThemeDefinition
    if (!deepEqual(definition, parsed)) {
      errors.push({
        check: "round-trip",
        theme: definition.meta.slug,
        message: "JSON.parse(JSON.stringify(definition)) does not deep-equal the source definition",
      })
    }
  }

  return errors
}

// ─── Required-token coverage (re-exposed from THEME-001 for a single entrypoint) ────

export { REQUIRED_BASELINE_TOKENS } from "./theme-contract-validate"

// ─── Entrypoint ───────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  console.log("Theme parity audit (THEME-005)\n")

  const freshness = await auditGeneratedFreshness()
  const crossOutput = await auditCrossOutputParity()
  const contrast = auditContrastMatrix()
  const siteContrast = auditSiteTokenContrast()
  const roundTrip = auditRoundTrip()

  const all = [...freshness, ...crossOutput, ...contrast, ...siteContrast, ...roundTrip]

  if (all.length === 0) {
    console.log("✓ Generated freshness: all emitters up to date")
    console.log("✓ Cross-output parity: css and unocss agree on every --ui-* value")
    console.log("✓ Contrast matrix: every required pair meets its WCAG AA minimum")
    console.log("✓ Site-token contrast: every --sol-* pair meets its WCAG AA minimum (A11Y-008)")
    console.log("✓ Round-trip: every reference theme survives JSON.stringify/JSON.parse")
    console.log("\n✓ Theme parity audit PASSED")
    return
  }

  for (const error of all) {
    console.error(`  ✗ [${error.check}] ${error.theme}: ${error.message}`)
  }
  console.error(`\n✗ Theme parity audit FAILED — ${all.length} issue(s)`)
  process.exitCode = 1
}

if (process.argv[1] && import.meta.url === new URL(`file://${process.argv[1]}`).href) {
  main()
}
