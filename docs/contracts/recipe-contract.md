---
id: recipe-contract
title: "Canonical Recipe Contract"
sidebar_label: Recipe Contract
description: The canonical recipe definition schema, semantic vocabulary, token model, exception model, and validation rules.
doc_type: reference
audience: "Solidiom contributors, recipe emitter authors"
tags: [recipes, contract, tokens, styling, css, tailwind, unocss]
lifecycle: current
---

> **Purpose:** the normative reference for the canonical recipe contract. One definition per recipe; the CSS, Tailwind, and UnoCSS emitters generate every output from it.

**Contract version:** 1
**Status authority:** The contract and emitters are implemented; current audit, build, and parity status is tracked only in `docs/plans/consolidated-plan.md` §4 and §10.
**Task history:** `RECIPE-001..004` are recorded in `docs/plans/consolidated-plan.md` §2 and `docs/history/plans/website-m0-m3.md`.
**Authoring workflow:** `docs/contracts/recipe-authoring-guide.md`

---

## 1. Artifacts

| Artifact                                          | Purpose                                                                                                                                                                 |
| ------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `tools/recipe-contract-schema.ts`                 | Definition types, `CONTRACT_VERSION`, traversal helpers                                                                                                                 |
| `tools/recipe-contract-tokens.ts`                 | 48 canonical token identities and their per-namespace spellings                                                                                                         |
| `tools/recipe-contract-validate.ts`               | `validateRecipeDefinition()` — the rule checker                                                                                                                         |
| `tools/recipe-contract-definitions.ts`            | Canonical definitions for all shipped recipe scopes                                                                                                                     |
| `tools/recipe-contract.ts`                        | CLI: `pnpm run recipe:contract`                                                                                                                                         |
| `tools/recipe-emit-core.ts`                       | Profile-agnostic cascade resolution and token substitution shared by all three emitters                                                                                 |
| `tools/recipe-emit-css.ts`                        | CSS emitter (RECIPE-002): `pnpm run recipe:emit:css[:check]`                                                                                                            |
| `tools/recipe-emit-tailwind.ts`                   | Tailwind emitter (RECIPE-003): `pnpm run recipe:emit:tailwind[:check]`. Generated `<scope>Variants()` functions wrap `cva()` in `tailwind-merge`'s `twMerge()` — see §6 |
| `tools/recipe-emit-tailwind-utilities.ts`         | Declaration → Tailwind utility mapping table, with arbitrary-value fallback                                                                                             |
| `tools/recipe-emit-unocss.ts`                     | UnoCSS emitter (RECIPE-004): `pnpm run recipe:emit:unocss[:check]`, also generates `packages/unocss-preset/src/generated-variant-rules.ts`                              |
| `tools/audit-recipe-parity.ts`                    | Cross-profile coverage/state/exception audit (RECIPE-005): `pnpm run audit:recipe-parity`                                                                               |
| `tools/audit-package-source-parity.ts`            | `src`/`source` byte parity and export-map completeness for recipe packages (RECIPE-006) and CLI (CLI-001): `pnpm run audit:package-source-parity`                       |
| `tools/emit-package-source.ts`                    | Explicit `src/` → `source/` regeneration/check without a full build (CLI-001): `pnpm run source:emit[:check]`                                                           |
| `tests/recipe-parity/`                            | Computed-style parity harness (RECIPE-005 phase 3): `pnpm run test:recipe-parity`                                                                                       |
| `packages/runtime/src/dom/semantic-vocabulary.ts` | The attribute and state vocabulary, exported from `@solidiom/runtime`                                                                                                   |
| `packages/recipes-tailwind/src/styles/theme.css`  | The Tailwind profile's theme contract                                                                                                                                   |

These commands participate in `gate:full` §3b. Current workflow trigger policy and pass/fail status are owned by `docs/plans/consolidated-plan.md`; this contract does not claim that they run on every pull request.

## 2. Definition shape

```ts
interface RecipeDefinition {
  contractVersion: 1
  scope: string // must equal the primitive package name
  description: string
  slots: RecipeSlot[]
  variants?: RecipeVariantAxis[]
  defaultVariants?: Record<string, string>
  compoundVariants?: RecipeCompoundVariant[]
}
```

