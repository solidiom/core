---
id: task-sequencing
title: "Solidiom Catalog — Component, Block, and Template Sequencing Plan"
doc_type: plan
audience: "Solidiom project leads, contributors"
tags: [components, blocks, templates, sequencing, m4, backlog]
lifecycle: active
date: 2026-08-03
---

# Solidiom Catalog — Component, Block, and Template Sequencing Plan

**Status:** proposed — awaiting decisions D1–D6
**Parent plan:** `docs/plans/website-tasks.md` §§8.2–8.4, §§9.2–9.4
**Scope:** the 86 open M4 catalog items — 21 components, 36 blocks, 29 templates
**Blocks:** G4 exit checklist

## 1. What this document is

`docs/plans/website-tasks.md` defines _what_ each catalog item must satisfy (the layer
Definitions of Done in §8) and _which_ items exist (the queues in §9). It does not say
in what order to build them, nor what machinery they plug into. This document supplies
both, and records the design decisions that must be settled before the first
`COMP-*` row can start.

It is a sequencing plan, not a second source of truth for scope. Where this document
and §9 disagree about which items exist, §9 wins.

### 1.1 What this document is not

- Not an amendment to any Definition of Done. §8.2/8.3/8.4 are unchanged.
- Not an approval of the six decisions in §3. They are proposals with a recommendation.
- Not a schedule. The effort model in §8 is derived from §1.2's size guide, not from
  measured throughput on this layer, of which there is none.

---

## 2. Findings — the machinery does not exist yet

The most consequential fact about this work: components, blocks, and templates have
almost no implementation layer. This is not "author 86 content entries into existing
scaffolding." The scaffolding is the majority of the risk.

Each finding below was verified against the tree at `532e3f6`.

