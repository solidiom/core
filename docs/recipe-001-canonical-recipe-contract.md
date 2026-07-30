---
id: recipe-001-canonical-recipe-contract
title: "RECIPE-001: Canonical Recipe Contract — Task Breakdown"
doc_type: reference
audience: "Solidiom contributors, recipe emitter authors"
tags: [recipes, contract, task-breakdown, RECIPE-001]
lifecycle: archived
date: 2026-07-30
---

# RECIPE-001: Canonical Recipe Contract — Task Breakdown

**Status:** subtasks 001a–001h delivered 2026-07-30 except 001a (inventory), which was folded into the defect tables in `docs/recipe-authoring-guide.md` §6 and `docs/recipe-contract.md` §3.1 rather than published separately
**Date:** 2026-07-30
**Contract reference:** `docs/recipe-contract.md`
**Task source:** `docs/website-tasks.md` §7.1
**Plan authority:** `docs/website-imp.md` §3 (styling outputs), §14 risk row "Generated CSS/Tailwind/UnoCSS diverge"
**Size:** L
**Depends on:** REG-003 (complete)
**Blocks:** RECIPE-002, RECIPE-003, RECIPE-004, and transitively RECIPE-005/006, all `COMP-*`, THEME-001, BLOCK-000

Task statement: _Define canonical recipe contract for semantic slots, variants, states, compound variants, scopes/parts, and adapter exceptions._

## 0. What shipped

| Subtask | Artifact                                                                  | State                                                                                                         |
| ------- | ------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| 001a    | Inventory                                                                 | Folded into the defect tables rather than published as a separate document                                    |
| 001b    | `packages/runtime/src/dom/semantic-vocabulary.ts`                         | Done — 14 attributes, 33 scopes, 9 recorded exceptions; `unocss-preset` and the selector audit derive from it |
| 001c    | `tools/recipe-contract-schema.ts`                                         | Done — `CONTRACT_VERSION` 1                                                                                   |
| 001d    | `SlotOwnership` in the schema                                             | Done — `consumer` and `adapter` exceptions; a test proves `COMPOSED_PART_ALLOWLIST` is expressible            |
| 001e    | `docs/recipe-contract.md` §6                                              | Done — six-artifact capability matrix; parity asserted on computed style                                      |
| 001f    | `tools/recipe-contract-validate.ts` + `.test.ts`                          | Done — 8 rule groups, 36 tests, one invalid fixture per rule                                                  |
| 001g    | `tools/recipe-contract-definitions.ts`                                    | Done — Button, Switch, Dialog                                                                                 |
| 001h    | `docs/recipe-contract.md`, `pnpm run recipe:contract` in `gate:phase1` §9 | Done                                                                                                          |

Additional work not in the original breakdown, found while executing it:

- `tools/recipe-contract-tokens.ts` — 50 canonical token identities with per-namespace spellings. Needed because §3.5 of the authoring guide had no artifact behind it.
- `packages/recipes-tailwind/src/styles/theme.css` — the Tailwind profile's theme contract. Its theme names were defined only in `apps/docs/src/styles.css`, which `CUT-003` deletes.
- `tools/audit-recipe-contract.ts` wired into `gate:phase1`; its dead `ALLOWED_PATTERNS` replaced by the derived vocabulary.
- `packages/recipes-unocss/src/index.ts` now declares `profileStatus`/`implementedBy`/`implementedRecipes`, and the drift check reports it as pending instead of passing silently.

---

## 1. Why this is a reconciliation task, not a greenfield design

RECIPE-001 cannot be authored in isolation. Four places in the repository already define parts of the styling vocabulary independently, and they disagree.

| Source                                               | What it defines today                                                                                                                                                                           | Problem for a single contract                                                                                                               |
| ---------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| `packages/runtime/src/dom/semantic-attrs.ts`         | `data-scope`, `data-part`, free-form `data-state`, `data-orientation`, and 8 boolean flags (`disabled`, `loading`, `readonly`, `required`, `invalid`, `placeholder`, `highlighted`, `selected`) | `state` is typed `string` — there is no per-scope enum, so no validator can reject `"escape"` vs `"escape-key"`-class typos                 |
| `packages/unocss-preset/src/index.ts`                | 11 variants (`uiOpen`, `uiClosed`, `uiChecked`, `uiUnchecked`, `uiActive`, `uiDisabled`, `uiHighlighted`, `uiSelected`, `uiRequired`, `uiInvalid`, `uiPlaceholder`)                             | Missing `readonly`, `loading`, `orientation`, `side`; adds `uiActive`/`uiUnchecked` that have no boolean-flag counterpart                   |
| `tools/audit-recipe-contract.ts`                     | 24 allowed selector patterns                                                                                                                                                                    | Allows `[data-side]` and `[data-value]`, which `applySemanticAttrs` cannot emit; only scans `.css`, so all class-string output is unaudited |
| `tools/registry-build.ts` → `detectStylingOutputs()` | `styling.outputs` per primitive in registry v2                                                                                                                                                  | Derived purely from `packages/recipes-*/source/recipes/<name>.tsx` file existence — a stub file counts as a shipped output                  |

