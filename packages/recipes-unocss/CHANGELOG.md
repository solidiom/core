# @solidiom/recipes-unocss

## 0.3.0

### Minor Changes

- Beta release 0.3.0

  - Resolved offline smoke-test fixture errors (verdaccio publish conflicts,
    pnpm integrity check failures).
  - Eliminated E2E test hydration-timing flakiness across all browser projects.
  - All CI gates pass: smoke-create-prep, site-e2e, and the full test surface.

### Patch Changes

- Updated dependencies []:
  - @solidiom/accordion@0.3.0
  - @solidiom/alert@0.3.0
  - @solidiom/avatar@0.3.0
  - @solidiom/badge@0.3.0
  - @solidiom/breadcrumb@0.3.0
  - @solidiom/button@0.3.0
  - @solidiom/card@0.3.0
  - @solidiom/checkbox@0.3.0
  - @solidiom/combobox@0.3.0
  - @solidiom/command-palette@0.3.0
  - @solidiom/data-table@0.3.0
  - @solidiom/dialog@0.3.0
  - @solidiom/field@0.3.0
  - @solidiom/input@0.3.0
  - @solidiom/kbd@0.3.0
  - @solidiom/menu@0.3.0
  - @solidiom/meter@0.3.0
  - @solidiom/navigation-menu@0.3.0
  - @solidiom/pagination@0.3.0
  - @solidiom/popover@0.3.0
  - @solidiom/progress@0.3.0
  - @solidiom/radio-group@0.3.0
  - @solidiom/resizable-panels@0.3.0
  - @solidiom/runtime@0.3.0
  - @solidiom/scroll-area@0.3.0
  - @solidiom/select@0.3.0
  - @solidiom/sheet@0.3.0
  - @solidiom/spinner@0.3.0
  - @solidiom/switch@0.3.0
  - @solidiom/tabs@0.3.0
  - @solidiom/toast@0.3.0
  - @solidiom/toolbar@0.3.0
  - @solidiom/tooltip@0.3.0
  - @solidiom/unocss-preset@0.3.0

## 0.1.0

### Minor Changes

