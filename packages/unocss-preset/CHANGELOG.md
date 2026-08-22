# @solidiom/unocss-preset

## 0.4.1

### Patch Changes

- Updated dependencies []:
  - @solidiom/runtime@0.4.1

## 0.4.0

### Minor Changes

- Beta release 0.4.0. Coordinated workspace-wide minor bump.

  - **Solid 2 support window advanced to `2.0.0-rc.1`.** `solid-js` and
    `@solidjs/web` are pinned to `2.0.0-rc.1` (previously `2.0.0-rc.0`) across the
    root dev dependencies, workspace overrides, and templates. The rolling Solid
    window (`tools/solid-matrix.json`) advances to
    `{ low: 2.0.0-beta.34, mid: 2.0.0-rc.0, high: 2.0.0-rc.1 }` with peer range
    `^2.0.0-beta.34`.
  - **`@solidiom/adapter-table-tanstack`** is rewritten against
    `@tanstack/table-core` v9's feature-modular API (`tableFeatures` +
    `constructTable` with `createCoreRowModel` / `createSortedRowModel` /
    `createFilteredRowModel`), replacing the v8 `createTable` / `getCoreRowModel`
    shape. The public capability surface (`createTanStackTableAdapter` and the
    `TableModelCapability` interfaces) is unchanged; consumers now resolve
    `@tanstack/table-core@9`.
  - **`@solidiom/cli`** resolves registry package versions as caret ranges
    (e.g. `^0.4.0`) instead of exact pins when planning installs, so consumers
    pick up in-range single-package releases without a registry regeneration.
    Pre-release versions and dist-tags are left unchanged. Also bumps `zod` to v4
    (`z.record` now takes an explicit key schema) and `ts-morph` to v28 with no
    change to CLI behavior or output.
  - **Dependency refresh** across adapters:
    `@solidiom/adapter-virtualization-tanstack` bumps `@tanstack/virtual-core` to
    3.17.8, and `@solidiom/adapter-date-internationalized` bumps
    `@internationalized/date` to `^3.12.3`. All packages refreshed to their latest
    compatible releases (TypeScript kept on the 6.x line).
  - **Release tooling** hardened: fail-fast Cloudflare token pre-flight with setup
    guidance that probes the Pages API instead of `/tokens/verify`, and a script
    to unpublish versions.
  - **Site & branding:** quadrant mark applied across brand assets and site
    chrome, footer community links point to on-site pages, and top-nav / language
    switcher spacing fixes.
  - **Documentation** synchronized with the current implementation, and an
    AI-assisted contributions policy added.

### Patch Changes

- Updated dependencies []:
  - @solidiom/runtime@0.4.0

## 0.3.0

### Minor Changes

- Beta release 0.3.0

  - Resolved offline smoke-test fixture errors (verdaccio publish conflicts,
    pnpm integrity check failures).
  - Eliminated E2E test hydration-timing flakiness across all browser projects.
  - All CI gates pass: smoke-create-prep, site-e2e, and the full test surface.

### Patch Changes

- Updated dependencies []:
  - @solidiom/runtime@0.3.0

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

- [`797c1b7`](https://github.com/solidiom/core/commit/797c1b7c492a4a89d0c80af70c35c66510c65f00) Thanks [@devx](https://github.com/devx)! - Implement the UnoCSS emitter and close the recipe-catalog gap `@solidiom/recipes-unocss` previously declared but did not fill (RECIPE-004).

  `@solidiom/recipes-unocss` now ships a full recipe catalog matching `@solidiom/recipes-css` and `@solidiom/recipes-tailwind`: 13 generated stylesheets, generated `.variants.ts` modules for `Button` and `Badge`, and 13 hand-written `.tsx` wrapper components, generated and maintained by `tools/recipe-emit-unocss.ts` (`pnpm run recipe:emit:unocss[:check]`) from the same canonical definitions the other two profiles use. The package gains the `"solid"` export condition, per-scope `./styles/<name>.css` subpaths, and workspace dependencies on the 13 primitives it wraps — previously it exported only a stub declaring its own lifecycle as `"declared, not implemented"`.

  The UnoCSS stylesheet form uses plain CSS declarations resolved through a new `unocss` token namespace that shares the `css` namespace's `--ui-*` custom-property spellings (`tools/recipe-contract-tokens.ts`), rather than depending on UnoCSS's optional `transformerDirectives` plugin for an `@apply`-equivalent. Setting `--ui-primary` now themes the CSS and UnoCSS profiles simultaneously.

  `@solidiom/unocss-preset` gains generated static rules (`rules` in `presetSolidiom()`'s returned preset object, https://unocss.dev/config/rules) for every variant and compound-variant class name across the canonical definitions — currently `Button` and `Badge`. This lets a consumer write `class="solidiom-btn--destructive"` directly and have UnoCSS resolve it through the preset, without importing `@solidiom/recipes-unocss/styles/button.css`. The existing vocabulary-derived variant generation (`getSolidiomVariants`) is unchanged.

### Patch Changes

- Updated dependencies [[`c134eb6`](https://github.com/solidiom/core/commit/c134eb684446a47195a19cf7928e0c84ee475278)]:
  - @solidiom/runtime@0.1.0
