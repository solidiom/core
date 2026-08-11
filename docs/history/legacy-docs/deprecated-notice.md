---
id: legacy-docs-deprecated-notice
title: "apps/docs — Read-Only (MIG-002)"
doc_type: history
tags: [legacy, migration, MIG-002]
lifecycle: archived
---

# apps/docs — Read-Only (MIG-002)

**Status:** Frozen — no new features accepted.

This application is the legacy documentation site for Solidiom primitives.
It is retained read-only for reference until `apps/site` achieves full parity
and the migration is complete (CUT-003).

## Rules

1. **No new features** — do not add routes, demos, or components here.
2. **Bug fixes only** — critical fixes that affect production users are acceptable.
3. **No API upgrades** — the declared Solid versions are intentionally frozen.
4. **Target: removal** — this app will be removed when CUT-003 executes.

## Where to work instead

All new documentation and website work happens in `apps/site/` (the Astro
static site). See `docs/plans/consolidated-plan.md` for the implementation backlog.

## Dependencies

This app depends on all 52 workspace primitive packages via `workspace:*`.
It runs against the workspace override version of Solid (beta.24) regardless
of its declared version (beta.21).