| #   | Finding                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             | Evidence                                                                                   |
| --- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| F1  | The registry has no non-primitive deliverable arrays. `registry/index.json` top-level keys are `$schema, version, generatedAt, integrity, primitives, adapters` — 52 primitives, 6 adapters, and nothing else.                                                                                                                                                                                                                                                                                                                                                                      | `node -e 'Object.keys(require("./registry/index.json"))'`                                  |
| F2  | `tools/registry-build.ts` only discovers packages whose `nx.tags` include `layer:primitive` (or `layer:adapter`). There is no producer for component, block, or template manifests. It also `unlinkSync`s orphan `registry/*.json` files, so manifests written by any other tool are deleted on the next `registry:build`.                                                                                                                                                                                                                                                          | `tools/registry-build.ts` `isPublicPrimitive()`, orphan sweep                              |
| F3  | A "component deliverable" is currently a declaration with no component-specific source. `registry/button.json` has `deliverables: ["component","primitive"]` and `styling.outputs: ["css","tailwind","unocss"]`, but `source.files` holds exactly the four _primitive_ files.                                                                                                                                                                                                                                                                                                       | `registry/button.json`; `packages/button/package.json` `nx.metadata.registry.deliverables` |
| F4  | Consequently `solidiom add button --deliverable component` writes primitive source into `componentDir`. `install.ts`'s `resolvePrimitiveSource()` looks only at `packages/<name>/source` or `node_modules/@solidiom/<name>/source`, regardless of deliverable.                                                                                                                                                                                                                                                                                                                      | `packages/cli/src/source-install/install.ts`                                               |
| F5  | The component and block content directories are empty. `apps/site/src/content/{en,es}/components/` = 0 entries, `blocks/` = 0, `themes/` = 0. `templates/` has 2 EN + 2 ES, which are `CLI-007` artifacts, not `TPL-*` catalog entries.                                                                                                                                                                                                                                                                                                                                             | directory listing                                                                          |
| F6  | Every recipe wrapper scope is already contract-backed. `tools/recipe-contract-definitions.ts` exports 15 definitions — `accordion`, `alert`, `badge`, `button`, `checkbox`, `dialog`, `menu`, `popover`, `select`, `switch`, `tabs`, `toast`, `tooltip`, plus `typeset` and `prose` — and `recipe:contract` validates all 15. `packages/recipes-{css,tailwind,unocss}/src/recipes/` each hold the same 13 `.tsx` wrappers (plus two generated `.variants.ts`). So the 13 components whose primitive already has a recipe need **no** new contract definition; the 8 without one do. | `tools/recipe-contract-definitions.ts`; `pnpm run recipe:contract`; directory listings     |
| F7  | No component, block, or template gate exists. `tools/` contains `primitive-catalog-gate.ts` and `primitive-completion-gate.ts` and no analogue for the other three layers.                                                                                                                                                                                                                                                                                                                                                                                                          | `ls tools/`                                                                                |
| F8  | Catalog docs load from two different places by layer. `primitives`, `examples`, and `accessibilityContracts` collections use `base: "../../packages"` with `*/docs/**`. `components`, `blocks`, `templates`, and `themes` use `base: "./src/content"` with `{en,es}/<layer>/**`. `registry-build.ts`'s `documentationMetadata()` only ever reads `packages/<name>/docs`, so a component's site-side docs can never influence its registry `documentation.status`.                                                                                                                   | `apps/site/src/content.config.ts`; `tools/registry-build.ts`                               |
| F9  | The block manifest and the block collection disagree on state vocabulary. `docs/contracts/block-catalog-manifest.json` records `states` as prose strings ("Loading (credentials submit)"). The Astro `blocks` collection requires `requiredStates: z.array(z.enum(["loading","empty","error","restricted"]))`.                                                                                                                                                                                                                                                                      | manifest; `content.config.ts`                                                              |
| F10 | `tools/recipe-emit-css.ts` throws for any variant-bearing scope absent from `CLASS_PREFIXES`, which currently holds only `button` and `badge`.                                                                                                                                                                                                                                                                                                                                                                                                                                      | `tools/recipe-emit-css.ts`                                                                 |
| F11 | `destinations.ts` already maps component→`componentDir`, block→`blockDir`, theme→`themeDir`, and deliberately throws `UnsupportedDeliverableError` for template (handled by `solidiom create`). This part needs no change.                                                                                                                                                                                                                                                                                                                                                          | `packages/cli/src/source-install/destinations.ts`                                          |

### 2.1 The block dependency graph is dense, and that changes the sequencing

`docs/contracts/block-catalog-manifest.json` declares 317 component-dependency edges
across 36 blocks: **minimum 4 per block, maximum 16, mean 8.8.**

The practical consequence is that blocks do **not** meaningfully overlap component work.
Under a fanout-optimal component order (§7), the first block does not unlock until the
6th component lands, and only 8 of 36 are available after 12 components. See the unlock
curve in §7.2. Any plan that assumes blocks proceed in parallel with components from the
start is wrong.

Two components are near-dead weight for the block catalog and should be scheduled last:
`COMP-018 Sheet` is referenced by **zero** blocks, and `COMP-019 Navigation Menu` by one.
§9.2 still requires both for 21/21, and §9.2's own note already flags Sheet.

---

## 3. Decisions required before Phase 1 (D1–D6)

These are blocking. D1 in particular determines whether the 21 components are rework-free.
Each needs an explicit resolution recorded in `website-tasks.md` §8.2 or §9.2.

### D1 — What is a component, physically?

§8.2 requires "CLI plan/add/verify/diff/update flows work with signed manifests and
source ownership," which requires per-component files carrying digests, and simultaneously
"it uses the corresponding Solidiom primitive and introduces no duplicate behavior layer."

