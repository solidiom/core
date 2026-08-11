---
id: legacy-docs-archive-note
title: "Legacy Docs Archive"
doc_type: history
tags: [legacy, archive, migration]
lifecycle: archived
---

# Legacy Docs Archive

## Archive date

2026-08-07

## What was archived

`apps/docs/` — the legacy Vite + SolidJS SPA documentation site for Solidiom primitives.

## Reason for archival

Superseded by `apps/site/` (the Astro static site) with full parity verified per CUT-001 parity report (`docs/operations/legacy-parity-verification.md`).

## Legacy routes and their successors in `apps/site/`

| Legacy route | Legacy file | apps/site/ successor |
|---|---|---|
| `/` (Home) | `src/routes/index.tsx` | `src/pages/index.astro` |
| `/primitives/[name]` | `src/routes/primitives/[name].tsx` | `src/pages/primitives/[name]/index.astro` (+ api, examples, accessibility views) |
| `/performance` | `src/routes/performance.tsx` | **Deferred** — no route yet; `packages/bench/` infrastructure exists |
| `/recipes` | `src/routes/recipes.tsx` | `src/pages/components/[name]/[view].astro` (examples view) |
| `/accessibility` | `src/routes/accessibility.tsx` | **Deferred** — content at `src/content/en/pages/accessibility.md`; no route wired yet |

## Demos

- The legacy site had **62 hand-authored demo files** (51 primitive demos, 4 block demos, 7 recipe demos).
- `apps/site/` does not use hand-authored demos. Instead, it generates examples from registry and API artifacts at build time.
- Every primitive with a registry entry gets an overview, API, examples, and accessibility page in `apps/site/`.
- The new approach is an architectural improvement: examples are maintained alongside package source rather than duplicated in the docs app.

## Key differences

- **Bilingual support:** `apps/site/` supports English and Spanish; the legacy site was English-only.
- **Generated API references:** `apps/site/` generates API docs from package source; the legacy site had none.
- **Expanded content layers:** Components (30), Blocks (36), Templates (29), Themes (5 + builder), Guides (13), Changelog, Search.
- **Maturity labels:** beta/GA labels per area.
- **Search:** Pagefind with locale-aware indexing.
