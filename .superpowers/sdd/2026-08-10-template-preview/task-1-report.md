# Task 1 Report: Sync Script — `sync-template-previews.ts`

## Initial Implementation (commit f1d598e8)

Created `apps/site/tools/sync-templates.ts` with recursive sync and stale deletion.

## Review Findings and Fixes (commit b9fa8a12)

All 6 findings addressed:

1. **CRITICAL: Wrong filename** — Renamed `sync-templates.ts` → `sync-template-previews.ts`, updated `package.json` script reference.
2. **CRITICAL: Custom copyFileSync was async** — Replaced custom `copyFile(src, dst, () => {})` wrapper with `copyFileSync` from `node:fs`.
3. **CRITICAL: Hand-rolled dirname** — Removed hand-rolled `dirname` using `lastIndexOf("/")`; matches plan's reference implementation which doesn't need `dirname`.
4. **IMPORTANT: Misleading function name** — Removed custom `copyFileSync` implementation entirely.
5. **IMPORTANT: Redundant dirname** — Not needed; plan's reference implementation doesn't use it.
6. **MINOR: Missing dirname import** — Not needed; plan imports only `{ resolve, join }` from `node:path`.

The implementation now matches the plan's reference implementation exactly (task-1-brief.md lines 15-67).

## Verification

- Script runs without errors: `Synced template previews: 1 copied, 0 skipped` (with test dist)
- Idempotency works: second run shows `Synced template previews: 0 copied, 1 skipped` (when mtime matches)
- Test artifacts cleaned up after verification

## Commits

- `f1d598e8` feat: add sync-templates script (initial, superseded)
- `b9fa8a12` fix: rename sync script to sync-template-previews and match plan reference impl
