# @solidiom/recipes-tailwind

## 0.1.0

### Minor Changes

- [`c134eb6`](https://github.com/solidiom/core/commit/c134eb684446a47195a19cf7928e0c84ee475278) Thanks [@devx](https://github.com/devx)! - Add the canonical recipe contract's semantic vocabulary and the Tailwind theme contract.

  `@solidiom/runtime` now exports the semantic attribute vocabulary that was previously implicit in `applySemanticAttrs` and duplicated as hand-maintained allowlists in the audit tooling: `SEMANTIC_ATTRIBUTES` (14 attributes), `SEMANTIC_FLAGS` (8 boolean flags), `SEMANTIC_ORIENTATIONS`, `SEMANTIC_SIDES`, `SEMANTIC_SIZES`, `SCOPE_STATES` (35 known scopes: 33 stateful plus stateless Badge and Toast), `COMPOSITE_SCOPES`, `VOCABULARY_EXCEPTIONS`, the `isSemanticAttribute` / `isKnownScope` / `isKnownState` / `statesForScope` / `vocabularyException` / `allStateValues` guards, and the `SemanticFlagName` type. These are additive; no existing export changed shape.

  Two consequences for consumers who style against Solidiom's data attributes:

  - `data-value` is not part of the vocabulary. The previous audit allowlist permitted it even though `applySemanticAttrs` cannot emit it, so any selector written against `data-value` was already dead. Nothing regressed here, but the attribute will not be added.
  - Nine scope/state pairs are recorded in `VOCABULARY_EXCEPTIONS` because they emit a `data-state` value that duplicates a boolean flag (`date-picker`, `data-table`, `tree`, `progress`) or encodes a compound value (`data-table` sort direction). They remain legal and emitted. Each entry names the primitive task that resolves it, so a selector relying on the duplicated `data-state` form should expect it to be withdrawn in a future major release of that primitive; prefer the boolean flag.

  `@solidiom/recipes-tailwind` adds a `./styles/theme.css` export and imports it first from `./styles`. It registers all 17 theme colour names the Tailwind recipes reference as Tailwind v4 `@theme` tokens resolving from the shared `--ui-*` namespace, with fallbacks matching `@solidiom/recipes-css`. Before this change those names were defined only in the docs application's stylesheet, so installing the package alone produced unstyled recipes and setting `--ui-primary` themed only the CSS profile. Now the two profiles agree visually with no theme installed, and setting a `--ui-*` value themes both.

  **Migration:** consumers on Tailwind v4 who already import `@solidiom/recipes-tailwind/styles` get the theme contract automatically. Consumers who import individual recipe stylesheets should add `@import "@solidiom/recipes-tailwind/styles/theme.css"` ahead of them. Tailwind v3 has no `@theme`, so v3 consumers must continue mapping the same names under `theme.extend.colors`; `THEME-003` will generate that mapping.

  `@solidiom/unocss-preset` now derives its variants from the shared vocabulary rather than a local copy, and takes `@solidiom/runtime` as a dependency. Flag/state collisions are disambiguated: the bare variant stays on the boolean flag (`uiSelected` matches `[data-selected]`) and the state form is namespaced (`uiStateSelected` matches `[data-state='selected']`). The namespaced variants exist only to cover the recorded vocabulary exceptions and will disappear when the owning primitives stop emitting a flag as a state.

  `@solidiom/recipes-unocss` now declares its lifecycle honestly. It exports `profileStatus` (`"declared"`), `implementedBy`, and separate `supportedPrimitives` and `implementedRecipes` lists so no consumer or audit can infer coverage from the declaration. The package still ships no stylesheets and no class-string recipes; `RECIPE-004` implements them.

- [`797c1b7`](https://github.com/solidiom/core/commit/797c1b7c492a4a89d0c80af70c35c66510c65f00) Thanks [@devx](https://github.com/devx)! - Implement the Tailwind emitter (RECIPE-003). Every recipe in `@solidiom/recipes-tailwind` — all 13 shipped scopes — is now generated from `tools/recipe-contract-definitions.ts` by `tools/recipe-emit-tailwind.ts` (`pnpm run recipe:emit:tailwind[:check]`) rather than hand-authored, using a declaration-to-Tailwind-utility mapping table (`tools/recipe-emit-tailwind-utilities.ts`) that falls back to Tailwind's arbitrary-value syntax for a value outside the default scale rather than dropping it silently.

  `packages/recipes-tailwind/src/styles/theme.css` gains `--radius-*` and `--shadow-*` `@theme` registrations, three intent-hover colours (`primary-hover`, `secondary-hover`, `destructive-hover`), an `overlay` colour, and the twelve status identities (`info`/`success`/`warning`/`danger` × base/surface/border) — closing every `tailwind`-namespace token gap that existed while the emitter was pending. `theme.css` itself remains hand-maintained until `THEME-003`.

  Because the CSS and Tailwind emitters share the same canonical definitions and cascade-resolution code (`tools/recipe-emit-core.ts`), this migration carries the same fixes and the same visible changes as `@solidiom/recipes-css`'s RECIPE-002 release: `Button`'s variants and compound variants now render correctly instead of silently falling back to the default, `Switch`'s thumb animates via its own `data-state` instead of an unexpressible ancestor selector, and `Alert`'s dead wrapper class is removed. The previous hand-written `buttonVariants` used Tailwind opacity modifiers for hover states (`hover:bg-primary/90`, `hover:bg-destructive/90`, `hover:bg-secondary/80`); the canonical contract has no opacity-modifier declaration form, so the generated output uses the new `primary-hover`/`destructive-hover`/`secondary-hover` token identities (`hover:bg-primary-hover`, etc.) instead — a distinct, designer-controlled hover colour rather than an opacity-derived one.

### Patch Changes

- [`15c124a`](https://github.com/solidiom/core/commit/15c124a3073b1c609f9fa809f28786185d213aec) Thanks [@devx](https://github.com/devx)! - Extend recipe audits to cross-profile coverage/state/exception parity and computed-style parity, and fix three defects the new checks found (RECIPE-005).

  New `tools/audit-recipe-parity.ts` (`pnpm run audit:recipe-parity`) is driven by the canonical definitions in `tools/recipe-contract-definitions.ts` rather than by comparing a profile's CSS to its own TSX, which is what `tools/audit-recipe-dual-emission.ts` already did and continues to do. The new audit asserts: every declared slot and state actually appears in each profile's stylesheet (not merely that whatever the stylesheet contains is rendered by the wrapper); a `.variants.ts` class-string module exists if and only if the scope declares a `variants` axis; a declared `adapter`-owned slot's `adapterOwnedProperties` are genuinely absent from that profile's own ruleset for the slot; and all three profiles cover the same scopes, slots, and states as each other.

  New `tests/recipe-parity/` (`pnpm run test:recipe-parity`) renders each profile's hand-written wrapper component with its own resolved stylesheet injected, in a real browser, and compares `getComputedStyle` across profiles — the assertion contract §6 specifies ("parity is asserted on computed style over a rendered fixture, not on generated strings") and that nothing previously implemented. Currently covers `badge` and `button`, the two scopes with a `variants` axis.

  Building this harness found and fixed three real defects, none introduced by this change:

  - `tools/recipe-emit-tailwind.ts`'s `renderVariantsModule` accumulated a variant or compound value's utilities incorrectly when a value produced more than one rule (a base rule and a separate `:hover` pseudo rule) — the second rule silently overwrote the first instead of merging with it. Every `recipes-tailwind` variant with a `:hover` declaration (`badge`'s four variants, `button`'s `default` state pair) rendered only its hover fill; the base background and text color were dropped. Fixed to accumulate every rule's utilities per value.
  - `packages/recipes-tailwind/src/styles/theme.css`'s `--color-primary-hover` fallback (`hsl(222 47% 18%)`) did not match `recipes-css`/`recipes-unocss`'s fallback for the same token identity (`hsl(222 47% 20%)`); corrected to match.
  - A compound variant's utility could lose to a size class's utility on the same property when Tailwind v4 ordered the two utility groups differently in its compiled stylesheet, regardless of source order — see the follow-up changeset for the `tailwind-merge` fix.

  Both new checks run in `gate:phase1`; the computed-style suite additionally runs in `ci.yml`'s `test-browser` job.

- [`87c635f`](https://github.com/solidiom/core/commit/87c635ffeb8ae28cf081b6d1a539d4daad9ce18a) Thanks [@devx](https://github.com/devx)! - Preserve `src`/`source` parity and package-export completeness for recipe packages, and enforce both in CI (RECIPE-006).

  Each recipe package's `tsup.config.ts` copied `src/` to `source/` in an `onSuccess` hook whose `copyDir` helper swallowed every error and never cleared the destination first — a failed copy could report a successful build, and a file removed from `src/` would linger in `source/` indefinitely. `copyDir` now clears `source/` before copying and lets a copy failure fail the build.

  New `tools/audit-recipe-source-parity.ts` (`pnpm run audit:recipe-source-parity`) asserts, per package: `source/` is byte-identical to `src/` (excluding `.test.ts`/`.spec.ts`, matching the copy step's own exclusion) with no orphaned files, and every `src/styles/*.css` stylesheet has a matching `package.json` `exports` subpath entry (and vice versa). This is the check that previously did not exist anywhere in the repo — `src`/`source` parity was verified only for `dialog`, `select`, `calendar`, and `carousel` via `tests/package-source-parity`, which now also covers all three recipe packages.

  `@solidiom/recipes-unocss` gains a `src/meta.ts` module (previously its `recipeProfile`/`supportedPrimitives` exports were inlined in `src/index.ts`), matching the other two profiles' layout.

  Both checks run in `gate:phase1` and in `ci.yml`'s `build` job.

- [`23d0aee`](https://github.com/solidiom/core/commit/23d0aeeee28fb81a0d060e6c345d21d096965753) Thanks [@devx](https://github.com/devx)! - Stop the Tailwind emitter from injecting a `line-height` no canonical definition declared.

  `tools/recipe-emit-tailwind-utilities.ts` mapped every `font-size` declaration onto Tailwind's named `text-*` step (`0.875rem` → `text-sm`, `1rem` → `text-base`, `1.125rem` → `text-lg`). Those named utilities also set `line-height` — `text-sm` compiles to `font-size: 0.875rem; line-height: calc(1.25 / 0.875)` — so the Tailwind profile silently acquired a property its recipe definition never declared, while the `css` and `unocss` profiles emitted a bare `font-size` and left line-height inherited. Wherever a definition sized text without pairing an explicit `line-height`, the three profiles disagreed on the computed line box; with `height: auto` that surfaced directly as a differing computed `height`. This was the follow-up gap recorded in `docs/contracts/recipe-contract.md` §10.

  The new `fontSizeUtility` decides per declaration group rather than per value. When the group also declares a `line-height`, the named step stays: the bundled value is a property the definition genuinely declared, and the group's own `leading-*` utility overrides it with the declared value. When no `line-height` is present, the emitter falls back to the arbitrary `text-[0.875rem]` form, which sets `font-size` alone — generalizing the spelling `0.8125rem` already used for lacking a named step. `declarationToUtilities` takes the surrounding declaration group as a third argument to make this decision, defaulting to an empty group so a lone declaration gets the conservative spelling.

  This regenerates 13 declarations across 7 scopes — `accordion`, `button` (all of `sm`/`md`/`lg`, not only `sm`/`md` as §10 recorded), `dialog`, `menu`, `select`, `tabs`, and `toast`. `alert`, `badge`, and `tooltip` already paired `font-size` with `line-height` and emit byte-identical output. Computed `font-size` is unchanged everywhere; only the undeclared `line-height` is no longer emitted.

  Two regression guards, deliberately at different levels. `tools/recipe-emit-tailwind-utilities.test.ts` sweeps every definition in `tools/recipe-contract-definitions.ts` and fails if any group without a `line-height` emits a line-height-bundling utility, naming each offending scope and part — so a scope added later that sizes text without a line-height fails automatically. `tests/recipe-parity/button.browser.test.tsx` adds a computed-style assertion that the Tailwind profile's button line-height matches a bare control at the same font-size, proving the recipe contributes none.

  That browser test's `"link"+"md"` case continues to assert `padding` and `border-radius` parity across profiles but deliberately does not compare `height`. The compound sets `height: auto`, so its computed height depends on the base reset rather than the recipe: the parity harness compiles the Tailwind profile with `@import "tailwindcss"`, whose Preflight sets `line-height: 1.5`, while the other two profiles inject only their recipe stylesheet and inherit `line-height: normal`. No recipe change can reconcile that, and the recipe-owned half of the gap is covered by the two guards above. The `sm`/`md`/`lg` size assertions still compare `height`, since those declare an explicit height.

- [`58f5ec3`](https://github.com/solidiom/core/commit/58f5ec37e54a4488d41e9272768a0c63b92f1cfa) Thanks [@devx](https://github.com/devx)! - Fix Tailwind compound-variant utility conflicts by merging generated class strings with `tailwind-merge`.

  `tools/recipe-emit-tailwind.ts`'s generated `<scope>Variants()` functions (`badgeVariants`, `buttonVariants`) concatenated a matched variant, size, and compound's Tailwind utilities in declaration order via `class-variance-authority`'s `cva()`. `cva()` assumes the last class wins a conflict, but Tailwind v4's compiled stylesheet orders utilities by its own internal grouping and scale value, not by the order classes appear in the `class` attribute — so a compound variant's override (e.g. `button`'s `"link"` + `"md"` compound setting `padding: 0`) could lose to an earlier-registered utility on the same property (`"md"`'s `padding: 0.5rem 1rem`) regardless of `compoundVariants` array order.

  Each generated `.variants.ts` module now keeps its `cva()` call internal (renamed `<scope>VariantsCva`) and exports `<scope>Variants()` as a thin wrapper that pipes the result through `tailwind-merge`'s `twMerge()`, which understands Tailwind's utility groups and resolves the conflict the way the `css`/`unocss` profiles' cascade-based stylesheets already do. `@solidiom/recipes-tailwind` gains `tailwind-merge` as a runtime dependency, bundled into `dist/index.js` alongside `class-variance-authority`.

  `tools/recipe-emit-tailwind-utilities.ts`'s `boxUtility` reverts to emitting the `p-*`/`m-*` shorthand for a uniform padding/margin value (rather than always forcing the `py-*`/`px-*` axis form) — that was a narrower workaround for the same underlying conflict, now superseded by the general fix above. Generated `@apply` stylesheets are unaffected by either change (they use real CSS selectors with normal specificity, not concatenated utility classes), and are cosmetically simplified back to the shorthand form.

  `tests/recipe-parity/button.browser.test.tsx`'s `"link"+"md"` compound-variant test now asserts real `padding` and `border-radius` parity across all three profiles instead of documenting the conflict as a known gap.

  Implementing this surfaced a separate, unrelated defect, tracked as a follow-up rather than fixed here: `tools/recipe-emit-tailwind-utilities.ts` maps a bare `font-size` declaration to Tailwind's `text-*` utilities, which bundle an opinionated `line-height` a canonical definition may not have declared. This makes `height: auto` compute differently between profiles wherever a definition sets `font-size` without an explicit `line-height` (at least `accordion`, `button`'s `"sm"`/`"md"` sizes, `dialog`, `menu`, `select`, `tabs`, `toast`) — see the "NEW KNOWN GAP" comment in `tests/recipe-parity/button.browser.test.tsx` and `docs/contracts/recipe-contract.md` §10.

- Updated dependencies [[`c134eb6`](https://github.com/solidiom/core/commit/c134eb684446a47195a19cf7928e0c84ee475278), [`71e20e7`](https://github.com/solidiom/core/commit/71e20e756dae0ac848c6820d4d2dabbacd510202), [`71e20e7`](https://github.com/solidiom/core/commit/71e20e756dae0ac848c6820d4d2dabbacd510202), [`0893352`](https://github.com/solidiom/core/commit/08933526925307bead1f90f23db7a4dceffc7c8e)]:
  - @solidiom/runtime@0.1.0
  - @solidiom/dialog@0.1.0
  - @solidiom/button@0.0.1
  - @solidiom/navigation-menu@0.0.1
  - @solidiom/accordion@0.0.1
  - @solidiom/alert@0.0.1
  - @solidiom/avatar@0.0.1
  - @solidiom/badge@0.0.1
  - @solidiom/breadcrumb@0.0.1
  - @solidiom/card@0.0.1
  - @solidiom/checkbox@0.0.1
  - @solidiom/combobox@0.0.1
  - @solidiom/command-palette@0.0.1
  - @solidiom/data-table@0.0.1
  - @solidiom/field@0.0.1
  - @solidiom/input@0.0.1
  - @solidiom/kbd@0.0.1
  - @solidiom/menu@0.0.1
  - @solidiom/meter@0.0.1
  - @solidiom/pagination@0.0.1
  - @solidiom/popover@0.0.1
  - @solidiom/progress@0.0.1
  - @solidiom/radio-group@0.0.1
  - @solidiom/resizable-panels@0.0.1
  - @solidiom/scroll-area@0.0.1
  - @solidiom/select@0.1.0
  - @solidiom/sheet@0.0.1
  - @solidiom/spinner@0.0.1
  - @solidiom/switch@0.0.1
  - @solidiom/tabs@0.0.1
  - @solidiom/toast@0.0.1
  - @solidiom/toolbar@0.0.1
  - @solidiom/tooltip@0.0.1
