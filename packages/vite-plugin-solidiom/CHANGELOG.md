# @solidiom/vite-plugin

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

## 0.3.0

### Minor Changes

- Beta release 0.3.0

  - Resolved offline smoke-test fixture errors (verdaccio publish conflicts,
    pnpm integrity check failures).
  - Eliminated E2E test hydration-timing flakiness across all browser projects.
  - All CI gates pass: smoke-create-prep, site-e2e, and the full test surface.

## 0.0.1

### Patch Changes

- [`797c1b7`](https://github.com/solidiom/core/commit/797c1b7c492a4a89d0c80af70c35c66510c65f00) Thanks [@devx](https://github.com/devx)! - Implement the CSS emitter (RECIPE-002). Every recipe in `@solidiom/recipes-css` — all 13 shipped scopes — is now generated from `tools/recipe-contract-definitions.ts` by `tools/recipe-emit-css.ts` (`pnpm run recipe:emit:css[:check]`) rather than hand-authored. Both emission forms (`src/styles/<name>.css` and, for a scope with variants, `src/recipes/<name>.variants.ts`) come from the same source and cannot drift from each other.

  This migration fixes real defects the hand-authored stylesheets had, which means some visual output changes:

  - `Button`'s CSS profile previously emitted 11 `solidiom-btn--*` variant classes with no definitions anywhere in the package — every non-default `variant`/`size` combination silently rendered as the default. All 6 variants × 4 sizes, plus two compound variants (`ghost`+`icon`, `link`+`md`), now render correctly.
  - `Switch`'s thumb previously animated via an ancestor selector (`[data-part="root"][data-state="on"] [data-part="thumb"]`), which the class-string form cannot express. The thumb now carries its own `data-state` and animates directly.
  - `Alert` previously carried a redundant, unused `solidiom-alert--<variant>` class; styling was already driven entirely by the primitive's `data-state`. The dead class is removed from the wrapper.
  - Ten previously-hardcoded literal values (focus ring colour, several corner radii, several box shadows, the switch track colour, the dialog scrim) are now spelled through canonical token identities in `tools/recipe-contract-tokens.ts`, with `var(--ui-*, fallback)` fallbacks matching the prior literals, so unthemed output is visually unchanged.

  `@solidiom/vite-plugin`'s static variant-expansion transform (`variantExpansion` option) now correctly inlines a `cva()` call's `compoundVariants`, appending a compound's class when every one of its `when` conditions matches the resolved (explicit-or-default) variant values, in declaration order after the single-axis classes. Previously it had no `compoundVariants` handling at all, so a generated `cva()` call with compound variants would statically expand with the compound's classes silently missing.
