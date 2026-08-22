# @solidiom/primitives

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
  - @solidiom/accordion@0.4.0
  - @solidiom/alert@0.4.0
  - @solidiom/alert-dialog@0.4.0
  - @solidiom/app-shell@0.4.0
  - @solidiom/aspect-ratio@0.4.0
  - @solidiom/attachment@0.4.0
  - @solidiom/avatar@0.4.0
  - @solidiom/avatar-group@0.4.0
  - @solidiom/badge@0.4.0
  - @solidiom/banner@0.4.0
  - @solidiom/breadcrumb@0.4.0
  - @solidiom/button@0.4.0
  - @solidiom/calendar@0.4.0
  - @solidiom/card@0.4.0
  - @solidiom/carousel@0.4.0
  - @solidiom/chart@0.4.0
  - @solidiom/chat-composer@0.4.0
  - @solidiom/chat-layout@0.4.0
  - @solidiom/chat-message@0.4.0
  - @solidiom/chat-message-metadata@0.4.0
  - @solidiom/chat-system-message@0.4.0
  - @solidiom/chat-tool-calls@0.4.0
  - @solidiom/checkbox@0.4.0
  - @solidiom/code-block@0.4.0
  - @solidiom/collapsible@0.4.0
  - @solidiom/combobox@0.4.0
  - @solidiom/command-palette@0.4.0
  - @solidiom/context-menu@0.4.0
  - @solidiom/data-table@0.4.0
  - @solidiom/date-picker@0.4.0
  - @solidiom/date-range-input@0.4.0
  - @solidiom/dialog@0.4.0
  - @solidiom/direction@0.4.0
  - @solidiom/drawer@0.4.0
  - @solidiom/empty-state@0.4.0
  - @solidiom/field@0.4.0
  - @solidiom/file-input@0.4.0
  - @solidiom/grid@0.4.0
  - @solidiom/hover-card@0.4.0
  - @solidiom/input@0.4.0
  - @solidiom/input-group@0.4.0
  - @solidiom/input-otp@0.4.0
  - @solidiom/kbd@0.4.0
  - @solidiom/label@0.4.0
  - @solidiom/lightbox@0.4.0
  - @solidiom/link@0.4.0
  - @solidiom/listbox@0.4.0
  - @solidiom/mega-menu@0.4.0
  - @solidiom/menu@0.4.0
  - @solidiom/menubar@0.4.0
  - @solidiom/message-scroller@0.4.0
  - @solidiom/meter@0.4.0
  - @solidiom/multi-selector@0.4.0
  - @solidiom/navigation-menu@0.4.0
  - @solidiom/number-input@0.4.0
  - @solidiom/pagination@0.4.0
  - @solidiom/popover@0.4.0
  - @solidiom/progress@0.4.0
  - @solidiom/questionnaire@0.4.0
  - @solidiom/radio-group@0.4.0
  - @solidiom/resizable-panels@0.4.0
  - @solidiom/scroll-area@0.4.0
  - @solidiom/segmented-control@0.4.0
  - @solidiom/select@0.4.0
  - @solidiom/separator@0.4.0
  - @solidiom/sheet@0.4.0
  - @solidiom/sidebar@0.4.0
  - @solidiom/skeleton@0.4.0
  - @solidiom/slider@0.4.0
  - @solidiom/spinner@0.4.0
  - @solidiom/stack@0.4.0
  - @solidiom/status-dot@0.4.0
  - @solidiom/switch@0.4.0
  - @solidiom/table@0.4.0
  - @solidiom/tabs@0.4.0
  - @solidiom/time-input@0.4.0
  - @solidiom/toast@0.4.0
  - @solidiom/toggle@0.4.0
  - @solidiom/toggle-group@0.4.0
  - @solidiom/tokenizer@0.4.0
  - @solidiom/toolbar@0.4.0
  - @solidiom/tooltip@0.4.0
  - @solidiom/tree@0.4.0
  - @solidiom/typography@0.4.0
  - @solidiom/virtual-list@0.4.0
  - @solidiom/visually-hidden@0.4.0

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
  - @solidiom/alert-dialog@0.3.0
  - @solidiom/app-shell@0.3.0
  - @solidiom/aspect-ratio@0.3.0
  - @solidiom/attachment@0.3.0
  - @solidiom/avatar@0.3.0
  - @solidiom/avatar-group@0.3.0
  - @solidiom/badge@0.3.0
  - @solidiom/banner@0.3.0
  - @solidiom/breadcrumb@0.3.0
  - @solidiom/button@0.3.0
  - @solidiom/calendar@0.3.0
  - @solidiom/card@0.3.0
  - @solidiom/carousel@0.3.0
  - @solidiom/chart@0.3.0
  - @solidiom/chat-composer@0.3.0
  - @solidiom/chat-layout@0.3.0
  - @solidiom/chat-message@0.3.0
  - @solidiom/chat-message-metadata@0.3.0
  - @solidiom/chat-system-message@0.3.0
  - @solidiom/chat-tool-calls@0.3.0
  - @solidiom/checkbox@0.3.0
  - @solidiom/code-block@0.3.0
  - @solidiom/collapsible@0.3.0
  - @solidiom/combobox@0.3.0
  - @solidiom/command-palette@0.3.0
  - @solidiom/context-menu@0.3.0
  - @solidiom/data-table@0.3.0
  - @solidiom/date-picker@0.3.0
  - @solidiom/date-range-input@0.3.0
  - @solidiom/dialog@0.3.0
  - @solidiom/direction@0.3.0
  - @solidiom/drawer@0.3.0
  - @solidiom/empty-state@0.3.0
  - @solidiom/field@0.3.0
  - @solidiom/file-input@0.3.0
  - @solidiom/grid@0.3.0
  - @solidiom/hover-card@0.3.0
  - @solidiom/input@0.3.0
  - @solidiom/input-group@0.3.0
  - @solidiom/input-otp@0.3.0
  - @solidiom/kbd@0.3.0
  - @solidiom/label@0.3.0
  - @solidiom/lightbox@0.3.0
  - @solidiom/link@0.3.0
  - @solidiom/listbox@0.3.0
  - @solidiom/mega-menu@0.3.0
  - @solidiom/menu@0.3.0
  - @solidiom/menubar@0.3.0
  - @solidiom/message-scroller@0.3.0
  - @solidiom/meter@0.3.0
  - @solidiom/multi-selector@0.3.0
  - @solidiom/navigation-menu@0.3.0
  - @solidiom/number-input@0.3.0
  - @solidiom/pagination@0.3.0
  - @solidiom/popover@0.3.0
  - @solidiom/progress@0.3.0
  - @solidiom/questionnaire@0.3.0
  - @solidiom/radio-group@0.3.0
  - @solidiom/resizable-panels@0.3.0
  - @solidiom/scroll-area@0.3.0
  - @solidiom/segmented-control@0.3.0
  - @solidiom/select@0.3.0
  - @solidiom/separator@0.3.0
  - @solidiom/sheet@0.3.0
  - @solidiom/sidebar@0.3.0
  - @solidiom/skeleton@0.3.0
  - @solidiom/slider@0.3.0
  - @solidiom/spinner@0.3.0
  - @solidiom/stack@0.3.0
  - @solidiom/status-dot@0.3.0
  - @solidiom/switch@0.3.0
  - @solidiom/table@0.3.0
  - @solidiom/tabs@0.3.0
  - @solidiom/time-input@0.3.0
  - @solidiom/toast@0.3.0
  - @solidiom/toggle@0.3.0
  - @solidiom/toggle-group@0.3.0
  - @solidiom/tokenizer@0.3.0
  - @solidiom/toolbar@0.3.0
  - @solidiom/tooltip@0.3.0
  - @solidiom/tree@0.3.0
  - @solidiom/typography@0.3.0
  - @solidiom/virtual-list@0.3.0
  - @solidiom/visually-hidden@0.3.0

