import { describe, expect, it } from "vitest"
import { readFileSync, readdirSync } from "node:fs"
import { join } from "node:path"
import {
  SEMANTIC_TOKENS,
  SEMANTIC_TOKEN_IDS,
  isSemanticToken,
  tokenSpelling,
  unmappedTokens,
} from "./recipe-contract-tokens"

const ROOT = join(import.meta.dirname ?? __dirname, "..")
const CSS_STYLES = join(ROOT, "packages/recipes-css/src/styles")
const TAILWIND_SRC = join(ROOT, "packages/recipes-tailwind/src")
const TAILWIND_THEME = join(TAILWIND_SRC, "styles/theme.css")

/**
 * Tailwind utility prefixes that resolve against a theme colour name.
 *
 * Longest alternatives first: `ring-offset` must precede `ring`, otherwise
 * `ring-offset-background` tokenises as the colour name `offset-background`.
 *
 * `border` additionally allows a side infix (`-t`, `-b`, `-l`, `-r`) before the colour
 * name, e.g. `border-b-primary`, which RECIPE-003's generated per-part border colours
 * use for cross-part-state-free styling (docs/contracts/recipe-authoring-guide.md §3.2).
 */
const COLOUR_UTILITIES =
  /\b(?:bg|text|border(?:-[tblr])?|ring-offset|ring|divide|outline|fill|stroke|placeholder|caret|from|via|to)-([a-z][a-z0-9-]*)/g

/**
 * Removes Tailwind arbitrary-value segments before utility matching.
 *
 * Their contents are raw CSS, not utility names, so COLOUR_UTILITIES misreads
 * them. The emitted `typeset.css` contains `@apply [border-left-width:2px]`,
 * where `border` matches the utility prefix and the remainder is captured as the
 * phantom theme colour `left-width` — a failure with no corresponding token to
 * register. Genuine arbitrary colours such as `bg-[#fff]` need no registration
 * either, so dropping the whole bracketed segment is correct in both cases.
 */
function withoutArbitraryValues(source: string): string {
  return source.replace(/\[[^\]]*\]/g, "")
}

/** Tailwind built-ins and non-colour utility suffixes that need no theme registration. */
const NOT_A_THEME_COLOUR = new Set([
  // structural / non-colour utility suffixes
  "b",
  "t",
  "l",
  "r",
  "b-2",
  "l-2",
  "none",
  "solid",
  "dashed",
  "collapse",
  "current",
  "transparent",
  "black",
  "white",
  "linecap",
  "linejoin",
  "width",
  "offset-2",
  // typography scale, not colour
  "xs",
  "sm",
  "base",
  "lg",
  "xl",
  "left",
  "center",
  "right",
])

function readAll(dir: string, extension: string): string {
  return readdirSync(dir, { withFileTypes: true })
    .flatMap((entry) => {
      const full = join(dir, entry.name)
      if (entry.isDirectory()) return [readAll(full, extension)]
      return entry.name.endsWith(extension) ? [readFileSync(full, "utf8")] : []
    })
    .join("\n")
}