| Option              | Shape                                                                                                                        | Assessment                                                                                                                                                                                                                                                                                                                           |
| ------------------- | ---------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| (a) Status quo      | Component = primitive source + recipe + docs; no new files                                                                   | Cheapest. But `--deliverable component` materializes primitive files (F4), so "source ownership of a component" is indistinguishable from owning the primitive. Does not satisfy §8.2 as written.                                                                                                                                    |
| **(b) Recommended** | Component = the composed recipe wrapper, `packages/recipes-<profile>/src/recipes/<scope>.tsx`, plus its primitive dependency | The wrapper already _is_ "primitive + styling." Each recipes package already has a published `source/` mirror enforced by `audit-package-source-parity.ts` (RECIPE-006), so digests and verification come free. Requires teaching `install.ts` to resolve component source from the recipes package for the active `stylingProfile`. |
| (c) New packages    | `packages/component-<name>/` × 21                                                                                            | Cleanest conceptual separation. Costs 21 new packages, build targets, tsup configs, publish surfaces, and registry discovery rules.                                                                                                                                                                                                  |

**Recommendation: (b).** It reuses three existing mechanisms (recipe wrappers, `source/`
mirrors, parity auditing) instead of inventing a fourth, and it makes the styling profile
an explicit input to component installation, which matches `ConfigSchema.stylingProfile`
already existing and being optional-with-no-default.

The cost of (b) is that a component's identity is per-profile: `recipes-css/button.tsx` and
`recipes-tailwind/button.tsx` are different files. The registry manifest must therefore
record a component's source per styling output, not as one file list.

### D2 — Registry schema for non-primitive deliverables

