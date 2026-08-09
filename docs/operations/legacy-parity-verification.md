---
id: legacy-parity-cut001
title: "CUT-001 — Legacy Inventory Resolution"
doc_type: operations
tags: [cutover, legacy, parity, CUT-001]
lifecycle: current
created: 2026-08-08
---

# CUT-001 — Legacy Inventory Resolution

## Scope

This document resolves the two legacy inventory items identified in MIG-001:

1. **`apps/docs/`** — Legacy Vite SPA documentation site (frozen, 5 routes, 72 demo files)
2. **`apps/docs-astro-poc/`** — Completed Astro POC (superseded by `apps/site/`)

The goal is to verify parity between the legacy docs site and `apps/site/` and resolve any gaps to determine whether CUT-002 (traffic cutover) and CUT-003 (legacy removal) can proceed.

---

## 1. Legacy Inventory Summary

### `apps/docs/` — Legacy Vite SPA

| Attribute | Value |
|-----------|-------|
| Framework | Vite + SolidJS Router |
| Status | Frozen (DEPRECATED.md, MIG-002) |
| Routes | 5 |
| Primitives documented | 52 (from registry/index.json) |
| Hand-authored demos | 51 primitive demos + 4 blocks + 7 recipes = 62 demo files |
| Demo index entries | 51 (in `demos/index.ts`) |
| Categories | overlay, input, layout, feedback, navigation |

### `apps/docs-astro-poc/` — Astro POC

| Attribute | Value |
|-----------|-------|
| Status | Completed, superseded by `apps/site/` |
| Action | N/A (already resolved by `apps/site/` being the production site) |

---

## 2. Route Parity

| # | Legacy Route | Legacy File | apps/site/ Equivalent | Site Route | Status |
|---|-------------|-------------|----------------------|------------|--------|
| 1 | `/` (Home) | `src/routes/index.tsx` | `src/pages/index.astro` | `/` | **RESOLVED** |
| 2 | `/primitives/[name]` | `src/routes/primitives/[name].tsx` | `src/pages/primitives/[name]/index.astro` + `[view].astro` | `/primitives/{name}/` and `/primitives/{name}/{view}/` | **RESOLVED** |
| 3 | `/performance` | `src/routes/performance.tsx` | — | — | **DEFERRED** |
| 4 | `/recipes` | `src/routes/recipes.tsx` | `src/pages/components/[name]/[view].astro` (examples view) | `/components/{name}/examples/` | **RESOLVED** |
| 5 | `/accessibility` | `src/routes/accessibility.tsx` | `src/content/en/pages/accessibility.md` (content exists, no route) | — | **DEFERRED** |

### Route parity detail

**Route 1 — Home (`/`)**

The legacy home page displayed primitives grouped by category with quick links to Performance and Accessibility. The new `index.astro` covers this and extends it with sections for CLI, Primitives, Recipes, Themes, Theme Builder, Components, Blocks, and Templates — a superset of the legacy content. The new page includes bilingual support and maturity badges.

**Route 2 — Primitive pages (`/primitives/[name]`)**

The legacy site rendered a single page per primitive. The new site provides four views per primitive: overview, api, examples, and accessibility. The API reference and examples are generated from registry/API artifacts rather than hand-authored. Each primitive page includes accessibility evidence (`evidence.json`) and accessibility contracts. This is a superset of the legacy functionality.

**Route 3 — Performance (`/performance`)**

The legacy site had a performance dashboard that loaded benchmark reports from `@solidiom/bench` at runtime, displaying throughput, bundle size, and interaction benchmark results. **No equivalent route exists in `apps/site/`.** The `packages/bench/` package exists and contains baselines and benchmark tooling, but there is no site route to surface this data. See Gap G1 below.

**Route 4 — Recipes (`/recipes`)**

The legacy site had 7 recipe demos (button, dialog, switch, checkbox, tabs, typeset, prose) rendered as live demos. The new site covers recipes through the Components layer (`/components/`), which includes styled recipe wrappers with overview, API, examples, and accessibility views. The components catalog contains 30+ component entries with recipe content, which is a superset of the 7 legacy recipes.

**Route 5 — Accessibility (`/accessibility`)**

The legacy site had an aggregate accessibility dashboard showing per-primitive audit results (axe scan, keyboard navigation, Playwright tests, VoiceOver, NVDA, JAWS) in a summary table with cards. The new site has an accessibility content file at `src/content/en/pages/accessibility.md` with WCAG/APG compliance information and evidence tables. However, **this content is not served as a route** — the `pages` collection is defined in `content.config.ts` but no page route consumes it. Per-primitive accessibility evidence exists at `/primitives/{name}/accessibility/`, but there is no aggregate accessibility overview page. See Gap G2 below.

---

## 3. Demo Parity

| Metric | Legacy (`apps/docs/`) | New site (`apps/site/`) |
|--------|----------------------|------------------------|
| Primitive demos | 51 hand-authored TSX demos | Generated from registry/API artifacts at build time |
| Block demos | 4 hand-authored (app-shell, aspect-ratio, code-block, chat-composer) | 36 block entries in content collections |
| Recipe demos | 7 hand-authored | 30 component entries with examples |
| Approach | Hand-authored components with inline code strings | Content-collection-driven with generated examples |

The legacy demos were hand-authored TSX files each exporting a component and a code string. The new site does not use hand-authored demos; instead, it generates examples from the registry and API artifacts at build time. This is an architectural improvement: examples are maintained alongside the package source rather than duplicated in the docs app.

Legacy demo files counted:
- Primitive demos: 51 `.tsx` files in `demos/` (root level, excluding `index.ts`, `blocks/`, `recipes/`)
- Block demos: 4 `.tsx` files in `demos/blocks/`
- Recipe demos: 7 `.tsx` files in `demos/recipes/`
- Total demo files: 62