/** Tailwind default palette shades (blue-50, red-800, …) are always available. */
function isDefaultPaletteShade(name: string): boolean {
  return /^(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-\d{2,3}$/.test(
    name,
  )
}

describe("canonical semantic tokens", () => {
  it("has no duplicate identities", () => {
    expect(SEMANTIC_TOKENS).toHaveLength(SEMANTIC_TOKEN_IDS.size)
  })

  it("matches the count published in the contract document", () => {
    // docs/contracts/recipe-contract.md §1 and docs/contracts/recipe-authoring-guide.md
    // "Superseded guidance" both state this number. A doc reader treats it as the size of
    // the closed vocabulary, so drift here is a correctness bug, not a typo. Update the
    // two documents in the same change that adds or removes an identity.
    expect(SEMANTIC_TOKENS).toHaveLength(60)
  })

  it("gives every identity a description and a category", () => {
    for (const token of SEMANTIC_TOKENS) {
      expect(token.description.length, `${token.id} needs a description`).toBeGreaterThan(0)
      expect(token.category, `${token.id} needs a category`).toBeTruthy()
    }
  })

  it("maps every identity into at least one namespace", () => {
    for (const token of SEMANTIC_TOKENS) {
      const mapped = Object.values(token.namespaces).filter((value) => value !== null)
      expect(mapped.length, `${token.id} maps to no namespace at all`).toBeGreaterThan(0)
    }
  })

  it("records the namespaces that cannot express an identity", () => {
    // Not an aspiration: these gaps are what RECIPE-002/003/004 and THEME-002..004 close.
    expect(unmappedTokens("css").length).toBeGreaterThan(0)
    expect(unmappedTokens("tailwind").length).toBeGreaterThan(0)
  })
})

describe("CSS profile token usage", () => {
  const css = readAll(CSS_STYLES, ".css")
  const used = [...new Set([...css.matchAll(/var\((--ui-[a-z-]+)/g)].map((match) => match[1]))]

  it("uses at least the tokens the recipes are known to reference", () => {
    expect(used.length).toBeGreaterThan(20)
  })

  it("resolves every --ui-* custom property to a canonical identity or a known alias", () => {
    const spellings = new Set(
      SEMANTIC_TOKENS.map((token) => token.namespaces.css).filter(
        (value): value is string => value !== null,
      ),
    )
    const unaccounted = used.filter((property) => !spellings.has(property))
    expect(unaccounted, "add these to recipe-contract-tokens.ts").toEqual([])
  })
})

describe("Tailwind profile theme contract", () => {
  const theme = readFileSync(TAILWIND_THEME, "utf8")
  const registered = new Set(
    [...theme.matchAll(/--color-([a-z][a-z0-9-]*)\s*:/g)].map((match) => match[1]),
  )
  const registeredRadii = new Set(
    [...theme.matchAll(/--radius-([a-z][a-z0-9-]*)\s*:/g)].map((match) => match[1]),
  )
  const registeredShadows = new Set(
    [...theme.matchAll(/--shadow-([a-z][a-z0-9-]*)\s*:/g)].map((match) => match[1]),
  )
  const referenced = new Set(
    [...withoutArbitraryValues(readAll(TAILWIND_SRC, ".css")).matchAll(COLOUR_UTILITIES)]
      .concat([...withoutArbitraryValues(readAll(TAILWIND_SRC, ".tsx")).matchAll(COLOUR_UTILITIES)])
      .map((match) => match[1])
      .filter((name) => !NOT_A_THEME_COLOUR.has(name) && !isDefaultPaletteShade(name)),
  )

  it("registers every theme colour name the recipes reference", () => {
    const missing = [...referenced].filter((name) => !registered.has(name)).sort()
    expect(
      missing,
      "packages/recipes-tailwind/src/styles/theme.css must register these for the profile to render styled",
    ).toEqual([])
  })

  it("resolves every registered name from the shared --ui-* namespace", () => {
    for (const [, value] of theme.matchAll(/--(?:color|radius|shadow)-[a-z0-9-]+:\s*([^;]+);/g)) {
      expect(value, "theme tokens must read the shared runtime namespace").toContain("var(--ui-")
    }
  })

  it("keeps the theme contract consistent with the canonical token spellings", () => {
    // Every canonical identity with a tailwind spelling must be registered under the
    // theme namespace that matches its category — colours under --color-*, radii under
    // --radius-*, shadows under --shadow-*.
    for (const token of SEMANTIC_TOKENS) {
      const spelling = tokenSpelling(token.id, "tailwind")
      if (!spelling) continue
      // Typography tokens (fontSize-*) are not registered in theme.css — the
      // Tailwind profile uses literal values (text-xs, text-sm, …) for the type scale.
      if (token.category === "typography") continue
      const registeredSet =
        token.category === "radius"
          ? registeredRadii
          : token.category === "shadow"
            ? registeredShadows
            : registered
      expect(registeredSet.has(spelling), `${token.id} → ${spelling} is not in theme.css`).toBe(
        true,
      )
    }
  })
})

describe("token lookup helpers", () => {
  it("recognises a canonical identity", () => {
    expect(isSemanticToken("primary")).toBe(true)
    expect(isSemanticToken("brand-gradient")).toBe(false)
  })

  it("returns undefined for a namespace with no equivalent", () => {
    expect(tokenSpelling("shadow-lg", "css")).toBe("--ui-shadow-lg")
    expect(tokenSpelling("surface-sunken", "css")).toBeUndefined()
    expect(tokenSpelling("primary", "css")).toBe("--ui-primary")
  })
})
