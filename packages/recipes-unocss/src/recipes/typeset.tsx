/**
 * Typeset — UnoCSS recipe: frozen data map for granular typography scale.
 * No component wrapper — UnoCSS profile uses data-* attributes + generated stylesheet only.
 *
 * Import stylesheet:
 *   `import "@solidiom/recipes-unocss/styles/typeset.css"`
 *
 * Usage:
 *   `<p data-scope="typeset" data-part="lead">...</p>`
 */

export const typeset = {
  lead: "data-scope='typeset' data-part='lead'",
  large: "data-scope='typeset' data-part='large'",
  muted: "data-scope='typeset' data-part='muted'",
  blockquote: "data-scope='typeset' data-part='blockquote'",
  inlineCode: "data-scope='typeset' data-part='inline-code'",
} as const

export type TypesetKey = keyof typeof typeset
