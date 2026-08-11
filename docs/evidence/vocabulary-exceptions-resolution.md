# Vocabulary Exceptions — G5 Formal Acceptance

**Date:** 2026-08-08
**Gate:** G5 Exit
**Decision:** All nine vocabulary exceptions are formally accepted as GA-acceptable.
**Rationale:** Removing `data-state` emissions that duplicate boolean flags would break consumer selectors across four primitives (date-picker, data-table, progress, tree). The cost of migration exceeds the benefit at GA time, and each exception has a named resolution task.

---

## Summary

Nine scope/state pairs in `VOCABULARY_EXCEPTIONS` conflate a `data-state` emission with a boolean `data-*` flag. They are legal exceptions to the closed-vocabulary rule (§3.6 of the recipe contract). For G5, the pragmatic choice is to accept them with documented rationale rather than break 52 primitives' consumers.

| #   | Scope/State              | Type                                 | Flag Collision            | Resolved By | GA Impact                                                     |
| --- | ------------------------ | ------------------------------------ | ------------------------- | ----------- | ------------------------------------------------------------- |
| 1   | `date-picker/disabled`   | Flag duplication                     | `data-disabled`           | PRIM-017    | Low — consumers target `[data-state='disabled']` on day cells |
| 2   | `date-picker/selected`   | Flag duplication                     | `data-selected`           | PRIM-017    | Low — day selection expressed twice                           |
| 3   | `data-table/selected`    | Flag duplication                     | `data-selected`           | PRIM-016    | Medium — row selection targeting is common                    |
| 4   | `data-table/unselected`  | Negative flag form                   | `data-selected` (absence) | PRIM-016    | Low — rarely targeted directly                                |
| 5   | `data-table/sorted-asc`  | Compound value                       | None (structural)         | PRIM-016    | Medium — sort direction is actively styled                    |
| 6   | `data-table/sorted-desc` | Compound value                       | None (structural)         | PRIM-016    | Medium — sort direction is actively styled                    |
| 7   | `progress/loading`       | Flag collision + semantic difference | `data-loading`            | PRIM-033    | Low — only state value the primitive emits                    |
| 8   | `tree/selected`          | Flag duplication                     | `data-selected`           | PRIM-050    | Low — tree item selection targeting                           |
| 9   | `tree/unselected`        | Negative flag form                   | `data-selected` (absence) | PRIM-050    | Low — rarely targeted directly                                |

## Rationale

### Why not Option A (remove the data-state emissions)?

1. **Breaking consumer selectors.** Recipe CSS in `packages/recipes-css/`, `packages/recipes-tailwind/`, and `packages/recipes-unocss/` contains selectors targeting `[data-state='selected']`, `[data-state='disabled']`, `[data-state='loading']`, and `[data-state='sorted-asc']`. Removing the state emission would leave these selectors dead.

2. **Underlying API constraints.** Radix Calendar, Radix Progress, and TanStack Table emit these `data-state` values from their internal render loops. Overriding them requires patching the primitive's wrapper layer, which is what the `PRIM-xxx` tasks are designed to do.

3. **GA timing.** The exceptions are well-understood, documented, and guarded by the vocabulary exception test suite. Deferring resolution to the `PRIM-xxx` tasks is the correct engineering trade-off at GA time.

### Acceptance criteria met

- [x] Each exception has a `reason` explaining the problem
- [x] Each exception has a `resolvedBy` task identifier
- [x] Each exception has a `resolution` field documenting the GA acceptance rationale
- [x] The `vocabularyException()` guard returns `true` for all nine entries
- [x] The test suite enforces that every state/flag collision is recorded
- [x] The UnoCSS preset resolves flag collisions via namespaced variants (`uiStateSelected` vs `uiSelected`)

## Resolution ownership

| Task     | Primitives  | Expected resolution                                                                                  |
| -------- | ----------- | ---------------------------------------------------------------------------------------------------- |
| PRIM-016 | data-table  | Remove `selected`/`unselected`/`sorted-*` state emissions; introduce `data-sort-direction` attribute |
| PRIM-017 | date-picker | Remove `disabled`/`selected` state emissions; rely on boolean flags                                  |
| PRIM-033 | progress    | Rename `loading` state or introduce `data-indeterminate` flag to resolve semantic collision          |
| PRIM-050 | tree        | Remove `selected`/`unselected` state emissions; rely on boolean flag                                 |

## Related artifacts

- `packages/runtime/src/dom/semantic-vocabulary.ts` — `VOCABULARY_EXCEPTIONS` definition
- `tools/recipe-contract-vocabulary.test.ts` — test that enforces all collisions are recorded
- `docs/contracts/recipe-contract.md` §3.1 — contract-level documentation of the exceptions
- `packages/unocss-preset/src/index.ts` — namespaced variant resolution for flag collisions
