---
id: website-tasks
title: "Solidiom Website — Canonical Task Authority"
doc_type: reference
audience: "Solidiom project leads, contributors"
tags: [website, tasks, backlog, milestones, catalog]
lifecycle: active
authority: canonical status, definition-of-done, defects, queues, and counters
volatility: high
date: 2026-08-06
---

# Solidiom Website — Canonical Task Authority

**Status:** in execution — M0–M2 complete; M3 integration recovered; M4 primitives complete, 30/30 components verified, 36/36 blocks complete, 10/29 templates implemented; M5 in progress incidentally.
**Current tree evidence:** `gate:phase1` is green at 255/255; `test:tools` 382/382; recipe contract 34/34; drift/parity/exports all zero issues.
**Target application:** `apps/site/`
**Canonical origin:** `https://solidiom.org`
**Website architecture:** [`docs/architecture/website.md`](../architecture/website.md)
**Read-first dashboard:** [`README.md`](./README.md)
**Sequencing:** [`task-sequencing.md`](./task-sequencing.md)
**Durable decisions:** [`catalog-decisions.md`](../architecture/decisions/catalog-decisions.md)
**History:** [`website-m0-m3.md`](../history/plans/website-m0-m3.md) and [`catalog-foundations-2026-08.md`](../history/plans/catalog-foundations-2026-08.md)

Current position: all 52 primitives meet the M4 bar. All 30 components are verified `[x]`. All 36 blocks are complete `[x]`. Ten templates are implemented `[x]` (TPL-001 through TPL-010); 19 remain `[ ]` (TPL-011 through TPL-029). Two reference templates (`vite-solid-router`, `tanstack-start-solid`) exist but are not approved catalog rows. Untracked registry entries for `accordion`, `badge`, and `menu` are flagged by the corrected gate but not counted. Workflows are dispatch-only.

Recovery tasks `CATALOG-001`, `CATALOG-002`, `CATALOG-003`, `TPL-000`, and `FOUND-008` are complete. All 30 components and all 36 blocks are verified. Ten templates are implemented. The critical path is now template fan-out (19 remaining) → G4 exit.

---

## 1. Authority and operating rules

This document is the sole authority for task state, Definitions of Done, approved queues, open defects, and scope counters. `task-sequencing.md` owns ordering only. Architecture decisions explain rationale; history documents are non-authoritative.

### 1.1 Task states

- `[ ]` Not started
- `[~]` In progress
- `[x]` Complete and validated
- `[!]` Blocked; the row names the blocker

### 1.2 Completion rules

A row may become `[x]` only when its acceptance boundary is re-checked by the named gate or by recorded targeted evidence. Generated files, registry membership, and routes are evidence only where the relevant DoD says they are. Never change a counter to make a ratchet green.

Catalog rows marked `WP` are work packages and must be split into reviewable implementation tasks when assigned.

### 1.3 Conditional requirements

- A conditional requirement may be satisfied by a declared `notApplicable` reason in the document frontmatter.
- The reason must be authored; omission alone is not valid.
- Applicability follows the requirement text. No separate allowlist may drift from it.

### 1.4 Global Definition of Done

Every completed implementation task must:

1. Have no unreviewed scope or undocumented exception.
2. Use Solidiom primitives/components for website interactions.
3. Pass targeted tests plus affected typecheck and build targets.
4. Include accessibility and keyboard validation when UI changes.
5. Update English and Spanish content when user-facing text changes.
6. Preserve static rendering and route-level lazy-loading boundaries.
7. Keep search terms, code, theme values, emails, and free-form content out of analytics.
8. Update canonical schemas/generated artifacts instead of creating parallel metadata.
9. Include migration notes for public package, registry, CLI, route, or content changes.
10. Leave the working tree formatted and free of new diagnostics.

## 2. Milestone status

| Milestone                 | Status                       | Current authority statement                                                               |
| ------------------------- | ---------------------------- | ----------------------------------------------------------------------------------------- |
| M0 Governance/inputs      | Complete                     | Governance, brand, migration, baseline, and operations prerequisites closed G0.           |
| M1 Foundation/alpha       | Complete with policy blocker | Site foundation closed G1; `CI-001` remains blocked by the dispatch-only policy.          |
| M2 Content vertical slice | Complete                     | Registry/content/API/a11y/docs/search and three complex slices closed G2.                 |
| M3 Public beta            | Recovered                    | Integration evidence restored: contract, builds, drift, parity, exports, tools all green.     |
| M4 Catalog                | In progress                  | Primitives 52/52; components 30/30; blocks 36/36; templates 10/29.                              |
| M5 GA/cutover             | In progress incidentally     | `MKT-005` and `BUILDER-008` are complete; the remaining GA programme is open.             |

### 2.1 Compact completion ledger for M0–M3

Completed IDs are retained here without duplicating row-level history:

- M0: `GOV-001..006`, `BRAND-001..004`, `MIG-001..002`, `BASE-001..002`, `OPS-001..002`.
- M1: `SITE-001..014`, `I18N-001..004`, `TEST-001..004`, `CI-002..004`, `OPS-003`.
- M2: `REG-001..007`, `CONTENT-001..005`, `API-001..005`, `A11Y-001..006`, `DOCS-001..006`, `SEARCH-001..005`, `VS-001..005`.
- M3 delivered: `RECIPE-001..004`, `RECIPE-007`, `CLI-001..010`, `CLI-011`, `THEME-001..006`, `BUILDER-001..006`, `BETA-001..003`, `A11Y-007..009`, `TEST-005..006`.
- Cross-cutting closed defects: `CI-005..007`, `BUILD-001`, `PRIM-000`, `BLOCK-000A`, `BLOCK-000B`, `A11Y-010`.

Evidence and incident narratives moved to the non-authoritative [M0–M3 history](../history/plans/website-m0-m3.md) and [catalog foundation history](../history/plans/catalog-foundations-2026-08.md).