## 0.0.1

### Patch Changes

- Updated dependencies [[`71e20e7`](https://github.com/solidiom/core/commit/71e20e756dae0ac848c6820d4d2dabbacd510202), [`7ef2230`](https://github.com/solidiom/core/commit/7ef223094f1da9df93bd6e1ead7e3a21d8ed5d30), [`71e20e7`](https://github.com/solidiom/core/commit/71e20e756dae0ac848c6820d4d2dabbacd510202), [`0893352`](https://github.com/solidiom/core/commit/08933526925307bead1f90f23db7a4dceffc7c8e)]:
  - @solidiom/dialog@0.1.0
  - @solidiom/drawer@0.0.1
  - @solidiom/button@0.0.1
  - @solidiom/navigation-menu@0.0.1
  - @solidiom/accordion@0.0.1
  - @solidiom/alert@0.0.1
  - @solidiom/alert-dialog@0.0.1
  - @solidiom/avatar@0.0.1
  - @solidiom/badge@0.0.1
  - @solidiom/breadcrumb@0.0.1
  - @solidiom/calendar@0.1.0
  - @solidiom/card@0.0.1
  - @solidiom/carousel@0.1.0
  - @solidiom/checkbox@0.0.1
  - @solidiom/collapsible@0.0.1
  - @solidiom/combobox@0.0.1
  - @solidiom/command-palette@0.0.1
  - @solidiom/context-menu@0.0.1
  - @solidiom/data-table@0.0.1
  - @solidiom/date-picker@0.0.1
  - @solidiom/empty-state@0.0.1
  - @solidiom/field@0.0.1
  - @solidiom/hover-card@0.0.1
  - @solidiom/input@0.0.1
  - @solidiom/input-otp@0.0.1
  - @solidiom/kbd@0.0.1
  - @solidiom/label@0.0.1
  - @solidiom/listbox@0.0.1
  - @solidiom/menu@0.0.1
  - @solidiom/meter@0.0.1
  - @solidiom/pagination@0.0.1
  - @solidiom/popover@0.0.1
  - @solidiom/progress@0.0.1
  - @solidiom/radio-group@0.0.1
  - @solidiom/resizable-panels@0.0.1
  - @solidiom/scroll-area@0.0.1
  - @solidiom/select@0.1.0
  - @solidiom/separator@0.0.1
  - @solidiom/sheet@0.0.1
  - @solidiom/skeleton@0.0.1
  - @solidiom/slider@0.0.1
  - @solidiom/spinner@0.0.1
  - @solidiom/switch@0.0.1
  - @solidiom/tabs@0.0.1
  - @solidiom/toast@0.0.1
  - @solidiom/toggle@0.0.1
  - @solidiom/toggle-group@0.0.1
  - @solidiom/toolbar@0.0.1
  - @solidiom/tooltip@0.0.1
  - @solidiom/tree@0.0.1
  - @solidiom/virtual-list@0.0.1
  - @solidiom/visually-hidden@0.0.1
