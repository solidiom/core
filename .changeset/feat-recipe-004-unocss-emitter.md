---
"@solidiom/recipes-unocss": minor
"@solidiom/unocss-preset": minor
---

Implement the UnoCSS emitter and close the recipe-catalog gap `@solidiom/recipes-unocss` previously declared but did not fill (RECIPE-004).

`@solidiom/recipes-unocss` now ships a full recipe catalog matching `@solidiom/recipes-css` and `@solidiom/recipes-tailwind`: 13 generated stylesheets, generated `.variants.ts` modules for `Button` and `Badge`, and 13 hand-written `.tsx` wrapper components, generated and maintained by `tools/recipe-emit-unocss.ts` (`pnpm run recipe:emit:unocss[:check]`) from the same canonical definitions the other two profiles use. The package gains the `"solid"` export condition, per-scope `./styles/<name>.css` subpaths, and workspace dependencies on the 13 primitives it wraps — previously it exported only a stub declaring its own lifecycle as `"declared, not implemented"`.

The UnoCSS stylesheet form uses plain CSS declarations resolved through a new `unocss` token namespace that shares the `css` namespace's `--ui-*` custom-property spellings (`tools/recipe-contract-tokens.ts`), rather than depending on UnoCSS's optional `transformerDirectives` plugin for an `@apply`-equivalent. Setting `--ui-primary` now themes the CSS and UnoCSS profiles simultaneously.

`@solidiom/unocss-preset` gains generated static rules (`rules` in `presetSolidiom()`'s returned preset object, https://unocss.dev/config/rules) for every variant and compound-variant class name across the canonical definitions — currently `Button` and `Badge`. This lets a consumer write `class="solidiom-btn--destructive"` directly and have UnoCSS resolve it through the preset, without importing `@solidiom/recipes-unocss/styles/button.css`. The existing vocabulary-derived variant generation (`getSolidiomVariants`) is unchanged.
