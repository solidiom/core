/**
 * tests/recipe-parity/harness — computed-style parity harness (RECIPE-005 phase 3).
 *
 * Contract §6: "Parity is asserted on computed style over a rendered fixture, not on
 * generated strings." The css and unocss profiles emit plain declarations
 * (`var(--ui-*, fallback)`), directly injectable as-is. The tailwind profile emits
 * `@apply` inside `@layer components`, which browsers cannot parse directly — it must
 * be resolved to real declarations first, using `@tailwindcss/node`'s programmatic
 * `compile()` (the same compiler Tailwind's own Vite plugin uses).
 *
 * This module runs inside the browser-mode test context, which has no Node builtins
 * (`node:fs`/`node:path` are externalized by Vite) — so it cannot read files at
 * runtime at all, for any profile. Instead every profile's stylesheet is loaded via
 * Vite's `?raw` import suffix, which inlines file contents as a string at bundle
 * time, in both Node and browser contexts, with no filesystem access needed here.
 *
 * The tailwind profile's `@apply` resolution still can't happen in the browser
 * (`@tailwindcss/node` is Node-only — native oxide bindings, `node:os`/`node:tty`), so
 * that step runs once, ahead of time, in `globalSetupTailwind.ts` (Node, via Vitest's
 * `globalSetup` hook), which writes the resolved CSS to
 * `.generated/tailwind-resolved.css`. This module then `?raw`-imports that generated
 * file exactly like the other two profiles' stylesheets — no special-casing needed
 * once it exists on disk.
 */
import cssBadge from "../../packages/recipes-css/src/styles/badge.css?raw"
import unocssBadge from "../../packages/recipes-unocss/src/styles/badge.css?raw"
import cssButton from "../../packages/recipes-css/src/styles/button.css?raw"
import unocssButton from "../../packages/recipes-unocss/src/styles/button.css?raw"
// Written by globalSetupTailwind.ts before any test file is collected; empty string
// if globalSetup has not run yet. Both scopes share the same compiled sheet — it
// contains every scope, namespaced by [data-scope="..."] — so one import covers both.
import tailwindResolved from "./.generated/tailwind-resolved.css?raw"

export type ProfileName = "recipes-css" | "recipes-tailwind" | "recipes-unocss"
export const PROFILES: readonly ProfileName[] = [
  "recipes-css",
  "recipes-tailwind",
  "recipes-unocss",
]

/**
 * Stylesheet text per profile, for the scopes this harness currently covers.
 *
 * `?raw` imports must be static (Vite resolves them at bundle time), so this cannot
 * be a generic `resolveProfileCss(profile, scope)` function backed by a dynamic file
 * read — each scope's stylesheet needs its own static import, added here as the
 * harness grows to cover more scopes.
 */
const BADGE_CSS: Record<ProfileName, string> = {
  "recipes-css": cssBadge,
  "recipes-unocss": unocssBadge,
  "recipes-tailwind": tailwindResolved,
}

const BUTTON_CSS: Record<ProfileName, string> = {
  "recipes-css": cssButton,
  "recipes-unocss": unocssButton,
  "recipes-tailwind": tailwindResolved,
}

function requireTailwindResolved(profile: ProfileName, css: string): string {
  if (profile === "recipes-tailwind" && !css) {
    throw new Error(
      "tests/recipe-parity/.generated/tailwind-resolved.css is empty — this suite's " +
        "globalSetup (globalSetupTailwind.ts) must run before any test file. Run via " +
        "pnpm --filter @solidiom/tests-recipe-parity test, not vitest directly without --config.",
    )
  }
  return css
}

export function resolveBadgeCss(profile: ProfileName): string {
  return requireTailwindResolved(profile, BADGE_CSS[profile])
}

export function resolveButtonCss(profile: ProfileName): string {
  return requireTailwindResolved(profile, BUTTON_CSS[profile])
}

/** Injects `css` into `document.head` and returns a function that removes it. */
export function injectStylesheet(css: string): () => void {
  const style = document.createElement("style")
  style.textContent = css
  document.head.appendChild(style)
  return () => style.remove()
}

/**
 * Reads `property` from `element`'s computed style, trimmed for stable comparison.
 * Colors always serialize as `rgb()`/`rgba()` from `getComputedStyle` regardless of
 * how the source declared them (hex, hsl, oklch), so no color-specific handling is
 * needed for the properties this harness currently compares.
 */
export function computedProperty(element: Element, property: string): string {
  return getComputedStyle(element).getPropertyValue(property).trim()
}