Bump `IndexManifestV2` → `IndexManifestV3` adding `components[]`, `blocks[]`, and
`templates[]`. Extend `registry-build.ts` (not a sibling tool, per F2's orphan sweep) with
layer-aware discovery. `REG-007`'s invariant — every public deliverable generates exactly
one valid route — then requires route generators for all three layers, which do not exist.

Open sub-question: whether component manifests live at `registry/<name>.json` alongside
the primitive of the same name, or at a namespaced path such as
`registry/components/<name>.json`. Namespacing is recommended; Button would otherwise need
one manifest describing two deliverables with different source file sets.

### D3 — Docs location for components, blocks, templates

F8 leaves two coherent choices:

1. **Extend `registry-build.ts` with a layer-aware docs resolver** that reads
   `apps/site/src/content/{en,es}/<layer>/<name>.md` for non-primitive layers.
   Keeps content where the collections already expect it. Recommended.
2. Colocate component docs with source and change the collections' `base`. Consistent with
   primitives, but for option D1(b) the "source" is a recipes package shared by all
   components, so there is no natural per-component directory.

### D4 — Block state vocabulary

Add a structured `requiredStates` array using the collection's enum
(`loading | empty | error | restricted`) to each of the 36 manifest entries, retaining the
existing prose `states` as human-facing detail. Then have the Phase 3 manifest validator
assert the two agree in cardinality and that every block declares all four.

The current prose already covers Loading / Empty / Error / a restricted-or-pending state /
Success in every entry, so this is mechanical.

### D5 — `CLASS_PREFIXES` coverage

Extend `CLASS_PREFIXES` in `tools/recipe-emit-css.ts` with a prefix for every
variant-bearing scope among the 21 components before the corresponding contract definition
lands, or the emitter throws (F10). Decide the naming convention once — the existing two
are `solidiom-btn` and `solidiom-badge`, which are inconsistent about abbreviation.

### D6 — `proposedComponents` resolution policy

`BLOCK-000A` is resolved: eight out-of-range IDs moved to a non-resolving
`proposedComponents` field. The frequencies are `COMP-042` cited by **all 36** blocks,
`COMP-033` by 7, `COMP-029` by 2, and `COMP-025/035/036/043/048` by 1 each.

`COMP-042` appearing in all 36 entries is not a typo pattern; it reads as a genuine missing
component in §9.2. Resolve it **once, in Phase 0**, rather than 36 times at work-package
split time: either identify which approved component it should be, or raise a §9.2
amendment to add it as `COMP-022`. Leaving it to per-block splits guarantees 36
inconsistent decisions.

---

## 4. Phase 0 — Foundations

Nothing in Phases 1–4 can start until these land. Task IDs are new and should be added to
`website-tasks.md` §11.1 or a new §9.0.

| ID        | Size | Task                                                                                                                                                                                                                                                 | Depends on               |
| --------- | ---- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------ |
| FOUND-001 | S    | Record decisions D1–D6 in `website-tasks.md`; amend §8.2 with the component physical form and §9.3 with the `COMP-042` resolution.                                                                                                                   | —                        |
| FOUND-002 | M    | Registry v3: add `components[]`/`blocks[]`/`templates[]` to the index, namespaced per-deliverable manifests, layer-aware discovery, and layer-aware `documentationMetadata()`. Preserve determinism, stable sort, and the integrity/signature path.  | D2, D3                   |
| FOUND-003 | S    | `install.ts`: resolve component and block source per D1, keyed on `config.stylingProfile`. Keep the verify → conflict → rollback → lock ordering unchanged.                                                                                          | D1                       |
| FOUND-004 | M    | `tools/component-catalog-gate.ts` — clone `primitive-catalog-gate.ts`. Per-item §8.2 checks plus registry reconciliation, `--audit-only` mode, and a ratchet asserting the passing count equals the `Components` DoD column in §11's Scope counters. | FOUND-002                |
| FOUND-005 | S    | `tools/block-catalog-gate.ts` + manifest validator: every `componentDependencies` entry resolves to `COMP-001..021`, `requiredStates` present and complete, `proposedComponents` flagged not resolved. Ratchet against the `Blocks` counter.         | D4, D6, FOUND-002        |
| FOUND-006 | S    | `tools/scaffold-component-docs.ts` (mirror `scaffold-primitive-docs.ts`) emitting EN+ES stubs into `apps/site/src/content/{en,es}/components/` with real `translationSourceHash` values — never the 64-zero placeholder that caused `I18N-005`.      | D3                       |
| FOUND-007 | M    | Route generators for `/components/[name]/`, `/blocks/[name]/`, `/templates/[name]/`, satisfying REG-007's one-deliverable-one-route invariant in both locales.                                                                                       | FOUND-002                |
| FOUND-008 | S    | Extend `CLASS_PREFIXES`; add the new gates to `ci.yml` and to `phase1-gate.ts` §9 alongside the existing RECIPE-001..006 assertions.                                                                                                                 | D5, FOUND-004, FOUND-005 |

**Estimated size: 15–20 person-days.** Partly parallelizable: FOUND-002 is on the critical
path for four others.

### 4.1 Exit criteria for Phase 0

- `registry:build` emits component/block/template arrays and manifests deterministically.
- `pnpm run component:catalog-audit` runs and reports 0/21 without error.
- `pnpm run block:catalog-audit` runs and reports 0/36 without error.
- A scaffolded component doc pair passes `translation:check` as `draft` with a real hash.
- `git diff --exit-code` is clean after `pnpm build` (BUILD-001 guard still holds).

---

## 5. Phase 1 — Component vertical slice (3 items)

Mirror `VS-001/002/003`. Prove the entire chain on three items covering distinct shapes
before any fan-out, for the same reason §9.1 forbade bulk primitive work before `VS-004`.

| Order | Item                | Size | Shape proven                                            | Why this one                                                                                                    |
| ----: | ------------------- | ---- | ------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
|     1 | **COMP-001 Button** | M    | Variants + compound variants                            | The only item that already declares a component deliverable in its package metadata. Highest block fanout (30). |
|     2 | **COMP-002 Input**  | M    | Greenfield — no existing wrapper or contract definition | Proves the from-scratch path early, when it is cheap to change. Fanout 26.                                      |
|     3 | **COMP-006 Dialog** | L    | Compound, multi-slot, overlay, focus management         | Contract-backed. Exercises the recipe schema's slot-ownership and `consumer`/`adapter` exception mechanisms.    |

Deliberately _not_ in the slice: `COMP-015 Switch`. It
proves less than Input does (no greenfield path) and has fanout 10 against Input's 26.

Each item closes the full §8.2 DoD: canonical recipe definition → three emitted outputs →
CLI plan/add/verify/diff/update → EN+ES docs and examples → accessibility evidence →
source preview → theme previews across the four presets. Advance the §11 ratchet 0→1→2→3.

**Gate: do not start Phase 2 until COMP-006 passes `component:catalog-gate`.**

**Estimated size: ~3 weeks** (M + M + L).

---

## 6. Phase 2 — Component fan-out (18 items)

### 6.1 Ordering principle

Order by **block fanout descending**, not by implementation cost. §2.1 shows the block
catalog is gated on a handful of high-fanout components; sequencing by cost would leave
`COMP-003 Field` (fanout 20) and `COMP-016 Combobox` (fanout 19) until last and delay 31
of 36 blocks. The single hard ordering constraint inside the queue is
`COMP-003 Field` ← `COMP-002 Input`, satisfied by the Phase 1 slice.

### 6.2 Recommended order

Fanout is the number of the 36 blocks that declare the component. Cumulative unlocked
counts assume the Phase 1 slice is complete and are computed against the real manifest.
"Recipe" means a wrapper **and** a validated contract definition already exist for that
scope (F6), so the styling layer is done and only the component layer is outstanding.

| Step | Item                     | Recipe + contract? | Fanout | Blocks unlocked (cum.) |
| ---: | ------------------------ | ------------------ | -----: | ---------------------: |
|    4 | COMP-004 Card            | no                 |     30 |                      0 |
|    5 | COMP-005 Alert           | yes                |     30 |                      0 |
|    6 | COMP-003 Field           | no                 |     20 |                      1 |
|    7 | COMP-010 Toast           | yes                |     18 |                      4 |
|    8 | COMP-007 Select          | yes                |     21 |                      4 |
|    9 | COMP-008 Dropdown Menu   | yes (`menu`)       |     14 |                      5 |
|   10 | COMP-021 Pagination      | no                 |     13 |                      6 |
|   11 | COMP-017 Popover         | yes                |     12 |                      7 |
|   12 | COMP-016 Combobox        | no                 |     19 |                      8 |
|   13 | COMP-012 Avatar          | no                 |     11 |                     10 |
|   14 | COMP-013 Checkbox        | yes                |     18 |                     14 |
|   15 | COMP-009 Tabs            | yes                |     16 |                     17 |
|   16 | COMP-015 Switch          | yes                |     10 |                     24 |
|   17 | COMP-020 Breadcrumb      | no                 |      8 |                     30 |
|   18 | COMP-011 Tooltip         | yes                |      3 |                     33 |
|   19 | COMP-014 Radio Group     | no                 |      2 |                     35 |
|   20 | COMP-019 Navigation Menu | no                 |      1 |                     36 |
|   21 | COMP-018 Sheet           | no                 |      0 |                     36 |

Steps 1–3 are the Phase 1 slice (Button, Input, Dialog).

### 6.3 Parallelization

The order above is a priority queue, not a serial chain. After the slice, the only
dependency among the 18 is none at all — `COMP-003`'s prerequisite is already met. So with
_n_ streams, take the next _n_ rows. Preserve the ordering across streams so that the
unlock curve is not sacrificed: a stream that finishes early should pull the next row down,
not a cheaper row further along.

Two sub-groups are worth keeping together for cache and review coherence:

- **Recipe-backed group** (steps 5, 7, 8, 9, 11, 14, 15, 16, 18 — nine items): the recipe
  wrapper and its contract definition both already exist and validate (F6), so the styling
  layer is done. Only the component layer is outstanding: docs, registry entry, CLI
  wiring, and tests. Cheaper than the estimate in §6.4 implies.
- **Greenfield group** (steps 4, 6, 10, 12, 13, 17, 19, 20, 21 — nine items): contract
  definition, wrapper, `CLASS_PREFIXES` entry (D5), and docs all new.

### 6.4 Estimated size

10 × M + 8 × L ≈ **100 person-days ≈ 20 person-weeks**; roughly 5 calendar weeks across
four streams.

---

## 7. Phase 3 — Blocks (36 items)

### 7.1 Overlap with Phase 2 is limited, and back-loaded

Per §6.2's cumulative column, block availability is:

| After component step | Blocks unlocked |
| -------------------: | --------------: |
|                    5 |               0 |
|                    6 |               1 |
|                   12 |               8 |
|                   14 |              14 |
|                   16 |              24 |
|                   17 |              30 |
|                   20 |              36 |

So Phase 3 can begin in earnest around component step 14 and reach full breadth at step 20.
Starting blocks earlier than step 12 yields at most 8 candidates and risks building against
components that are still churning.

### 7.2 Sequence

1. **BLOCK-000B (S)** — manifest validator, D4 structured states, D6 `COMP-042`
   resolution applied across all 36 entries. Land during Phase 0, not here.
2. **Pilot blocks**, chosen for shape coverage against real availability. Under §6.2's
   order the earliest unlock step per block is fixed, so the pilot set is constrained:

   | Pilot | Block                                 | Deps | Unlocks at step | Shape proven                                  |
   | ----: | ------------------------------------- | ---: | --------------: | --------------------------------------------- |
   |     1 | `BLOCK-AUTH-01 Sign In`               |    4 |               6 | Form, validation, error and restricted states |
   |     2 | `BLOCK-BILLING-03 Invoice History`    |    7 |              12 | Data display, empty and loading states        |
   |     3 | `BLOCK-SHELL-03 Notifications Center` |   11 |              16 | Application shell, embedded preview           |

   Run pilots 1 and 2 at component step ~14 rather than at their earliest unlock, so the
   components they depend on have stopped churning (R3). Pilot 3 cannot start before
   step 16 — **no application-shell block unlocks earlier.** Command Palette
   (`BLOCK-SHELL-02`) unlocks at step 19 and Navigation Layout (`BLOCK-SHELL-01`) at
   step 20, so the shell shape is necessarily the last of the three to be proven.
   Sequence the shell-heavy categories accordingly.

3. **Fan out** the remaining 33 across the 12 categories, splitting each `WP` into
   reviewable tasks per §1.2. Prefer completing a category (3 blocks) per stream so the
   §9.3 "three or more per category" G4 requirement lands incrementally.

Every block must implement all four required states plus full-page **and** embedded
previews per §8.3, and must declare its data boundary explicitly.

### 7.3 Highest-dependency blocks to schedule last

`BLOCK-CONTENT-03 Content Workflow` (16 deps), `BLOCK-AI-02 Prompt Studio` (13),
`BLOCK-AI-03 Workflow Builder` (13), `BLOCK-OBS-03 Alert Configuration` (12),
`BLOCK-RESOURCE-03 Resource Creator` (12), `BLOCK-CONTENT-02 Content Library` (12).

### 7.4 Estimated size

36 × ~4 days ≈ **144 person-days ≈ 29 person-weeks**. The per-item figure is the least
certain number in this document: no `WP` row in §9.3 has been split yet, so 4 days is an
assumption, not an estimate.

---

## 8. Phase 4 — Templates (29 unique / 32 placements)

### 8.1 TPL-000 is unblocked now

`TPL-000`'s dependencies — `CLI-008` and `BLOCK-000` — are both complete. It is a manifest
and approval exercise, so **start it in parallel with Phase 0.** It must assign per
template: stack (exactly one of SolidStart, TanStack Start Solid, Vite + Solid Router),
required blocks, deployment target, auth model, and portfolio tags.

### 8.2 Template sequencing cannot be computed yet

Unlike blocks, there is no machine-readable template manifest, so no `requiredBlocks` edges
exist to sequence against. Until `TPL-000` lands, the template order is unknown. Treat
"produce the same fanout table for templates that §6.2 gives for components" as an explicit
`TPL-000` deliverable — it is cheap to add while authoring the manifest and expensive to
reconstruct later.

### 8.3 Existing assets

`templates/vite-solid-router/` and `templates/tanstack-start-solid/` exist with
`template.json` (`{name, stack, description, variables, generatedFiles, notes}`), and
`packages/cli/src/create/materialize.ts` already handles variable substitution
(`ALLOWED_VARIABLES = {projectName}`), exclusions, foreign-lockfile refusal with rollback,
`workspace:*` rewriting, and repo-local tsconfig stripping. These are `CLI-007`
deliverables — they prove the materializer, and are not `TPL-*` catalog entries (§9.4).

The two existing trees are the reference layout for all 29.

### 8.4 Per-template work

Each `TPL-*` needs: a `templates/<name>/` tree with `template.json`; verified
`solidiom create --template <name>` materialization; the generated project building,
typechecking, starting, and passing smoke/a11y tests; EN+ES site content under
`apps/site/src/content/{en,es}/templates/`; screenshots; security and data assumptions;
provenance and a signed manifest; and green `solidiom create` × {npm, pnpm, Yarn, Bun} in
the `CLI-008` offline fixture.

The 32 placements come from three templates tagged "Balanced + Enterprise" in §9.4 —
`TPL-004 Multi-tenant Admin`, `TPL-007 Resource Manager`, `TPL-008 Observability Console` —
each counting twice. 29 + 3 = 32.

### 8.5 Estimated size

29 × ~4 days + manifest ≈ **121 person-days ≈ 24 person-weeks**, with the same
per-item uncertainty as blocks.

---

## 9. Effort model and critical path

```text
TPL-000 (start now, parallel) ─────────────────────────────┐
                                                           │
Phase 0 Foundations ──> Phase 1 Slice (3, sequential) ──> Phase 2 Components (18)
                                                              │        │
                                              step ~14 ───────┘        │
                                                     └──> Phase 3 Blocks (36)
                                                                       │
                                                     TPL-000 + blocks ─┴──> Phase 4 Templates (29)
```

| Phase             |  Items | Person-days | Parallelizable                             |
| ----------------- | -----: | ----------: | ------------------------------------------ |
| 0 Foundations     |      — |       15–20 | Partly (FOUND-002 is on the critical path) |
| 1 Component slice |      3 |         ~21 | No, by design                              |
| 2 Components      |     18 |        ~100 | Yes, preserve §6.2 order across streams    |
| 3 Blocks          |     36 |        ~144 | Yes, by category, from step ~14            |
| 4 Templates       |     29 |        ~121 | Yes, after TPL-000                         |
| **Total**         | **86** |    **~400** |                                            |

**~400 person-days ≈ 80 person-weeks.** Roughly 5 months with four parallel streams once
Phase 1 closes; the tail is dominated by blocks and templates, which cannot start early.

Estimates derive from §1.2's size guide (M = 3–5 d, L = 1–2 w, `WP` ≈ 4 d assumed
post-split). The `WP` assumption covers 65 of the 86 items, so total effort should be
re-derived after the first three block splits and the first three template splits produce
real numbers.

