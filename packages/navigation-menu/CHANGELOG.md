# @solidiom/navigation-menu

## 0.4.1

### Patch Changes

- Correct the published Solid peer dependency ranges. All packages now declare `solid-js`, `@solidjs/web`, and `babel-preset-solid` via the shared pnpm catalog, locked to `>=2.0.0-rc.1 <3.0.0`.

  Previously some 0.4.0 packages advertised a `>=2.0.0-beta` peer range (or the catalog resolved to a beta) even though they were built and tested against the Solid 2 RC. Consumers now receive a peer range that matches the version these packages are actually built against.

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

## 0.0.1

### Patch Changes

- [`0893352`](https://github.com/solidiom/core/commit/08933526925307bead1f90f23db7a4dceffc7c8e) Thanks [@devx](https://github.com/devx)! - Fix the `positioning` capability never being applied to `NavigationMenu.Content`.

  `NavigationMenu.Root` accepted a `positioning` adapter and threaded it through context, and `registry/navigation-menu.json` advertised the `positioning` capability with `@solidiom/adapter-positioning-floating-ui` as its default — but `Content` never called `positioning.update()`, and no trigger element was exposed on context to position against. Passing an adapter therefore had no effect, leaving every consumer to hand-roll CSS positioning with no supported alternative.

  `Content` now resolves its panel element and its item's trigger element through a tracked `createEffect` compute function (the same pattern used by `tooltip`, `hover-card`, and `popover`) and calls `positioning.update(trigger, content)` once the panel actually mounts, disposing any returned cleanup when the panel closes or unmounts. Both elements are read in the compute function rather than the effect body so positioning still fires when either reference resolves on a later tick.

  The trigger element is now tracked in a signal on **item** context (`triggerRef`/`setTriggerRef`) rather than root context, because a navigation bar has one trigger/content pair per `Item`, unlike single-anchor primitives which keep one trigger ref on the root. Each panel positions against its own trigger. The collection registration used for roving focus reads the same signal, so keyboard navigation and positioning can no longer disagree about which element a trigger is, and the reference is cleared on unmount so a detached node is never used as a positioning anchor or focus target.

  No breaking API changes. `positioning` remains optional and `Content` still renders unpositioned when no adapter is supplied, so CSS-only consumers are unaffected.

- Updated dependencies [[`c134eb6`](https://github.com/solidiom/core/commit/c134eb684446a47195a19cf7928e0c84ee475278)]:
  - @solidiom/runtime@0.1.0
