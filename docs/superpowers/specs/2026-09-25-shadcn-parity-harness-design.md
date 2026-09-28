# shadcn/ui Behavior + Visual Parity Harness — Design

Date: 2026-09-25
Status: Approved (brainstorming complete)
Scope: Verify every shadcn/ui component with a Solidiom equivalent **behaves** and **looks** like shadcn, using Chrome DevTools for live verification and a durable Playwright harness for repeatability.

---

## 1. Goals, non-goals, governing rule

### Goal

For every shadcn/ui component that has a Solidiom equivalent, verify that the Solidiom
component **behaves** (interaction, keyboard, focus, ARIA, state) and **looks** (color,
spacing, radius, border, typography, dark mode) like shadcn. Verification is done two ways:

- **Live** through the Chrome DevTools MCP tools (the discovery pass, Phase A).
- **Durable** through a Playwright parity suite that replays the same per-component spec (Phase B).

Divergences are fixed in the Solidiom recipe/primitive so the **look and behavior**
converge on shadcn — never the API or the names.

### Non-goals (hard, from `docs/architecture/design.md` §15.3 and §24.4)

- No shadcn **API compatibility**, no prop/name alignment.
- No 1:1 catalog mapping as a success metric.
- Solidiom keeps its own taxonomy, props, and theme-token system.

Where Solidiom deliberately diverges (a component shadcn folds differently, or a
Solidiom-specific token), the harness records it as an **accepted divergence**
(🟡) rather than a failure (❌).

### Governing rule

A _declared_ set of parts, tokens, and interactions per component (in the mapping file,
§2a) defines "like shadcn" for that component. Anything not declared is out of scope for
that component's parity verdict.

### Success criteria (per component)

A component is one of:

- ✅ **parity** — every declared signal within tolerance.
- 🟡 **accepted divergence** — differences documented with rationale.
- ❌ **gap** — a declared signal fails → produces a fix task (Phase C).

A component is **done** only when no declared signal is an unresolved ❌.

---

## 2. Architecture

Three parts; the mapping file is the single source of truth.

### 2a. Mapping file — `tests/shadcn-parity/mapping.json`

The single source of truth for the comparison set. Built from design §15.4 (the existing
shadcn→Solidiom mapping table) plus judgment; shadcn components with no Solidiom package
are marked `gap`. Solidiom-only extras (`listbox`, `tokenizer`, `tree`, …) are **not** in
the parity set (no shadcn counterpart). The file is **reviewed by the user before Phase B
locks it in.**

Each entry:

```jsonc
{
  "id": "dialog",                     // shadcn component key
  "shadcn": { "ref": "dialog" },      // which component the reference app renders
  "solidiom": {
    "package": "@solidiom/dialog",
    "sitePath": "/components/dialog/examples"  // where the live recipe renders
  },
  "status": "mapped" | "gap" | "na",  // gap = shadcn comp has no solidiom pkg; na = deliberately out of scope
  "parts": ["Root", "Trigger", "Content", "Title", "Close", "Overlay"],
  "tokens": {                         // per-part computed-style assertions (primary "look" signal)
    "Root": { "position": "fixed", "zIndex": ">=40" },
    "Trigger": { "borderRadius": "0.5rem", "minHeight": "2.5rem" },
    "Content": { "background": "var(--card)", "border": "1px solid var(--border)" }
  },
  "interactions": ["open", "close-esc", "close-overlay-click", "focus-trap", "focus-return"],
  "states": ["default", "open"],      // visual states to capture
  "themes": ["light", "dark"],
  "tolerance": { "pixelMaxDiff": 2, "pixelMaxPercent": 1.0 },
  "acceptedDivergences": [
    { "signal": "tokens.Root.borderRadius", "reason": "Solidiom radius token resolves to a different value by design; see architecture/design.md theming section" }
  ]
}
```

Token assertion forms: exact (`"0.5rem"`), relational (`">=40"`), or token identity
(`"var(--x)"` — compared by resolved value, see risk table §5).

Note: `solidiom.sitePath` slugs and the `parts`/`tokens`/`interactions` lists shown above
are **illustrative**. The authoritative per-component values are settled during Batch 0
(confirm every `examples` route renders) and Batches 1–5 (the DevTools discovery pass),
then frozen in this file before Phase B generates specs from it.

