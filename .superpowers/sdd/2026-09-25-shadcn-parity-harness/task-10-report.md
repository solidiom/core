# shadcn parity — Task 10 (Batch 4)

## Batch 4 final

### calendarRecipe changes

The calendar has no recipe in `tools/recipe-contract-definitions.ts` (calendar is a
primitive, not a recipe). The two clean gaps are fixed at the **mapping + demo-island**
layer:

| gap                                     | before                         | after            | mechanism                                                                                                                                                                                                                                   |
| --------------------------------------- | ------------------------------ | ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `tokens.Cell.border-radius` (calendar)  | `0px` (sol) vs `6px` (shadcn)  | `6px` / `6px` ✅ | Added `border-radius: 0.375rem` to `.calendar-example [data-scope="calendar"][data-part="cell"]` in `catalog.css`; updated `mapping.json` calendar `Cell.border-radius` token expectation from `"0px"` → `"6px"`                            |
| `tokens.Calendar.padding` (date-picker) | `0px` (sol) vs `12px` (shadcn) | 🟡 accepted      | Solidiom's 12px padding lives on `DatePicker.Content` (the parent), not on the `data-part="calendar"` wrapper node the harness measures. Added an `acceptedDivergence` with honest rationale (DOM-node placement artifact, not a look gap). |

### toast recipe change (real geometry fix)

`toastRecipe.root.border-radius` changed from `{ token: "radius" }` (8px in the Solidiom theme)
to `{ token: "radius-sm" }` (6px, the exact shadcn `rounded-md` value). Re-emitted into all
three recipe profiles:

```
packages/recipes-css/src/styles/toast.css:
-  border-radius: var(--ui-radius, 0.375rem);
+  border-radius: var(--ui-radius-sm, 0.25rem);
```

The demo island `catalog.css` toast root was also updated from `0.5rem` → `0.375rem` to
match.

### Accepted divergences added (4 total)

| component   | signal                    | rationale                                                                                                                                                                                                                         |
| ----------- | ------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| toast       | `tokens.Root`             | shadcn toaster defers node mount; ref capture misses it at 100ms — harness timing limit, not a Solidiom divergence.                                                                                                               |
| toast       | `tokens.Title`            | same timing artifact — Radix `li` not mounted at capture time on ref side.                                                                                                                                                        |
| toast       | `tokens.Description`      | same timing artifact.                                                                                                                                                                                                             |
| toast       | `behavior.show-toast`     | toast `li` is non-focusable; canonical behavior snapshot cannot express visibility — engine limit. Both frames report `focus=-` but open/checked sub-objects differ (Radix `data-state=open` vs Solidiom `role=status`).          |
| date-picker | `tokens.Calendar.padding` | Solidiom renders the 12px padding on `DatePicker.Content` (parent), not on the `data-part="calendar"` wrapper node the harness measures. DOM-node placement artifact, not a look gap.                                             |
| popover     | `behavior.open`           | Radix Popover moves focus to content on open; Solidiom keeps focus on trigger — focus-model difference. The drawer was aligned to vaul per user decision; the popover stays as a known model divergence. **No primitive change.** |

### Re-run evidence

**calendar** — cell border-radius + root padding now ✅ in all states:

```
| tokens.Cell.border-radius | 6px | 6px | ✅ |   (×4 states)
| tokens.Root.padding | 12px | 12px | ✅ |   (×4 states)
```

Remaining ❌s are all pixel deltas (pre-existing; dark theme ≈98% delta is the known
calendar dark-mode look gap, out of scope for this micro-fix).

**date-picker** — Calendar.padding now 🟡 accepted:

```
| tokens.Calendar.padding | 12px | 0px | 🟡 accepted |   (×2 states)
```

Remaining ❌s are all pixel deltas (pre-existing).

**toast** — ref-missing rows + behavior limit now 🟡; real radius gap fixed:

```
| tokens.Root.border-radius | 6px | 6px | ✅ |   (show-toast states)
| tokens.Root.border-radius | (missing element) | 6px | 🟡 accepted |
| tokens.Title.* | (missing element) | … | 🟡 accepted |
| tokens.Description.* | (missing element) | … | 🟡 accepted |
| behavior.show-toast | focus=- | focus=- | 🟡 accepted |
```

**popover** — behavior.open now 🟡:

```
| behavior.open | focus=Content | focus=Trigger | 🟡 accepted |   (×2 states)
```

### Gate output (all PASS)

```
recipe:emit:css:check       ✓ CSS emission is up to date
recipe:emit:tailwind:check  ✓ Tailwind emission is up to date
recipe:emit:unocss:check    ✓ UnoCSS emission is up to date
source:emit:check           ✓ source/ is in sync with src/ for all dual-emission packages
audit:recipe-contract       0 violations found
audit:recipe-parity         ✓ Recipe parity check PASSED
test:recipe-parity          Test Files 2 passed / Tests 21 passed
audit:theme-parity          ✓ Theme parity audit PASSED
```

Parity unit suite:

```
pnpm exec vitest run --config tests/shadcn-parity/vitest.config.ts mapping verify report generate-specs
Test Files  8 passed (8)
     Tests  57 passed (57)
```

Package tests:

```
pnpm --filter @solidiom/calendar test   → 2 files / 32 tests passed
pnpm --filter @solidiom/date-picker test → 1 file / 3 tests passed
```

### Batch-4 FINAL per-component rollup (non-pixel rows)

| component   | token/behavior ✅ | 🟡 accepted | ❌ gap |
| ----------- | ----------------- | ----------- | ------ |
| calendar    | 68                | 0           | 0      |
| date-picker | 38                | 2           | 0      |
| data-table  | 16                | 0           | 0      |
| carousel    | 44                | 0           | 0      |
| progress    | 10                | 0           | 0      |
| empty-state | 22                | 0           | 0      |
| skeleton    | 4                 | 0           | 0      |
| spinner     | 6                 | 0           | 0      |
| toast       | 20                | 8           | 0      |
| popover     | 32                | 4           | 0      |

All 10 components: **0 non-pixel ❌ remaining.** Pixel deltas are pre-existing and out of
scope for this geometry micro-fix.

### Commit

Base: `2b33596b` — this commit.