All 52 registry primitives have documentation in `apps/site/` via the registry-driven catalog. The new site's approach (generated examples from package source) means there is no 1:1 file correspondence, but the coverage is comprehensive: every primitive with a registry entry gets an overview, API, examples, and accessibility page.

---

## 4. Content Gaps

### G1: No performance dashboard route

**Severity:** Low for beta
**Legacy content:** A runtime dashboard loading benchmark data from `@solidiom/bench`, showing throughput (ops/sec, avg ns, samples), bundle sizes (raw, gzip, budget, pass/fail), and interaction benchmarks.
**Current state:** `packages/bench/` exists with baselines and tooling. No route in `apps/site/` surfaces this data. No performance/benchmark content exists in any content collection.
**Resolution:** **DEFERRED** — Performance benchmark pages are developer-facing, not critical for beta users. The `packages/bench/` infrastructure exists and can be wired to a site route when prioritized. Acceptable gap for beta release.

### G2: No aggregate accessibility overview page

**Severity:** Low for beta
**Legacy content:** An aggregate dashboard with summary cards (total primitives, axe passes, keyboard audited, full AT sign-off) and a per-primitive results table with pass/fail/partial statuses for axe, keyboard, Playwright, VoiceOver, NVDA, and JAWS.
**Current state:** A content file exists at `src/content/en/pages/accessibility.md` with comprehensive accessibility information (WCAG 2.2 AA compliance, APG patterns, evidence tables). However, the `pages` collection has no route to serve it. Per-primitive accessibility evidence is available at `/primitives/{name}/accessibility/`.
**Resolution:** **DEFERRED** — The content exists but lacks a route. This is a wiring issue (add a route that consumes the `pages` collection), not a content gap. Per-primitive accessibility pages already exist. Acceptable gap for beta; the aggregate page adds polish but is not blocking.

### G3: No Spanish translation for accessibility overview

**Severity:** Very low
**Legacy content:** The legacy site was English-only, so no equivalent existed.
**Current state:** `src/content/es/pages/` has `.gitkeep` but no `accessibility.md`. The English version is not yet served as a route.
**Resolution:** **N/A** — Not a gap relative to legacy. Spanish translation of the accessibility page can be backfilled when the English route is added.

---

## 5. Content Extensions (New site capabilities beyond legacy)

The new site includes capabilities that the legacy site did not have:

| Capability | Legacy | New site |
|------------|--------|----------|
| Bilingual (en/es) | No | Yes — full Spanish parity for all content |
| API reference | No | Yes — generated from package source per primitive |
| Components layer | Recipe demos only | 30 styled components with full catalog views |
| Blocks layer | 4 demo blocks | 36 composable blocks with documentation |
| Templates layer | No | 29 application templates with documentation |
| Themes layer | No | 5 theme presets + visual theme builder |
| Accessibility evidence | Manual dashboard | Per-primitive `evidence.json` + accessibility contracts |
| Changelog | No | Yes |
| Guides | No | 13 guide entries |
| Maturity labels | No | Yes — beta/GA labels per area |
| Search | No | Yes — Pagefind with locale-aware indexing |

---

## 6. Resolution Status Summary

| Item | Description | Status | Notes |
|------|-------------|--------|-------|
| R1 | Home page | ✅ Resolved | New site is a superset with bilingual support, maturity labels |
| R2 | Primitive documentation | ✅ Resolved | 4 views per primitive (overview, api, examples, accessibility) |
| R3 | Performance dashboard | ⏳ Deferred | `packages/bench/` exists; no site route. Low priority for beta. |
| R4 | Recipes page | ✅ Resolved | Superseded by Components layer (30 entries, was 7) |
| R5 | Accessibility overview | ⏳ Deferred | Content exists at `content/en/pages/accessibility.md`; no route. Wiring fix needed. |
| R6 | Astro POC (`apps/docs-astro-poc/`) | ✅ Resolved | Superseded by `apps/site/` |
| D1 | 51 primitive demos | ✅ Resolved | Replaced by generated examples from registry |
| D2 | 4 block demos | ✅ Resolved | Superseded by 36 block content entries |
| D3 | 7 recipe demos | ✅ Resolved | Superseded by 30 component content entries |

---

## 7. Conclusion

**Parity verdict: SUFFICIENT FOR BETA.**

The new site (`apps/site/`) achieves full route parity for 3 of 5 legacy routes, and the remaining 2 gaps (performance dashboard and aggregate accessibility page) are low-severity for a beta release:

- **Performance gap (G1):** The benchmark infrastructure exists in `packages/bench/`. A site route can be added when prioritized. This is developer-facing content, not critical for beta users evaluating the component library.

- **Accessibility gap (G2):** The content file exists but needs a route wired to serve it. This is a mechanical wiring fix, not a content authoring task. Per-primitive accessibility pages already exist and provide the core functionality the legacy dashboard offered.

The new site extends the legacy functionality in every dimension: bilingual support, generated API references, a Components/Blocks/Templates/Themes layer, maturity labels, and integrated search. The legacy site's hand-authored demo approach has been replaced with a maintainable registry-driven system.

**Recommendation: Proceed with CUT-002 (traffic cutover) and CUT-003 (legacy removal).** The two deferred gaps should be tracked as post-cutover enhancements, not blockers.

### Recommended post-cutover work

1. Wire a route for `src/content/en/pages/accessibility.md` (wiring fix, low effort)
2. Create a performance dashboard route that reads from `packages/bench/` artifacts (new feature, medium effort)
3. Add Spanish translation for the accessibility page (translation task)
