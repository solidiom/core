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
- `packages/recipes-tailwind/src/styles/theme.css`'s `--color-primary-hover` fallback (`hsl(222 47% 18%)`) did not match `recipes-css`/`recipes-unocss`'s fallback for the same token identity (`hsl(222 47% 20%)`); corrected to match.
- A compound variant's utility could lose to a size class's utility on the same property when Tailwind v4 ordered the two utility groups differently in its compiled stylesheet, regardless of source order — see the follow-up changeset for the `tailwind-merge` fix.

Both new checks run in `gate:phase1`; the computed-style suite additionally runs in `ci.yml`'s `test-browser` job.
