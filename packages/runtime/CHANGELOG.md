# @solidiom/runtime

## 0.3.0

### Minor Changes

- Beta release 0.3.0

  - Resolved offline smoke-test fixture errors (verdaccio publish conflicts,
    pnpm integrity check failures).
  - Eliminated E2E test hydration-timing flakiness across all browser projects.
  - All CI gates pass: smoke-create-prep, site-e2e, and the full test surface.

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
