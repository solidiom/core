---
id: descope-migration-legacy
title: "Decision: Descope Migration Matrix and Legacy CLI"
doc_type: decision
audience: "Solidiom project leads"
tags: [decisions, migration, legacy, phase2]
lifecycle: archived
date: 2026-07-27
---

# Decision: Descope Migration Matrix (Task 49) and Legacy CLI (Task 50)

**Date:** 2026-07-27
**Status:** Accepted
**Context:** Phase 2 gate review

## Background

Task 49 (shadcn-solid migration matrix with Class A/B/C transforms) and Task 50
(legacy CLI + sunset metadata) were originally defined under the assumption that
Solidiom would ship alongside an existing ecosystem of shadcn-solid applications
that need a structured migration path.

## Decision

Both tasks are **descoped from Phase 2 and all current milestones**. They are not
required for initial release and will not be implemented until a concrete migration
demand exists.

## Rationale

1. **Greenfield product.** Solidiom has not been released. There is no prior public
   surface, no backwards-compatibility contract, and no deployed consumer base.

2. **No migration source exists.** The Class A/B/C migration matrix assumes users
   have existing shadcn-solid applications built on Kobalte/Corvu primitives. Since
   Solidiom targets new deployments, there is nothing to migrate from.

3. **No legacy metadata to track.** Legacy facades, sunset dates, and deprecation
   warnings are meaningless without a prior release that introduced the APIs being
   deprecated.

4. **Dead code cost.** The migration transform engine (`applyMigration`, `MigrationSpec`)
   and the `no-recipe-import-of-migration` ESLint rule add maintenance burden for
   code paths that will never execute. They are removed alongside this decision.

## What Remains

- **`no-cross-layer-import` ESLint rule** — enforces the general layer hierarchy
  (runtime → primitive → adapter → recipe). This is architectural, not migration-related.
- **`inspect provenance`** — source-mode governance (who owns copied files). Unrelated
  to backwards-compatibility.
- **`ast-transform.ts` `rewriteImportsAst`** — rewrites `@solidiom/runtime` imports
  for source-mode installs. This is install-time infrastructure, not migration.

## Consequences

- Tasks 49 and 50 are marked as descoped (not complete) in the implementation plan.
- The Phase 2 gate removes migration/legacy checks and adjusts its criterion count.
- If a migration story becomes necessary post-release, these tasks can be reinstated
  with the existing `applyMigration` engine as a reference (preserved in git history).

## Follows the Pattern

This decision mirrors the existing documented skip for the source graph visualizer
(deferred to Phase 3 per §14 of the gate), using the same justification framework:
the deliverable has no acceptance-criteria dependency for the current milestone.

## Addendum: Task 66 (Phase 3)

Task 66 ("Legacy and migration beta readiness") is also descoped under the same
rationale. It requires legacy facades and migration transforms to work against
beta registry versions — but since Tasks 49 and 50 are descoped, Task 66 has
no deliverable to verify.
