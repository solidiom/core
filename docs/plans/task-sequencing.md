---
id: task-sequencing
title: "Solidiom Catalog — Recovery and Delivery Sequencing"
doc_type: plan
audience: "Solidiom project leads, contributors"
tags: [components, blocks, templates, sequencing, m4]
lifecycle: active
authority: canonical catalog sequencing
volatility: medium
date: 2026-08-06
---

# Solidiom Catalog — Recovery and Delivery Sequencing

**Status:** block fan-out in progress; all 30 components verified, 25/36 blocks complete, 11 blocks remaining (SEARCH-02/03, COMMERCE ×3, CONTENT ×3, SHELL ×3).
**Status/DoD/queue authority:** [`docs/plans/website-tasks.md`](./website-tasks.md)
**Decision authority:** [`docs/architecture/decisions/catalog-decisions.md`](../architecture/decisions/catalog-decisions.md)

## 1. Scope and authority

This document owns only execution order, dependency unlocks, pilots, the critical path, and sequencing risks. `website-tasks.md` owns every task state, approved queue, Definition of Done, defect boundary, and counter. If the documents disagree on status or scope, `website-tasks.md` wins.

## 2. Completed recovery order

Recovery is complete. All four recovery prerequisites are closed:

1. **`CATALOG-001`: component identity and clause enforcement.** Complete — exact `COMP-*` ID/name pairs reconciled, untracked slugs flagged, all ten §8.2.1 clauses enforced.
2. **`CATALOG-002`: block enforcement.** Complete — block gate rejects manifest-only blocks, verifies source, states, previews, index, install, docs, and routes.
3. **`CATALOG-003`: aggregate integration.** Complete — contract (34/34), builds, drift, parity, exports, tools tests (382/382), and phase 1 gate (255/255) are all green.
4. **`TPL-000` in parallel:** Complete — template architecture manifest (29 templates, 32 placements), required-block graph, portfolio placement, and §8.4.1 validator are approved.

Component verification (30/30) and block pilots are also complete. The current position is block fan-out for the remaining 11 blocks, followed by template implementation.

## 3. Decision pointers D1–D6

This short section is retained for compatibility, including the manifest reference to **§3 (D6)**. Durable rationale and rejected alternatives live in [`catalog-decisions.md`](../architecture/decisions/catalog-decisions.md).

### D1 — Component physical form