### 2b. Reference app — `tools/shadcn-reference/`

Throwaway Vite + React app. `shadcn init` + `shadcn add` for every mapped component from
the shadcn registry. One route per component:
`tools/shadcn-reference/src/pages/<id>.tsx`, rendering the component in a neutral,
token-matched shell. Served on a fixed port.

**Isolation (hard requirement):**

- Own `package.json` + own lockfile (not the pnpm workspace).
- Excluded from the `nx` dependency graph and the release/vertical-slice gates — it is a
  comparison fixture, never a product dependency.
- shadcn registry versions pinned in its lockfile; no auto-update.

### 2c. Parity suite — `tests/shadcn-parity/` (Phase B)

New Playwright config `apps/site/playwright.shadcn.config.ts` (sibling to the existing
`playwright.visual.config.ts`). One spec per component, generated from `mapping.json`.
Each spec:

1. Opens **two isolated contexts** (no shared state): `ref` → reference app page;
   `sol` → Solidiom site `solidiom.sitePath`.
2. For each declared **state × theme**, runs the **interaction script** into both and
   captures computed styles, behavior snapshots, and pixel crops.
3. Writes a findings report to `artifacts/shadcn-parity/<id>.md`.

### Where DevTools fits (Phase A, now)

**Ownership:** Phase A is **agent-driven** — performed by the assistant (this session) via
the Chrome DevTools MCP tools, per batch. Phase B is the **committed** Playwright suite
that any contributor/CI can re-run without the assistant. Phase A's job is to _discover_
the true tokens/interactions and produce the first findings; Phase B's job is to _record_
them durably.

The **Chrome DevTools MCP tools** do the comparison _live_ per batch: open both apps in
tabs, `take_snapshot` for the a11y/DOM tree, `evaluate_script` for computed styles,
`take_screenshot` for pixels, `click`/`press_key`/`fill`/`hover` for interactions. Phase A
produces the first findings reports and **proves out the exact token list + interaction
script per component** that Phase B then encodes in `mapping.json`. DevTools is the
discovery engine; the Playwright suite is the durable recorder.

---

## 3. Per-component verification flow (the unit of work)

Repeatable procedure, run once per component per batch. Identical in Phase A (live) and
Phase B (replayed).

**Step 0 — Load the spec** from `mapping.json`: `id`, `solidiom.sitePath`, `parts`,
`tokens`, `interactions`, `states`, `themes`, `tolerance`, `acceptedDivergences`.

**Step 1 — Render both.**

- Reference: navigate to the reference app page for `<id>`.
- Solidiom: navigate to `solidiom.sitePath` (the site `examples` view, recipe rendered
  live with its theme).
- Wait for stable DOM in both. Light default, no theme override yet.

**Step 2 — For each theme in `themes`:** apply to both.

- Reference: set shadcn's dark class.
- Solidiom: set `document.documentElement.dataset.theme` (same idiom as
  `apps/site/tests/visual/visual-baseline.spec.ts:setTheme`).
- Wait ~100ms for transitions to settle.

**Step 3 — For each state in `states`:** drive both from a known closed/reset state using
the same **interaction script**. Each interaction is an _ordered, deterministic_ sequence
of `click` / `press_key` / `fill` / `hover` / `wait` steps — identical on both frames.
After each step, capture on both frames:

- **Behavior snapshot**: `activeElement` (part + role), the part's `aria-*` attributes,
  `data-state` / open-closed DOM flags, whether focus is trapped/returned.
- **Computed styles**: for every declared `tokens[part][prop]`, read `getComputedStyle`
  on the resolved element and evaluate the assertion.
- **Pixel capture**: screenshot the component's **bounding box** (not the full page) into
  the findings artifacts.

**Step 4 — Diff and verdict.** Per signal:

- **Token diff**: each assertion ✅ (within tolerance) / ❌ (mismatched, expected vs.
  actual recorded) / 🟡 (in `acceptedDivergences`).