---

## 10. Risk register

| #   | Risk                                                 |                                                               Impact | Mitigation                                                                                                              |
| --- | ---------------------------------------------------- | -------------------------------------------------------------------: | ----------------------------------------------------------------------------------------------------------------------- |
| R1  | D1 decided wrong or late                             |                                           All 21 components reworked | Settle D1 before FOUND-003. One day of contract-writing against 100 person-days of exposure.                            |
| R2  | No per-layer ratchet added in Phase 0                |             §9.2/9.3/9.4 counts drift into prose exactly as §9.1 did | FOUND-004/005 ship ratchets with the gates, not after. §11's own preamble is the precedent.                             |
| R3  | Blocks started too early against churning components |                                  Rework in blocks, the largest phase | Hold Phase 3 to component step ≥ 12; pilot at ~14.                                                                      |
| R4  | `COMP-042` resolved 36 times at split time           |                                            36 inconsistent decisions | D6: resolve once in Phase 0.                                                                                            |
| R5  | Template order unknown until TPL-000                 |                                          Phase 4 cannot be scheduled | Make the template→block fanout table a TPL-000 deliverable (§8.2).                                                      |
| R6  | Generated artifacts committed stale                  |                               Recurrence of `A11Y-009` / `BUILD-001` | The BUILD-001 `git diff --exit-code` guard already exists; extend it to the new registry arrays in FOUND-002.           |
| R7  | Component docs never reach `human-reviewed`          |                    Same open state as `I18N-005`, blocking G5 not G4 | FOUND-006 emits real hashes from the start; per-item Spanish review remains a G5 concern per §8.1.2.                    |
| R8  | Recipe drift in the nine recipe-backed components    | Silent divergence between the contract definition and emitted output | `audit-recipe-drift.ts` and `recipe:emit:*:check` already exist; require both green in each component's DoD.            |
| R9  | `COMP-018 Sheet` has no consumer                     |                                        Effort with no catalog payoff | §9.2's open question: either a block is missing from the manifest or Sheet is unused. Decide during D6, not at step 21. |