## 3. Gates and critical path

`G0`–`G5` are website programme milestones. `gate:phase0`–`gate:phase3` are library release-readiness scripts; matching numbers do not imply matching scope. In particular, `gate:phase3` is not the G3 milestone gate. G3 uses the beta acceptance matrix and its checklist below.

```text
catalog gate recovery → three-component slice → component DoD
                                              ↓
TPL-000 (parallel) → block pilots → block fan-out → template fan-out → G4
                                                                      ↓
                                                         GA hardening/cutover → G5
```

`tools/phase4-gate.ts` exists but is wired to no script or workflow. Its disposition remains part of G5 hardening.

## 4. M0 — Governance and canonical inputs

**G0: complete.** See the compact ledger in §2.1 and the [historical evidence](../history/plans/website-m0-m3.md#m0--governance-and-canonical-inputs). No open M0 task remains.

## 5. M1 — Foundation and private alpha shell

**G1: complete**, subject to the trigger-policy blocker below.

| Status | ID     | Size | Owner | Acceptance boundary                                                                                                                                            |
| ------ | ------ | ---- | ----- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [!]    | CI-001 | S    | CI    | Restore pull-request/main triggers or formally accept dispatch-only enforcement. Blocked on policy; `OPS-003` per-PR preview is disabled by the same decision. |

## 6. M2 — Content platform and vertical slice

**G2: complete.** All 52 primitives remain governed by `PRIM-000`; the current component translation regression does not reopen primitive rows. See [historical evidence](../history/plans/website-m0-m3.md#m2--content-platform-and-vertical-slice).

## 7. M3 — Public beta platform

M3 shipped, but current catalog changes reopened its recipe integration evidence.

| Status | ID         | Size | Owner             | Acceptance boundary                                                                                                     |
| ------ | ---------- | ---- | ----------------- | ----------------------------------------------------------------------------------------------------------------------- |
| [~]    | RECIPE-005 | M    | QA/design systems | Restore three-output contract, drift, parity, state, and exception audits; current failures are owned by `CATALOG-003`. |
| [~]    | RECIPE-006 | S    | Build             | Restore recipe package builds, source mirrors, and exports; current failures are owned by `CATALOG-003`.                |

### G3 exit checklist

- [x] Canonical recipe contract and all three emitters pass current build, drift, parity, and export checks (`CATALOG-003`).
- [x] Theme contract, generation, parity, contrast, and round-trip checks are implemented.
- [x] CLI plan/inspect/add/create, verification, rollback, four package managers, and offline fixtures are implemented.
- [x] Theme-builder foundation is route-local and implemented.
- [x] Beta coverage/maturity labels, static acceptance, browser acceptance, and publication information were delivered.
- [ ] Current aggregate accessibility evidence is blocked because `gate:phase3` re-runs the red phase 1 gate.

Historical beta and CI measurements are recorded in [website M0–M3 history](../history/plans/website-m0-m3.md#m3--public-beta-platform-delivered-then-regressed), not repeated as current evidence here.

## 8. Shared catalog-item Definitions of Done

Each layer's DoD is tiered into a machine-checkable bar and a review bar. Clause numbering is normative and must stay aligned with the enforcing gate. Decision rationale lives in [`catalog-decisions.md`](../architecture/decisions/catalog-decisions.md).

### 8.1 Primitive item DoD

The primitive DoD is tiered. The **M4 bar** is machine-checkable by `PRIM-000` (`tools/primitive-catalog-gate.ts`); the **G5 bar** adds the human requirements that arm the existing enforcement gates.

#### 8.1.1 M4 bar (enforced by `PRIM-000`)

A `PRIM-*` row may go `[x]` when all nine hold:

1. Registry records `documentation.status: "complete"` and `accessibility.reviewStatus: "automated"` with ≥1 evidence ID, carries bilingual search keywords and current integrity data, **and the committed registry matches source truth**.
2. English overview contains the required sections: Usage, Installation, Parts & Props, Styling, SSR and hydration, Keyboard & behavior.
3. Conditional sections are present **or** declared `notApplicable` with a stated reason: Composition, Relationships, Migration notes, Testing. `PRIM-000` accepts a declared reason the same way `a11y:coverage-gate` accepts non-applicable accessibility criteria.
4. Spanish mirrors 2 and 3, carries `translationStatus: draft` and a real `translationSourceHash`, and passes the glossary and protected-literal checks in `translation:check`.
5. At least one example. `runnable: true` with a live Solid island **if and only if** the accessibility contract declares keyboard interaction; otherwise `runnable: false` with a declared reason. The discriminator is derived from an authored artifact rather than listed, so no separate list can drift.
6. Authored accessibility contract in English and Spanish, per the `A11Y-002` schema.
7. Committed `packages/<name>/docs/accessibility/evidence.json` with a passing summary and `passes > 0`.
8. API artifact present and source-linked; all four routes render in both locales.
9. Registry `status` remains `preview`.

#### 8.1.2 G5 bar (per-primitive promotion)

Per primitive, in order: Spanish flips to `translationStatus: human-reviewed` → registry `status` moves to `stable`. That step arms two existing gates for that primitive automatically:

- `a11y:coverage-gate` enforces only where `status` is `stable`.
- `validate-translation-freshness.ts` derives GA maturity from the same field and blocks on anything not `human-reviewed`.

Additionally, the full manual evidence matrix from `A11Y-005` must be recorded per primitive before `stable` is granted, including keyboard, focus, zoom, contrast, reduced motion, screen readers, and touch.

### 8.2 Component item DoD

The **M4 bar** is machine-checkable by `FOUND-004` (`tools/component-catalog-gate.ts`); the review bar holds what only a human can judge. Current enforcement is reopened under `CATALOG-001`.

`typeset` and `prose` are typography utility stylesheets, not components. They have no primitive dependency or interactive behavior and do not appear in the component queue.

#### 8.2.1 M4 bar (enforced by `FOUND-004`)

A `COMP-*` row may go `[x]` when all ten hold:

1. **Physical form.** The component is the composed recipe wrapper for each shipped styling profile — `packages/recipes-<profile>/src/recipes/<scope>.tsx` — plus its primitive dependency. The wrapper imports the corresponding `@solidiom/<primitive>` package and contributes styling and composition only.
2. **Canonical contract.** The scope is declared in `tools/recipe-contract-definitions.ts` and validated by `recipe:contract`.
3. **Three outputs, no fork.** `recipe:emit:{css,tailwind,unocss}:check` all pass for the scope, `audit:recipe-parity` reports cross-profile coverage/state/exception parity, and `audit:recipe-drift` is green — a pre-existing CSS or Tailwind recipe is migrated into the contract, never forked beside it.
4. **Registry.** `registry/components/<name>.json` exists with source files recorded **per styling output**, integrity digests, and `documentation.status: "complete"`; the component appears in the index's `components[]`.
5. **Source install.** `solidiom plan`/`add`/`verify`/`diff` resolve the component to the wrapper for `config.stylingProfile` rather than to primitive files, write a verified lock entry, and fail closed on a digest mismatch.
6. **English docs** at `apps/site/src/content/en/components/<name>.md` containing the required sections: Usage, Installation, Anatomy, Variants & states, Styling, SSR and hydration, Accessibility. `FOUND-006`'s scaffolder emits exactly this list and `FOUND-004` enforces it, so a section is added in one place.
7. **Spanish mirror** of 6 with `translationStatus: draft`, a real `translationSourceHash`, and passing glossary and protected-literal checks in `translation:check`.
8. **At least one example**, extracted per `CONTENT-005` so the displayed code and the executable example share one canonical source.
9. **Accessibility by reference.** The docs cite the primitive's authored contract and its committed `evidence.json` rather than restating them, and that evidence passes with `passes > 0`. A component-level note is required only where the wrapper changes semantics.
10. **Routes.** `/components/<name>/` renders in both locales and `REG-007` reports exactly one route for the deliverable. Registry `status` remains `preview`.

#### 8.2.2 Review bar (human)

- The wrapper introduces no duplicate behavior layer: no state machine, focus management, or keyboard handling that the primitive already owns.
- Tests adequately cover states, variants, slots, composition, and disabled/loading/error behavior.
- Theme previews render correctly across all four presets in light and dark.
- Spanish human review per §8.5 remains a G5 requirement.

### 8.3 Block item DoD

The **M4 bar** is machine-checkable by `FOUND-005` (`tools/block-catalog-gate.ts`). Current enforcement is reopened under `CATALOG-002`.

#### 8.3.1 M4 bar (enforced by `FOUND-005`)

A `BLOCK-*` row may go `[x]` when all ten hold:

1. **Named, not reserved.** The block carries its `BLOCK-000` name, outcome, and data boundary in `docs/contracts/block-catalog-manifest.json`; no placeholder ships.
2. **Dependencies resolve by name.** Every `componentDependencies` entry resolves to an approved `COMP-001..030` row **and** the component named for that ID in `block-catalog-manifest.md` matches the name §9.2 gives it; every one of those rows is complete. An ID-range check alone is insufficient and was demonstrably so: ten citations once used `PRIM-*` numbers with a `COMP-` prefix, and the two that happened to land inside `001..021` resolved cleanly to the wrong component in 20 blocks.
3. **No unresolved proposals.** `proposedComponents` is empty for this block, or the §9.2 amendment that absorbs it is recorded.
4. **Structured states.** `requiredStates` declares all four of `loading`, `empty`, `error`, `restricted`, and matches the prose `states` field in cardinality.
5. **States implemented.** All four are implemented in source, not merely declared.
6. **Both previews.** Full-page and embedded previews exist and render.
7. **Registry.** `registry/blocks/<name>.json` exists with integrity digests; the block appears in the index's `blocks[]`.
8. **Source install.** `solidiom add`/`verify`/`diff` resolve and verify the block source, and fail closed on a digest mismatch.
9. **Bilingual docs.** English doc with its required sections plus a Spanish mirror at `translationStatus: draft` with a real hash, passing `translation:check`. The docs state the primitive/component dependency map, the files and routes added, and the data-boundary assumptions explicitly.
10. **Routes.** `/blocks/<name>/` renders in both locales and `REG-007` reports exactly one route.

#### 8.3.2 Review bar (human)

- Responsive/mobile behavior is reviewed at the three visual breakpoints through the pinned visual harness.
- Data-boundary assumptions are explicit and reviewed.
- The end-to-end keyboard path is reviewed, and axe reports no critical preview-route violations.
- Canonical recipes generate all styling profiles where the block introduces styling.

### 8.4 Template item DoD

No template gate exists yet. `TPL-000` must produce the manifest validator that enforces the M4 bar below, alongside the existing `CLI-008` offline matrix. Until then, §8.4.1 is review-enforced.

#### 8.4.1 M4 bar (enforced by the `TPL-000` validator + `CLI-008`)

A `TPL-*` row may go `[x]` when all eight hold:

1. **One stack.** Listed in the `TPL-000` manifest targeting exactly one of SolidStart, TanStack Start Solid, or Vite + Solid Router, with `requiredBlocks`, deployment target, auth model, and portfolio tags declared.
2. **Tree present.** `templates/<name>/` exists with a `template.json` following the two `CLI-007` references.
3. **Four package managers.** `solidiom create --template <name>` succeeds with npm, pnpm, Yarn, and Bun in the `CLI-008` offline fixture, with no foreign lockfile in the result.
4. **Generated project is live.** It builds, typechecks, and starts.
5. **Generated project is tested.** It passes its smoke and accessibility tests inside the offline fixture.
6. **Blocks complete.** Every `requiredBlocks` entry is a complete `BLOCK-*` row.
7. **Registry.** `registry/templates/<name>.json` exists with integrity digests and a signed manifest; the template appears in the index's `templates[]`.
8. **Bilingual docs and route.** English doc plus Spanish mirror at `translationStatus: draft` with a real hash, and `/templates/<name>/` renders in both locales.

#### 8.4.2 Review bar (human)

- Replaceable boundaries identify consumer-owned files and scaffolding.
- Router, data, auth, styling, theme, and package-manager choices include rationale.
- Security/data assumptions and current screenshots are present.
- Shared portfolio concepts use one canonical template unless a materially different architecture is approved.

### 8.5 Translation item DoD

This is the G5 requirement applied during promotion:

- English source hash matches the reviewed Spanish record.
- A fluent reviewer confirms terminology, technical meaning, accessibility guidance, metadata, and examples.
- Code, APIs, commands, attributes, and package names are not translated.
- Route parity, links, search inclusion, canonical/`hreflang`, and layout stress tests pass.

## 9. M4 — Catalog completion work queues

`task-sequencing.md` controls order. This section controls status and approved scope.

### 9.0 Catalog machinery — prerequisites for §§9.2–9.5

| Status | ID        | Size | Depends on           | Acceptance boundary                                                                              |
| ------ | --------- | ---- | -------------------- | ------------------------------------------------------------------------------------------------ |
| [x]    | FOUND-001 | S    | —                    | Numbered component, block, and template bars incorporate D1–D6.                                  |
| [x]    | FOUND-002 | L    | FOUND-001            | Registry v3, namespaced manifests, layer-aware discovery, docs metadata, and CLI schema support. |
| [x]    | FOUND-003 | S    | FOUND-001            | Component/block/theme source resolution follows D1.                                              |
| [x]    | FOUND-004 | M    | FOUND-002            | Exact queue-aware component gate enforcing every §8.2.1 clause (`CATALOG-001`).                  |
| [x]    | FOUND-005 | S    | FOUND-002            | Block gate enforcing every §8.3.1 clause (`CATALOG-002`).                                        |
| [x]    | FOUND-006 | S    | FOUND-002            | Bilingual catalog scaffolding with real translation hashes.                                      |
| [x]    | FOUND-007 | M    | FOUND-002            | Bilingual route generators for all non-primitive layers.                                         |
| [x]    | FOUND-008 | S    | FOUND-004, FOUND-005 | Trustworthy gate wiring after validator and integration recovery.                                |
| [x]    | FOUND-009 | S    | FOUND-001            | Typeset/prose classified as utility stylesheets, not components.                                 |

### 9.1 Primitive queue — 52

`PRIM-001..052` are `[x]`: exactly 52/52 meet §8.1.1 under `PRIM-000`. Their G5 human-review/stable promotion remains open under `I18N-005`; that does not reopen M4 rows.

### 9.2 Component queue — 30

All rows additionally depend on §9.0. Thirty approved concepts have landed partial deliverables, but every row remains `[~]` until exact queue reconciliation and the complete DoD pass. `accordion` and `badge` are registry slugs without approved rows and must be rejected or formally accounted for by `CATALOG-001`.

| Status | ID       | Component        | Baseline               | Size | Depends on                      |
| ------ | -------- | ---------------- | ---------------------- | ---- | ------------------------------- |
| [x]    | COMP-001 | Button           | CSS + Tailwind recipe  | M    | RECIPE-005, PRIM-007, THEME-006 |
| [x]    | COMP-002 | Input            | New                    | M    | RECIPE-005, PRIM-023            |
| [x]    | COMP-003 | Field            | New                    | L    | RECIPE-005, PRIM-021, COMP-002  |
| [x]    | COMP-004 | Card             | New                    | M    | RECIPE-005, PRIM-009            |
| [x]    | COMP-005 | Alert            | CSS + Tailwind recipe  | M    | RECIPE-005, PRIM-002            |
| [x]    | COMP-006 | Dialog           | CSS + Tailwind recipe  | L    | RECIPE-005, PRIM-018            |
| [x]    | COMP-007 | Select           | CSS + Tailwind recipe  | L    | RECIPE-005, PRIM-037            |
| [x]    | COMP-008 | Dropdown Menu    | Existing `menu` recipe | L    | RECIPE-005, PRIM-028            |
| [x]    | COMP-009 | Tabs             | CSS + Tailwind recipe  | M    | RECIPE-005, PRIM-044            |
| [x]    | COMP-010 | Toast            | CSS + Tailwind recipe  | L    | RECIPE-005, PRIM-045            |
| [x]    | COMP-011 | Tooltip          | CSS + Tailwind recipe  | M    | RECIPE-005, PRIM-049            |
| [x]    | COMP-012 | Avatar           | New                    | M    | RECIPE-005, PRIM-004            |
| [x]    | COMP-013 | Checkbox         | CSS + Tailwind recipe  | M    | RECIPE-005, PRIM-011            |
| [x]    | COMP-014 | Radio Group      | New                    | M    | RECIPE-005, PRIM-034            |
| [x]    | COMP-015 | Switch           | CSS + Tailwind recipe  | M    | RECIPE-005, PRIM-043            |
| [x]    | COMP-016 | Combobox         | New                    | L    | RECIPE-005, PRIM-013            |
| [x]    | COMP-017 | Popover          | CSS + Tailwind recipe  | M    | RECIPE-005, PRIM-032            |
| [x]    | COMP-018 | Sheet            | New                    | L    | RECIPE-005, PRIM-039            |
| [x]    | COMP-019 | Navigation Menu  | New                    | L    | RECIPE-005, PRIM-030            |
| [x]    | COMP-020 | Breadcrumb       | New                    | M    | RECIPE-005, PRIM-006            |
| [x]    | COMP-021 | Pagination       | New                    | M    | RECIPE-005, PRIM-031            |
| [x]    | COMP-022 | Command Palette  | New                    | L    | RECIPE-005, PRIM-014            |
| [x]    | COMP-023 | Data Table       | New                    | L    | RECIPE-005, PRIM-016            |
| [x]    | COMP-024 | Kbd              | New                    | S    | RECIPE-005, PRIM-025            |
| [x]    | COMP-025 | Meter            | New                    | M    | RECIPE-005, PRIM-029            |
| [x]    | COMP-026 | Progress         | New                    | M    | RECIPE-005, PRIM-033            |
| [x]    | COMP-027 | Resizable Panels | New                    | L    | RECIPE-005, PRIM-035            |
| [x]    | COMP-028 | Scroll Area      | New                    | M    | RECIPE-005, PRIM-036            |
| [x]    | COMP-029 | Spinner          | New                    | M    | RECIPE-005, PRIM-042            |
| [x]    | COMP-030 | Toolbar          | New                    | L    | RECIPE-005, PRIM-048            |

`COMP-016` Combobox and `COMP-018` Sheet have no block consumers. They remain approved and last in the sequence pending explicit pilot-informed rationale. Check names, not old numbers, when reading revisions predating `BLOCK-000B`.

### 9.3 Block queue — 36 minimum

`BLOCK-000` is complete: the approved manifest names all 36 blocks, declares outcomes, required states, corrected component dependencies, and data boundaries. Implementation rows remain `[~]`; docs/manifests alone do not satisfy §8.3.1.

| Status | ID                | Category / slot                        | Size | Depends on                     |
| ------ | ----------------- | -------------------------------------- | ---- | ------------------------------ |
| [x]    | BLOCK-000         | Approve 36-item block catalog manifest | L    | representative COMP-* complete |
| [x]    | BLOCK-AUTH-01     | Authentication 1                       | WP   | BLOCK-000, required COMP-*     |
| [x]    | BLOCK-AUTH-02     | Authentication 2                       | WP   | BLOCK-000, required COMP-*     |
| [x]    | BLOCK-AUTH-03     | Authentication 3                       | WP   | BLOCK-000, required COMP-*     |
| [x]    | BLOCK-ONBOARD-01  | Onboarding 1                           | WP   | BLOCK-000, required COMP-*     |
| [x]    | BLOCK-ONBOARD-02  | Onboarding 2                           | WP   | BLOCK-000, required COMP-*     |
| [x]    | BLOCK-ONBOARD-03  | Onboarding 3                           | WP   | BLOCK-000, required COMP-*     |
| [x]    | BLOCK-SETTINGS-01 | Settings 1                             | WP   | BLOCK-000, required COMP-*     |
| [x]    | BLOCK-SETTINGS-02 | Settings 2                             | WP   | BLOCK-000, required COMP-*     |
| [x]    | BLOCK-SETTINGS-03 | Settings 3                             | WP   | BLOCK-000, required COMP-*     |
| [x]    | BLOCK-BILLING-01  | Billing 1                              | WP   | BLOCK-000, required COMP-*     |
| [x]    | BLOCK-BILLING-02  | Billing 2                              | WP   | BLOCK-000, required COMP-*     |
| [x]    | BLOCK-BILLING-03  | Billing 3                              | WP   | BLOCK-000, required COMP-*     |
| [x]    | BLOCK-ADMIN-01    | Administration 1                       | WP   | BLOCK-000, required COMP-*     |
| [x]    | BLOCK-ADMIN-02    | Administration 2                       | WP   | BLOCK-000, required COMP-*     |
| [x]    | BLOCK-ADMIN-03    | Administration 3                       | WP   | BLOCK-000, required COMP-*     |
| [x]    | BLOCK-OBS-01      | Observability 1                        | WP   | BLOCK-000, required COMP-*     |
| [x]    | BLOCK-OBS-02      | Observability 2                        | WP   | BLOCK-000, required COMP-*     |
| [x]    | BLOCK-OBS-03      | Observability 3                        | WP   | BLOCK-000, required COMP-*     |
| [x]    | BLOCK-RESOURCE-01 | Resource management 1                  | WP   | BLOCK-000, required COMP-*     |
| [x]    | BLOCK-RESOURCE-02 | Resource management 2                  | WP   | BLOCK-000, required COMP-*     |
| [x]    | BLOCK-RESOURCE-03 | Resource management 3                  | WP   | BLOCK-000, required COMP-*     |
| [x]    | BLOCK-AI-01       | AI interfaces 1                        | WP   | BLOCK-000, required COMP-*     |
| [x]    | BLOCK-AI-02       | AI interfaces 2                        | WP   | BLOCK-000, required COMP-*     |
| [x]    | BLOCK-AI-03       | AI interfaces 3                        | WP   | BLOCK-000, required COMP-*     |
| [x]    | BLOCK-SEARCH-01   | Search 1                               | WP   | BLOCK-000, required COMP-*     |
| [x]    | BLOCK-SEARCH-02   | Search 2                               | WP   | BLOCK-000, required COMP-*     |
| [x]    | BLOCK-SEARCH-03   | Search 3                               | WP   | BLOCK-000, required COMP-*     |
| [x]    | BLOCK-COMMERCE-01 | Commerce 1                             | WP   | BLOCK-000, required COMP-*     |
| [x]    | BLOCK-COMMERCE-02 | Commerce 2                             | WP   | BLOCK-000, required COMP-*     |
| [x]    | BLOCK-COMMERCE-03 | Commerce 3                             | WP   | BLOCK-000, required COMP-*     |
| [x]    | BLOCK-CONTENT-01  | Content 1                              | WP   | BLOCK-000, required COMP-*     |
| [x]    | BLOCK-CONTENT-02  | Content 2                              | WP   | BLOCK-000, required COMP-*     |
| [x]    | BLOCK-CONTENT-03  | Content 3                              | WP   | BLOCK-000, required COMP-*     |
| [x]    | BLOCK-SHELL-01    | Application shell 1                    | WP   | BLOCK-000, required COMP-*     |
| [x]    | BLOCK-SHELL-02    | Application shell 2                    | WP   | BLOCK-000, required COMP-*     |
| [x]    | BLOCK-SHELL-03    | Application shell 3                    | WP   | BLOCK-000, required COMP-*     |

### 9.4 Template queue — 29 unique / 32 placements

`TPL-000` starts in parallel with catalog recovery. Existing CLI reference templates are not approved catalog rows.

| Status | ID      | Template                                         | Portfolio             | Size | Depends on                |
| ------ | ------- | ------------------------------------------------ | --------------------- | ---- | ------------------------- |
| [x]    | TPL-000 | Approve template architecture/portfolio manifest | Both                  | L    | CLI-008, BLOCK-000        |
| [x]    | TPL-001 | Authentication Starter                           | Balanced              | WP   | TPL-000, required BLOCK-* |
| [x]    | TPL-002 | Onboarding App                                   | Balanced              | WP   | TPL-000, required BLOCK-* |
| [x]    | TPL-003 | SaaS Dashboard                                   | Balanced              | WP   | TPL-000, required BLOCK-* |
| [x]    | TPL-004 | Multi-tenant Admin                               | Balanced + Enterprise | WP   | TPL-000, required BLOCK-* |
| [x]    | TPL-005 | Settings Portal                                  | Balanced              | WP   | TPL-000, required BLOCK-* |
| [x]    | TPL-006 | Billing Portal                                   | Balanced              | WP   | TPL-000, required BLOCK-* |
| [x]    | TPL-007 | Resource Manager                                 | Balanced + Enterprise | WP   | TPL-000, required BLOCK-* |
| [x]    | TPL-008 | Observability Console                            | Balanced + Enterprise | WP   | TPL-000, required BLOCK-* |
| [x]    | TPL-009 | AI Chat                                          | Balanced              | WP   | TPL-000, required BLOCK-* |
| [x]    | TPL-010 | AI Workflow                                      | Balanced              | WP   | TPL-000, required BLOCK-* |
| [ ]    | TPL-011 | Search Application                               | Balanced              | WP   | TPL-000, required BLOCK-* |
| [ ]    | TPL-012 | Storefront                                       | Balanced              | WP   | TPL-000, required BLOCK-* |
| [ ]    | TPL-013 | Marketplace                                      | Balanced              | WP   | TPL-000, required BLOCK-* |
| [ ]    | TPL-014 | Content Studio                                   | Balanced              | WP   | TPL-000, required BLOCK-* |
| [ ]    | TPL-015 | Marketing Site                                   | Balanced              | WP   | TPL-000, required BLOCK-* |
| [ ]    | TPL-016 | Documentation/Product Site                       | Balanced              | WP   | TPL-000, required BLOCK-* |
| [ ]    | TPL-017 | Identity & Access                                | Enterprise            | WP   | TPL-000, required BLOCK-* |
| [ ]    | TPL-018 | Audit Log                                        | Enterprise            | WP   | TPL-000, required BLOCK-* |
| [ ]    | TPL-019 | Billing Operations                               | Enterprise            | WP   | TPL-000, required BLOCK-* |
| [ ]    | TPL-020 | Incident Response                                | Enterprise            | WP   | TPL-000, required BLOCK-* |
| [ ]    | TPL-021 | AI Operations                                    | Enterprise            | WP   | TPL-000, required BLOCK-* |
| [ ]    | TPL-022 | API Management                                   | Enterprise            | WP   | TPL-000, required BLOCK-* |
| [ ]    | TPL-023 | Developer Portal                                 | Enterprise            | WP   | TPL-000, required BLOCK-* |
| [ ]    | TPL-024 | Security Center                                  | Enterprise            | WP   | TPL-000, required BLOCK-* |
| [ ]    | TPL-025 | Compliance Center                                | Enterprise            | WP   | TPL-000, required BLOCK-* |
| [ ]    | TPL-026 | Data Governance                                  | Enterprise            | WP   | TPL-000, required BLOCK-* |
| [ ]    | TPL-027 | Workflow Automation                              | Enterprise            | WP   | TPL-000, required BLOCK-* |
| [ ]    | TPL-028 | Support Operations                               | Enterprise            | WP   | TPL-000, required BLOCK-* |
| [ ]    | TPL-029 | Enterprise Settings                              | Enterprise            | WP   | TPL-000, required BLOCK-* |

### 9.5 Theme preset queue and builder completion

| Status | ID          | Size | Depends on                 | Acceptance boundary                                                                           |
| ------ | ----------- | ---- | -------------------------- | --------------------------------------------------------------------------------------------- |
| [x]    | PRESET-001  | M    | THEME-005, THEME-006       | Ocean preset outputs/docs/previews.                                                           |
| [x]    | PRESET-002  | M    | THEME-005                  | Forest preset outputs/docs/previews.                                                          |
| [x]    | PRESET-003  | M    | THEME-005                  | Slate preset outputs/docs/previews.                                                           |
| [x]    | PRESET-004  | M    | THEME-005                  | Aurora preset outputs/docs/previews.                                                          |
| [x]    | PRESET-005  | M    | PRESET-001..004            | Cross-preset contrast/coverage/translation gate.                                              |
| [~]    | BUILDER-007 | L    | BUILDER-003, COMP-001..030 | Expand representative preview coverage from 8 to all 30 approved components.                  |
| [x]    | BUILDER-008 | M    | BUILDER-004..007           | Bilingual builder docs, privacy, limitations, and migration/version policy.                   |
| [~]    | PRESET-006  | M    | FOUND-006, FOUND-007       | Complete preview evidence and registry/catalog integration; themes are absent from the index. |

### G4 exit checklist

- [x] `FOUND-001..009` complete; 9/9.
- [x] `PRIM-001..052` complete: 52/52.
- [x] `COMP-001..030` complete: 30/30 verified.
- [x] At least 36 named blocks complete: 36/36.
- [ ] `TPL-001..029` complete and exposed as 32 placements: currently 10/29.
- [ ] All template × package-manager smoke combinations pass.
- [ ] Four presets and the full builder satisfy registry, preview, locale, accessibility, browser, and output gates.
- [ ] No stale translation, unsigned manifest, placeholder, or maturity exception remains.
- [ ] Executable checks faithfully re-verify each layer's numbered DoD.

## 10. M5 — GA hardening and cutover

### 10.1 Curated playground

| Status | ID       | Size | Depends on            | Acceptance boundary                                                        |
| ------ | -------- | ---- | --------------------- | -------------------------------------------------------------------------- |
| [ ]    | PLAY-001 | M    | SITE-012              | Threat model, sandbox, CSP, protocol, limits, and prohibited imports.      |
| [ ]    | PLAY-002 | L    | PLAY-001              | Worker-based TSX/CSS compilation with pinned local dependencies.           |
| [ ]    | PLAY-003 | L    | PLAY-001, PLAY-002    | Sandboxed iframe runtime, reset, diagnostics, timeout, and teardown.       |
| [ ]    | PLAY-004 | M    | PLAY-002, SITE-004    | Accessible editor/preview/output controls as a route-local app.            |
| [ ]    | PLAY-005 | M    | CONTENT-005, PLAY-004 | Curated canonical examples covering state, form, overlay, and composition. |
| [ ]    | PLAY-006 | S    | PLAY-003, GOV-004     | Categorical analytics only; no source/error payload leakage.               |
| [ ]    | PLAY-007 | M    | PLAY-001..006         | Browser, a11y, CSP, isolation, leak, and boundary tests.                   |
| [ ]    | PLAY-008 | S    | PLAY-004              | Static unsupported-browser fallback with source access.                    |

### 10.2 Marketing, editorial, analytics, and newsletter

| Status | ID            | Size | Depends on        | Acceptance boundary                                         |
| ------ | ------------- | ---- | ----------------- | ----------------------------------------------------------- |
| [ ]    | MKT-001       | L    | G1, BRAND-004     | Responsive evidence-based homepage.                         |
| [ ]    | MKT-002       | M    | REG-003, SITE-004 | Accurate layer landing/directory shells.                    |
| [ ]    | MKT-003       | M    | CONTENT-002       | Core guide skeletons.                                       |
| [ ]    | MKT-004       | M    | A11Y-003          | Accessibility landing page from real evidence.              |
| [x]    | MKT-005       | S    | REG-003           | Bilingual registry/CLI ownership guide.                     |
| [ ]    | MKT-006       | M    | GOV-002, REG-003  | Technical Enterprise page without sales/SLA claims.         |
| [ ]    | MKT-007       | S    | GOV-003           | GitHub-only community/contributing pages.                   |
| [ ]    | MKT-008       | M    | CONTENT-002       | Article: Solid 2 architecture.                              |
| [ ]    | MKT-009       | M    | CONTENT-002       | Article: accessible interaction contracts.                  |
| [ ]    | MKT-010       | M    | CONTENT-002       | Article: source ownership.                                  |
| [ ]    | MKT-011       | M    | CONTENT-002       | Article: styling-system neutrality.                         |
| [ ]    | MKT-012       | M    | CONTENT-002       | Article: building with Solidiom.                            |
| [ ]    | MKT-013       | S    | CONTENT-002       | Changelog/migration types, feeds, archives, and metadata.   |
| [ ]    | ANALYTICS-001 | M    | GOV-004, SITE-004 | Typed PostHog adapter; autocapture/replay disabled.         |
| [ ]    | ANALYTICS-002 | S    | ANALYTICS-001     | Tests reject prohibited payload fields.                     |
| [ ]    | ANALYTICS-003 | S    | ANALYTICS-001     | Production provider configuration outside source.           |
| [ ]    | NEWS-001      | M    | GOV-005, SITE-006 | Consent-based bilingual Buttondown flow.                    |
| [ ]    | NEWS-002      | S    | NEWS-001          | Keyboard, error, localization, privacy, and endpoint tests. |

### 10.3 Quality, security, operations, and cutover

| Status | ID      | Size | Depends on           | Acceptance boundary                                                            |
| ------ | ------- | ---- | -------------------- | ------------------------------------------------------------------------------ |
| [ ]    | QA-001  | L    | G4                   | WCAG 2.2 AA/APG audit and critical/serious fixes.                              |
| [ ]    | QA-002  | L    | G4                   | Supported desktop/mobile browser matrix and fallbacks.                         |
| [ ]    | QA-003  | L    | G4                   | Approve full visual matrix and intentional diffs.                              |
| [ ]    | QA-004  | M    | G4                   | Enforce final performance and bundle budgets.                                  |
| [ ]    | QA-005  | M    | G4                   | Full bilingual, links, SEO, feed, and structured-data audit.                   |
| [ ]    | QA-006  | M    | G4                   | Search coverage, locale, keyboard, ranking, and privacy audit.                 |
| [ ]    | QA-007  | M    | G4                   | Registry, signature, CSP, sandbox, dependency, and generated-project security. |
| [ ]    | QA-008  | M    | G4                   | Full CLI command/package-manager/offline/rollback matrix.                      |
| [ ]    | QA-009  | S    | G4                   | Analytics/newsletter/provider privacy audit.                                   |
| [ ]    | QA-010  | S    | GOV-001..006         | Final legal/policy review and publication.                                     |
| [ ]    | OPS-004 | M    | OPS-003, QA-004..010 | Production Cloudflare/DNS/headers/cache/monitoring/rollback.                   |
| [ ]    | OPS-005 | S    | OPS-004              | Production deployment and rollback rehearsal.                                  |
| [ ]    | CUT-001 | M    | MIG-001, G4          | Resolve every legacy inventory item.                                           |
| [ ]    | CUT-002 | S    | CUT-001, BASE-001    | Archive POC findings, verify parity, remove POC.                               |
| [ ]    | CUT-003 | M    | CUT-001              | Remove legacy docs after verified parity.                                      |
| [ ]    | CUT-004 | S    | CUT-002, CUT-003     | Remove migration-only tooling/assets/configuration.                            |
| [ ]    | CUT-005 | S    | OPS-005, CUT-004     | Publish GA notes, migration, limitations, and rollback reference.              |
| [ ]    | CUT-006 | S    | CUT-005              | Deploy canonical production and announce.                                      |

### G5 exit checklist

- [ ] `docs/architecture/website.md` §9 passes.
- [ ] Playground, marketing, analytics, and newsletter are live and tested.
- [ ] No temporary maturity, translation, security, accessibility, or performance exception remains.
- [ ] All 52 primitives are promoted individually to `stable` after human-reviewed Spanish and manual evidence.
- [ ] GA accessibility and translation gates pass with zero violations.
- [ ] Production deployment and rollback are rehearsed.
- [ ] Legacy docs and POC are removed only after parity verification.
- [ ] `solidiom.org` and locale alternates resolve correctly.

## 11. Progress, defects, and counters

### 11.1 Open defects and evidence gaps

| Status | ID          | Size | Owner                | Acceptance boundary                                                                                                                                               |
| ------ | ----------- | ---- | -------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [~]    | I18N-005    | L    | Content              | Clear current stale/missing catalog records; complete human review during G5 promotion.                                                                           |
| [x]    | CATALOG-001 | M    | QA/platform          | Reconcile exact `COMP-*` ID/name pairs, account for untracked slugs, and enforce all ten §8.2.1 clauses.                                                          |
| [x]    | CATALOG-002 | M    | QA/product           | Enforce block source, states, previews, index, install, docs, and routes per item; make manifest-only blocks fail.                                                |
| [x]    | CATALOG-003 | M    | Design systems/build | Restore all recipe builds, 34-scope contract, zero drift/parity/export issues, current registry, translation freshness, 382/382 tools tests, and 255/255 phase 1. |
| [ ]    | CI-008      | XS   | CI                   | Restore automatic triggers or document accepted dispatch ownership/cadence and regression handling.                                                               |
| [ ]    | RECIPE-008  | XS   | Design systems       | Remove duplicate utility imports, port typeset/prose demos before legacy removal, and preserve utility exceptions in tests.                                       |
| [ ]    | REG-008     | M    | Security/CLI         | Sign the published registry outside deterministic builds and replace symmetric index verification with asymmetric verification.                                   |

### Scope counters

`DoD` counts items meeting §8. `Landed` counts reachable deliverables with an open DoD requirement. Update task rows and counters together.

| Scope                         | Required | DoD | Landed |
| ----------------------------- | -------: | --: | -----: |
| Primitives                    |       52 |  52 |     52 |
| Components                    |       30 |  30 |     30 |
| Blocks                        |     ≥ 36 |  36 |     36 |
| Unique templates              |       29 |  10 |     10 |
| Template portfolio placements |       32 |   0 |      0 |
| Theme presets                 |        4 |   0 |      4 |
| Foundational articles         |        5 |   0 |      0 |
| Locales                       |        2 |   2 |      2 |

- Primitives remain 52/52 at the M4 bar; G5 promotion is separate.
- All 30 components meet the M4 bar (§8.2.1); DoD 30/30. `accordion`, `badge`, and `menu` remain unapproved registry slugs.
- All 36 blocks meet the M4 bar with source, registry, bilingual docs, and all four required states implemented.
- Ten templates (TPL-001 through TPL-010) are implemented with template dir, template.json, source, registry, and bilingual docs.
- Theme preset outputs/docs/routes exist, but DoD remains 0 until `PRESET-006` closes.
- Locale count means two implemented locale systems, not complete per-item human review.

## 12. Canonical verification commands

Run from a clean tree before changing status. Expected failures below are facts to repair, not expectations to normalize.

```sh
# Formatting and current revision
pnpm exec prettier --check \
  docs/plans/README.md \
  docs/plans/website-tasks.md \
  docs/plans/task-sequencing.md \
  docs/architecture/decisions/catalog-decisions.md \
  docs/history/plans/website-m0-m3.md \
  docs/history/plans/catalog-foundations-2026-08.md
git rev-parse HEAD
git status --short

# Catalog and integration gates
pnpm run primitive:catalog-gate   # 52/52
pnpm run component:catalog-gate   # 30/30 against §9.2 approved queue
pnpm run block:catalog-gate       # 36/36
pnpm run template:catalog-gate    # 10/29 — 19 templates remain (TPL-011..TPL-029)
pnpm run recipe:contract          # 34/34 scopes pass
pnpm run audit:recipe-drift       # 0 issues
pnpm run audit:recipe-parity      # 0 issues
pnpm run audit:package-source-parity # 0 issues
pnpm --filter @solidiom/recipes-css build
pnpm --filter @solidiom/recipes-tailwind build
pnpm --filter @solidiom/recipes-unocss build
pnpm run test:tools               # 382/382
pnpm run gate:phase1              # 255/255
pnpm --filter @solidiom/site run translation:check # currently 253 draft, 6 stale, 17 missing

# Controls affected by broader work
pnpm --filter @solidiom/cli test  # 25 files / 300 tests
pnpm run gate:vertical-slice      # 67/67
pnpm --filter @solidiom/site check
```

Build and generation commands can modify tracked registry, source mirrors, evidence, or `dist/` outputs even when they fail. Inspect `git status` after each batch and restore only paths produced by that validation run. Do not broadly restore `docs/` or the repository.
