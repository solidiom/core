---
id: beta-coverage-matrix
title: "Beta Coverage Matrix"
description: Defines what "beta" means for Solidiom — what is included, what is excluded, and where the platform stands on its path to GA.
tags: [beta, maturity, coverage, ga, platform]
lifecycle: current
---

> **Purpose:** establish clear boundaries between "beta-ready" and "in-progress" features. This document is the source of truth for maturity labels displayed across the site.

**Task:** BETA-001
**Milestone:** M3 (Public beta platform)

---

## 1. What Beta Means

Solidiom's public beta signals that a subset of the platform is functional, tested, and safe to experiment with. It does **not** signal GA completeness. Beta is honest about what is missing.

### Beta Principles

1. **No dead CTA** — every call-to-action on the site links to a working feature.
2. **No implied GA** — the site never presents beta features as production-ready.
3. **Honest labeling** — every area of the platform carries a maturity label that reflects its current state.
4. **Clear boundaries** — the line between "ready" and "in progress" is visible and unambiguous.

---

## 2. Coverage Matrix

### Included in Beta (Ready)

| Area              | Scope             | Status     | Detail                                                                                                                                                                         |
| ----------------- | ----------------- | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Primitives**    | 3 vertical slices | **beta**   | `combobox`, `data-table`, `dialog` — full vertical slice with accessibility evidence, contracts, and reviewed documentation. 49 additional primitives are in `preview` status. |
| **CLI**           | Complete          | **stable** | All CLI commands (CLI-001..010) are complete and tested. `create solidiom`, `add`, and registry management work end-to-end.                                                    |
| **Recipes**       | Complete          | **stable** | All recipe definitions (RECIPE-001..006) are authored, validated, and published. Covers CSS, Tailwind, and UnoCSS.                                                             |
| **Themes**        | Complete          | **stable** | Theme contract, validation, 4 presets (PRESET-001..004), and cross-output parity (THEME-005) are all shipped.                                                                  |
| **Theme Builder** | Complete          | **beta**   | Full visual theme builder (BUILDER-001..006) with import/export/share-link. Functional but subject to UX refinements.                                                          |

### Excluded from Beta (In Progress)

| Area                        | Target | Count             | Status       | Detail                                                                                      |
| --------------------------- | ------ | ----------------- | ------------ | ------------------------------------------------------------------------------------------- |
| **Full Primitives Catalog** | M4     | 52 total (3 beta) | **upcoming** | Remaining 49 primitives need accessibility evidence, contracts, and reviewed documentation. |
| **Components**              | M4     | 21                | **upcoming** | Composed, opinionated components built on primitives.                                       |
| **Blocks**                  | M4     | 36                | **upcoming** | Page-level composables (hero, footer, sidebar patterns).                                    |
| **Templates**               | M4     | 29                | **upcoming** | Full application templates with routing, state, and theming.                                |

---

## 3. Maturity Levels

| Level        | Label      | Color  | Meaning                                                                                                                    |
| ------------ | ---------- | ------ | -------------------------------------------------------------------------------------------------------------------------- |
| **stable**   | "Stable"   | Green  | Production-ready. Subject to semantic versioning. Part of the public API.                                                  |
| **beta**     | "Beta"     | Blue   | Functional and tested. API may change. Safe to experiment with but not for mission-critical production without evaluation. |
| **alpha**    | "Alpha"    | Orange | Early access. Incomplete or unstable. For feedback only.                                                                   |
| **upcoming** | "Upcoming" | Gray   | Planned but not yet implemented. No API surface available.                                                                 |

---

## 4. Path to GA

GA requires:

- All 52 primitives with complete vertical slices (accessibility evidence, contracts, reviewed docs)
- All 21 components tested and documented
- All 36 blocks available
- All 29 templates published
- Full catalog search and filtering
- i18n parity for all content
- Performance budgets met on all routes
- E2E test coverage on all interactive flows

---

## 5. Maturity Metadata

The canonical mapping of platform areas to maturity levels is maintained programmatically in `apps/site/src/lib/maturity.ts`. That file is the single source of truth for the `MaturityBadge` component and any automated checks.
