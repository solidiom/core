# @solidiom/navigation-menu

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
