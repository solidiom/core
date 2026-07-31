/**
 * tools/theme-emit-tailwind — Tailwind `@theme` mapping emitter (THEME-003).
 *
 * Generates, per theme in `REFERENCE_THEMES`:
 *   - packages/themes/src/tailwind/<slug>.css — a Tailwind v4 `@theme` block registering
 *     every token identity with a `tailwind` namespace spelling
 *     (tools/recipe-contract-tokens.ts) under its Tailwind theme variable name, resolved
 *     from `var(--ui-*, <this theme's value>)` — the same runtime namespace THEME-002
 *     assigns and `@solidiom/recipes-tailwind`'s recipes already reference.
 *
 * This supersedes the hand-maintained fallback values in
 * `packages/recipes-tailwind/src/styles/theme.css` (see that file's header comment,
 * which named THEME-003 as the eventual generator) with per-theme generated output:
 * the *mapping* (which Tailwind name resolves which `--ui-*` property) is
 * theme-independent and stays hand-authored in `recipes-tailwind` for the profile's own
 * zero-theme-installed baseline; this emitter's output is what a theme replaces the
 * fallback with when installed.
 *
 * Only identities with a `tailwind` spelling are emitted — `null` entries are a
 * recorded gap (RECIPE-003/THEME-003), not a bug.
 *
 * TAILWIND VARIABLE NAMESPACE
 * Tailwind v4's `@theme` block keys a token's CSS variable name by category:
 * `--color-*` for colours, `--radius-*` for corner radii, `--shadow-*` for shadows.
 * `recipe-contract-tokens.ts`'s `category` field selects which `@theme` namespace a
 * given identity's `tailwind` spelling is registered under.
 *
 * Usage: pnpm run theme:emit:tailwind [--check]
 */
import { join } from "node:path"
import { generatedFileHeader, writeEmittedFiles, type EmittedFile } from "./recipe-emit-core"
import { SEMANTIC_TOKENS, tokenSpelling, type TokenCategory } from "./recipe-contract-tokens"
import { REFERENCE_THEMES } from "./theme-contract-definitions"
import { resolveTokenValue, type ThemeDefinition } from "./theme-contract-schema"

const ROOT = join(import.meta.dirname ?? __dirname, "..")
const TAILWIND_DIR = join(ROOT, "packages/themes/src/tailwind")

/** Tailwind v4 `@theme` variable prefix for a token's category. Categories with no
 * Tailwind-namespaced form (e.g. typography, focus) fall through to `--color-*`
 * only when the identity actually has a `tailwind` spelling; most do not. */
const THEME_VAR_PREFIX: Partial<Record<TokenCategory, string>> = {
  radius: "--radius-",
  shadow: "--shadow-",
}

function themeVarName(category: TokenCategory, tailwindName: string): string {
  const prefix = THEME_VAR_PREFIX[category] ?? "--color-"
  return `${prefix}${tailwindName}`
}

/** This theme's light-mode resolved value, used as this profile's `var()` fallback so
 * the Tailwind output looks correct even before any `[data-theme]` attribute is set —
 * matching how `@solidiom/recipes-tailwind`'s hand-maintained theme.css already
 * hardcodes a light-mode-shaped literal as every variable's fallback. */
function fallbackFor(definition: ThemeDefinition, id: string): string | undefined {
  try {
    return resolveTokenValue(definition, "light", id)
  } catch {
    return undefined
  }
}

function renderStylesheet(definition: ThemeDefinition): string {
  const lines: string[] = []

  for (const token of SEMANTIC_TOKENS) {
    const tailwindName = tokenSpelling(token.id, "tailwind")
    if (!tailwindName) continue // no Tailwind spelling — recorded gap

    const cssSpelling = tokenSpelling(token.id, "css")
    if (!cssSpelling) continue // nothing to var() against in the shared runtime namespace

    const fallback = fallbackFor(definition, token.id)
    if (fallback === undefined) continue // theme does not assign this identity at all

    const varName = themeVarName(token.category, tailwindName)
    lines.push(`  ${varName}: var(${cssSpelling}, ${fallback});`)
  }

  return `${generatedFileHeader("tools/theme-emit-tailwind.ts", definition.meta.slug)}\n@theme {\n${lines.join("\n")}\n}\n`
}

export async function emitThemeTailwind(options: { check: boolean }): Promise<boolean> {
  const files: EmittedFile[] = Object.values(REFERENCE_THEMES).map((definition) => ({
    path: join(TAILWIND_DIR, `${definition.meta.slug}.css`),
    contents: renderStylesheet(definition),
  }))

  const result = await writeEmittedFiles(files, options)

  if (options.check) {
    if (result.upToDate) {
      console.log("✓ Theme Tailwind emission is up to date")
    } else {
      console.error("✗ Theme Tailwind emission is stale — run: pnpm run theme:emit:tailwind")
      for (const path of result.changed) console.error(`    ${path.replace(ROOT + "/", "")}`)
    }
  } else {
    console.log(
      result.changed.length > 0
        ? `✓ Wrote ${result.changed.length} generated theme Tailwind file(s)`
        : "✓ Theme Tailwind emission already up to date, nothing written",
    )
  }

  return result.upToDate
}

async function main(): Promise<void> {
  const check = process.argv.includes("--check")
  const upToDate = await emitThemeTailwind({ check })
  if (check && !upToDate) process.exitCode = 1
}

if (process.argv[1] && import.meta.url === new URL(`file://${process.argv[1]}`).href) {
  main()
}
