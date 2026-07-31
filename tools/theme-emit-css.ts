/**
 * tools/theme-emit-css — CSS variable emitter (THEME-002).
 *
 * Generates, per theme in `REFERENCE_THEMES`:
 *   - packages/themes/src/css/<slug>.css — `[data-theme="light"]`/`[data-theme="dark"]`
 *     blocks assigning every token identity's runtime spelling in the `css` namespace
 *     (`--ui-*`, tools/recipe-contract-tokens.ts) to that theme's resolved value.
 *
 * This is the same `--ui-*` namespace `@solidiom/recipes-css` and `@solidiom/recipes-unocss`
 * already read via `var(--ui-x, fallback)` (RECIPE-002/004) — installing a theme's
 * generated stylesheet is what makes `--ui-primary` resolve to that theme's primary
 * colour instead of falling through to a recipe's hardcoded fallback. A theme that
 * assigns no value to an identity is intentionally omitted from that theme's output;
 * the recipe's own `cssFallback` continues to apply for it.
 *
 * `null` in a token's `namespaces.css` map (tools/recipe-contract-tokens.ts) means the
 * `css` namespace cannot express that identity at all — those identities are skipped
 * here regardless of whether a theme assigns them, matching how the recipe emitters
 * treat an unmapped namespace as a recorded gap, not a bug.
 *
 * Usage: pnpm run theme:emit:css [--check]
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
const CSS_DIR = join(ROOT, "packages/themes/src/css")

/** Selector for one mode's block, matching BRAND-002's `data-theme` attribute convention. */
function modeSelector(mode: ThemeMode): string {
  return mode === "light" ? `:root,\n:root[data-theme="light"]` : `:root[data-theme="dark"]`
}

/**
 * Multiple canonical identities can share the same `css`/`unocss` spelling by design
 * (e.g. `surface` and `surface-raised` both spell `--ui-surface` — the CSS/UnoCSS
 * profiles do not distinguish base vs. raised surfaces at the runtime-variable level;
 * see recipe-contract-tokens.ts). When a theme assigns those identities *different*
 * values, silently emitting both `--ui-surface: a;` then `--ui-surface: b;` makes the
 * final value depend on iteration order rather than being a deliberate choice.
 *
 * Resolution: the earlier-declared identity in `SEMANTIC_TOKENS` wins deterministically
 * (`surface` before `surface-raised`), independent of a theme's own key order — matching
 * how the CSS profile's own hand-written stylesheets already had to pick one literal for
 * `--ui-surface` before this identity existed. A theme is still free to assign both
 * identities the same value, which resolves the collision without any precedence rule
 * mattering.
 */
function collapseBySpelling(
  entries: ReadonlyArray<{ id: string; spelling: string; value: string }>,
): Array<{ spelling: string; value: string }> {
  // SEMANTIC_TOKENS declaration order is the precedence order; entries are pre-filtered
  // to ids the theme declares, so iterate SEMANTIC_TOKENS and keep the first hit per
  // spelling rather than relying on the caller's (sorted-by-id) iteration order.
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
    const spelling = tokenSpelling(id, "css")
    if (!spelling) continue // css namespace cannot express this identity — recorded gap

    let value: string | undefined
    try {
      value = resolveTokenValue(definition, mode, id)
    } catch {
      continue // a reference cycle; already reported by the theme validator
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

function renderStylesheet(definition: ThemeDefinition): string {
  const blocks = THEME_MODES.map((mode) => renderModeBlock(definition, mode)).filter(Boolean)
  return `${generatedFileHeader("tools/theme-emit-css.ts", definition.meta.slug)}\n${blocks.join("\n\n")}\n`
}

export async function emitThemeCss(options: { check: boolean }): Promise<boolean> {
  const files: EmittedFile[] = Object.values(REFERENCE_THEMES).map((definition) => ({
    path: join(CSS_DIR, `${definition.meta.slug}.css`),
    contents: renderStylesheet(definition),
  }))

  const result = await writeEmittedFiles(files, options)

  if (options.check) {
    if (result.upToDate) {
      console.log("✓ Theme CSS emission is up to date")
    } else {
      console.error("✗ Theme CSS emission is stale — run: pnpm run theme:emit:css")
      for (const path of result.changed) console.error(`    ${path.replace(ROOT + "/", "")}`)
    }
  } else {
    console.log(
      result.changed.length > 0
        ? `✓ Wrote ${result.changed.length} generated theme CSS file(s)`
        : "✓ Theme CSS emission already up to date, nothing written",
    )
  }

  return result.upToDate
}

async function main(): Promise<void> {
  const check = process.argv.includes("--check")
  const upToDate = await emitThemeCss({ check })
  if (check && !upToDate) process.exitCode = 1
}

if (process.argv[1] && import.meta.url === new URL(`file://${process.argv[1]}`).href) {
  main()
}