### 1.1 Existing surface

Both mature profiles carry the identical 13-primitive inventory: accordion, alert, badge, button, checkbox, dialog, menu, popover, select, switch, tabs, toast, tooltip — one `src/recipes/<name>.tsx` and one `src/styles/<name>.css` each, plus shared `index.css`, `prose.css`, `typeset.css` (and a Tailwind-only `recipes/typeset.tsx`).

`packages/recipes-unocss` has `src/index.ts` only: 20 lines declaring `recipeProfile` and a `supportedPrimitives` array of the same 13 names, with no `src/recipes/` or `src/styles/` directory.

### 1.2 Each profile emits two forms, not one

This is the structural fact the contract must be shaped around. Every profile ships:

- a **stylesheet form** — `src/styles/<name>.css`, selector-based, consumed by importing the CSS subpath;
- a **class-string form** — `src/recipes/<name>.tsx`, either a `cva()` call or a frozen string map, consumed as `class={...}`.

`tools/audit-recipe-dual-emission.ts` exists specifically to keep these two forms paired. So the contract produces **2 forms × 3 profiles = 6 emitted artifacts**, and the capability matrix in §3.5 must be expressed per form, not per profile. The two forms are not equally expressive, which is where most of the drift below comes from.

### 1.3 Confirmed drift the contract must resolve

**Variant axes exist only in the class-string form.** `buttonVariants` in both profiles declares 6 variants × 4 sizes with `defaultVariants`. Neither `packages/recipes-css/src/styles/button.css` nor `packages/recipes-tailwind/src/styles/button.css` contains any variant selector — both style `[data-scope="button"][data-part="root"]`, its `:hover`, and `[data-disabled]` only. The stylesheet form silently implements the default variant and nothing else.

**The CSS profile's variant classes have no definition anywhere.** `packages/recipes-css/src/recipes/button.tsx` emits `solidiom-btn`, `solidiom-btn--default`, `--destructive`, `--outline`, `--secondary`, `--ghost`, `--link`, `--sm`, `--md`, `--lg`, `--icon`. Grepping `solidiom-btn` across `packages/recipes-css/src` matches only that file. Every one of those classes is dead — a consumer selecting `variant="destructive"` in the CSS profile gets the default button.

**Cross-part state works in the stylesheet form and cannot work in the class-string form.** `styles/switch.css` in both profiles ends with an ancestor selector — root `[data-state="on"]` styling the descendant `[data-part="thumb"]` (`translateX`). That is valid CSS and passes both audits. The class-string form has no equivalent: Tailwind needs `group` + `group-data-[state=on]:`, and each `presetSolidiom` variant appends its selector to the same element via its `selector` callback, so UnoCSS variants are same-element only. `docs/solid2-migration-notes.md` already mandates that every visually distinct part carries its own `data-state`; the contract must make that the rule and forbid ancestor-state styling so both forms stay expressible.

**Presence states are unstyled.** No `data-state="open"` or `"closed"` rule exists in `dialog.css`, `popover.css`, `tooltip.css`, `menu.css`, or `toast.css` in either profile. Overlay open/close styling is entirely absent from the recipe layer today.

**Compound variants are new surface.** `cva()` is called exactly twice in the whole workspace (`button.tsx` in each profile) and `compoundVariants` is used nowhere. Nothing is being migrated for that part of the task — it is being introduced.

**`recipes-unocss` passes CI while claiming 13 primitives.** In `auditRecipeProfile`, when neither `styles/` nor `recipes/` exists, both inner guards are false and the function returns an empty error array. A profile with no implementation is indistinguishable from a clean one. Meanwhile the package's own `supportedPrimitives` advertises all 13 names, and `detectStylingOutputs()` correctly reports no `unocss` output — so the package metadata and the registry already contradict each other. Those counts feed MKT-002 and DOCS-005.

