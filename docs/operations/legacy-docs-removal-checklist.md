---
id: cut-003-removal-checklist
title: "CUT-003 — Legacy Docs Removal"
doc_type: operations
tags: [cutover, legacy, removal, CUT-003]
lifecycle: archived
created: 2026-08-08
completed: 2026-08-09
---

# CUT-003 — Legacy Docs Removal Checklist

## Status: COMPLETE

All items executed. `apps/docs/` removed at CUT-003. Remaining legacy references cleaned up at CUT-004.

## What was done

### Deletion

- [x] `apps/docs/` removed
- [x] Archive at `docs/history/legacy-docs/` retained

### Config and CI

- [x] `.changeset/config.json` — `@solidiom/docs` removed from ignore list
- [x] `.mise.toml` — `build:docs` task replaced with `build:site`; `dev` task updated to point to `dev:site`
- [x] `.github/workflows/ci.yml` — `@solidiom/docs` removed from exclude list in `test-solid-matrix` job
- [x] `.mise.toml` — `ci:solid-matrix` task updated to exclude only `@solidiom/site`

### Tooling

- [x] `tools/primitive-completion-gate.ts` — removed `apps/docs/` demo and docs-package checks
- [x] `tools/phase2-gate.ts` — updated RangeCalendar demo and bench dashboard checks to reference `apps/site/`
- [x] `tools/phase3-gate.ts` — removed `apps/docs/src/demos/index.ts` demo count check
- [x] `tools/primitive-completion-gate.test.ts` — removed `apps/docs/` test fixtures
- [x] `tools/recipe-contract-tokens.ts` — removed `LEGACY_TOKEN_ALIASES` content (now empty)
- [x] `tools/recipe-contract-tokens.test.ts` — removed `LEGACY_TOKEN_ALIASES` reference

### Documentation

- [x] `README.md` — removed `apps/docs/` from workspace layout and task table; updated Apple Silicon caveat
- [x] `docs/contracts/public-package-classification.md` — moved `@solidiom/docs` to "Removed at CUT-003" section
- [x] `docs/guides/deployment.md` — updated redirect section to reflect active CUT-003 redirects

### Retained

- `docs/history/legacy-docs/` — archive of deprecation notice and key content
- `apps/site/public/_redirects` — `/docs/*` → `/primitives/:splat` redirect still active
- `apps/site/tools/verify-preview-deployment.ts` — legacy redirect verification check still active (valid)

## Deferred notes

Historical comments in source files that explain the origin of certain files are retained:

- `packages/recipes-tailwind/src/styles/theme.css` — explains why the theme contract file exists
- `docs/contracts/recipe-contract.md` — explains the dependency resolution for CUT-003
- `templates/*/src/index.css` — historical note about where tokens were trimmed from
