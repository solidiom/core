# shadcn/ui Parity Harness — Operator Guide

This page documents how to run, read, and extend the shadcn/ui behavior + visual
parity harness. The design lives in
[`docs/superpowers/specs/2026-09-25-shadcn-parity-harness-design.md`](superpowers/specs/2026-09-25-shadcn-parity-harness-design.md);
the full-parity rollup lives in [`artifacts/shadcn-parity/ROLLUP.md`](../../artifacts/shadcn-parity/ROLLUP.md).

## What it is

The parity harness verifies that every Solidiom component with a shadcn/ui
equivalent **behaves** like shadcn (interaction, keyboard, focus, ARIA, state)
and **looks** like shadcn (color, spacing, radius, border, typography, dark
mode). It opens two isolated browser contexts per component — the pinned
shadcn reference app and the Solidiom site's live recipe examples — drives the
same deterministic interaction script into both, and diffs computed tokens,
behavior snapshots, and bounding-box pixel crops.

It is **not** an API or identity comparison. Per the governing rule in design
§1/§15.3/§24.4 the harness measures behavior and look only.

> **Look/behavior only, NEVER API.** No shadcn API compatibility, no
> prop/name alignment, no 1:1 catalog mapping as a success metric. Divergences
> are fixed in the Solidiom recipe/primitive so the **look and behavior**
> converge on shadcn — never the API or the names. Solidiom keeps its own
> taxonomy, props, and theme-token system. A finding that "the fix" would
> require touching public API/props is a **design conflict** (🔴), surfaced to
> the user — not something to force through the harness.

## How to run it

The suite needs **two servers** running. There is **no `webServer` block** in
`apps/site/playwright.shadcn.config.ts` — you bring both up yourself.

### 1. Reference app → :4333

```sh
cd tools/shadcn-reference
npm run preview          # vite preview --port 4333 --strictPort
```

(`npm run dev` also works and serves the same pages with HMR.)

### 2. Site preview → :4322

```sh
pnpm --filter @solidiom/site build
pnpm --filter @solidiom/site run search-index
pnpm --filter @solidiom/site exec astro preview --host 127.0.0.1 --port 4322
```

The `examples` routes (e.g. `/components/button/examples/`) are the pages the
harness compares against. Note the **trailing slash** — Solidiom routes are
trailing-slash canonical.

### 3. Regenerate specs (after editing `mapping.json`)

```sh
pnpm run parity:generate        # from the repo root
```

This re-emits `tests/shadcn-parity/specs/*.spec.ts` from
`tests/shadcn-parity/mapping.json`. The specs are generated artifacts — do not
hand-edit them.

### 4. Run

```sh
# everything
pnpm --filter @solidiom/site run test:parity

# one component
pnpm --filter @solidiom/site exec playwright test \
  --config playwright.shadcn.config.ts specs/<id>.spec.ts
```

The mise task `mise run test:parity` is the same as the first form. The suite
runs **Chromium only, workers = 1**, so captures are deterministic. If the
browser isn't present yet: `npx playwright install chromium`.

## Reading findings

- **Per component:** `artifacts/shadcn-parity/<id>.md` — a signal table
  (pixels / tokens / behavior) with ✅ / 🟡 / ❌ per row, plus side-by-side PNGs
  in `artifacts/shadcn-parity/<id>/` and shared captures in
  `artifacts/shadcn-parity/assets/`.
- **Rollup:** `artifacts/shadcn-parity/ROLLUP.md` — the full-parity summary
  across all 50 comparison-set entries (verdict + detail per component,
  accepted-divergence families, residual look gaps).

Verdict vocabulary: **✅** = no real token/behavior ❌ (pixel-only ❌ may
remain where the divergence is an accepted palette/dark-theme difference);
**🟡** = accepted divergence (documented with rationale); **❌** = gap that
produces a fix task; **⛔ gap / ⏸ na** = not a parity target (no shadcn ref or
no Solidiom live island / Solidiom-only primitive).

## Adding a new component to the comparison set

1. **Reference page.** Add `tools/shadcn-reference/src/pages/<name>.tsx`
   rendering the real shadcn API in the neutral shell, and register it in
   `src/main.tsx` `pages`. Pull the component in with the pinned CLI:
   `npx -y shadcn@3.8.5 add <name> -y` (inside `tools/shadcn-reference/`).
2. **Mapping entry.** Add an entry to `tests/shadcn-parity/mapping.json` with
   `id`, `status` (`mapped` | `gap` | `na`), `shadcn.ref`, `solidiom.package` /
   `solidiom.siteSlug` / `solidiom.sitePath`, `parts`, per-frame `selectors`
   (`selectors[part] = { ref, sol }`), `tokens` (the shadcn values),
   `interactions`, and `states`. **Convention: each state name must EQUAL the
   interaction name that drives it** — the engine's `scriptForState`
   (`tests/shadcn-parity/lib/verify.ts`) runs the script named after the state,
   falling back to `reset` when the state isn't an interaction.
3. `pnpm run parity:generate`.
4. Run the one spec: `pnpm --filter @solidiom/site exec playwright test
--config playwright.shadcn.config.ts specs/<id>.spec.ts`.

## Re-baselining shadcn versions

The shadcn CLI is **pinned to 3.8.5** — 4.x changed `-b` to mean a base
component library (radix|base|aria) and rejects the classic `-b neutral`. To
re-baseline:

1. Re-run `npx -y shadcn@3.8.5 add` for the affected components in
   `tools/shadcn-reference/` (answer `n` to overwrite prompts when files are
   already identical).
2. Update `tools/shadcn-reference/PINNED.md` with the new versions/notes.
3. Re-run the full parity suite and refresh the rollup.

## CI posture

`test:parity` is a **local/mise task only — gated out of CI by default.** The
parity suite is pixel-sensitive (needs the pinned Playwright image, like the
visual suite), requires **both** servers running (reference app :4333 + site
preview :4322), and is **human-in-loop by design** (spec §4 — the findings
reports are reviewed, not just pass/fail). Wiring it into CI as a hard gate
would make it flaky (pixel deltas from font rendering, the Batch-2 overlay
residuals) and would block merges on accepted divergences (🟡). The opt-in
local run stays `mise run test:parity` / `pnpm run test:parity`. A future
`PARITY_IN_CI=1` nightly job on the pinned container is possible but is **not**
wired into the existing CI workflows as of this write.

## Gotchas (learned during the build)

- **No system Chrome binary** in the run environment → the suite drives
  Playwright's bundled **Chromium**, not the chrome-devtools MCP. (Phase A
  discovery used chrome-devtools MCP live; Phase B is the committed Chromium
  suite.)
- **Site routes are trailing-slash** (`/components/<slug>/examples/`), not
  `/components/<slug>/examples`.
- **The reference app is isolated.** It is negated out of the pnpm workspace
  (`!tools/shadcn-reference` in `pnpm-workspace.yaml`) and manages its own
  `package-lock.json` with **npm** — it is a comparison fixture, never a
  product dependency, and is excluded from the nx graph and release gates.
- **Recipe CSS is generated.** Never hand-edit `packages/recipes-*/src/styles/`.
  Edit `tools/recipe-contract-definitions.ts` (or the recipe source of truth)
  and re-emit with `pnpm run recipe:emit:css` (+ the tailwind/unocss variants).
- **`source:emit` is required after a recipe re-emit.** The tailwind profile
  reads from `source/`; run `pnpm run source:emit` so the emitted package
  sources stay in sync with the recipe CSS.
