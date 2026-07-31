---
"@solidiom/recipes-tailwind": patch
---

Fix Tailwind compound-variant utility conflicts by merging generated class strings with `tailwind-merge`.

`tools/recipe-emit-tailwind.ts`'s generated `<scope>Variants()` functions (`badgeVariants`, `buttonVariants`) concatenated a matched variant, size, and compound's Tailwind utilities in declaration order via `class-variance-authority`'s `cva()`. `cva()` assumes the last class wins a conflict, but Tailwind v4's compiled stylesheet orders utilities by its own internal grouping and scale value, not by the order classes appear in the `class` attribute — so a compound variant's override (e.g. `button`'s `"link"` + `"md"` compound setting `padding: 0`) could lose to an earlier-registered utility on the same property (`"md"`'s `padding: 0.5rem 1rem`) regardless of `compoundVariants` array order.

Each generated `.variants.ts` module now keeps its `cva()` call internal (renamed `<scope>VariantsCva`) and exports `<scope>Variants()` as a thin wrapper that pipes the result through `tailwind-merge`'s `twMerge()`, which understands Tailwind's utility groups and resolves the conflict the way the `css`/`unocss` profiles' cascade-based stylesheets already do. `@solidiom/recipes-tailwind` gains `tailwind-merge` as a runtime dependency, bundled into `dist/index.js` alongside `class-variance-authority`.

`tools/recipe-emit-tailwind-utilities.ts`'s `boxUtility` reverts to emitting the `p-*`/`m-*` shorthand for a uniform padding/margin value (rather than always forcing the `py-*`/`px-*` axis form) — that was a narrower workaround for the same underlying conflict, now superseded by the general fix above. Generated `@apply` stylesheets are unaffected by either change (they use real CSS selectors with normal specificity, not concatenated utility classes), and are cosmetically simplified back to the shorthand form.

`tests/recipe-parity/button.browser.test.tsx`'s `"link"+"md"` compound-variant test now asserts real `padding` and `border-radius` parity across all three profiles instead of documenting the conflict as a known gap.

Implementing this surfaced a separate, unrelated defect, tracked as a follow-up rather than fixed here: `tools/recipe-emit-tailwind-utilities.ts` maps a bare `font-size` declaration to Tailwind's `text-*` utilities, which bundle an opinionated `line-height` a canonical definition may not have declared. This makes `height: auto` compute differently between profiles wherever a definition sets `font-size` without an explicit `line-height` (at least `accordion`, `button`'s `"sm"`/`"md"` sizes, `dialog`, `menu`, `select`, `tabs`, `toast`) — see the "NEW KNOWN GAP" comment in `tests/recipe-parity/button.browser.test.tsx` and `docs/contracts/recipe-contract.md` §10.
