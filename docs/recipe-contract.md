---
id: recipe-contract
title: "Canonical Recipe Contract"
sidebar_label: Recipe Contract
description: The canonical recipe definition schema, semantic vocabulary, token model, exception model, and validation rules.
doc_type: reference
audience: "Solidiom contributors, recipe emitter authors"
tags: [recipes, contract, tokens, styling, css, tailwind, unocss]
---

> **Purpose:** the normative reference for the canonical recipe contract. One definition per recipe; the CSS, Tailwind, and UnoCSS emitters generate every output from it.

**Contract version:** 1
**Status:** contract and validator shipped (RECIPE-001). Emitters pending (RECIPE-002/003/004).
**Task:** `docs/website-tasks.md` §7.1 RECIPE-001
**Breakdown:** `docs/recipe-001-canonical-recipe-contract.md`
**Authoring workflow:** `docs/recipe-authoring-guide.md`

---

## 1. Artifacts

| Artifact                                          | Purpose                                                               |
| ------------------------------------------------- | --------------------------------------------------------------------- |
| `tools/recipe-contract-schema.ts`                 | Definition types, `CONTRACT_VERSION`, traversal helpers               |
| `tools/recipe-contract-tokens.ts`                 | 50 canonical token identities and their per-namespace spellings       |
| `tools/recipe-contract-validate.ts`               | `validateRecipeDefinition()` — the rule checker                       |
| `tools/recipe-contract-definitions.ts`            | Button, Switch, Dialog reference definitions                          |
| `tools/recipe-contract.ts`                        | CLI: `pnpm run recipe:contract`                                       |
| `packages/runtime/src/dom/semantic-vocabulary.ts` | The attribute and state vocabulary, exported from `@solidiom/runtime` |
| `packages/recipes-tailwind/src/styles/theme.css`  | The Tailwind profile's theme contract                                 |

All are enforced by `gate:phase1` §9, which `ci.yml` runs on every pull request.

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

`defaultVariants` must name a declared value on every declared axis, or emitters cannot resolve an unspecified value.

### 2.4 Compound variants

Constrain two or more axes. Applied after single-axis variants, in declaration order, last match winning. All emitters must apply that order or the outputs diverge. Duplicate conditions and unreachable conditions are rejected rather than resolved silently.

## 3. Semantic vocabulary

Exported from `@solidiom/runtime`. Fourteen attributes:

| Attribute                         | Values                                                                 |
| --------------------------------- | ---------------------------------------------------------------------- |
| `data-scope`                      | Primitive package name                                                 |
| `data-part`                       | Part name                                                              |
| `data-state`                      | Per-scope; 33 scopes declared in `SCOPE_STATES`                        |
| `data-orientation`                | `horizontal`, `vertical`                                               |
| `data-side`                       | `top`, `right`, `bottom`, `left` — set directly by positioned overlays |
| `data-size`                       | `sm`, `base`, `lg` — composite scopes only                             |
| `data-disabled` … `data-selected` | The 8 boolean flags; present or absent, never `="false"`               |

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

| Namespace  | Mechanism                       | Defined in                                       |
| ---------- | ------------------------------- | ------------------------------------------------ |
| `css`      | `var(--ui-<token>, <fallback>)` | `packages/recipes-css` stylesheets               |
| `tailwind` | Theme colour names              | `packages/recipes-tailwind/src/styles/theme.css` |
| `site`     | `--sol-*`                       | `apps/site/src/assets/tokens.css` (BRAND-002)    |

A recipe references an identity; the emitter substitutes the spelling. `null` in a token's `namespaces` map means that namespace genuinely cannot express the identity — a gap RECIPE-002/003/004 or THEME-002/003/004 must close, not an oversight. `pnpm run recipe:contract` reports which identities each namespace cannot express for every definition.

Values, light/dark pairs, contrast validation, and migration remain THEME-001..005. This contract owns identities only.

### 4.1 The Tailwind theme contract

Before RECIPE-001 the Tailwind recipes referenced theme names defined **only** in `apps/docs/src/styles.css`, which `CUT-003` deletes. `packages/recipes-tailwind/src/styles/theme.css` now registers all 18 names as Tailwind v4 `@theme` tokens resolving from the shared `--ui-*` namespace, with fallbacks matching `recipes-css`. Consequences:

- setting `--ui-primary` once themes both profiles;
- the two profiles agree visually with no theme installed;
- the profile no longer depends on the app being removed.

Tailwind v3 consumers have no `@theme`; they must map the same names in `theme.extend.colors`. THEME-003 generates this file from canonical theme JSON.

## 5. Exception model

Two unrelated kinds, separated:

**Composition exceptions.** A slot with `ownership: "consumer"` is styled but not rendered by the recipe wrapper — repeatable items, optional titles, consumer-supplied collection content. A reason is mandatory. This replaces `COMPOSED_PART_ALLOWLIST` in `tools/audit-recipe-dual-emission.ts`; a test proves every current entry there is expressible as per-slot ownership.

**Adapter exceptions.** Adapters must never emit `class` or `style` (`tools/audit-adapter-styling.ts`). The genuine cases are adapter-owned inline geometry: computed coordinates from `adapter-positioning-floating-ui`, transforms from `adapter-virtualization-tanstack`. A slot with `ownership: "adapter"` names the capability port and lists `adapterOwnedProperties`, which are exempt from cross-profile parity assertions.

## 6. Emitter capability matrix

Six artifacts: each profile ships a stylesheet form and a class-string form.

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

**Parity is asserted on computed style over a rendered fixture, not on generated strings.** Three emitters cannot produce matching output text, so a string-diff parity rule would be permanently red or permanently disabled. RECIPE-005 implements the assertion against this matrix.

## 7. Validation rules

`pnpm run recipe:contract`. Each rule is tagged with the authoring-guide section it enforces.

| Rule                       | Rejects                                                                                                                                                                                                     |
| -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| §3.1 backed declarations   | A variant value or declaration group with no declarations; a slot with no styling                                                                                                                           |
| §3.2 no ancestor state     | A part name containing a selector combinator                                                                                                                                                                |
| §3.3 matched coverage      | A variant or compound styling an undeclared slot                                                                                                                                                            |
| §3.4 presence states       | An open/closed scope where no slot styles `open` or `closed`                                                                                                                                                |
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

Until the emitters land, hand-authored recipes must follow the same rules — see `docs/recipe-authoring-guide.md` §3. That is what makes RECIPE-002/003/004 a migration rather than a rewrite.

## 9. Versioning

`CONTRACT_VERSION` is `1`. A change that invalidates existing definitions increments it, and the validator rejects a mismatched version rather than guessing. Definitions are JSON-representable so a version migration can be written as a data transform.

## 10. Not yet done

| Gap                                                                        | Owner                                                                             |
| -------------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| CSS, Tailwind, UnoCSS emitters                                             | RECIPE-002/003/004                                                                |
| Coverage and computed-style parity assertions across six artifacts         | RECIPE-005                                                                        |
| `src`/`source` parity checks for recipe packages                           | RECIPE-006                                                                        |
| Token values, light/dark pairs, contrast validation                        | THEME-001..005                                                                    |
| `SemanticAttrsOptions["state"]` narrowed from `string` to per-scope unions | needs a sweep across 52 primitives; the vocabulary guard test covers it meanwhile |
| Definitions for the remaining 10 recipe-covered primitives                 | RECIPE-002/003                                                                    |