### 1.4 Conflict with published guidance — resolved 2026-07-30

`docs/recipe-authoring-guide.md` previously instructed the opposite of what RECIPE-001 requires, under "Token strategy: don't invent cross-profile contracts":

> Each profile consumes its own existing tokens … Do not create a shared `--text-foreground` or `--font-serif` token unless a design system decision demands it. Let profiles diverge in implementation while converging in visual output.

A canonical contract with a declared token surface **is** that design-system decision. The guide has been revised to withdraw that guidance and replace it with the split now recorded in its §3.5: token _identity_ is canonical and shared, token _mechanism_ stays profile-local (`var(--ui-*, fallback)` for CSS, theme utilities for Tailwind). The guide also now carries the §3 authoring rules that this contract will enforce, so recipes authored before the emitters land are migratable rather than rewritable.

Consequence for 001h: the guide no longer needs a rewrite, only a pass to replace its interim hand-authoring steps (§4) with the contract-driven workflow and to delete the interim-status banner. Its §6 known-defects table should be reconciled against `docs/recipe-contract-inventory.md` from 001a rather than maintained separately.

Still outstanding: `docs/typeset-plan.md` repeats the claim that `tools/audit-recipe-contract.ts` fails CI. It does not — see §1.5. Correct it when typeset work next touches that document.

### 1.5 The selector audit is not enforced — resolved 2026-07-30

Recorded because it explains how the defects in §1.3 shipped.

- `tools/audit-recipe-dual-emission.ts` **was** already enforced: `ci.yml` runs the `phase1-gate` job on every pull request, and `gate:phase1` §9 executes both its negative fixtures and the drift check.
- `tools/audit-recipe-contract.ts` was **not** enforced by any workflow or gate. It now is, alongside `pnpm run recipe:contract` and the contract/vocabulary/token fixtures, in the same gate section. A `package.json` script (`audit:recipe-contract`) was added.
- Its `ALLOWED_PATTERNS` array — the 24 patterns cited in §1 — was declared and never referenced. It is deleted; the checker now derives its allowlist from `SEMANTIC_ATTRIBUTES`, so `data-value` and `data-theme` are correctly rejected.
- `tests/package-source-parity` enumerates a hardcoded primitive list and covers no recipe package, so the tracked `source/` directories in `recipes-css` (31 files) and `recipes-tailwind` (32 files) remain unverified. RECIPE-006 still owns this.

---

## 2. Scope boundary

RECIPE-001 delivers **the contract, its validator, and reference definitions — no emitted output and no package migration.**

In scope:

- a versioned, serializable recipe-definition schema;
- a single source of truth for the semantic attribute vocabulary;
- the exception model for consumer-composed parts and adapter-owned styling;
- the emitter capability matrix and the definition of parity;
- a validator with fixtures, wired into CI;
- three reference definitions used as emitter input fixtures;
- the published contract document.

Out of scope: CSS emitter (RECIPE-002), Tailwind emitter (RECIPE-003), UnoCSS emitter/preset catalog (RECIPE-004), audit extension (RECIPE-005), `src`/`source` parity checks (RECIPE-006).

Invariant: `packages/recipes-css` and `packages/recipes-tailwind` must export exactly what they export now, and build unchanged, when RECIPE-001 merges.

**Exit test for the whole task:** a reviewer can author one new recipe definition, and three different people can each write the CSS, Tailwind, and UnoCSS emitter against it without asking a follow-up question about slots, state precedence, or exception handling.

---

## 3. Subtasks

Suggested IDs `RECIPE-001a` … `RECIPE-001h`. Sizes sum to approximately L.

| ID   | Size | Depends on | Deliverable                                                          |
| ---- | ---- | ---------- | -------------------------------------------------------------------- |
| 001a | S    | —          | Inventory of the current 13-recipe × 2-profile × 2-form surface      |
| 001b | S    | 001a       | Semantic vocabulary frozen as one typed source of truth              |
| 001c | M    | 001b       | Recipe definition schema: slots, variants, states, compound variants |
| 001d | S    | 001c       | Exception model: consumer composition and adapter-owned styling      |
| 001e | S    | 001c       | Emitter capability tiers and the parity rule                         |
| 001f | M    | 001c, 001d | Schema validator plus valid/invalid fixtures                         |
| 001g | S    | 001c       | Button, Switch, and Dialog reference definitions                     |
| 001h | S    | 001b–001g  | Published contract document, guide supersession, CI wiring           |

