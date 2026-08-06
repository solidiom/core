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

**Status:** recovery first; component and block completion cannot advance until the catalog gates and aggregate integration checks are trustworthy.
**Status/DoD/queue authority:** [`docs/plans/website-tasks.md`](./website-tasks.md)
**Decision authority:** [`docs/architecture/decisions/catalog-decisions.md`](../architecture/decisions/catalog-decisions.md)

## 1. Scope and authority

This document owns only execution order, dependency unlocks, pilots, the critical path, and sequencing risks. `website-tasks.md` owns every task state, approved queue, Definition of Done, defect boundary, and counter. If the documents disagree on status or scope, `website-tasks.md` wins.

## 2. Current recovery order

Treat the next catalog cycle as recovery and verification, not greenfield fan-out:

1. **`CATALOG-001`: repair component identity and clause enforcement.** The component gate must reconcile exact approved IDs and names before any component receives credit.
2. **`CATALOG-002`: repair block enforcement.** The block gate must reject manifest-only blocks and verify implementation evidence.
3. **`CATALOG-003`: restore aggregate integration.** Contract, build, parity, drift, package-export, translation, tool, and phase-gate failures must be repaired before the component ratchet advances.
4. **`TPL-000` in parallel:** define the template architecture manifest, required-block graph, portfolio placement, and template validator. Its prerequisites are complete and it does not need to wait for catalog recovery.

`CATALOG-001`, `CATALOG-002`, and `CATALOG-003` may be developed in parallel, but all three are re-entry conditions for component/block completion. Keep validation changes separate from changes that merely adjust expected counts.

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

## 4. Three-item component slice

Before accepting fan-out completion, re-verify this slice against the corrected gate and aggregate integration checks:

| Order | Item              | Shape proved                   | Sequencing reason                                        |
| ----: | ----------------- | ------------------------------ | -------------------------------------------------------- |
|     1 | `COMP-001` Button | Variants and compound variants | Highest fanout and the established prefix exception      |
|     2 | `COMP-002` Input  | Greenfield wrapper/source path | Proves profile-aware source resolution and unlocks Field |
|     3 | `COMP-006` Dialog | Compound multi-slot overlay    | Exercises slot ownership and behavior boundaries         |

Do not start block implementation from component file presence. A dependency unlocks only when its component row closes under the corrected authority in `website-tasks.md`.

## 5. Component ordering principle

After the slice, prioritize components by corrected block fanout. Preserve prerequisites such as Input before Field. Keep zero-consumer components last so their product rationale is reviewed explicitly rather than inferred from accidental graph edges.

Parallel repair streams may address: contract/build failures; cross-profile parity and package exports; queue/registry identity; and per-item evidence. Within each stream, prefer the §6.2 order.

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

### 7.2 Pilot sequence

Start pilots only after `CATALOG-002` makes a manifest-only block fail and each pilot's component dependencies are complete.

| Pilot | Block                                 | Dependencies | Unlock step | Shape proved                                  |
| ----: | ------------------------------------- | -----------: | ----------: | --------------------------------------------- |
|     1 | `BLOCK-AUTH-01` Sign In               |            5 |           8 | Form validation, error, and restricted states |
|     2 | `BLOCK-BILLING-03` Invoice History    |            8 |          15 | Data display, empty, and loading states       |
|     3 | `BLOCK-SHELL-03` Notifications Center |           12 |          17 | Application shell and embedded preview        |

After the pilots, fan out the remaining blocks by category, keeping each category's three items together where practical. Keep the highest-dependency blocks last; Toolbar keeps Content Editor at component step 28. Re-estimate work after the pilots rather than applying historical greenfield estimates.

## 8. Template dependency and order

`TPL-000` starts now in parallel. It must create the machine-readable template-to-block dependency graph before template implementation order can be computed.

After that manifest is approved:

1. rank templates by required-block availability and portfolio reuse;
2. prove one template for each supported stack before broad fan-out;
3. run the package-manager matrix for each template rather than batching it at the end;
4. implement shared portfolio concepts once and expose the approved placements;
5. re-estimate after the first three catalog templates.

The existing CLI materializer reference templates are not substitutes for approved `TPL-*` entries.

## 9. Critical path

```text
TPL-000 (parallel) ───────────────────────────────────────────────┐
                                                                 │
CATALOG-001/002/003 ──> three-item slice ──> component order ──> block pilots ──> block fan-out
                                                                 │
                                     template manifest + complete blocks ──> template fan-out
```

The catalog critical path is trustworthy enforcement → verified component dependencies → representative block pilots → block completion → dependency-derived templates. Theme preset and builder completion can proceed beside the path but cannot satisfy catalog item counts.

## 10. Sequencing risks

| ID  | Risk                                                     | Sequencing response                                                       |
| --- | -------------------------------------------------------- | ------------------------------------------------------------------------- |
| R1  | Gates count artifacts rather than approved identities.   | Finish `CATALOG-001/002` before advancing ratchets.                       |
| R2  | Generated output matches a broken emitter.               | Require contract, build, drift, parity, export, and item checks together. |
| R3  | Blocks begin against incomplete components.              | Unlock only from authoritative component status.                          |
| R4  | Valid-looking IDs name the wrong component.              | Preserve D6 three-way name agreement.                                     |
| R5  | Template order is guessed before dependencies exist.     | Require `TPL-000` to emit the block graph and fanout table.               |
| R6  | Parallel repairs overwrite generated artifacts.          | Isolate streams and inspect targeted diffs after validation.              |
| R7  | Translation scaffolds are mistaken for reviewed content. | Keep freshness repair and human review distinct.                          |
| R8  | Zero-consumer components disappear from scope silently.  | Keep them last and require an explicit product rationale.                 |
| R9  | Dispatch-only workflows delay regression detection.      | Require local evidence or an explicit dispatch before status changes.     |
| R10 | Historical effort estimates drive false forecasts.       | Re-estimate from the slice, pilots, and first templates.                  |
