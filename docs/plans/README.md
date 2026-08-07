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
- **M3 is complete**: `gate:phase3` passes 21/21. Recipe contract (34/34), builds, drift, parity, exports, tools tests (382/382), and phase 1 gate (255/255) are all green.
- **M4 is complete** (catalog items): primitives 52/52; components 30/30; blocks 36/36; **templates 29/29**. G4 exit hardening remains.
- M5 has only incidental progress: `MKT-005` and `BUILDER-008` are complete.
- `TPL-000` is complete: template manifest (29 templates, 32 placements), dependency graph, and §8.4.1 validator are approved and wired into the phase 1 gate.
- Two reference templates (`vite-solid-router`, `tanstack-start-solid`) exist but are not approved `TPL-*` catalog rows.
- Workflows are dispatch-only, so local or explicitly dispatched evidence is required.
- Historical green evidence must not be treated as evidence for the current tree.

## Immediate priorities

1. **G4 exit hardening:** pass all template × package-manager smoke combinations; close PRESET-006, BUILDER-007, I18N-005.
2. **Theme preset registry (`PRESET-006`):** complete preview evidence and registry/catalog integration for all four presets.
3. **Builder coverage (`BUILDER-007`):** expand preview coverage from 8 to all 30 components.
4. **Translation freshness (`I18N-005`):** clear stale and missing catalog translation records.
5. **`CATALOG-001` untracked slugs:** formally reject or add `accordion`, `badge`, and `menu` registry entries that have no COMP-* row.

All recovery tasks are complete. All catalog layer items (primitives, components, blocks, templates) are implemented. The critical path is now G4 exit hardening → M5 GA programme.

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