### 2.1 Slots

A slot is one `data-part`.

| Field                    | Meaning                                                              |
| ------------------------ | -------------------------------------------------------------------- |
| `part`                   | The `data-part` value. Unique per definition. No selector characters |
| `element`                | Element the slot renders, for emitter checks and docs                |
| `ownership`              | `recipe`, `consumer`, or `adapter` — see §5                          |
| `ownershipReason`        | Required unless ownership is `recipe`                                |
| `adapterPort`            | Required when ownership is `adapter`                                 |
| `adapterOwnedProperties` | Properties the adapter controls, exempt from parity                  |
| `base`                   | Unconditional declarations                                           |
| `states`                 | Keyed by a `data-state` value legal for the scope                    |
| `flags`                  | Keyed by a boolean flag name from the vocabulary                     |
| `pseudos`                | Keyed by pseudo-class or pseudo-element                              |

### 2.2 Declarations

Property names are kebab-case CSS. Values are either a literal string or a token reference:

```ts
{ "border-radius": { token: "radius" }, height: "2.5rem" }
```

Declarations are canonical, **not** utility-class strings. The Tailwind emitter maps a declaration to a utility; it cannot mechanically invert `bg-primary/90` back into a declaration. This means the Tailwind profile's hand-written class strings become generated output, and some hand-tuned visual output will change.

### 2.3 Variants

An axis maps each value to **per-slot** declarations, so a root-level variant can restyle a child part by naming it:

```ts
{ name: "size", values: { icon: { root: { width: "2.5rem" }, thumb: { width: "1rem" } } } }
```

When a pseudo declaration differs by variant, use the long form on that part. `base` applies whenever the variant matches; `pseudos` stays on the same part, so all output forms can emit the interaction without an ancestor selector:

```ts
{
  name: "variant",
  values: {
    default: {
      root: {
        base: { "background-color": { token: "primary" } },
        pseudos: { ":hover": { "background-color": { token: "primary-hover" } } },
      },
    },
  },
}
```

`defaultVariants` must name a declared value on every declared axis, or emitters cannot resolve an unspecified value.

### 2.4 Compound variants

Constrain two or more axes. Applied after single-axis variants, in declaration order, last match winning. All emitters must apply that order or the outputs diverge. Duplicate conditions and unreachable conditions are rejected rather than resolved silently.

## 3. Semantic vocabulary

Exported from `@solidiom/runtime`. Fourteen attributes:

| Attribute                         | Values                                                                            |
| --------------------------------- | --------------------------------------------------------------------------------- |
| `data-scope`                      | Primitive package name                                                            |
| `data-part`                       | Part name                                                                         |
| `data-state`                      | Per-scope; 35 known scopes (33 stateful, Badge/Toast stateless) in `SCOPE_STATES` |
| `data-orientation`                | `horizontal`, `vertical`                                                          |
| `data-side`                       | `top`, `right`, `bottom`, `left` — set directly by positioned overlays            |
| `data-size`                       | `sm`, `base`, `lg` — composite scopes only                                        |
| `data-disabled` … `data-selected` | The 8 boolean flags; present or absent, never `="false"`                          |

`SCOPE_STATES` is descriptive: every entry was read from the primitive that emits it. Adding a state to a primitive without declaring it here fails `tools/recipe-contract-vocabulary.test.ts`.

`data-value` is **not** in the vocabulary. The previous hand-maintained audit allowlist permitted it even though `applySemanticAttrs` cannot emit it.

### 3.1 Recorded vocabulary exceptions

Nine scope/state pairs conflate a state with a boolean flag or encode a compound value. They stay legal so current primitives validate, and each names the primitive task that resolves it — see `VOCABULARY_EXCEPTIONS`.

