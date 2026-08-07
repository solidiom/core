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

Read this page first. It summarizes the current position and points to the document that owns each kind of fact.

## Current state

- **M0–M4 are complete.** Primitives 52/52; components 30/30; blocks 36/36; templates 29/29. All gates green.
- **M5 is active:** GA hardening, QA, security, primitive promotion, and production cutover.
- **M6 follows G5:** playground, marketing, analytics, newsletter, and editorial content.
- Library Phase 3 beta blockers (C8, C9, C10, C11) track independently.
- Open defect: REG-008. CI-008 resolved — workflows remain dispatch-only until post-GA automatic triggers are enabled.

## Immediate priorities

1. **M5 production exit:** QA audits (QA-001..010), primitive G5 promotion (52×), operations (OPS-004..005), cutover (CUT-001..006).
2. **Library release:** close beta blockers (C8, C9/Task 60, C10/Task 68, C11).
3. **Open defects:** REG-008.

## Authority map

| Question | Authority |
|----------|-----------|
| Task state, DoD, queues, defects, counters, sequencing, library roadmap | [`consolidated-plan.md`](./consolidated-plan.md) |
| Architecture decisions (D1–D6) | [`catalog-decisions.md`](../architecture/decisions/catalog-decisions.md) |
| Website architecture, scope, GA criteria | [`website.md`](../architecture/website.md) |
| History (non-authoritative) | [`website-m0-m3.md`](../history/plans/website-m0-m3.md), [`catalog-foundations-2026-08.md`](../history/plans/catalog-foundations-2026-08.md) |

## Active plans

- [Consolidated execution plan](./consolidated-plan.md) — single source of truth

## Architecture

- [Website architecture](../architecture/website.md)
- [Catalog decisions D1–D6](../architecture/decisions/catalog-decisions.md)
- [Typeset/prose decision](../architecture/decisions/typeset.md)

## Contracts

- [Recipe contract](../contracts/recipe-contract.md)
- [Block catalog manifest](../contracts/block-catalog-manifest.json)
- [Beta coverage matrix](../contracts/beta-coverage-matrix.md)

## History

- [Website M0–M3 implementation history](../history/plans/website-m0-m3.md)
- [Catalog foundations, corrections, and incidents](../history/plans/catalog-foundations-2026-08.md)

## Update rules

- Change task states, DoD, queues, defects, counters, and sequencing only in `consolidated-plan.md`.
- Change durable rationale only through a decision update in `catalog-decisions.md`.
- Add historical evidence to history documents without making them sources of current status.
- Re-run the canonical command set before changing a status.