- **Behavior diff**: each interaction step's snapshot pair ✅/❌/🟡. A mismatch is
  concrete, e.g. "Esc closes shadcn's dialog but not Solidiom's."
- **Pixel diff**: two PNGs compared; max percent diff ≤ `tolerance.pixelMaxPercent` → ✅,
  else ❌ with side-by-side + delta heatmap saved.

**Step 5 — Emit the findings report** `artifacts/shadcn-parity/<id>.md`:

```markdown
# dialog — shadcn parity

Reference: shadcn@<pinned-version>, solidiom @ <git sha>
Status: ❌ 2 failures, 1 accepted divergence

| Signal                      | Expected (shadcn) | Actual (solidiom)  | Verdict     |
| --------------------------- | ----------------- | ------------------ | ----------- |
| pixels/light/default        | —                 | delta 3.1%         | ❌          |
| tokens/Trigger.borderRadius | 0.5rem            | 0.625rem           | 🟡 accepted |
| behavior/close-esc          | closed            | still open         | ❌          |
| behavior/focus-return       | focus on Trigger  | focus lost to body | ❌          |

[side-by-side PNGs + delta heatmaps + failing interaction DOM traces]

Fixes:

- [ ] recipe: dialog content bg uses --card, expected --popover
- [ ] primitive: Esc keypress does not close; close handler missing on Content
```

A component is **done** when all ❌ are converted to ✅ (fixed) or 🟡 (accepted with
rationale). The report is the handoff to the fix step.

**Step 6 — (Phase C) Fix & re-run.** Each ❌ becomes a targeted change to the recipe CSS
/ TSX or the primitive behavior. Re-run just that component's spec; the report updates;
iterate to green. Fixes go to `packages/recipes-*` and/or `packages/<primitive>` — **never**
by adding a shadcn-compatible API surface.

---

## 4. Batching, ordering, review checkpoint

Batched (not all-at-once): 63 components × (states × themes × interactions) is a large
amount of live work. Batches make progress checkpointable, produce one findings report per
component, and let the user correct the mapping/tolerances early (on batch 1) before hours
are spent on a wrong definition.

**Batch plan** (ordered by complexity + value — forms & surfaces first, hardest overlays
last):

- **Batch 0 — Foundation (setup only).** Build `tools/shadcn-reference/` Vite+React app,
  install the shadcn components, verify it renders; wire the two-context harness skeleton
  (no per-component assertions yet).
  _Checkpoint: user confirms the reference app looks like real shadcn._
- **Batch 1 — Form & input primitives.** button, input, label, checkbox, radio-group,
  switch, slider, select, combobox, textarea, field, input-otp, input-group.
  High-value, mostly static states, establishes the token/interaction idioms.
  _Review gate (below)._
- **Batch 2 — Overlays & popovers.** dialog, alert-dialog, sheet, drawer, popover,
  tooltip, hover-card, dropdown-menu, context-menu, menubar. Behavior-heavy: focus trap,
  Esc, portal, positioning. Where real divergences will surface.
- **Batch 3 — Navigation & structure.** tabs, accordion, collapsible, breadcrumb,
  navigation-menu, sidebar, pagination, resizable-panels, scroll-area, separator, avatar,
  badge, kbd.
- **Batch 4 — Data & feedback.** table, data-table, calendar, date-picker, carousel,
  chart, progress, skeleton, spinner, toast, empty-state.
- **Batch 5 — Command & composites.** command/command-palette, tree, listbox, + remaining
  mapped; close out `gap` entries with rationale.

**Checkpoints.** After **Batch 1** the user reviews the findings reports and the settled
`mapping.json` token/interaction definitions — the gate to correct "like shadcn"
once, cheaply, before Batches 2–5 scale it. Each subsequent batch ends with a short
status (per component: ✅ / 🟡 / ❌ counts + what needs fixing).

---

## 5. Risks and mitigations