### 3.1 RECIPE-001a — Inventory the existing surface (S)

Produce `docs/recipe-contract-inventory.md`. For each of the 13 primitives, for each of the 2 profiles, for each of the 2 emission forms, record: `data-scope`; every `data-part` styled; every `data-state` value styled; every boolean flag used; every pseudo-class used; every variant axis and its values; every token or utility referenced. Mark each CSS↔Tailwind divergence and each stylesheet↔class-string divergence.

**Acceptance:** every finding in §1.3 is enumerated with a `file:line` reference, including the full dead-class list, every ancestor-state selector, and every primitive with unstyled presence states. This document is the migration checklist RECIPE-002 and RECIPE-003 work from — without it, "without behavior drift" in RECIPE-002 has nothing to be measured against.

### 3.2 RECIPE-001b — Freeze the semantic vocabulary (S)

One exported module — recommend `packages/runtime/src/dom/semantic-vocabulary.ts`, re-exported from `@solidiom/runtime` — enumerating the legal boolean flags, the legal `data-state` values **per scope**, `data-orientation`, and `data-side`. Narrow `SemanticAttrsOptions["state"]` from `string` to the scope's union where the scope is statically known.

Then make the three existing consumers derive from it instead of hardcoding their own list:

1. `getSolidiomVariants()` in `packages/unocss-preset/src/index.ts`;
2. `ALLOWED_PATTERNS` in `tools/audit-recipe-contract.ts`;
3. the definition schema from 001c.

Decisions to settle here:

- **`data-side` and `data-value`.** The audit allows them; `applySemanticAttrs` cannot emit them. Sheet and Drawer set `data-side` directly per `docs/solid2-migration-notes.md`. Either extend the helper to emit them or record them as primitive-set attributes outside the helper — but pick one and state it.
- **`readonly` and `loading` have no UnoCSS variant.** Either add `uiReadonly`/`uiLoading` to the preset or record the omission as an explicit, tested exception.
- **`uiActive` and `uiUnchecked` have no flag counterpart.** They are `data-state` values (`tabs` trigger `active`, `checkbox` `unchecked`), so the per-scope state enums must legitimize them or the preset must drop them.

**Acceptance:** exactly one file lists each attribute name; every boolean flag either has a preset variant or a recorded exception; `pnpm exec tsx tools/audit-recipe-contract.ts` still reports 0 violations.

Fold in one small fix while here: make `auditRecipeProfile` treat a profile with neither `styles/` nor `recipes/` as an error or as an explicit "declared, unimplemented" state, so `recipes-unocss` stops reporting green (§1.3). Alternatively truncate its `supportedPrimitives` to `[]` until RECIPE-004 lands. Leaving it as-is means RECIPE-005 inherits a known-false pass.

### 3.3 RECIPE-001c — Recipe definition schema (M)

The core artifact: a versioned, JSON-representable TypeScript type carrying `contractVersion` for migration. Minimum fields:

| Field              | Purpose                                                                                                                                              |
| ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `scope`            | Must equal the imported primitive package name — the existing dual-emission audit already enforces this relationship, so the schema should encode it |
| `slots`            | Keyed by `data-part`; each declares element type, ownership (see 001d), and base declarations                                                        |
| `variants`         | Named axes with values, resolved **per slot** so a root variant can restyle a child part without an ancestor selector                                |
| `defaultVariants`  | Must resolve to a reachable combination                                                                                                              |
| `states`           | Per-slot reactive selectors, restricted to the 001b vocabulary                                                                                       |
| `compoundVariants` | With a defined precedence order so all six emitted artifacts resolve conflicts identically                                                           |
| `tokens`           | The custom properties the recipe reads, so THEME-001 can validate that every referenced token exists                                                 |

Two decisions gate every downstream emitter:

**Declarations are token-referencing, not utility-class strings.** The Tailwind emitter can map declarations to utilities; it cannot reliably go the other direction (`bg-primary/90` has no mechanical CSS equivalent). This makes the hand-written class strings in `recipes-tailwind/src/recipes/*.tsx` — including button's 12-utility base string — the migration _target_, not the source. RECIPE-003's wording ("generated output must match the canonical contract") already implies accepting visual diffs on the Tailwind profile. Acknowledge that before 001g, not during it.

