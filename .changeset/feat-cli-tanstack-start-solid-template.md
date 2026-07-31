---
"@solidiom/cli": minor
---

Add a `tanstack-start-solid` SSR template for `solidiom create` (CLI-007 PR2).

The plan named SolidStart as the SSR template pending a compatibility spike against this workspace's `solid-js@2.0.0-beta.24` pin. That spike ran and failed: SolidStart's latest release candidate still nests its own private `solid-js@1.9.14` internally rather than using Solid 2, and a minimal build against it fails immediately (`@solidjs/start/config` does not export `defineConfig` at that release). Per the plan's own pre-agreed fallback, TanStack Start (Solid) was spiked instead and confirmed working: `@tanstack/solid-start@2.0.0-beta.29`'s peer dependencies explicitly target `solid-js: ">=2.0.0-0 <3.0.0"`, a real install against this workspace's exact pins resolves with only peer-dependency warnings (no hard failures, no nested Solid fork), and a minimal fixture builds successfully for both client and SSR targets.

`templates/tanstack-start-solid/` ships under `templates/` as a real workspace project (same pattern as `vite-solid-router`), selectable via `solidiom create --template tanstack-start-solid`. It demonstrates server-side rendering with a root route, an index and about route, and the same Tailwind-styled `@solidiom/button` demo as the client-only template, for a comparable side-by-side.

Every `@tanstack/*` dependency is exact-pinned rather than range-pinned. The plan's own security note about a May 2026 npm compromise affecting this package turned out to describe two separate incidents; the version pinned here postdates both by roughly two months and is not in either affected range, but exact-pinning and routing installs through the existing verification path (CLI-003) apply regardless.

`src/create/materialize.ts` gained one fix needed to support this template: `routeTree.gen.ts` (TanStack Router's own generated route-registration file, rewritten on every `dev`/`build` and explicitly marked "will be overwritten") is now excluded from template copying, so a scaffolded project always gets its own freshly generated route tree instead of a stale one copied from the template's workspace checkout.
