# @solidiom/textarea

## 0.6.0

### Minor Changes

- Coordinated workspace-wide minor bump to 0.6.0.

  - **Solid 2 toolchain** advanced to the `2.0.0-rc.11` rolling window (solid-js, @solidjs/web); babel-preset-solid stays at its latest in-line release.
  - **Dependency refresh**: build/test/lint tooling moved to current releases (vite 8.3, vitest 5, eslint 10.11, astro 7.3.5, tsx, nx, prettier, @changesets/cli), plus adapter upstreams (@floating-ui/dom 1.8, embla-carousel 8.6, @tanstack/virtual-core 3.17.11, zod 4.6). TypeScript is intentionally held at 6.x — the native TS 7 compiler does not yet ship the programmatic API Solid's jsx:preserve typechecking relies on.
  - **New primitive**: `@solidiom/textarea` (native textarea).
  - **UI behavior + visual design** updates across components.
  - **Fixes**: navigation-menu positioning is now robust to Solid rc.11 ref/reconciliation ordering; node test lanes point at the shared vitest config so browser tests are excluded by default under vitest 5.

## 0.4.2

### Patch Changes

- Initial release of the standalone textarea primitive.
