# shadcn/ui Parity — Full Rollup (Batches 1–5)

From `tests/shadcn-parity/mapping.json` + `artifacts/shadcn-parity/*.md`. "real ❌" = token/behavior gaps; "total ❌" incl. pixel-only (accepted palette/dark-theme).

## Comparison set: 40 mapped (compared + converged), 8 gap (no island or no shadcn ref), 2 na (Solidiom-only)

| Component | Verdict | Detail |
|---|---|---|
| button | ✅(pixel-only) | 4 total ❌, 8 🟡 |
| input | ✅(pixel-only) | 4 total ❌, 4 🟡 |
| label | ✅(pixel-only) | 2 total ❌, 4 🟡 |
| checkbox | ✅(pixel-only) | 4 total ❌, 0 🟡 |
| radio-group | ✅(pixel-only) | 4 total ❌, 12 🟡 |
| switch | ✅(pixel-only) | 4 total ❌, 4 🟡 |
| slider | ✅(pixel-only) | 4 total ❌, 4 🟡 |
| select | ✅(pixel-only) | 4 total ❌, 4 🟡 |
| field | ✅(pixel-only) | 2 total ❌, 0 🟡 |
| input-otp | ✅(pixel-only) | 2 total ❌, 4 🟡 |
| combobox | ⛔ gap | no shadcn reference page in pinned 3.8.5 registry (it is a Command+Pop |
| textarea | ⛔ gap | no Solidiom live examples island (slug not in COMPONENTS_WITH_EXAMPLES |
| input-group | ⛔ gap | no Solidiom live examples island (slug not in COMPONENTS_WITH_EXAMPLES |
| dialog | ✅(pixel-only) | 6 total ❌, 5 🟡 |
| alert-dialog | ❌8 real | 14 total ❌, 11 🟡 |
| sheet | ❌16 real | 22 total ❌, 10 🟡 |
| drawer | ❌8 real | 14 total ❌, 14 🟡 |
| popover | ✅(pixel-only) | 6 total ❌, 4 🟡 |
| tooltip | ❌6 real | 10 total ❌, 6 🟡 |
| hover-card | ❌6 real | 12 total ❌, 3 🟡 |
| dropdown-menu | ❌4 real | 10 total ❌, 6 🟡 |
| context-menu | ❌10 real | 16 total ❌, 6 🟡 |
| menubar | ⛔ gap | no Solidiom live examples island (menubar is not in COMPONENTS_WITH_EX |
| tabs | ✅ | 0 total ❌, 8 🟡 |
| accordion | ✅ | 0 total ❌, 4 🟡 |
| collapsible | ✅ | 0 total ❌, 4 🟡 |
| breadcrumb | ✅ | 0 total ❌, 4 🟡 |
| navigation-menu | ✅ | 0 total ❌, 11 🟡 |
| pagination | ✅ | 0 total ❌, 4 🟡 |
| resizable-panels | ✅ | 0 total ❌, 6 🟡 |
| scroll-area | ✅ | 0 total ❌, 2 🟡 |
| avatar | ✅ | 0 total ❌, 6 🟡 |
| badge | ✅ | 0 total ❌, 4 🟡 |
| kbd | ✅ | 0 total ❌, 2 🟡 |
| table | ⛔ gap | no Solidiom live examples island for plain table — Solidiom ships data |
| calendar | ✅(pixel-only) | 4 total ❌, 0 🟡 |
| date-picker | ✅(pixel-only) | 4 total ❌, 2 🟡 |
| data-table | ✅(pixel-only) | 2 total ❌, 0 🟡 |
| carousel | ✅(pixel-only) | 4 total ❌, 0 🟡 |
| progress | ✅(pixel-only) | 2 total ❌, 0 🟡 |
| skeleton | ✅(pixel-only) | 2 total ❌, 0 🟡 |
| spinner | ✅(pixel-only) | 2 total ❌, 0 🟡 |
| toast | ✅(pixel-only) | 4 total ❌, 8 🟡 |
| empty-state | ✅(pixel-only) | 2 total ❌, 0 🟡 |
| chart | ⛔ gap | no Solidiom live examples island for chart (there is no `chart` entry  |
| sidebar | ⛔ gap | no Solidiom live examples island (sidebar is not in COMPONENTS_WITH_EX |
| separator | ⛔ gap | no Solidiom live examples island (separator is not in COMPONENTS_WITH_ |
| command-palette | ✅ | 0 total ❌, 18 🟡 |
| tree | ⏸ na | Solidiom-only primitive, no shadcn/ui component to compare against (no |
| listbox | ⏸ na | Solidiom-only primitive, no shadcn/ui component to compare against (no |

✅ = no real token/behavior ❌ (pixel-only may remain = accepted palette/dark-theme). ⛔ gap / ⏸ na = not a parity target (rationale in detail).

## Accepted divergence families (🟡, deliberate, NOT fixable look gaps)
Color/palette (filled-light vs primary, Batch-1 user-approved) · Dark-theme surfaces · Mount-model (command-palette defaultOpen, drawer vaul-orientation) · Focus-model (popover behavior.open) · Structural (navigation-menu floating viewport, resizable handle, alert-dialog non-dismissable).

## Out of scope (design §15.3/§24.4): no shadcn API/identity parity. BEHAVIOR + LOOK only.

## Residual look gaps (secondary — Batch-2 overlays width/padding)
The Batch-2 overlay fix (Task 9) converged **radius** (content 6px, item 4px) + the drawer focus model, but 7 overlays retain **width/padding** look gaps that were recorded in discovery but not converged in the fix pass (the fix focused on radius). These are the "real ❌" rows above:
- **alert-dialog / sheet / drawer**: Content width (shadcn 512px vs solidiom 384px) + Content border/padding (sol-side selector resolution in some states).
- **tooltip / hover-card / dropdown-menu / context-menu**: smaller token residuals (item/content spacing).
These are genuine, specific geometry gaps — candidates for a Batch-2 residual convergence pass. They do NOT affect the Batch-1/3/4/5 convergence (those are fully at 0 real ❌).