| Risk                                                                                | Mitigation                                                                                                                                                                                                                                                                                     |
| ----------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Reference app rots** (shadcn publishes new versions, styling drifts between runs) | Pin shadcn registry versions in `tools/shadcn-reference/` (own lockfile, no auto-update). Re-baseline only on a deliberate versioned re-init. Record the shadcn version in every findings report header.                                                                                       |
| **Theme tokens don't line up 1:1** (Solidiom token system ≠ shadcn CSS vars)        | Compare _computed/resolved_ values, not token names, for the "look" signal. Where token identity is itself the point, it goes in `acceptedDivergences` with rationale. Resolved values (color, px, radius) are what "looks like" means.                                                        |
| **Pixel diff too brittle** (fonts, anti-aliasing, 1px shifts, sub-pixel)            | Bounding-box crop (not full page) + `tolerance.pixelMaxPercent` + **computed-style token assertions as the primary "look" signal** (robust, points at the exact drifted value). Pixel diff is corroboration, not the sole gate. Disable animations (existing idiom: `animations: "disabled"`). |
| **Interaction scripts not deterministic** (timing, async open/close)                | Each step includes an explicit `wait` for the stable state (e.g. `waitFor` `[data-state=open]`). Scripts are ordered and idempotent-from-reset; the same sequence drives both frames so timing noise is symmetric.                                                                             |
| **`sitePath` examples view doesn't render the recipe in the needed state**          | Verify in Batch 0 that each `examples` view renders the component with recipe styling. A missing/inert example is a small _site_ fix recorded alongside, not silently skipped.                                                                                                                 |
| **Scope creep into "make the API match"**                                           | Non-goal is hard (§1). Every fix touches recipe/primitive _behavior or look_, never public API/props/names. Mapping file + this design doc are the guardrail.                                                                                                                                  |
| **Reference app pollutes build/publish graph**                                      | Isolated `package.json`/lockfile, excluded from the `nx` graph and release gates. Confirm `vertical-slice-gate`/`release-gate` don't sweep it in (Batch 0).                                                                                                                                    |

---

## 6. Deliverables

- `tests/shadcn-parity/mapping.json` — comparison set (reviewed pre-Phase B).
- `tools/shadcn-reference/` — isolated Vite+React shadcn reference app.
- `apps/site/playwright.shadcn.config.ts` — Phase B parity suite config.
- `tests/shadcn-parity/` — generated per-component Playwright specs (Phase B).
- `artifacts/shadcn-parity/<id>.md` + side-by-side/delta PNGs — findings reports (Phase A & B).
- Phase C fixes in `packages/recipes-*` and/or `packages/<primitive>` for each confirmed ❌.

## 7. Explicit non-outputs

- No new public API/props on any Solidiom package.
- No renaming of Solidiom primitives or registry entries to match shadcn.
- No changes to the theme-token _system_ (only resolved-value convergence where a declared
  token asserts a specific look, or a recorded accepted divergence).

---

## As-built (2026-09-25)

- **shadcn pinned:** CLI **3.8.5** (last release with classic `-b neutral`; 4.x rejects it),
  new-york style, neutral base theme — see `tools/shadcn-reference/PINNED.md`.
- **Comparison set:** 50 entries in `tests/shadcn-parity/mapping.json` —
  **40 mapped** (compared + converged), **8 gap** (no shadcn ref or no Solidiom live
  island), **2 na** (Solidiom-only primitives: tree, listbox).
- **Convergence:** Batches 1/3/4/5 are at **0 real token/behavior ❌** (pixel-only ❌
  remain where the divergence is an accepted palette/dark-theme difference). Batch 2
  overlays converged **radius** (content 6px, item 4px) + the drawer focus model;
  **7 width/padding residuals** remain on alert-dialog, sheet, drawer, tooltip,
  hover-card, dropdown-menu, context-menu (documented in `artifacts/shadcn-parity/ROLLUP.md`).
- **User decisions at the gates:** (1) full **look parity** — pixel-level convergence
  was pursued, not token-only; (2) **fix the published recipe** rather than the site or
  the reference when a look gap surfaced (Phase C fixes landed in `packages/recipes-*`);
  (3) drawer uses the **vaul** trigger-focus model, matching shadcn's vaul-based drawer.
- **CI posture:** `test:parity` is **local/mise only, gated out of CI by default**
  (pixel-sensitive, needs both servers, human-in-loop per §4). Operator guide:
  `docs/shadcn-parity.md`.