**Variants must resolve to real styling in every artifact.** Whichever mechanism is chosen for the stylesheet form — `[data-scope][data-part][data-variant]` attribute selectors, or generated classes emitted alongside the class-string form — the `solidiom-btn--*` dead-class situation must become structurally impossible rather than merely fixed once.

**States are per-slot; ancestor-state styling is forbidden.** Root state that affects a child part is expressed by declaring that state on the child slot, which requires the primitive to emit `data-state` on that part. This is already the documented headless-styling rule; the contract makes it enforceable and keeps the class-string form expressible.

**Acceptance:** the schema round-trips through `JSON.stringify`/`parse` without loss; `contractVersion` is present; every field carries a doc comment naming which emitted artifacts consume it.

### 3.4 RECIPE-001d — Exception model (S)

The task title conflates two unrelated exception kinds. Separate them.

**Consumer-composition exceptions** — parts that are styled but not rendered by the recipe wrapper. `COMPOSED_PART_ALLOWLIST` in `tools/audit-recipe-dual-emission.ts` already holds these for 8 primitives (accordion, alert, dialog, menu, popover, select, tabs, toast) with a prose reason per part. Move them into the recipe definition as a per-slot `ownership: "recipe" | "consumer"` field with a required reason, so the allowlist stops being a parallel handwritten table. Global DoD item 8 requires exactly this.

**Adapter exceptions** — `tools/audit-adapter-styling.ts` forbids adapters from emitting `class` or `style` at all. The genuine cases are adapter-owned inline geometry: computed coordinates from `adapter-positioning-floating-ui`, transforms from `adapter-virtualization-tanstack`. Define who owns those inline styles and how a slot declares that its position or size is adapter-controlled and therefore exempt from parity assertions.

**Acceptance:** every current `COMPOSED_PART_ALLOWLIST` entry is expressible in the new field with its reason preserved; each adapter-owned slot exception names the capability port and the reason; the plan's requirement that "adapter-specific exceptions must be explicit and tested" is satisfiable by a test rather than by prose.

### 3.5 RECIPE-001e — Capability tiers and the parity rule (S)

Define what parity means before three emitters exist. The six artifacts are not equally expressive: the stylesheet forms can express arbitrary selectors; the Tailwind class-string form needs `group-data-*` for anything cross-element; the UnoCSS class-string form is same-element only via `presetSolidiom`.

Deliverable: a capability matrix of feature × artifact × `supported | shimmed | unsupported`, plus the rule for what parity is asserted on. Recommend computed-style equivalence on a rendered fixture rather than string comparison of generated output — three emitters can never produce matching strings, so a string-diff parity rule would be permanently red or permanently disabled.

**Acceptance:** RECIPE-005 can be written directly against this matrix without redefining parity; every `unsupported` cell names its shim or its documented exception.

### 3.6 RECIPE-001f — Validator and fixtures (M)

A validator — recommend `tools/recipe-contract.ts` with a colocated `.test.ts`, matching the existing tools layout — that rejects:

- a `data-part` not declared in the scope's slot set;
- a `data-state` value outside that scope's enum from 001b;
- any ancestor or descendant state selector;
- a token reference not present in the theme token set;
- an unreachable compound variant;
- a `defaultVariants` combination that does not resolve;
- a slot styled but marked `ownership: "consumer"` without a reason.

Ship an invalid fixture per rule alongside the valid ones.

**Acceptance:** fixture-driven tests cover every rule; the validator runs standalone via `pnpm exec tsx tools/recipe-contract.ts` and exits non-zero on violation.

### 3.7 RECIPE-001g — Reference definitions (S)

Three definitions, chosen to exercise the schema rather than for coverage:

| Primitive | Why                                                                                                                      |
| --------- | ------------------------------------------------------------------------------------------------------------------------ |
| Button    | The only real variant surface (6 × 4 with defaults) and the dead-class case from §1.3                                    |
| Switch    | The cross-part state case — root `data-state="on"` restyling the thumb — that the class-string form cannot express today |
| Dialog    | Multi-slot with presence states plus an existing consumer-composition exception (`close`)                                |

Definitions only; not wired into package exports, not emitted. These are the input fixtures RECIPE-002/003/004 emit from, which is how "one definition, three outputs" gets proven rather than asserted.

**Acceptance:** all three validate clean; each references the `docs/recipe-contract-inventory.md` line for the specific defect it now expresses correctly.

### 3.8 RECIPE-001h — Publish, supersede, gate (S)

