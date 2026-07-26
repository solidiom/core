---
id: primitive-normalization
title: "Primitive Normalization Plan"
sidebar_label: Normalization
description: Plan to align all Solidiom primitives on correct imports, JSDoc headers, and colocated tests.
doc_type: how-to
audience: "Solidiom contributors"
tags: [primitives, testing, imports, consistency]
---

> **Purpose:** For Solidiom contributors, shows how to bring every primitive package into alignment on JSX imports, file-header documentation, and test coverage.

## Background

The primitive packages have diverged over time. Older primitives (button, checkbox, collapsible) use a broken `import { type JSX } from "solid-js"` that fails typecheck under Solid 2. Some lack JSDoc headers. Most lack colocated tests. This plan fixes all three in phases that are independently mergeable and CI-gatable.

## Current state (as of 2026-07-22)

### JSX import — `solid-js` (broken) vs `@solidjs/web` (correct)

| Status                       | Primitives                                                                                                                                           |
| ---------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Needs fix** (`solid-js`)   | accordion, button, calendar, carousel, checkbox, collapsible, combobox, dialog, listbox, menu, popover, select, slider, switch, tabs, toast, tooltip |
| **Correct** (`@solidjs/web`) | badge, command-palette, data-table, date-picker, drawer, resizable-panels, tree, virtual-list                                                        |
| **N/A** (no JSX)             | primitives, probe-primitive                                                                                                                          |

### JSDoc file-header block

| Status      | Primitives                                   |
| ----------- | -------------------------------------------- |
| **Missing** | badge, button, checkbox, collapsible, switch |
| **Present** | all others                                   |

### Colocated tests

| Status        | Primitives                |
| ------------- | ------------------------- |
| **Has tests** | dialog, listbox, select   |
| **No tests**  | all others (~24 packages) |

## Phase 0 — Baseline audit script

**Time:** 30 min

1. Create `tools/audit-primitives.ts`. Walk packages tagged `layer:primitive` and report:
   - JSX import source (`solid-js` / `@solidjs/web` / none)
   - Whether the first non-empty non-import token is a `/**` block
   - Whether any `*.{test,spec}.{ts,tsx}` file exists in `src/`
2. Output: human-readable table + JSON for CI.
3. Commit the script and its baseline output to `docs/audit/primitives-baseline.md`.

After Phases 1–3 land, this script becomes the CI regression check.

## Phase 1 — Fix JSX imports

**Time:** 1–2 hours + 30 min for eslint rule

**Rule:** `type JSX` moves to `@solidjs/web`; every other symbol stays on `solid-js`.

Before:

```tsx
import { type JSX, type Accessor, onCleanup } from "solid-js"
```

After:

```tsx
import { type Accessor, onCleanup } from "solid-js"
import { type JSX } from "@solidjs/web"
```

### Steps

1. Apply the split to each of the 11 files listed above.
2. Run `pnpm nx run-many -t typecheck --projects='tag:layer:primitive'` — must exit 0.
3. Run `pnpm build` — must succeed.
4. Run audit script — "JSX import" column must be all `@solidjs/web`.

### Success criteria

- `grep -rn 'type JSX.* from "solid-js"' packages/*/src` returns zero hits.
- Typecheck passes for every primitive.

### Durable prevention

Add a rule `no-jsx-from-solid-js` to `packages/eslint-plugin-solidiom` that flags `import { type JSX } from "solid-js"`. Enable at error level.

## Phase 2 — JSDoc normalization

**Time:** 1 hour + 30 min for eslint rule

**Scope:** 4 files.

| File                                 | Action                             |
| ------------------------------------ | ---------------------------------- |
| `packages/button/src/index.tsx`      | Add block                          |
| `packages/checkbox/src/index.tsx`    | Add block                          |
| `packages/collapsible/src/index.tsx` | Add block                          |
| `packages/badge/src/index.tsx`       | Move existing block to top-of-file |

### Template

```tsx
/**
 * @solidiom/<name> — <one-line description>.
 *
 * Parts: <Root, ...>.
 */
```

Position: line 1, before any imports. Blank line after closing `*/`.

### Steps

1. Write the four blocks using actual export names from each file.
2. Run prettier — no diff.

### Success criteria

- Every `packages/*/src/index.tsx` file's line 1 is `/**`.
- Audit script's "JSDoc" column is all `true`.

### Durable prevention

Eslint rule `require-package-header-jsdoc` scoped to `packages/*/src/index.{ts,tsx}`.

## Phase 3 — Colocated tests

**Time:** 10–15 hours total, distributed over weeks.

This is a program of work, not a single PR. Break into slices.

### Slice 3a — Template + worked example (2h)

1. Write `packages/badge/src/badge.test.ts` covering:
   - Rendering — Root emits `data-scope="badge"` and `data-part="root"`.
   - Class passthrough — supplied `class` appears on the element.
   - Children — content renders inside the span.
2. Use vitest (unit) for primitives that don't need a real DOM; vitest-browser for those that do.
3. Document the pattern in `docs/testing/primitive-test-template.md` (short, points at badge as reference).

### Slice 3b — Categorize remaining primitives (30 min)

| Tier         | Primitives                                                                                                      | Test type                                | Effort/primitive |
| ------------ | --------------------------------------------------------------------------------------------------------------- | ---------------------------------------- | ---------------- |
| Stateless    | badge, button                                                                                                   | Unit — semantic attrs + prop passthrough | ~30 min          |
| State-driven | collapsible, dialog*, drawer, popover, tooltip, toast                                                           | Unit — open/close, disclosure state      | ~1–2h            |
| Selection    | listbox*, select, combobox, menu, tabs, tree, checkbox                                                          | Browser — keyboard nav, ARIA             | ~2–3h            |
| Complex      | calendar, carousel, slider, date-picker, data-table, virtual-list, resizable-panels, command-palette, accordion | Browser — full behavioral suite          | ~4–6h            |

\* Already has tests — skip or extend.

### Slice 3c — Execute by tier

- **Tier 1 (Stateless):** all in one PR.
- **Tier 2 (State-driven):** one PR per 2–3 primitives.
- **Tier 3 (Selection):** one PR per primitive.
- **Tier 4 (Complex):** one PR per primitive. Check `tests/e2e/` first — if coverage already exists via Playwright, a colocated unit test may duplicate effort.

### Success criteria (per primitive)

- At least one `.test.ts` or `.browser.test.tsx` in `packages/<name>/src/`.
- Minimum three `it(...)` blocks: renders, primary interaction, edge case.
- `pnpm --filter @solidiom/<name> test` exits 0 without `--passWithNoTests`.
- Coverage ≥ 60% for that package.

## Order of operations

1. **Phase 0** — without the audit script, nothing is verifiable.
2. **Phase 1** — highest risk of regression; blocks CI once eslint rule lands.
3. **Phase 2** — same week as Phase 1; pure text edits.
4. **Phase 3** — ongoing program, assigned per tier.

## What NOT to do in this pass

- Do not refactor props shapes, add variant props, or rename anything.
- Do not "improve" adjacent code while touching a file for import/JSDoc/test.
- Every changed line must trace directly to: import fix, JSDoc addition, or test file.
- Unrelated bugs discovered during this work: file an issue, move on.

## Cost summary

| Phase                           | Effort            |
| ------------------------------- | ----------------- |
| Phase 0 (audit script)          | 30 min            |
| Phase 1 (imports + lint rule)   | 2–2.5h            |
| Phase 2 (JSDoc + lint rule)     | 1.5h              |
| Phase 3 (tests, all tiers)      | 10–15h over weeks |
| **High-value quick wins (0–2)** | **< half a day**  |
