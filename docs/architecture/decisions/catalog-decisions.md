---
id: catalog-decisions-d1-d6
title: "Catalog Decisions D1–D6"
doc_type: architecture-decision-record
audience: "Solidiom project leads, catalog implementers"
tags: [catalog, components, blocks, registry, decisions]
lifecycle: accepted
authority: canonical catalog decision rationale
volatility: low
---

# Catalog Decisions D1–D6

This document owns the durable rationale for catalog decisions D1–D6. The normative item requirements and current task states remain in [`website-tasks.md`](../../plans/website-tasks.md); implementation order remains in [`task-sequencing.md`](../../plans/task-sequencing.md).

## Decision context

Solidiom must ship primitives, styled components, blocks, and templates without creating competing behavior layers or styling-profile forks. Registry records, docs, source installation, previews, and generated routes must agree on item identity. These decisions define the stable boundaries; they intentionally omit live pass counts, repository snapshots, and current incident status.

## D1 — A component is the active-profile recipe wrapper

**Decision.** A component is the composed wrapper at `packages/recipes-<profile>/src/recipes/<scope>.tsx` plus its primitive dependency. The wrapper contributes styling and composition only; behavior remains in the primitive. Source installation selects the wrapper for the consumer's configured styling profile.

**Rationale.** Consumers need a source-owned component that reflects their chosen styling profile while retaining one behavioral implementation. Treating the wrapper as the component gives the CLI a concrete install unit and makes profile selection explicit.

**Rejected alternatives.** We rejected defining a component as only a registry concept, because it would not identify installable source. We rejected copying primitive behavior into wrappers, because duplicate state, focus, and keyboard layers would drift. We rejected selecting one profile as canonical source for all consumers, because that would make the other profiles second-class translations.

**Consequences.** Every shipped profile must provide an equivalent wrapper or an explicit utility-style exception. Contract, build, drift, parity, export, and verified-install checks are part of proving the physical component.

## D2 — Registry v3 uses namespaced manifests

**Decision.** Non-primitive manifests live under `registry/<layer>/<name>.json`. The registry index exposes distinct `components[]`, `blocks[]`, `templates[]`, and `themes[]` collections, with layer-aware discovery and orphan handling.

**Rationale.** Flat or primitive-only registry structures cannot represent product-layer identity, per-layer source files, documentation metadata, or installation behavior without collisions. Namespacing keeps slugs meaningful within a layer and lets tooling reconcile manifests with approved queues.

**Rejected alternatives.** We rejected placing every deliverable in the primitive collection, because layer semantics and install destinations differ. We rejected hand-maintained aggregate lists detached from manifests, because they create a second inventory. We rejected inferring approved scope from generated index contents, because accidental files could silently expand the product catalog.

**Consequences.** Index membership is required evidence, but it does not itself approve or complete an item. Gates must reconcile exact approved IDs and names rather than count arbitrary slugs.

## D3 — Catalog prose lives in layer-aware site content

**Decision.** Components, blocks, templates, and themes keep bilingual prose under `apps/site/src/content/{en,es}/<layer>/`. Registry and route tooling resolve documentation from those layer-aware collections.

**Rationale.** Unlike primitives, these deliverables do not necessarily own standalone packages. Site content provides one schema-governed location for prose, translation metadata, examples, and route generation without creating artificial package boundaries.

**Rejected alternatives.** We rejected mandatory package-local docs for every non-primitive item, because blocks and templates are source-owned catalog artifacts rather than independently published behavior packages. We rejected copying generated registry prose into the site, because copies would drift. We rejected one untyped content directory, because layer-specific validation and routes are required.

**Consequences.** Content presence is only one part of completion. Required sections, canonical examples, translation freshness, registry linkage, and route reachability remain independently verifiable.

## D4 — Block states are structured and retain prose

**Decision.** Every block declares `loading`, `empty`, `error`, and `restricted` in a structured `requiredStates` field while retaining human-facing state prose. Schemas reject omission rather than defaulting to an empty list.

**Rationale.** Prose explains product behavior, but machines cannot reliably determine whether all required states exist from prose alone. A structured field supports validation and implementation checks while the prose preserves intent and nuance.

**Rejected alternatives.** We rejected prose-only state declarations because omissions are invisible to gates. We rejected structured values without prose because labels alone do not explain transitions, data assumptions, or user recovery. We rejected optional/default-empty state arrays because absence would look valid.

**Consequences.** A declaration is not implementation evidence. Block completion also requires source behavior and previews for all four states.

## D5 — Class prefixes are derived by default

**Decision.** Emitters derive the class prefix `solidiom-<scope>` from the canonical scope. A small explicit exception map is allowed where compatibility requires it; `button: "solidiom-btn"` is the established exception.

**Rationale.** Derivation keeps CSS, Tailwind, and UnoCSS naming aligned as scopes grow and prevents three manually maintained prefix inventories. Explicit exceptions make compatibility debt visible and reviewable.

**Rejected alternatives.** We rejected manually specifying every prefix because duplicate maps drift. We rejected profile-specific naming because examples and source installs would fork. We rejected removing all exceptions because existing public class contracts may require compatibility.

**Consequences.** New scopes use derived names unless a reviewed compatibility exception is recorded. Cross-profile parity remains mandatory.

## D6 — Correct component citations instead of deferring them

**Decision.** Block component dependencies must resolve by both ID and name across the JSON manifest, its Markdown companion, and the approved component queue. Recoverable citation errors are corrected; they are not moved into a non-resolving proposal list. `proposedComponents` remains empty unless an actual unapproved concept is identified and the component queue is formally amended.

**Rationale.** A numeric range check can accept a valid-looking ID that names the wrong component. The companion catalog preserves semantic names, so three-way agreement detects both out-of-range and in-range miscitations. Deferring recoverable identities would hide required dependencies and distort sequencing.

**Rejected alternatives.** We rejected range-only validation because wrong in-range references pass. We rejected preserving known bad IDs for historical continuity because consumers would build against the wrong component. We rejected moving known names to `proposedComponents` because no product decision remains unresolved when the intended identity is recoverable.

**Consequences.** Queue amendments are explicit and name-bearing. Dependency graphs, fanout order, and block unlocks are computed only from corrected approved identities. Components with no block consumers remain approved only by an explicit product rationale, not by accidental graph edges.

## Change policy

A decision change must update this record, the normative DoD clauses in `website-tasks.md`, affected contracts, and sequencing implications together. Current evidence and incident narratives belong in the active backlog or history, not in this low-volatility record.
