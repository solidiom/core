/**
 * Prose — UnoCSS recipe: rich-text wrapper that styles descendant elements.
 * Zero runtime — applies typography via [data-scope="prose"] descendant selectors.
 *
 * Import stylesheet:
 *   `import "@solidiom/recipes-unocss/styles/prose.css"`
 *
 * Usage:
 *   `<article data-scope="prose" data-size="lg">{children}</article>`
 */

export const PROSE_SIZES = ["sm", "base", "lg"] as const
export type ProseSize = (typeof PROSE_SIZES)[number]