| Scope                               | State                       | Problem                                                            |
| ----------------------------------- | --------------------------- | ------------------------------------------------------------------ |
| `date-picker`                       | `disabled`                  | Duplicates the `data-disabled` flag                                |
| `date-picker`, `data-table`, `tree` | `selected`                  | Duplicates the `data-selected` flag                                |
| `data-table`, `tree`                | `unselected`                | Negative form of a flag                                            |
| `data-table`                        | `sorted-asc`, `sorted-desc` | Compound value; a `data-sort-direction` attribute would be cleaner |
| `progress`                          | `loading`                   | Duplicates the `data-loading` flag, with a different meaning       |

The UnoCSS preset resolves the flag collisions by keeping the bare variant on the flag (`uiSelected` → `[data-selected]`) and namespacing the state (`uiStateSelected` → `[data-state='selected']`). When the owning primitives stop emitting a flag as a state, the namespaced variants disappear on their own.

## 4. Token model

Token **identity** is canonical and shared; token **mechanism** is profile-local.

| Namespace  | Mechanism                                                         | Defined in                                                                         |
| ---------- | ----------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| `css`      | `var(--ui-<token>, <fallback>)`                                   | `packages/recipes-css` stylesheets, generated by `tools/recipe-emit-css.ts`        |
| `tailwind` | Theme colour/radius/shadow names                                  | `packages/recipes-tailwind/src/styles/theme.css` (hand-maintained until THEME-003) |
| `unocss`   | `var(--ui-<token>, <fallback>)` — same runtime namespace as `css` | `packages/recipes-unocss` stylesheets, generated by `tools/recipe-emit-unocss.ts`  |
| `site`     | `--sol-*`                                                         | `apps/site/src/assets/tokens.css` (BRAND-002)                                      |

A recipe references an identity; the emitter substitutes the spelling. `null` in a token's `namespaces` map means that namespace genuinely cannot express the identity — a gap RECIPE-002/003/004 or THEME-002/003/004 must close, not an oversight. `pnpm run recipe:contract` reports which identities each namespace cannot express for every definition. RECIPE-002/003/004 closed every `css`/`tailwind`/`unocss` gap that existed while the emitters were pending; only `site` gaps remain, owned by BRAND-002/THEME-002.

Values, light/dark pairs, contrast validation, and migration remain THEME-001..005. This contract owns identities only.

### 4.1 The Tailwind theme contract

Before RECIPE-001 the Tailwind recipes referenced theme names defined **only** in `apps/docs/src/styles.css`, which `CUT-003` deletes. `packages/recipes-tailwind/src/styles/theme.css` registers every Tailwind v4 `@theme` token the Tailwind emitter's output references — colours, corner radii, and shadows — resolving from the shared `--ui-*` namespace, with fallbacks matching `recipes-css`. `tools/recipe-contract-tokens.test.ts` sweeps every `.css` and `.tsx` source in the package and fails if a referenced theme colour is not registered, so the set stays complete without the count being asserted. Consequences:

- setting `--ui-primary` once themes both profiles;
- the two profiles agree visually with no theme installed;
- the profile no longer depends on the app being removed.

Tailwind v3 consumers have no `@theme`; they must map the same names in `theme.extend.colors`. THEME-003 generates this file from canonical theme JSON.

## 5. Exception model

Two unrelated kinds, separated:

**Composition exceptions.** A slot with `ownership: "consumer"` is styled but not rendered by the recipe wrapper — repeatable items, optional titles, consumer-supplied collection content. A reason is mandatory. This replaced `COMPOSED_PART_ALLOWLIST` in `tools/audit-recipe-dual-emission.ts` for every scope with a canonical definition; the audit now consults `ownership` first and falls back to the (now-empty) allowlist only for a scope with no definition yet.

**Adapter exceptions.** Adapters must never emit `class` or `style` (`tools/audit-adapter-styling.ts`). The genuine cases are adapter-owned inline geometry: computed coordinates from `adapter-positioning-floating-ui`, transforms from `adapter-virtualization-tanstack`. A slot with `ownership: "adapter"` names the capability port and lists `adapterOwnedProperties`, which are exempt from cross-profile parity assertions.