---

## 11. Verification commands

Existing commands that Phase 0 must keep green, all verified present in `package.json`:

```sh
pnpm run registry:build
pnpm run recipe:contract
pnpm run recipe:emit:css:check && pnpm run recipe:emit:tailwind:check && pnpm run recipe:emit:unocss:check
pnpm run audit:recipe-parity
pnpm run audit:package-source-parity
pnpm run source:emit
pnpm run primitive:catalog-gate
pnpm run api:coverage-gate
pnpm run gate:phase1
pnpm --filter @solidiom/site run translation:check
```

New commands Phase 0 introduces, to be wired into `ci.yml` and `phase1-gate.ts` §9:

```sh
pnpm run component:catalog-gate     # FOUND-004, ratchets against §11 Components DoD column
pnpm run component:catalog-audit    # --audit-only
pnpm run component:scaffold-docs    # FOUND-006
pnpm run block:catalog-gate         # FOUND-005, ratchets against §11 Blocks column
pnpm run block:catalog-audit
```

After any verification pass, check `git status` before concluding the tree is clean —
several of the commands above write to tracked files (`registry/`, `source/` mirrors,
`packages/*/docs/accessibility/evidence.json`). Do not use a broad `git checkout -- docs/`
to clean churn; it reverts this document.

---

## 12. Definition-of-Done additions

Per-layer additions required so §8 stays machine-checkable, to be folded into
`website-tasks.md` rather than maintained here:

- **§8.2 Component** — add the D1 physical form; add "recipe definition validated by
  `recipe:contract` and all three `recipe:emit:*:check` green"; add "registry manifest
  present with per-styling-output source files."
- **§8.3 Block** — add "structured `requiredStates` present and complete"; add "every
  `componentDependencies` entry resolves to an approved §9.2 component";
  add "`proposedComponents` empty, or the amendment is recorded."
- **§8.4 Template** — add "listed in the TPL-000 manifest with `requiredBlocks` declared";
  add "appears in the `CLI-008` offline smoke matrix across four package managers."

A task row in §9.2/9.3/9.4 may only go `[x]` when the corresponding gate from §11 fails on
regression. That is §11's existing rule; these three layers have simply never had a gate to
name.
