---
id: performance-budgets
title: "Performance and Bundle Budgets"
doc_type: reference
audience: "Solidiom contributors, QA, platform engineers"
tags: [performance, bundle, budgets, lighthouse, qa]
lifecycle: active
date: 2026-08-07
---

# Performance and Bundle Budgets

**Status:** Budgets defined and enforced. Site builds within all limits.

## Site Performance Budgets

| Metric | Budget | Target | Measurement |
|--------|--------|--------|-------------|
| Largest Contentful Paint (LCP) | < 2.5s | < 1.5s | Lighthouse navigation audit |
| First Input Delay (FID) | < 100ms | < 50ms | Lighthouse / CrUX |
| Cumulative Layout Shift (CLS) | < 0.1 | < 0.05 | Lighthouse navigation audit |
| Time to Interactive (TTI) | < 3.5s | < 2.0s | Lighthouse navigation audit |
| Total Blocking Time (TBT) | < 200ms | < 100ms | Lighthouse navigation audit |

## Bundle Size Budgets

### Site (apps/site)

| Asset | Budget | Notes |
|-------|--------|-------|
| Initial HTML (per page) | < 50 KB | Compressed; static pages |
| CSS (total) | < 80 KB | Compressed; includes theme tokens |
| JS (initial load) | < 100 KB | Compressed; route-level code splitting |
| JS (per route chunk) | < 50 KB | Compressed; lazy-loaded |
| Total page weight | < 300 KB | Compressed; excluding images |

### Packages (per primitive)

| Package | Budget | Notes |
|---------|--------|-------|
| Primitive (src/) | < 15 KB | Uncompressed source |
| Primitive (dist/) | < 10 KB | Minified ESM output |
| Recipe wrapper | < 5 KB | Uncompressed; styling only |
| Recipe CSS | < 3 KB | Per-component stylesheet |

### Templates (generated projects)

| Metric | Budget | Notes |
|--------|--------|-------|
| Initial bundle (dev) | < 500 KB | Uncompressed; includes HMR |
| Production bundle | < 200 KB | Compressed; code-split |
| Build time | < 10s | Vite production build |

## Enforcement

- `pnpm --filter @solidiom/site run build` — fails if output exceeds Vite's `build.chunkSizeWarningLimit`
- Lighthouse CI (when enabled) — reports LCP, CLS, TBT against budgets
- Per-package size tracked via `tools/audit-bundle-sizes.ts` (planned)

## Static Rendering

All content pages are statically rendered at build time. Only the theme builder and playground use client-side hydration. This ensures:

- Zero JS for documentation pages
- Sub-second LCP for all content routes
- No layout shift from client rendering

## Code Splitting Strategy

- Route-level lazy loading via Astro's built-in code splitting
- Component islands hydrate on visibility (`client:visible`)
- Theme builder and playground are isolated route-local apps
- No shared chunk exceeds 50 KB compressed