`tools/audit-recipe-parity.ts` (RECIPE-005) verifies both kinds of exception are genuinely honored, not merely tolerated: a `consumer`-owned slot must still be styled in every profile (the coverage rule in §6 applies to it the same as a recipe-owned slot — the exception only excuses the TSX wrapper from rendering it), and an `adapter`-owned slot's `adapterOwnedProperties` must not appear in any profile's own stylesheet ruleset for that slot.

## 6. Emitter capability matrix

The class-string form exists only for a scope with a `variants` axis (currently badge and button); every scope ships a stylesheet form. "Six artifacts" below describes the capability matrix for a scope that has both forms, not a universal per-scope count.

| Feature                     | css sheet | css class | tw sheet | tw class | uno sheet | uno class |
| --------------------------- | --------- | --------- | -------- | -------- | --------- | --------- |
| Base declarations           | ✓         | ✓         | ✓        | ✓        | ✓         | ✓         |
| Per-slot state              | ✓         | ✓         | ✓        | ✓        | ✓         | ✓         |
| Boolean flags               | ✓         | ✓         | ✓        | ✓        | ✓         | ✓         |
| Pseudo-classes              | ✓         | ✓         | ✓        | ✓        | ✓         | ✓         |
| Variant axes                | ✓         | ✓         | ✓        | ✓        | ✓         | ✓         |
| Compound variants           | ✓         | ✓         | ✓        | ✓        | ✓         | ✓         |
| Cross-part state (ancestor) | ✓         | ✗         | ✓        | shim     | ✗         | ✗         |
| Opacity-modified tokens     | shim      | shim      | ✓        | ✓        | ✓         | ✓         |
| Adapter-owned geometry      | n/a       | n/a       | n/a      | n/a      | n/a       | n/a       |

Legend: ✓ supported, `shim` expressible with extra machinery, ✗ not expressible, `n/a` owned by the adapter at runtime.

The cross-part row is why §3.2 of the authoring guide forbids ancestor-state styling: the Tailwind class-string form needs `group` plus `group-data-*`, and the UnoCSS preset appends selectors to the same element only. The contract therefore requires state on the slot that carries it, which every current primitive already supports.

**Tailwind's compound-variant row was `shim` until this fix.** `cva()` only concatenates a matched variant/size/compound's utilities in declaration order; it does not know that two of them can set the same CSS property through different Tailwind utility groups (e.g. a compound's `py-0`/`px-0` and a size's `py-2`/`px-4`), and Tailwind's compiled stylesheet orders utilities by internal group and scale value, not by the order classes appear in the `class` attribute — so the "last one wins" assumption `cva()` relies on did not hold. `tools/recipe-emit-tailwind.ts`'s generated `<scope>Variants()` function now wraps its internal `cva()` call in `tailwind-merge`'s `twMerge()`, which understands Tailwind's utility groups and resolves the conflict the way this scope's cascade-based css/unocss stylesheets already do — see `tests/recipe-parity/button.browser.test.tsx`'s `"link"+"md"` compound test, which now asserts real parity instead of documenting a gap.

**Parity is asserted on computed style over a rendered fixture, not on generated strings.** Three emitters cannot produce matching output text, so a string-diff parity rule would be permanently red or permanently disabled. RECIPE-005 implements this: `tests/recipe-parity/` renders each profile's hand-written wrapper with its own resolved stylesheet injected and compares `getComputedStyle` across profiles, covering badge and button (the two scopes with a `variants` axis) — base declarations, every variant value, every size, both compound variants, on/off and hover states. Implementing it found and fixed four real defects: a variant-accumulation bug in `renderVariantsModule` that dropped every variant's base declarations in favor of its `:hover` rule; a one-value drift in `theme.css`'s `--color-primary-hover` fallback; the compound-variant utility-ordering conflict above; and it surfaced a font-size/line-height mismatch, since fixed and described in §10.

## 7. Validation rules

`pnpm run recipe:contract`. Each rule is tagged with the authoring-guide section it enforces.

