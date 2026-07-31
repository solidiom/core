---
"@solidiom/recipes-css": patch
"@solidiom/recipes-tailwind": patch
"@solidiom/recipes-unocss": patch
---

Preserve `src`/`source` parity and package-export completeness for recipe packages, and enforce both in CI (RECIPE-006).

Each recipe package's `tsup.config.ts` copied `src/` to `source/` in an `onSuccess` hook whose `copyDir` helper swallowed every error and never cleared the destination first — a failed copy could report a successful build, and a file removed from `src/` would linger in `source/` indefinitely. `copyDir` now clears `source/` before copying and lets a copy failure fail the build.

New `tools/audit-recipe-source-parity.ts` (`pnpm run audit:recipe-source-parity`) asserts, per package: `source/` is byte-identical to `src/` (excluding `.test.ts`/`.spec.ts`, matching the copy step's own exclusion) with no orphaned files, and every `src/styles/*.css` stylesheet has a matching `package.json` `exports` subpath entry (and vice versa). This is the check that previously did not exist anywhere in the repo — `src`/`source` parity was verified only for `dialog`, `select`, `calendar`, and `carousel` via `tests/package-source-parity`, which now also covers all three recipe packages.

`@solidiom/recipes-unocss` gains a `src/meta.ts` module (previously its `recipeProfile`/`supportedPrimitives` exports were inlined in `src/index.ts`), matching the other two profiles' layout.

Both checks run in `gate:phase1` and in `ci.yml`'s `build` job.
