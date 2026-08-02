import { readFileSync } from "node:fs"
import { dirname, join, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import { describe, expect, it } from "vitest"
import { REFERENCE_THEMES, SOLIDIOM_DEFAULT_THEME } from "./theme-contract-definitions"
import { resolveTokenValue } from "./theme-contract-schema"
import { validateThemeDefinition } from "./theme-contract-validate"

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..")
const TOKENS_CSS = join(ROOT, "apps/site/src/assets/tokens.css")

/**
 * Reads a `--sol-<name>: <value>;` declaration from a named block of tokens.css.
 * `tokens.css` repeats the same variable names across the light/dark/system-preference
 * blocks, so this greps within the block bounded by `startMarker`/`endMarker` rather
 * than matching the first occurrence anywhere in the file.
 */
function readSolValue(css: string, blockStart: RegExp, blockEnd: RegExp, name: string): string {
  const startMatch = blockStart.exec(css)
  if (!startMatch) throw new Error(`block start ${blockStart} not found in tokens.css`)
  const rest = css.slice(startMatch.index + startMatch[0].length)
  const endMatch = blockEnd.exec(rest)
  const block = endMatch ? rest.slice(0, endMatch.index) : rest

  const declaration = new RegExp(`--sol-${name}:\\s*([^;]+);`).exec(block)
  if (!declaration) throw new Error(`--sol-${name} not found in the matched block`)
  return declaration[1]!.trim()
}

describe("solidiom-default reference theme", () => {
  it("validates clean", () => {
    expect(validateThemeDefinition(SOLIDIOM_DEFAULT_THEME)).toEqual([])
  })

  it("is registered under its own slug", () => {
    expect(REFERENCE_THEMES["solidiom-default"]).toBe(SOLIDIOM_DEFAULT_THEME)
  })

  it("resolves focus-ring to the primary colour in both modes, matching tokens.css's alias", () => {
    expect(resolveTokenValue(SOLIDIOM_DEFAULT_THEME, "light", "focus-ring")).toBe(
      resolveTokenValue(SOLIDIOM_DEFAULT_THEME, "light", "primary"),
    )
    expect(resolveTokenValue(SOLIDIOM_DEFAULT_THEME, "dark", "focus-ring")).toBe(
      resolveTokenValue(SOLIDIOM_DEFAULT_THEME, "dark", "primary"),
    )
  })
})

describe("drift against apps/site/src/assets/tokens.css (BRAND-002)", () => {
  const css = readFileSync(TOKENS_CSS, "utf8")

  // Identity → tokens.css variable name, for the subset both files declare with a
  // directly comparable literal (skips composite/legacy-alias-only entries).
  const CHECKED: ReadonlyArray<readonly [id: string, cssName: string]> = [
    ["surface", "surface-base"],
    ["surface-raised", "surface-raised"],
    ["foreground", "foreground"],
    ["foreground-muted", "foreground-muted"],
    ["border", "border"],
    ["primary", "primary"],
    ["primary-hover", "primary-hover"],
    ["primary-foreground", "primary-foreground"],
    ["secondary", "secondary"],
    ["destructive", "destructive"],
    ["radius-sm", "radius-sm"],
    ["radius", "radius-md"],
    ["radius-lg", "radius-lg"],
    ["radius-full", "radius-full"],
  ]

  const LIGHT_START = /LIGHT THEME[\s\S]*?:root,\s*\n:root\[data-theme="light"\]\s*\{/
  const LIGHT_END = /DARK THEME/
  const DARK_START = /:root\[data-theme="dark"\]\s*\{/
  const DARK_END = /SYSTEM PREFERENCE FALLBACK/

  it("matches tokens.css's light values for every checked identity", () => {
    for (const [id, cssName] of CHECKED) {
      const cssValue = readSolValue(css, LIGHT_START, LIGHT_END, cssName)
      const themeValue = resolveTokenValue(SOLIDIOM_DEFAULT_THEME, "light", id)
      expect(themeValue.toLowerCase(), `light "${id}" should match --sol-${cssName}`).toBe(
        cssValue.toLowerCase(),
      )
    }
  })

  it("matches tokens.css's dark values for every checked identity", () => {
    for (const [id, cssName] of CHECKED) {
      const cssValue = readSolValue(css, DARK_START, DARK_END, cssName)
      const themeValue = resolveTokenValue(SOLIDIOM_DEFAULT_THEME, "dark", id)
      expect(themeValue.toLowerCase(), `dark "${id}" should match --sol-${cssName}`).toBe(
        cssValue.toLowerCase(),
      )
    }
  })
})
