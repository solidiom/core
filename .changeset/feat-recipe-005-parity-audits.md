---
"@solidiom/recipes-css": patch
"@solidiom/recipes-tailwind": patch
"@solidiom/recipes-unocss": patch
---

Extend recipe audits to cross-profile coverage/state/exception parity and computed-style parity, and fix three defects the new checks found (RECIPE-005).

New `tools/audit-recipe-parity.ts` (`pnpm run audit:recipe-parity`) is driven by the canonical definitions in `tools/recipe-contract-definitions.ts` rather than by comparing a profile's CSS to its own TSX, which is what `tools/audit-recipe-dual-emission.ts` already did and continues to do. The new audit asserts: every declared slot and state actually appears in each profile's stylesheet (not merely that whatever the stylesheet contains is rendered by the wrapper); a `.variants.ts` class-string module exists if and only if the scope declares a `variants` axis; a declared `adapter`-owned slot's `adapterOwnedProperties` are genuinely absent from that profile's own ruleset for the slot; and all three profiles cover the same scopes, slots, and states as each other.

New `tests/recipe-parity/` (`pnpm run test:recipe-parity`) renders each profile's hand-written wrapper component with its own resolved stylesheet injected, in a real browser, and compares `getComputedStyle` across profiles — the assertion contract §6 specifies ("parity is asserted on computed style over a rendered fixture, not on generated strings") and that nothing previously implemented. Currently covers `badge` and `button`, the two scopes with a `variants` axis.

Building this harness found and fixed three real defects, none introduced by this change:

- `tools/recipe-emit-tailwind.ts`'s `renderVariantsModule` accumulated a variant or compound value's utilities incorrectly when a value produced more than one rule (a base rule and a separate `:hover` pseudo rule) — the second rule silently overwrote the first instead of merging with it. Every `recipes-tailwind` variant with a `:hover` declaration (`badge`'s four variants, `button`'s `default` state pair) rendered only its hover fill; the base background and text color were dropped. Fixed to accumulate every rule's utilities per value.
- `tools/recipe-emit-tailwind-utilities.ts`'s `boxUtility` emitted the `p-*`/`m-*` shorthand for a uniform padding/margin value. Tailwind v4's compiled stylesheet orders shorthand and axis-form (`py-*`/`px-*`) utilities as separate groups, with the axis group always after the shorthand group regardless of the order classes appear in an element's `class` attribute — so a compound variant's `p-0` never won the cascade over a size class's `py-2 px-4`. `boxUtility` now always emits the axis form.
- `packages/recipes-tailwind/src/styles/theme.css`'s `--color-primary-hover` fallback (`hsl(222 47% 18%)`) did not match `recipes-css`/`recipes-unocss`'s fallback for the same token identity (`hsl(222 47% 20%)`); corrected to match.

One gap the fix above does not close is documented, not silently passed: a compound variant's utility can still lose to a size class's utility on the same property when both use the axis form but different scale values, because Tailwind v4 orders utilities within a group by scale value rather than by source order. Closing this needs `tailwind-merge` or per-value custom-property indirection — both are scoped changes affecting every recipe with a compound variant, tracked as a follow-up rather than folded into this change. See `docs/contracts/recipe-contract.md` §6 and the "KNOWN GAP" comment in `tests/recipe-parity/button.browser.test.tsx`.

Both new checks run in `gate:phase1`; the computed-style suite additionally runs in `ci.yml`'s `test-browser` job.
