# @solidiom/drawer

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

- [`71e20e7`](https://github.com/solidiom/core/commit/71e20e756dae0ac848c6820d4d2dabbacd510202) Thanks [@devx](https://github.com/devx)! - Fix Escape-key dismissal, click-outside dismissal, and focus trapping never activating for `Dialog.Content` / `Drawer.Content` unless the dialog or drawer happened to be open on its very first render.

  Both primitives registered their layer-stack/dismissable-layer/focus-scope setup inside a one-shot `onSettled` callback that checked a plain `let contentEl` ref variable. Because the content panel is only mounted once `present()` becomes true (behind a `Show`/`Portal`), and `onSettled` fires once at the component's own mount (before the panel has ever rendered for a closed-by-default dialog/drawer), the ref was always `undefined` when the callback ran — permanently skipping dismissal and focus-trap setup for the overwhelmingly common case of a disclosure that starts closed.

  Replaced the one-shot `onSettled` guard with a `createEffect` keyed off a reactive `present()`-gated element signal, so setup (and its cleanup) re-runs every time the content panel actually mounts and unmounts.

  No API changes. Consumers get working Escape/outside-click dismissal and focus trapping with no code changes required.

- [`7ef2230`](https://github.com/solidiom/core/commit/7ef223094f1da9df93bd6e1ead7e3a21d8ed5d30) Thanks [@devx](https://github.com/devx)! - Fix `Drawer.Trigger` and `Drawer.Close` not accepting `class`, `style`, or `aria-label`, which made it effectively impossible to style or label them without nesting another interactive element (e.g. a `Button`) inside them.

  Nesting a button-rendering component inside `Drawer.Trigger`/`Drawer.Close` produces invalid HTML (`<button>` cannot contain another `<button>`): browsers silently close the outer `<button>` as soon as the inner one opens, splitting them into siblings in the DOM. The outer element — the one with the actual `onClick` handler that opens/closes the drawer — ends up empty and invisible, while the visible inner button has no wired behavior. Clicking the visible trigger/close button then does nothing.

  `Trigger` and `Close` now accept `class`, `style`, and `"aria-label"` and apply them directly to their own `<button>` (also adding `type="button"`), so consumers can style/label the trigger or close control without nesting another interactive element inside it.

- Updated dependencies [[`c134eb6`](https://github.com/solidiom/core/commit/c134eb684446a47195a19cf7928e0c84ee475278)]:
  - @solidiom/runtime@0.1.0
