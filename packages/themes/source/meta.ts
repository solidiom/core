/**
 * @solidiom/themes — metadata for the shipped theme catalog.
 *
 * THEME-002/003/004 generate this package's `css/` and `tailwind/` stylesheets, and
 * (once a consumer needs it) a UnoCSS preset extension, from
 * `tools/theme-contract-definitions.ts`'s `ThemeDefinition` documents. This file lists
 * what currently ships so a consumer or the registry can enumerate themes without
 * reading `tools/` (not a published package) at runtime.
 */

export interface ShippedTheme {
  slug: string
  name: string
  /** Output forms this theme currently ships, matching apps/site's `themes` content collection. */
  outputs: readonly ("css" | "tailwind" | "unocss")[]
}

/** Kept in sync with `tools/theme-contract-definitions.ts`'s `REFERENCE_THEMES` by
 * `tools/theme-emit-css.ts`/`tools/theme-emit-tailwind.ts` (THEME-002/003) — each
 * emitter run regenerates the corresponding stylesheet for every entry here. */
export const SHIPPED_THEMES: readonly ShippedTheme[] = [
  { slug: "solidiom-default", name: "Solidiom Default", outputs: ["css", "tailwind"] },
]