Write `docs/recipe-contract.md`: schema reference, semantic vocabulary table, capability matrix, exception model, authoring walkthrough, versioning and migration policy.

Rewrite `docs/recipe-authoring-guide.md` to point at the contract as the authoring entry point. Its token guidance was already aligned on 2026-07-30 (§1.4), so the remaining work is narrower than originally scoped: replace its interim hand-authoring steps (§4) with the contract-driven workflow, delete the interim-status banner and the "what changes" table in its §1, fold its §6 known-defects table into `docs/recipe-contract-inventory.md`, and demote its `cva`-vs-frozen-map advice to emitter implementation detail. Its §3 authoring rules should survive as the contract's authoring summary — they were written to match this schema.

Add the validator to CI over the reference definitions.

**Acceptance:** CI fails on an intentionally invalid definition; `pnpm --filter @solidiom/recipes-css build` and `pnpm --filter @solidiom/recipes-tailwind build` still pass; no file under `packages/recipes-*` changed behavior; `docs/recipe-authoring-guide.md` contains no instruction that contradicts the contract.

Note for later, not now: `docs/` prose is CC BY 4.0 per GOV-001, and this document is the source for the public Styling guide (MKT-003) and the `COMP-*` DoD reference. It needs the bilingual treatment when it becomes site content under CONTENT-002, not during RECIPE-001.

---

## 4. Sequencing

```text
001a ─→ 001b ─→ 001c ─┬─→ 001d ─┬─→ 001f ─┐
                      ├─→ 001e ──┤        ├─→ 001h
                      └─→ 001g ───────────┘
```

001d, 001e, and 001g are parallelizable once 001c lands. 001f needs 001d because the ownership field is one of the validated rules.

## 5. Decisions required before 001c — all settled 2026-07-30

1. **Canonical declaration form** — settled: token-referencing declarations. Tailwind output becomes generated and some hand-tuned visual output will change (§3.3, `docs/recipe-contract.md` §2.2).
2. **`data-side` / `data-value` ownership** — settled: `data-side` and `data-size` are legal vocabulary attributes set directly by primitives; `data-value` is **removed** from the allowlist because `applySemanticAttrs` cannot emit it.
3. **UnoCSS variant completeness** — settled: variants are generated from the vocabulary, so `uiReadonly` and `uiLoading` now exist. Flag/state collisions are namespaced (`uiStateSelected`) and recorded in `VOCABULARY_EXCEPTIONS`.
4. **Variant mechanism for the stylesheet form** — settled at the schema level: variants carry per-slot declarations, and a variant value with no declarations is a validation error, so unbacked classes are structurally impossible. The concrete selector or class spelling is each emitter's choice (RECIPE-002/003/004).
5. **Parity assertion basis** — settled: computed style over a rendered fixture, not generated-string diff (`docs/recipe-contract.md` §6).
6. **Supersession of the per-profile token guidance** — settled: token identity is canonical and shared, mechanism stays profile-local. Recorded in the guide's §3.5 and implemented in `tools/recipe-contract-tokens.ts`.

Also settled while executing: the minimal token identity list was pulled into RECIPE-001 rather than waiting for THEME-001, which owns values, light/dark pairs, and contrast.

One decision deferred with a reason: `SemanticAttrsOptions["state"]` was **not** narrowed from `string` to per-scope unions. Doing so requires a sweep across 52 primitives and risks a wide typecheck break for no gain the validator does not already provide; `tools/recipe-contract-vocabulary.test.ts` enforces the vocabulary against every call site instead.

## 6. Alignment with the task backlog

- Satisfies the RECIPE-001 acceptance boundary in `docs/website-tasks.md` §7.1 in full: semantic slots (001c), variants and compound variants (001c), states (001b, 001c), scopes and parts (001b, 001c), adapter exceptions (001d).
- Supplies the "canonical recipe contract" that Component DoD §8.2 and Block DoD §8.3 both reference.
- Leaves REG-003's `styling.outputs` detection untouched; if the emitters change the `source/recipes/<name>.tsx` path shape, `detectStylingOutputs()` must be updated in RECIPE-002/003/004, not here.
- Global DoD item 8 (no parallel handwritten metadata) is the reason `COMPOSED_PART_ALLOWLIST` moves into the definitions in 001d rather than staying a separate table.
- Global DoD item 9 (migration notes for public contract changes) applies at 001h: the vocabulary narrowing in 001b is a public `@solidiom/runtime` type change.