Use the active-profile recipe wrapper plus its primitive dependency. See [D1](../architecture/decisions/catalog-decisions.md#d1--a-component-is-the-active-profile-recipe-wrapper).

### D2 — Registry shape

Use registry v3 and namespaced non-primitive manifests. See [D2](../architecture/decisions/catalog-decisions.md#d2--registry-v3-uses-namespaced-manifests).

### D3 — Documentation location

Use layer-aware bilingual site content. See [D3](../architecture/decisions/catalog-decisions.md#d3--catalog-prose-lives-in-layer-aware-site-content).

### D4 — Block state vocabulary

Keep structured `loading`, `empty`, `error`, and `restricted` states plus prose. See [D4](../architecture/decisions/catalog-decisions.md#d4--block-states-are-structured-and-retain-prose).

### D5 — Class prefixes

Derive prefixes by default and keep explicit compatibility exceptions. See [D5](../architecture/decisions/catalog-decisions.md#d5--class-prefixes-are-derived-by-default).

### D6 — Component citation policy

Resolve block dependencies by ID and name across the JSON manifest, Markdown companion, and approved queue; correct recoverable identities rather than deferring them. See [D6](../architecture/decisions/catalog-decisions.md#d6--correct-component-citations-instead-of-deferring-them).

## 4. Three-item component slice (complete)

The initial slice is verified and complete:

| Order | Item              | Shape proved                   | Status    |
| ----: | ----------------- | ------------------------------ | --------- |
|     1 | `COMP-001` Button | Variants and compound variants | Complete  |
|     2 | `COMP-002` Input  | Greenfield wrapper/source path | Complete  |
|     3 | `COMP-006` Dialog | Compound multi-slot overlay    | Complete  |

All three proved the corrected gate and aggregate integration checks. The full component sequence (§6.2) was then completed in order through step 30.

## 5. Component ordering principle (complete)

All 30 components are verified in the §6.2 order. The corrected block fanout ordering was followed: prerequisites (e.g. Input before Field) were respected, and zero-consumer components (Combobox, Sheet) were completed last.

## 6. Component sequence

### 6.1 Unlock interpretation

“Blocks unlocked” means every component dependency for that block has met the component DoD. It never means wrappers, docs, or registry files merely exist.

### 6.2 Recommended component order

| Step | Item                      | Block fanout | Blocks unlocked (cumulative) |
| ---: | ------------------------- | -----------: | ---------------------------: |
|    1 | COMP-001 Button           |           30 |                            0 |
|    2 | COMP-002 Input            |           26 |                            0 |
|    3 | COMP-006 Dialog           |           15 |                            0 |
|    4 | COMP-029 Spinner          |           36 |                            0 |
|    5 | COMP-004 Card             |           30 |                            0 |
|    6 | COMP-005 Alert            |           30 |                            0 |
|    7 | COMP-007 Select           |           21 |                            0 |
|    8 | COMP-003 Field            |           20 |                            1 |
|    9 | COMP-023 Data Table       |           19 |                            1 |
|   10 | COMP-010 Toast            |           18 |                            3 |
|   11 | COMP-013 Checkbox         |           18 |                            3 |
|   12 | COMP-009 Tabs             |           16 |                            4 |
|   13 | COMP-008 Dropdown Menu    |           14 |                            5 |
|   14 | COMP-021 Pagination       |           13 |                            6 |
|   15 | COMP-017 Popover          |           12 |                            8 |
|   16 | COMP-012 Avatar           |           11 |                           13 |
|   17 | COMP-015 Switch           |           11 |                           19 |
|   18 | COMP-020 Breadcrumb       |            8 |                           24 |
|   19 | COMP-026 Progress         |            7 |                           28 |
|   20 | COMP-011 Tooltip          |            3 |                           29 |
|   21 | COMP-025 Meter            |            2 |                           31 |
|   22 | COMP-014 Radio Group      |            1 |                           32 |
|   23 | COMP-019 Navigation Menu  |            1 |                           32 |
|   24 | COMP-022 Command Palette  |            1 |                           32 |
|   25 | COMP-024 Kbd              |            1 |                           33 |
|   26 | COMP-027 Resizable Panels |            1 |                           34 |
|   27 | COMP-028 Scroll Area      |            1 |                           35 |
|   28 | COMP-030 Toolbar          |            1 |                           36 |
|   29 | COMP-016 Combobox         |            0 |                           36 |
|   30 | COMP-018 Sheet            |            0 |                           36 |

## 7. Block unlock curve and pilots

### 7.1 Unlock curve

| After component step | Blocks dependency-complete |
| -------------------: | -------------------------: |
|                    7 |                          0 |
|                    8 |                          1 |
|                   10 |                          3 |
|                   12 |                          4 |
|                   14 |                          6 |
|                   16 |                         13 |
|                   18 |                         24 |
|                   20 |                         29 |
|                   24 |                         32 |
|                   28 |                         36 |

### 7.2 Pilot sequence (complete)

All three pilots are complete:

| Pilot | Block                                 | Dependencies | Unlock step | Shape proved                                  | Status   |
| ----: | ------------------------------------- | -----------: | ----------: | --------------------------------------------- | -------- |
|     1 | `BLOCK-AUTH-01` Sign In               |            5 |           8 | Form validation, error, and restricted states | Complete |
|     2 | `BLOCK-BILLING-03` Invoice History    |            8 |          15 | Data display, empty, and loading states       | Complete |
|     3 | `BLOCK-SHELL-03` Notifications Center |           12 |          17 | Application shell and embedded preview        | Complete |

Block fan-out proceeded after pilots. Currently 25/36 blocks are complete. The remaining 11 blocks (SEARCH-02/03, COMMERCE ×3, CONTENT ×3, SHELL ×3) should continue by category, keeping each category's three items together where practical.

## 8. Template dependency and order

`TPL-000` is complete. The machine-readable template-to-block dependency graph is approved. Two reference templates (`vite-solid-router`, `tanstack-start-solid`) exist under `templates/` as real workspace projects but are not approved `TPL-*` catalog rows.

Template implementation order:

1. Complete the remaining 11 blocks to satisfy all `requiredBlocks` entries.
2. Rank templates by required-block availability and portfolio reuse.
3. Prove one template for each supported stack (SolidStart/TanStack Start Solid/Vite + Solid Router) before broad fan-out.
4. Run the package-manager matrix for each template rather than batching it at the end.
5. Implement shared portfolio concepts once and expose the approved placements.
6. Re-estimate after the first three catalog templates.

## 9. Critical path

```text
TPL-000 (complete) ───────────────────────────────────────────────┐
                                                                 │
CATALOG-001/002/003 (complete) ──> components 30/30 (complete) ──> block fan-out (25/36 done)
                                                                 │
                                     template manifest + complete blocks ──> template fan-out
```

The catalog critical path is now: **remaining 11 blocks** (SEARCH-02/03, COMMERCE ×3, CONTENT ×3, SHELL ×3) → **template fan-out** (0/29). Theme preset and builder completion can proceed beside the path but cannot satisfy catalog item counts.

## 10. Sequencing risks

| ID  | Risk                                                     | Sequencing response                                                       | Status          |
| --- | -------------------------------------------------------- | ------------------------------------------------------------------------- | --------------- |
| R1  | Gates count artifacts rather than approved identities.   | Finish `CATALOG-001/002` before advancing ratchets.                       | Resolved        |
| R2  | Generated output matches a broken emitter.               | Require contract, build, drift, parity, export, and item checks together. | Mitigated       |
| R3  | Blocks begin against incomplete components.              | Unlock only from authoritative component status.                          | Resolved (30/30)|
| R4  | Valid-looking IDs name the wrong component.              | Preserve D6 three-way name agreement.                                     | Mitigated       |
| R5  | Template order is guessed before dependencies exist.     | Require `TPL-000` to emit the block graph and fanout table.               | Resolved        |
| R6  | Parallel repairs overwrite generated artifacts.          | Isolate streams and inspect targeted diffs after validation.              | Active          |
| R7  | Translation scaffolds are mistaken for reviewed content. | Keep freshness repair and human review distinct.                          | Active          |
| R8  | Zero-consumer components disappear from scope silently.  | Keep them last and require an explicit product rationale.                  | Resolved        |
| R9  | Dispatch-only workflows delay regression detection.      | Require local evidence or an explicit dispatch before status changes.     | Active          |
| R10 | Historical effort estimates drive false forecasts.       | Re-estimate from the slice, pilots, and first templates.                  | Active          |
| R11 | Remaining blocks lack registry entries despite docs.     | Require source + registry + previews per §8.3.1, not just docs.           | Active (11 blocks) |
