/**
 * Typeset — Tailwind recipe: frozen class-string map for granular typography scale.
 * No cva() — these entries have no variants, so a function call adds nothing.
 *
 * Import stylesheet (for data-attribute usage):
 *   `import "@solidiom/recipes-tailwind/styles/typeset.css"`
 */

export const typeset = {
  heading1: "scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl",
  heading2: "scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight",
  heading3: "scroll-m-20 text-2xl font-semibold tracking-tight",
  heading4: "scroll-m-20 text-xl font-semibold tracking-tight",
  paragraph: "leading-7 [&:not(:first-child)]:mt-6",
  lead: "text-xl text-muted-foreground",
  large: "text-lg font-semibold",
  small: "text-sm font-medium leading-none",
  muted: "text-sm text-muted-foreground",
  blockquote: "mt-6 border-l-2 pl-6 italic",
  inlineCode: "relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold",
} as const

export type TypesetKey = keyof typeof typeset
