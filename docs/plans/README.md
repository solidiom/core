---
id: plans-dashboard
title: "Plans Dashboard"
doc_type: index
audience: "Solidiom project leads, contributors"
tags: [plans, status, navigation]
lifecycle: active
authority: read-first navigation and priority summary
volatility: medium
---

# Plans Dashboard

Read this page first. It summarizes the current website/catalog position and points to the document that owns each kind of fact.

## Current state

- M0–M2 are complete.
- M3 integration is **recovered**: recipe contract (34/34), builds, drift, parity, exports, tools tests (382/382), and phase 1 gate (255/255) are all green.
- M4 is in progress: primitives are 52/52; components are **30/30 verified**; blocks are **25/36 complete** (AUTH ×3, ONBOARD ×3, SETTINGS ×3, BILLING ×3, ADMIN ×3, OBS ×3, RESOURCE ×3, AI ×3, SEARCH-01); templates are 0/29.
- M5 has only incidental progress: `MKT-005` and `BUILDER-008` are complete.
- `TPL-000` is complete: template manifest (29 templates, 32 placements), dependency graph, and §8.4.1 validator are approved and wired into the phase 1 gate.
- Two reference templates (`vite-solid-router`, `tanstack-start-solid`) exist but are not approved `TPL-*` catalog rows.
- Workflows are dispatch-only, so local or explicitly dispatched evidence is required.
- Historical green evidence must not be treated as evidence for the current tree.

## Immediate priorities

1. **Block fan-out (remaining 11):** complete SEARCH-02/03, COMMERCE ×3, CONTENT ×3, and SHELL ×3 — each requires source implementation, registry entries, previews, and bilingual docs per §8.3.1.
2. **Template implementation:** once all 36 blocks are complete, begin `TPL-001` through `TPL-029` per the dependency-derived order from `TPL-000`'s manifest.
3. **`CATALOG-001` untracked slugs:** formally reject or add `accordion`, `badge`, and `menu` registry entries that have no COMP-* row.
4. **Translation freshness (`I18N-005`):** clear stale and missing catalog translation records.
5. **Theme preset registry (`PRESET-006`):** complete preview evidence and registry/catalog integration for all four presets.

Recovery tasks `CATALOG-001`, `CATALOG-002`, `CATALOG-003`, `TPL-000`, and `FOUND-008` are complete. Component verification is complete (30/30). The critical path is now block fan-out → template implementation → G4 exit.

## Authority map

| Question                                        | Authority                                                                             |
| ----------------------------------------------- | ------------------------------------------------------------------------------------- |
| What is open, complete, blocked, or counted?    | [`website-tasks.md`](./website-tasks.md)                                              |
| What must an item satisfy?                      | [`website-tasks.md` §8](./website-tasks.md#8-shared-catalog-item-definitions-of-done) |
| Which items are approved?                       | [`website-tasks.md` §9](./website-tasks.md#9-m4--catalog-completion-work-queues)      |
| In what order should recovery and delivery run? | [`task-sequencing.md`](./task-sequencing.md)                                          |
| Why were catalog decisions D1–D6 made?          | [`catalog-decisions.md`](../architecture/decisions/catalog-decisions.md)              |
| What happened during M0–M3?                     | [`website-m0-m3.md`](../history/plans/website-m0-m3.md)                               |
| What happened during catalog foundation work?   | [`catalog-foundations-2026-08.md`](../history/plans/catalog-foundations-2026-08.md)   |

## Active plans

- [Website/catalog task authority](./website-tasks.md)
- [Catalog recovery and delivery sequencing](./task-sequencing.md)
- [Library and release roadmap](./implementation-plan.md)

## Architecture and compatibility

- [Website architecture](../architecture/website.md)
- [Catalog decisions D1–D6](../architecture/decisions/catalog-decisions.md)
- [Typeset/prose decision](../architecture/decisions/typeset.md)
- [`website-plan.md`](./website-plan.md) and [`typeset-plan.md`](./typeset-plan.md) are superseded compatibility stubs.

## Contracts

- [Recipe contract](../contracts/recipe-contract.md)
- [Block catalog manifest](../contracts/block-catalog-manifest.json)
- [Beta coverage matrix](../contracts/beta-coverage-matrix.md)

## History

History is evidence and context, not current authority.

- [Website M0–M3 implementation history](../history/plans/website-m0-m3.md)
- [Catalog foundations, corrections, and incidents](../history/plans/catalog-foundations-2026-08.md)

## Update rules

- Change task states, DoD text, approved queues, defects, and counters only in `website-tasks.md`.
- Change ordering and dependency guidance only in `task-sequencing.md`.
- Change durable rationale only through a decision update in `catalog-decisions.md`.
- Add historical evidence to history documents without making them sources of current status.
- Re-run the canonical command set before changing a status, and do not make a failing check green on paper.
