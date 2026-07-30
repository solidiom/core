import { readdirSync, readFileSync } from "node:fs"
import { dirname, join, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import { describe, expect, it } from "vitest"
import {
  REFERENCE_DEFINITIONS,
  badgeRecipe,
  popoverRecipe,
  tooltipRecipe,
} from "./recipe-contract-definitions"
import { referencedTokens } from "./recipe-contract-schema"
import { validateRecipeDefinition } from "./recipe-contract-validate"

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..")
const CSS_RECIPES = join(ROOT, "packages/recipes-css/src/recipes")
const CSS_STYLES = join(ROOT, "packages/recipes-css/src/styles")

function recipeScopes(): string[] {
  return readdirSync(CSS_RECIPES)
    .filter((entry) => entry.endsWith(".tsx"))
    .map((entry) => entry.slice(0, -".tsx".length))
    .sort()
}

function styledParts(scope: string): string[] {
  const stylesheet = readFileSync(join(CSS_STYLES, `${scope}.css`), "utf8")
  const parts = new Set(
    [...stylesheet.matchAll(new RegExp(`data-scope="${scope}"\\]\\[data-part="([^"]+)"`, "g"))].map(
      (match) => match[1]!,
    ),
  )
  return [...parts].sort()
}

describe("recipe definition coverage", () => {
  it("defines exactly one canonical definition for every shipped CSS recipe", () => {
    expect(Object.keys(REFERENCE_DEFINITIONS).sort()).toEqual(recipeScopes())
  })

  it("covers every semantic slot styled by each shipped CSS recipe", () => {
    for (const scope of recipeScopes()) {
      const definition = REFERENCE_DEFINITIONS[scope]!
      const definedParts = new Set(definition.slots.map((slot) => slot.part))
      const missing = styledParts(scope).filter((part) => !definedParts.has(part))
      expect(missing, `${scope} stylesheet has undocumented styled parts`).toEqual([])
    }
  })

  it("uses the primitive's data-state for alert type rather than legacy wrapper classes", () => {
    expect(Object.keys(REFERENCE_DEFINITIONS.alert!.slots[0]!.states ?? {}).sort()).toEqual([
      "error",
      "info",
      "success",
      "warning",
    ])
  })

  it("keeps Badge's variant-specific hover fills in the canonical definition", () => {
    expect(referencedTokens(badgeRecipe)).toEqual(
      expect.arrayContaining(["primary-hover", "secondary-hover", "destructive-hover"]),
    )
  })

  it("records positioning geometry as adapter-owned for positioned overlays", () => {
    for (const definition of [popoverRecipe, tooltipRecipe]) {
      const content = definition.slots.find((slot) => slot.part === "content")!
      expect(content.ownership).toBe("adapter")
      expect(content.adapterPort).toBe("PositioningPort")
      expect(content.adapterOwnedProperties).toEqual(
        expect.arrayContaining(["position", "top", "left", "transform"]),
      )
    }
  })

  it("accepts variant-scoped pseudo declarations and traverses their tokens", () => {
    expect(validateRecipeDefinition(badgeRecipe)).toEqual([])
    const defaultVariant = badgeRecipe.variants![0]!.values.default!.root!
    expect("pseudos" in defaultVariant ? defaultVariant.pseudos?.[":hover"] : undefined).toEqual({
      "background-color": { token: "primary-hover" },
    })
  })
})