| Rule                       | Rejects                                                                                                                                                                                                     |
| -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| §3.1 backed declarations   | A variant value or declaration group with no declarations; a slot with no styling                                                                                                                           |
| §3.2 no ancestor state     | A part name containing a selector combinator                                                                                                                                                                |
| §3.3 matched coverage      | A variant or compound styling an undeclared slot                                                                                                                                                            |
| §3.4 presence states       | A `createPresence` scope where no slot styles `open` or `closed`                                                                                                                                            |
| §3.5 canonical tokens      | A token reference that is not a canonical identity                                                                                                                                                          |
| §3.6 closed vocabulary     | An unknown scope, a state not declared for the scope, a flag outside the vocabulary                                                                                                                         |
| §3.7 documented exceptions | A consumer slot with no reason; an adapter slot with no port; `adapterPort` on a recipe-owned slot                                                                                                          |
| envelope                   | Wrong `contractVersion`, missing description, no slots, duplicate slots or axes, camelCase properties, unresolvable or missing `defaultVariants`, single-axis or duplicate or unreachable compound variants |

`tools/recipe-contract-validate.test.ts` ships an invalid fixture per rule.

## 8. Authoring a definition

1. Confirm the scope is in `SCOPE_STATES`, and that the states you intend to style are declared for it.
2. Declare one slot per `data-part`, with `ownership` and a reason for anything not recipe-owned.
3. Put state on the slot that carries it. If a child needs a parent's state, the primitive must emit `data-state` on the child.
4. Reference token identities for anything a token covers; use literals only for lengths, keywords, and timing.
5. Give every variant value real declarations on at least one slot, and give every axis a default.
6. Run `pnpm run recipe:contract`.

All three profiles' recipes are now generated by their emitters (RECIPE-002/003/004) from these definitions — see `docs/contracts/recipe-authoring-guide.md` §4 for the authoring workflow of editing a definition and re-running `pnpm run recipe:emit:css|tailwind|unocss`.

## 9. Versioning

`CONTRACT_VERSION` is `1`. A change that invalidates existing definitions increments it, and the validator rejects a mismatched version rather than guessing. Definitions are JSON-representable so a version migration can be written as a data transform.

## 10. Not yet done

| Gap                                                                                            | Owner                                                                             |
| ---------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| Token values, light/dark pairs, contrast validation                                            | THEME-001..005                                                                    |
| `SemanticAttrsOptions["state"]` narrowed from `string` to per-scope unions                     | needs a sweep across 52 primitives; the vocabulary guard test covers it meanwhile |
| `site` namespace token gaps (BRAND-002's `--sol-*` set is not yet complete for every identity) | BRAND-002/THEME-002                                                               |

The RECIPE-005 audit surfaces and RECIPE-006 package/source parity mechanism are described in §1 and §6 rather than listed as missing capabilities. Their current completion status is owned by `docs/plans/consolidated-plan.md`. The Tailwind compound-variant utility-ordering hazard previously listed here is fixed — see §6. The Tailwind `font-size`/`line-height` hazard previously listed here is also fixed: `tools/recipe-emit-tailwind-utilities.ts`'s `fontSizeUtility` emits the arbitrary `text-[<size>]` form (which sets `font-size` alone) unless the declaration group also declares a `line-height` for the named step's bundled value to be overridden by. It is guarded at two levels — an exhaustive sweep over every definition in `tools/recipe-emit-tailwind-utilities.test.ts`, and a computed-style assertion in `tests/recipe-parity/button.browser.test.tsx` that the Tailwind profile adds no line-height of its own.

Note that cross-profile **computed** `line-height` (and therefore `height` under `height: auto`) is not a meaningful parity assertion in the current harness: `tests/recipe-parity/globalSetupTailwind.ts` compiles the Tailwind profile with `@import "tailwindcss"`, which includes Preflight and its `line-height: 1.5`, whereas the `css` and `unocss` profiles inject only their own recipe stylesheet and inherit `line-height: normal`. That residual difference is a base-reset difference, not a recipe difference. Normalizing it would require the harness to neutralize Preflight, which is properly the canonical type-scale follow-up's concern — once a type scale declares `font-size`/`line-height` as paired identities, every profile declares the line-height explicitly and the base reset stops mattering.
