# Provenance

This private workspace package is a one-time fork of `@astrojs/solid-js@7.0.1`, imported through `@corvu-next/astrojs-solid-next`.

- **Upstream repository:** https://github.com/withastro/astro
- **Upstream path:** `packages/integrations/solid/`
- **Upstream version:** `@astrojs/solid-js@7.0.1`
- **Intermediate fork:** `@corvu-next/astrojs-solid-next`
- **Intermediate import date:** 2026-07-16
- **Solidiom import date:** 2026-07-16

## Modifications from upstream

1. **Package identity:** Rename `@astrojs/solid-js` to `@solidiom/astrojs-solid-next` (the intermediate fork uses `@corvu-next/astrojs-solid-next`).
2. **Solid target:** Update `solid-js` and `@solidjs/web` peer dependencies from Solid 1 to `^2.0.0-beta.21`; pin both development dependencies to `2.0.0-beta.21`.
3. **Solid imports:** Replace `solid-js/web` imports with `@solidjs/web` and `solid-js/store` imports with `solid-js`.
4. **Solid 2 APIs:** Replace `Suspense` with `Loading` and replace `reconcile()` with draft-based store mutation.
5. **Vite integration:** Use `vite-plugin-solid@^3.0.0-next.15` and `vite@^8.1.5`.
6. **TypeScript:** Use `typescript@~6.0.3`.
7. **Node support:** Require Node.js `>=20.0.0` to match the Solidiom monorepo.
8. **Direct TypeScript exports:** Export renderer TypeScript sources directly; no package build step is required because Astro resolves them through Vite.
9. **Simplified integration:** Omit the devtools integration and the deprecated `getContainerRenderer` re-export warning.
10. **Solidiom renderer references:** Use `@solidiom/astrojs-solid-next` for renderer-name strings and client/server entry-point paths.

## Sync policy

This is a self-contained, one-time import. There is no ongoing upstream sync; individual upstream fixes may be imported only when specifically needed.
