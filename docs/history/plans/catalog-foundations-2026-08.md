---
id: catalog-foundations-2026-08-history
title: "Catalog Foundations and Corrections — 2026-08"
doc_type: history
audience: "Solidiom maintainers researching catalog foundation work"
tags: [catalog, history, foundations, incidents]
lifecycle: archived
authority: non-authoritative historical evidence
volatility: low
---

# Catalog Foundations and Corrections — 2026-08

> **Non-authoritative.** This document records how catalog foundations evolved. Current task states, approved queues, Definitions of Done, defects, and counters are owned by [`docs/plans/website-tasks.md`](../../plans/website-tasks.md).

## Purpose

Catalog work began with no trustworthy non-primitive registry population, source-resolution proof, layer routes, or per-layer gates. Foundation work added most of that machinery, but later fan-out exposed incomplete validators and integration regressions. This history preserves the evidence without turning old snapshots into current status.

The durable architectural rationale for D1–D6 is now in [`catalog-decisions.md`](../../architecture/decisions/catalog-decisions.md). Current ordering is in [`task-sequencing.md`](../../plans/task-sequencing.md).

## Foundation work completed

- `FOUND-001` translated decisions D1–D6 into numbered component, block, and template bars.
- `FOUND-002` introduced registry v3, namespaced non-primitive manifests, layer-aware discovery/documentation metadata, recursive orphan handling, and CLI schema support.
- `FOUND-003` added component/block/theme source resolution while preserving verify, conflict, rollback, and lock ordering.
- `FOUND-006` added bilingual catalog scaffolding with real translation source hashes.
- `FOUND-007` added bilingual generic routes for components, blocks, templates, and themes.
- `FOUND-009` resolved the typeset/prose asymmetry by classifying them as utility stylesheets rather than component rows.

`FOUND-004`, `FOUND-005`, and dependent `FOUND-008` initially appeared complete, then were reopened when the gates were compared with every numbered DoD clause. Their current state belongs only in the active backlog.

## Original foundation findings

The initial investigation established these durable facts:

1. Primitive-oriented registry and CLI assumptions did not model components, blocks, templates, or themes.
2. A component needed a physical install unit tied to the selected styling profile.
3. Non-primitive docs needed layer-aware site collections instead of artificial packages.
4. Block state requirements needed structured values as well as prose.
5. Three styling emitters needed one derived naming policy and explicit exceptions.
6. Block dependency IDs could not be trusted without semantic name agreement.

Those findings produced D1–D6. Live repository counts and pass totals were intentionally removed from the decision record because they changed during implementation.

## Component fan-out outran verification

Artifacts were produced for the approved component concepts before the component gate proved exact queue identity and all item clauses. The gate classified registry candidates rather than reconciling approved `COMP-*` ID/name pairs, allowing additional slugs to distort the apparent count. Aggregate recipe contract, build, drift, parity, export, and translation failures further showed that generated files alone were not completion evidence.

The recovery response was to restore the original vertical-slice discipline around Button, Input, and Dialog, then order the remainder by block fanout. Current priorities and values are maintained in `website-tasks.md` and `task-sequencing.md`.

## Block manifest citation incident

`BLOCK-000A` originally diagnosed eight component references outside the then-approved range and moved them into `proposedComponents`. That treatment was superseded because the intended names were recoverable from the Markdown companion.

`BLOCK-000B` found ten misnumbered citations, not eight. They used primitive numbers with a `COMP-` prefix. Two were especially dangerous because they fell inside the approved numeric range and therefore resolved cleanly to the wrong component:

- a repeated in-range citation named Data Table in the companion but resolved to Combobox by ID;
- another in-range citation meant Command Palette in one block while the same ID legitimately meant Radio Group elsewhere.

The repair reconciled JSON, companion Markdown, and the component queue by name, emptied `proposedComponents`, and expanded the approved component catalog to include the missing named concepts. The exact approved 30-row queue remains in `website-tasks.md` §9.2.

The evidence-preserving lesson is that range validation catches only malformed numbers. It cannot catch a valid number with the wrong semantic identity. This is why the manifest still points to `task-sequencing.md §3 (D6)`, whose durable rationale delegates to the decision record.

## Manifest approval versus implementation

The approved block manifest established names, outcomes, required states, component dependencies, and data boundaries. Later scaffolding added bilingual docs and namespaced manifests. Those facts were mistakenly close to being treated as block completion even though implementation source, four-state behavior, full-page and embedded previews, index membership, verified install, and reachable routes were absent.

The block gate was reopened because a manifest-only block could pass once component dependencies closed. The active acceptance boundary is `CATALOG-002`; this history does not assert its result.

## Registry and generated-artifact ownership

Namespaced files and index arrays solved schema shape but introduced an ownership question: a file can exist under `registry/` without being discoverable in the generated index. Generation also exposed the risk of sweeping hand-added manifests or cleaning tracked outputs before a failed build.

The resulting practice is to distinguish:

- authored source and approved queue identity;
- generated manifest/index membership;
- route reachability;
- verified source installation;
- per-item DoD evidence.

No one layer substitutes for the others. Validation commands must run from a known-clean tree, followed by a targeted status check.

## Historical sequencing assumptions

The original plan estimated foundation, component, block, and template phases as if most work were greenfield. Once artifacts landed unevenly, those totals stopped being useful as remaining-work forecasts. The durable ordering survived:

1. prove foundation gates;
2. verify a three-component slice;
3. close components in dependency/fanout order;
4. prove three representative block pilots;
5. fan out blocks;
6. derive template order from an approved template-to-block graph.

Current sequencing, pilots, and unlock points are maintained only in `task-sequencing.md`.

## What this history must not be used for

Do not use this document to:

- mark a `FOUND-*`, `COMP-*`, `BLOCK-*`, or `TPL-*` row complete;
- infer scope from generated registry contents;
- replace any numbered clause in `website-tasks.md` §8;
- claim current recipe, translation, tool, or aggregate gate results;
- alter the approved component, block, or template queues.

Use it to understand why exact identity reconciliation, name-based dependency checks, and implementation-level evidence are mandatory.
