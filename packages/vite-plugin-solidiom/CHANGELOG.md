# @solidiom/vite-plugin

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
