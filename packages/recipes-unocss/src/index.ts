/**
 * @solidiom/recipes-unocss — UnoCSS recipe profile for Solidiom primitives.
 *
 * Targets semantic data-* attributes for styling via @solidiom/unocss-preset variants.
 *
 * PROFILE STATUS: declared, not implemented.
 * This package ships no stylesheets and no class-string recipes. It exists so the
 * profile has an identity in tooling and metadata ahead of RECIPE-004, which
 * implements the emitter and the recipe catalog.
 *
 * Read `supportedPrimitives` as declared intent and `implementedRecipes` as shipped
 * reality. They are deliberately separate so no consumer or audit can infer coverage
 * from the declaration alone. See docs/contracts/recipe-authoring-guide.md §2.2.
 */

/** Recipe profile identifier. */
export const recipeProfile = "unocss" as const

/**
 * Lifecycle state of this profile.
 *
 * - `declared` — the profile is named in tooling but ships no recipes.
 * - `implemented` — the profile ships paired stylesheets and class-string recipes.
 *
 * `tools/audit-recipe-dual-emission.ts` reads this marker: a profile with no
 * `styles/` or `recipes/` directory is reported as pending only while it is
 * `declared`. Flipping this to `implemented` without shipping recipes fails the
 * drift check instead of passing silently.
 */
export const profileStatus = "declared" as const

/** Task that closes the gap between `supportedPrimitives` and `implementedRecipes`. */
export const implementedBy = "RECIPE-004" as const

/**
 * Primitives this profile intends to cover, matching the CSS and Tailwind profiles.
 *
 * This is a declaration, not an implementation claim. `tools/primitive-completion-gate.ts`
 * requires recipe-classified primitives to be declared by all three profiles.
 */
export const supportedPrimitives = [
  "dialog",
  "select",
  "button",
  "checkbox",
  "switch",
  "tabs",
  "accordion",
  "popover",
  "tooltip",
  "menu",
  "toast",
  "badge",
  "alert",
] as const

/**
 * Primitives with a shipped UnoCSS recipe in this package.
 *
 * Empty until RECIPE-004. Every entry added here must have both emission forms
 * (`src/styles/<name>.css` and `src/recipes/<name>.tsx`) or the drift check fails.
 */
export const implementedRecipes: readonly string[] = []
