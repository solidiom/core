/**
 * tools/theme-emit-unocss — UnoCSS preset/configuration emitter (THEME-004).
 *
 * UnoCSS has no `@theme`-equivalent theme layer of its own (recipe-contract.md §4: the
 * `unocss` token namespace re-spells the same `--ui-*` custom properties `css` uses).
 * A theme's UnoCSS "configuration" is therefore the same variable assignments
 * THEME-002 emits, expressed as a UnoCSS preflight — injectable CSS a consumer's
 * `defineConfig({ presets: [presetSolidiom()], preflights: [...] })` can include
 * without a separate stylesheet import, matching how `@solidiom/unocss-preset`
 * already ships `getSolidiomVariantRules()` as data rather than a stylesheet.
 *
 * Generates, per theme in `REFERENCE_THEMES`:
 *   - packages/unocss-preset/src/generated-theme-preflights.ts — one
 *     `UnocssThemePreflight` per theme, containing the light/dark `--ui-*` CSS text
 *     THEME-002 also emits (same source, same resolution, different destination file)
 *     plus a `getRaw()`-shaped export the preset's `presetSolidiom()` can splice into
 *     UnoCSS's `preflights` array.
 *
 * `packages/unocss-preset` cannot depend on `tools/` at runtime (`tools/` is not a
 * published package) — the same constraint `tools/recipe-emit-unocss.ts` documents for
 * `generated-variant-rules.ts` — so this is generated data, not a `tools/` import.
 *
 * Usage: pnpm run theme:emit:unocss [--check]
 */
import { join } from "node:path"
import { generatedFileHeader, writeEmittedFiles, type EmittedFile } from "./recipe-emit-core"
import { SEMANTIC_TOKENS, tokenSpelling } from "./recipe-contract-tokens"
import { REFERENCE_THEMES } from "./theme-contract-definitions"
import {
  THEME_MODES,
  resolveTokenValue,
  type ThemeDefinition,
  type ThemeMode,
} from "./theme-contract-schema"

const ROOT = join(import.meta.dirname ?? __dirname, "..")
const PRESET_DIR = join(ROOT, "packages/unocss-preset/src")
const OUTPUT_FILE = join(PRESET_DIR, "generated-theme-preflights.ts")

function modeSelector(mode: ThemeMode): string {
  return mode === "light" ? `:root,\n:root[data-theme="light"]` : `:root[data-theme="dark"]`
}

/**
 * See tools/theme-emit-css.ts's `collapseBySpelling` for why this dedup is necessary:
 * `surface`/`surface-raised` share `--ui-surface` in this namespace too. Kept as a
 * separate copy rather than an import so this emitter has no runtime dependency on
 * theme-emit-css.ts beyond the shared `recipe-emit-core`/`recipe-contract-tokens`
 * infrastructure both already use.
 */
function collapseBySpelling(
  entries: ReadonlyArray<{ id: string; spelling: string; value: string }>,
): Array<{ spelling: string; value: string }> {
  const bySpelling = new Map<string, { id: string; value: string }>()
  for (const token of SEMANTIC_TOKENS) {
    const entry = entries.find((candidate) => candidate.id === token.id)
    if (!entry) continue
    if (!bySpelling.has(entry.spelling)) {
      bySpelling.set(entry.spelling, { id: entry.id, value: entry.value })
    }
  }
  return [...bySpelling.entries()].map(([spelling, { value }]) => ({ spelling, value }))
}

function renderModeBlock(definition: ThemeDefinition, mode: ThemeMode): string {
  const tokens = definition.modes[mode] ?? {}
  const resolved: Array<{ id: string; spelling: string; value: string }> = []

  for (const id of Object.keys(tokens)) {
    // "unocss" resolves through the same runtime namespace as "css" (RECIPE-004 §4).
    const spelling = tokenSpelling(id, "unocss") ?? tokenSpelling(id, "css")
    if (!spelling) continue

    let value: string | undefined
    try {
      value = resolveTokenValue(definition, mode, id)
    } catch {
      continue
    }
    if (value === undefined) continue

    resolved.push({ id, spelling, value })
  }

  const collapsed = collapseBySpelling(resolved).sort((a, b) =>
    a.spelling.localeCompare(b.spelling),
  )
  const lines = collapsed.map(({ spelling, value }) => `  ${spelling}: ${value};`)

  if (lines.length === 0) return ""
  return `${modeSelector(mode)} {\n${lines.join("\n")}\n}`
}

function renderCss(definition: ThemeDefinition): string {
  return THEME_MODES.map((mode) => renderModeBlock(definition, mode))
    .filter(Boolean)
    .join("\n\n")
}

function renderModule(definitions: readonly ThemeDefinition[]): string {
  const entries = definitions
    .map((definition) => {
      const css = renderCss(definition)
      return [
        `  {`,
        `    slug: ${JSON.stringify(definition.meta.slug)},`,
        `    name: ${JSON.stringify(definition.meta.name)},`,
        `    css: ${JSON.stringify(css)},`,
        `  },`,
      ].join("\n")
    })
    .join("\n")

  return [
    generatedFileHeader("tools/theme-emit-unocss.ts", "unocss-preset", "ts"),
    `/** One theme's \`--ui-*\` variable assignments, ready to splice into UnoCSS's \`preflights\` array. */`,
    `export interface UnocssThemePreflight {`,
    `  slug: string`,
    `  name: string`,
    `  /** Raw CSS text: \`[data-theme]\`-scoped \`--ui-*\` custom property assignments. */`,
    `  css: string`,
    `}`,
    ``,
    `/** Generated from tools/theme-contract-definitions.ts's REFERENCE_THEMES (THEME-004). */`,
    `export const SOLIDIOM_THEME_PREFLIGHTS: UnocssThemePreflight[] = [`,
    entries,
    `]`,
    ``,
    `/** Looks up a shipped theme's preflight by slug. */`,
    `export function themePreflight(slug: string): UnocssThemePreflight | undefined {`,
    `  return SOLIDIOM_THEME_PREFLIGHTS.find((theme) => theme.slug === slug)`,
    `}`,
    ``,
  ].join("\n")
}

export async function emitThemeUnocss(options: { check: boolean }): Promise<boolean> {
  const definitions = Object.values(REFERENCE_THEMES)
  const files: EmittedFile[] = [{ path: OUTPUT_FILE, contents: renderModule(definitions) }]

  const result = await writeEmittedFiles(files, options)

  if (options.check) {
    if (result.upToDate) {
      console.log("✓ Theme UnoCSS emission is up to date")
    } else {
      console.error("✗ Theme UnoCSS emission is stale — run: pnpm run theme:emit:unocss")
      for (const path of result.changed) console.error(`    ${path.replace(ROOT + "/", "")}`)
    }
  } else {
    console.log(
      result.changed.length > 0
        ? `✓ Wrote ${result.changed.length} generated theme UnoCSS file(s)`
        : "✓ Theme UnoCSS emission already up to date, nothing written",
    )
  }

  return result.upToDate
}

async function main(): Promise<void> {
  const check = process.argv.includes("--check")
  const upToDate = await emitThemeUnocss({ check })
  if (check && !upToDate) process.exitCode = 1
}

if (process.argv[1] && import.meta.url === new URL(`file://${process.argv[1]}`).href) {
  main()
}
