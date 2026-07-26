# Astro MDX POC — Findings

## Summary

- Date: 2025-07-18
- Result: ADOPT
- Checks passed: 14/14

## Checks

| # | Check | Result | Notes |
|---|-------|--------|-------|
| 1 | Integration package resolves | ✅ | `@solidiom/astrojs-solid-next` resolves via `workspace:*`; `pnpm install` clean with monorepo overrides |
| 2 | POC app scaffolded in workspace | ✅ | `apps/docs-astro-poc/` created with all required deps; detected by `apps/*` workspace pattern |
| 3 | Dev server starts cleanly | ✅ | `astro dev` boots without errors; Tailwind styles applied via Vite plugin |
| 4 | Type checking passes (`astro check`) | ✅ | Zero type errors; strict tsconfig with `jsxImportSource: solid-js` |
| 5 | Production build succeeds | ✅ | `astro build` produces `dist/` with static HTML + JS islands |
| 6 | MDX content renders correctly | ✅ | `/docs/button/` renders prose, code blocks, and imported Solid component |
| 7 | Component hydration works | ✅ | `<astro-island>` with `ssr` attribute present; click handler increments counter; no hydration mismatch warnings |
| 8 | Styling renders (Tailwind) | ✅ | Tailwind CSS 4 utility classes render in both dev and production |
| 9 | Code highlighting works (Shiki) | ✅ | Fenced code blocks rendered with Shiki syntax highlighting and token colors |
| 10 | Navigation and heading anchors | ✅ | `h2`/`h3` have `id` attributes; fragment navigation scrolls correctly; nav links keyboard-operable |
| 11 | Search works (Pagefind) | ✅ | `pagefind --site dist` indexes content; search for "Button" returns 1 page with sub-results |
| 12 | Accessibility basics pass | ✅ | Lighthouse a11y 100/100; semantic landmarks (`nav`, `main`, `article`) present; `:focus-visible` outlines confirmed |
| 13 | Build reproducibility (self-contained) | ✅ | Build uses only workspace packages and npm registry; no external path references |
| 14 | Decision gate evaluated | ✅ | This document — all checks pass, recommending adoption |

## Compatibility Notes

- **Solid 2 beta.21** — uses `solid-js@2.0.0-beta.21` and `@solidjs/web@2.0.0-beta.21` with monorepo `pnpm.overrides` forcing resolution. No peer dependency conflicts.
- **vite-plugin-solid@3.0.0-next.15** — compatible with Vite 8 Environment API. The monorepo already uses this combination for component builds.
- **Vite 8** — `vite@^8.1.5` works with Astro 7 and the Solid plugin without issue.
- **Node >=20** — relaxed from the upstream reference's `>=22.12`. The integration code uses no Node 22-specific APIs. Validated on the monorepo's Node 20+ policy.
- **No peer dependency conflicts** — `pnpm-workspace.yaml` overrides and `peerDependencyRules.allowAny` suppress version mismatch warnings for beta packages.
- **TypeScript 6** — `~6.0.3` used across both packages; no breaking changes encountered compared to the reference's TS 5.8.

## Performance Observations

- **Static site generation** — Astro produces zero-JS HTML by default. Only hydrated islands ship client-side JavaScript, resulting in fast page loads and no runtime server requirement.
- **Deferred hydration (`client:visible`)** — the ButtonDemo component hydrates only when scrolled into view. This keeps initial page load fast while still demonstrating full interactivity.
- **Pagefind client-side search** — search index is generated at build time as static JSON. No server-side search infrastructure needed; queries execute entirely in the browser.
- **Tailwind CSS 4 with `@tailwindcss/vite`** — CSS compilation happens through the Vite plugin pipeline with no separate PostCSS step, providing fast dev-mode HMR and optimized production output.
- **Build output is minimal** — static HTML + small JS island bundles. No framework runtime shipped for non-interactive pages.

## Recommendation

**ADOPT** — All 14 mandatory checks pass. Astro 7 + MDX + Solid 2 is validated as a viable documentation architecture for the Solidiom monorepo.

Key advantages over the current Vite SPA approach:
1. **Content-first authoring** — MDX enables mixing prose and interactive demos without custom build tooling.
2. **Zero-JS by default** — pages ship static HTML; JavaScript is loaded only for interactive islands.
3. **Built-in search** — Pagefind provides instant client-side search with no server infrastructure.
4. **Familiar tooling** — Astro uses Vite under the hood; Solid components are authored identically to the design system source.
5. **Accessibility built-in** — semantic HTML output, automatic heading anchors, and Lighthouse 100/100 out of the box.

Next steps: migrate existing documentation content to the Astro architecture and integrate into CI/CD pipeline.
