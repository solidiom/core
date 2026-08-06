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
- M3 is regressed locally because the catalog expansion broke recipe, build, parity, export, translation, and tool checks.
- M4 is in progress: primitives are 52/52; components are 0/30 verified with 30 concepts landed; blocks are 0/36; templates are 0/29.
- M5 has only incidental progress: `MKT-005` and `BUILDER-008` are complete.
- Workflows are dispatch-only, so local or explicitly dispatched evidence is required.
- Historical green evidence must not be treated as evidence for the current tree.

## Immediate priorities

1. **`CATALOG-001` — component gate:** reconcile exact `COMP-*` IDs/names, account for untracked registry slugs, and enforce all component DoD clauses.
2. **`CATALOG-002` — block gate and implementation:** make manifest-only blocks fail; require source, states, previews, registry/index, install, docs, and routes.
3. **`CATALOG-003` — integration recovery:** restore recipe contracts/builds, drift/parity/export checks, translations, tool tests, and the aggregate phase gate.
4. **`TPL-000` in parallel:** approve the template manifest, dependency graph, and §8.4.1 validator while catalog recovery proceeds.

Do not grant component or block completion from file presence, generated output, or a historical run. Use the status and DoD rules in the canonical backlog.

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