- [`797c1b7`](https://github.com/solidiom/core/commit/797c1b7c492a4a89d0c80af70c35c66510c65f00) Thanks [@devx](https://github.com/devx)! - Implement the UnoCSS emitter and close the recipe-catalog gap `@solidiom/recipes-unocss` previously declared but did not fill (RECIPE-004).

  `@solidiom/recipes-unocss` now ships a full recipe catalog matching `@solidiom/recipes-css` and `@solidiom/recipes-tailwind`: 13 generated stylesheets, generated `.variants.ts` modules for `Button` and `Badge`, and 13 hand-written `.tsx` wrapper components, generated and maintained by `tools/recipe-emit-unocss.ts` (`pnpm run recipe:emit:unocss[:check]`) from the same canonical definitions the other two profiles use. The package gains the `"solid"` export condition, per-scope `./styles/<name>.css` subpaths, and workspace dependencies on the 13 primitives it wraps — previously it exported only a stub declaring its own lifecycle as `"declared, not implemented"`.

  The UnoCSS stylesheet form uses plain CSS declarations resolved through a new `unocss` token namespace that shares the `css` namespace's `--ui-*` custom-property spellings (`tools/recipe-contract-tokens.ts`), rather than depending on UnoCSS's optional `transformerDirectives` plugin for an `@apply`-equivalent. Setting `--ui-primary` now themes the CSS and UnoCSS profiles simultaneously.

  `@solidiom/unocss-preset` gains generated static rules (`rules` in `presetSolidiom()`'s returned preset object, https://unocss.dev/config/rules) for every variant and compound-variant class name across the canonical definitions — currently `Button` and `Badge`. This lets a consumer write `class="solidiom-btn--destructive"` directly and have UnoCSS resolve it through the preset, without importing `@solidiom/recipes-unocss/styles/button.css`. The existing vocabulary-derived variant generation (`getSolidiomVariants`) is unchanged.

### Patch Changes

- [`c134eb6`](https://github.com/solidiom/core/commit/c134eb684446a47195a19cf7928e0c84ee475278) Thanks [@devx](https://github.com/devx)! - Add the canonical recipe contract's semantic vocabulary and the Tailwind theme contract.

  `@solidiom/runtime` now exports the semantic attribute vocabulary that was previously implicit in `applySemanticAttrs` and duplicated as hand-maintained allowlists in the audit tooling: `SEMANTIC_ATTRIBUTES` (14 attributes), `SEMANTIC_FLAGS` (8 boolean flags), `SEMANTIC_ORIENTATIONS`, `SEMANTIC_SIDES`, `SEMANTIC_SIZES`, `SCOPE_STATES` (35 known scopes: 33 stateful plus stateless Badge and Toast), `COMPOSITE_SCOPES`, `VOCABULARY_EXCEPTIONS`, the `isSemanticAttribute` / `isKnownScope` / `isKnownState` / `statesForScope` / `vocabularyException` / `allStateValues` guards, and the `SemanticFlagName` type. These are additive; no existing export changed shape.

  Two consequences for consumers who style against Solidiom's data attributes:

  - `data-value` is not part of the vocabulary. The previous audit allowlist permitted it even though `applySemanticAttrs` cannot emit it, so any selector written against `data-value` was already dead. Nothing regressed here, but the attribute will not be added.
  - Nine scope/state pairs are recorded in `VOCABULARY_EXCEPTIONS` because they emit a `data-state` value that duplicates a boolean flag (`date-picker`, `data-table`, `tree`, `progress`) or encodes a compound value (`data-table` sort direction). They remain legal and emitted. Each entry names the primitive task that resolves it, so a selector relying on the duplicated `data-state` form should expect it to be withdrawn in a future major release of that primitive; prefer the boolean flag.

  `@solidiom/recipes-tailwind` adds a `./styles/theme.css` export and imports it first from `./styles`. It registers all 17 theme colour names the Tailwind recipes reference as Tailwind v4 `@theme` tokens resolving from the shared `--ui-*` namespace, with fallbacks matching `@solidiom/recipes-css`. Before this change those names were defined only in the docs application's stylesheet, so installing the package alone produced unstyled recipes and setting `--ui-primary` themed only the CSS profile. Now the two profiles agree visually with no theme installed, and setting a `--ui-*` value themes both.

  **Migration:** consumers on Tailwind v4 who already import `@solidiom/recipes-tailwind/styles` get the theme contract automatically. Consumers who import individual recipe stylesheets should add `@import "@solidiom/recipes-tailwind/styles/theme.css"` ahead of them. Tailwind v3 has no `@theme`, so v3 consumers must continue mapping the same names under `theme.extend.colors`; `THEME-003` will generate that mapping.

  `@solidiom/unocss-preset` now derives its variants from the shared vocabulary rather than a local copy, and takes `@solidiom/runtime` as a dependency. Flag/state collisions are disambiguated: the bare variant stays on the boolean flag (`uiSelected` matches `[data-selected]`) and the state form is namespaced (`uiStateSelected` matches `[data-state='selected']`). The namespaced variants exist only to cover the recorded vocabulary exceptions and will disappear when the owning primitives stop emitting a flag as a state.

  `@solidiom/recipes-unocss` now declares its lifecycle honestly. It exports `profileStatus` (`"declared"`), `implementedBy`, and separate `supportedPrimitives` and `implementedRecipes` lists so no consumer or audit can infer coverage from the declaration. The package still ships no stylesheets and no class-string recipes; `RECIPE-004` implements them.

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

- Updated dependencies [[`c134eb6`](https://github.com/solidiom/core/commit/c134eb684446a47195a19cf7928e0c84ee475278), [`797c1b7`](https://github.com/solidiom/core/commit/797c1b7c492a4a89d0c80af70c35c66510c65f00), [`71e20e7`](https://github.com/solidiom/core/commit/71e20e756dae0ac848c6820d4d2dabbacd510202), [`71e20e7`](https://github.com/solidiom/core/commit/71e20e756dae0ac848c6820d4d2dabbacd510202), [`0893352`](https://github.com/solidiom/core/commit/08933526925307bead1f90f23db7a4dceffc7c8e)]:
  - @solidiom/runtime@0.1.0
  - @solidiom/unocss-preset@0.1.0
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
