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
- **M4 is complete**: G4 exit criteria satisfied. Primitives 52/52; components 30/30; blocks 36/36; templates 29/29. All gates pass clean-tree verification. PRESET-006, BUILDER-007, and I18N-005 are closed.
- M5 is next: GA hardening, playground, marketing, analytics, QA, and production cutover.
- Two reference templates (`vite-solid-router`, `tanstack-start-solid`) exist but are not approved `TPL-*` catalog rows.
- Workflows are dispatch-only, so local or explicitly dispatched evidence is required.
- Historical green evidence must not be treated as evidence for the current tree.

## Immediate priorities

1. **M5 GA programme:** begin playground (PLAY-001..008), marketing (MKT-001..013), analytics (ANALYTICS-001..003), and QA (QA-001..010).
2. **Library release:** close Phase 3 beta blockers (C8, C9/Task 60, C10/Task 68, C11).
3. **Open defects:** CI-008 (restore CI triggers), RECIPE-008 (utility cleanup), REG-008 (asymmetric signature).
4. **G5 promotion:** per-primitive human-reviewed Spanish + `stable` status.

All recovery tasks, catalog items, and G4 hardening are complete. The project moves to M5 (GA hardening and cutover) and library Phase 3 beta release.

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
