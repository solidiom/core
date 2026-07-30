---
id: recipe-authoring-guide
title: "Recipe Authoring Guide"
sidebar_label: Recipe Authoring
description: How to author recipes in the Solidiom recipe packages so they survive the RECIPE-001 canonical-contract migration.
doc_type: how-to
audience: "Solidiom contributors, recipe authors"
tags: [recipes, css, tailwind, unocss, authoring, styling]
lifecycle: current
---

> **Purpose:** For Solidiom contributors, shows how to author, wire, and verify recipes in `recipes-css`, `recipes-tailwind`, and `recipes-unocss` — under rules that keep the result migratable to the canonical recipe contract.

**Revised:** 2026-07-30
**Contract reference:** `docs/contracts/recipe-contract.md`
**Breakdown:** (delivered; task breakdown archived — see git history for `docs/recipe-001-canonical-recipe-contract.md`)
**Status:** interim workflow. The canonical contract, its vocabulary, its token identities, and its validator have shipped (RECIPE-001) and are enforced in CI. Recipes themselves are still hand-authored per profile until the emitters land (RECIPE-002/003/004). §3 exists so that work is a mechanical migration rather than a rewrite.

---

## 1. What changes, and what that means for you today

RECIPE-001 defines one canonical recipe definition — slots, variants, states, compound variants, tokens, exceptions — from which all three profiles are generated. Until its emitters land you still write CSS and TSX by hand, but **the rules in §3 are already binding**, because a recipe that violates them cannot be expressed in the contract and will have to be rewritten instead of migrated.

| Concern           | Today                              | After RECIPE-002/003/004                              |
| ----------------- | ---------------------------------- | ----------------------------------------------------- |
| Source of truth   | Hand-written CSS + TSX per profile | One definition per recipe                             |
| Profiles in scope | `recipes-css`, `recipes-tailwind`  | Plus `recipes-unocss`                                 |
| Variants          | Hand-written `cva()` class strings | Generated into both forms                             |
| Tokens            | Profile-local names                | Canonical semantic token set, profile-local mechanism |
| Parity            | File pairing only                  | Coverage plus rendered-output parity                  |

### Superseded guidance

A previous revision of this guide instructed authors to let profiles diverge in token strategy and not to introduce cross-profile contracts. **That guidance is withdrawn.** The canonical contract _is_ the cross-profile contract: `tools/recipe-contract-tokens.ts` defines 48 token identities with their per-namespace spellings, and the validator rejects a reference to anything else. See §3.5 for the replacement rule and `docs/contracts/recipe-contract.md` §4 for the model.

---

## 2. The architecture you are authoring into

### 2.1 Each profile ships two emission forms

Every recipe exists twice inside its profile, and the two forms must stay in agreement:

| Form         | File                     | Consumed as                                           |
| ------------ | ------------------------ | ----------------------------------------------------- |
| Stylesheet   | `src/styles/<name>.css`  | An imported CSS subpath; selector-based               |
| Class string | `src/recipes/<name>.tsx` | `class={...}` — a `cva()` call or a frozen string map |

`tools/audit-recipe-dual-emission.ts` exists to keep them paired. The contract will emit both forms for all three profiles — six artifacts per recipe — so anything you can express in only one form is a future migration problem.

### 2.2 Profile status

| Package                      | Recipes        | Stylesheets                      | Notes                                               |
| ---------------------------- | -------------- | -------------------------------- | --------------------------------------------------- |
| `@solidiom/recipes-css`      | 13             | 13 + `index`, `prose`, `typeset` | Mature. Tokens via `var(--ui-*, fallback)`          |
| `@solidiom/recipes-tailwind` | 13 + `typeset` | 13 + `index`, `prose`, `typeset` | Mature. `@apply` inside `@layer components`         |
| `@solidiom/recipes-unocss`   | 0              | 0                                | **Stub.** `src/index.ts` only. RECIPE-004 builds it |

Do not add recipes to `recipes-unocss` ahead of RECIPE-004 — it has no `styles/`, no `recipes/`, no styles subpath exports, and no `"solid"` export condition. Its `src/index.ts` now states this explicitly: `profileStatus = "declared"`, `implementedBy = "RECIPE-004"`, and `implementedRecipes = []`. Read `supportedPrimitives` there as declared intent (the primitive-completion gate requires all three profiles to declare a recipe-classified primitive) and `implementedRecipes` as shipped reality. The drift check reports the profile as pending rather than passing silently.

The 13 covered primitives: accordion, alert, badge, button, checkbox, dialog, menu, popover, select, switch, tabs, toast, tooltip.

### 2.3 Which checks actually run

Know which of these blocks a pull request, because they are not equivalent:

| Check                       | Command                                | Enforced in CI?                                                  |
| --------------------------- | -------------------------------------- | ---------------------------------------------------------------- |
| Canonical contract          | `pnpm run recipe:contract`             | **Yes** — `ci.yml` → `phase1-gate` job → `gate:phase1` §9        |
| Dual-emission drift         | `pnpm run audit:recipe-drift`          | **Yes** — same gate section                                      |
| Recipe-contract selectors   | `pnpm run audit:recipe-contract`       | **Yes** — same gate section (wired 2026-07-30)                   |
| Typecheck                   | `pnpm typecheck`                       | Yes                                                              |
| Build                       | `pnpm build`                           | Yes                                                              |
| Profile build + dist output | via `gate:phase1` §3, `gate:phase2` §5 | Yes (css and tailwind only)                                      |
| `src`/`source` parity       | `tests/package-source-parity`          | Yes, but its list covers **primitives only** — no recipe package |

One gap remains: nothing compares a profile's two emission forms for _coverage_, only for existence. That is how the defects in §6 shipped. RECIPE-005 closes it against the capability matrix in `docs/contracts/recipe-contract.md` §6.

#### What the selector audit actually rejects

The audit reads only `.css` files, despite its header comment mentioning TSX. Its `ALLOWED_PATTERNS` array is declared but never referenced — dead code. The real rule in `isAllowed()` is narrow:

- a line whose trimmed text starts with `.` followed by a letter **and** does not contain `[data-` → violation;
- a line whose trimmed text starts with `#` followed by a letter → violation;
- everything else passes.

So attribute selectors, state pseudo-classes, structural pseudos, pseudo-elements, and element descendant selectors all pass — but so does a great deal the contract rejects. The selector audit is the floor; `pnpm run recipe:contract` (§4.6) is the real check.

---

## 3. Authoring rules

These are the rules the RECIPE-001 validator will enforce. Follow them now.

### 3.1 Every class you emit must be defined in the same profile

A class-string recipe may only emit class names that resolve to real declarations in that profile. In the CSS profile this means a class string must reference selectors that its own stylesheet defines.

This rule exists because it was broken: `recipes-css/src/recipes/button.tsx` emits `solidiom-btn` plus eleven `solidiom-btn--*` variant classes, and none of them are defined anywhere in `packages/recipes-css`. A consumer asking for `variant="destructive"` in the CSS profile silently gets the default button. Do not add a variant axis to a class-string recipe without adding its backing declarations in the same change.

### 3.2 State goes on the part that renders it — never on an ancestor

If root state changes how a child part looks, the child part must carry its own `data-state` and be styled directly:

```css
/* Correct — the part carries its own state */
[data-scope="switch"][data-part="thumb"][data-state="on"] {
  transform: translateX(1.25rem);
}
```

```css
/* Forbidden — ancestor state styling a descendant part */
[data-scope="switch"][data-part="root"][data-state="on"] [data-part="thumb"] {
  transform: translateX(1.25rem);
}
```

The forbidden form is valid CSS and passes both audits, which is why it exists in `switch.css` in both profiles today. It is still forbidden, because the class-string form cannot express it: Tailwind would need `group` plus `group-data-[state=on]:`, and each `presetSolidiom` variant appends its selector to the same element, so UnoCSS cannot reach an ancestor at all. Requiring per-part state keeps all six artifacts expressible and matches the headless-styling rule in `docs/architecture/solid2-migration-notes.md`.

This may require the primitive to emit `data-state` on the part. That is the correct fix — add it to the primitive, do not work around it in the recipe.

### 3.3 The two forms must match in coverage, not just exist

For every recipe, the same set of slots, variants, and states must be reachable from both the stylesheet and the class string. Where a slot is deliberately left to the consumer, declare it (§3.6) rather than letting it silently differ.

Both `button.css` files currently style only the default variant while `buttonVariants` declares 6 variants × 4 sizes. That is a coverage divergence the dual-emission audit cannot see.

### 3.4 Overlay recipes must style their presence states

Any recipe for a primitive with an open/closed lifecycle — dialog, popover, tooltip, menu, toast, sheet, drawer, hover-card — must style `data-state="open"` and `data-state="closed"` on the parts that appear and disappear. None of the current overlay stylesheets do, so overlays get no enter/exit treatment from the recipe layer at all.

### 3.5 Token identity is shared; token mechanism is profile-local

This replaces the withdrawn "let profiles diverge" guidance.

- **Shared:** the semantic token _identity_ — what `primary`, `primary-foreground`, `surface-muted`, `border`, `radius` mean. The canonical set is `tools/recipe-contract-tokens.ts`; `pnpm run recipe:contract` rejects any reference outside it.
- **Profile-local:** how that identity is emitted. The CSS profile keeps `var(--ui-<token>, <fallback>)` so a stylesheet renders without a theme; the Tailwind profile keeps theme utilities (`bg-primary`, `text-muted-foreground`), registered by `packages/recipes-tailwind/src/styles/theme.css` and resolved from the same `--ui-*` namespace.

Setting `--ui-primary` once now themes both profiles. What is no longer acceptable is a recipe that invents a profile-only token, or reaches for a token in one profile with no counterpart in another without that gap being recorded. A token identity a namespace cannot express is listed as `null` in its `namespaces` map, and `pnpm run recipe:contract` prints those gaps per definition. If a recipe needs an identity the canonical set lacks, add it under a THEME-001 decision rather than locally in one profile.

### 3.6 The attribute vocabulary is closed

Use only attributes in the semantic vocabulary, exported from `@solidiom/runtime` and defined in `packages/runtime/src/dom/semantic-vocabulary.ts`:

| Attribute          | Values                                                                                                                                                                           |
| ------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `data-scope`       | The primitive package name                                                                                                                                                       |
| `data-part`        | The part name                                                                                                                                                                    |
| `data-state`       | Per-scope state value (`open`, `closed`, `checked`, `unchecked`, `on`, `off`, `active`, `indeterminate`)                                                                         |
| `data-orientation` | `horizontal`, `vertical`                                                                                                                                                         |
| Boolean flags      | `data-disabled`, `data-loading`, `data-readonly`, `data-required`, `data-invalid`, `data-placeholder`, `data-highlighted`, `data-selected` — present or absent, never `="false"` |

Two attributes sit outside the helper and are set directly by primitives: `data-side` (sheet, drawer, positioned overlays) and `data-size` (composite recipes, see §5). Both are legal in recipe CSS. RECIPE-001b decides whether they move into the helper — until then, do not invent a third such attribute.

`data-scope` must equal the primitive package imported by the TSX recipe. The dual-emission audit already enforces this, and the contract encodes it.

### 3.7 Declare composition exceptions with a reason

When a stylesheet styles a part the TSX wrapper does not render — repeatable items, optional titles, consumer-supplied collection content — add an entry to `COMPOSED_PART_ALLOWLIST` in `tools/audit-recipe-dual-emission.ts` with a reason. An undocumented divergence fails the drift check; an entry without a real reason is worse, because it hides drift.

In a canonical definition the same thing is expressed as `ownership: "consumer"` plus `ownershipReason` on the slot, and the validator rejects a missing reason. A test in `tools/recipe-contract-validate.test.ts` proves every current allowlist entry is expressible that way, so the allowlist retires when RECIPE-002/003 migrate each recipe. Keep your reasons meaningful now — they carry over verbatim.

Adapter-owned geometry is a separate exception: `ownership: "adapter"` plus `adapterPort` and `adapterOwnedProperties`. See `docs/contracts/recipe-contract.md` §5.

### 3.8 Solid 2 requirements for TSX wrappers

Wrappers are Solid 2 components and follow the same rules as primitives (see `docs/architecture/solid2-migration-notes.md`):

- Import `type JSX` from `@solidjs/web`, never from `solid-js` — `solid-js` has no `JSX` export in Solid 2. Nothing enforces this: `docs/architecture/solid2-migration-notes.md` claims a `no-jsx-from-solid-js` rule exists, but `packages/eslint-plugin-solidiom/src/rules/` contains no such rule. Check the import by hand.
- Accept and forward `class`, and accept `style` and `ref` where the part renders a DOM element. A wrapper that does not accept `class` forces consumers into invalid nesting.
- Use bare boolean prop names: `loading`, `disabled`, `pressed` — never `isLoading`.
- No `asChild`. Solid has no `cloneElement`. Export a variants function for composition instead.
- Do not destructure props; read `props.x` in render expressions.

---

## 4. Adding a recipe

Six touchpoints per profile. Miss any one and the build still succeeds while consumers get an import error, missing styles, or a wrong registry entry.

### 4.1 Pick the scope name

Kebab-case, equal to the primitive package name. Check what exists:

```sh
grep -rh 'data-scope=' packages/recipes-css/src/styles/ | sort -u
```

### 4.2 Stylesheet — `src/styles/<name>.css`

CSS profile:

```css
/* @solidiom/recipes-css — <Name> */
[data-scope="<name>"][data-part="root"] {
  color: var(--ui-fg, hsl(222 47% 11%));
  border-radius: var(--ui-radius, 0.375rem);
}

[data-scope="<name>"][data-part="root"]:hover {
  opacity: 0.9;
}

[data-scope="<name>"][data-part="root"][data-disabled] {
  opacity: 0.5;
  cursor: not-allowed;
}
```

Tailwind profile — same selectors, `@apply` inside `@layer components`:

```css
@layer components {
  [data-scope="<name>"][data-part="root"] {
    @apply inline-flex items-center rounded-md bg-primary text-sm;
  }
}
```

Cover every part, every state from §3.4, and every variant you expose in §4.3.

### 4.3 Class string — `src/recipes/<name>.tsx`

**With variants** — `cva`, and every emitted class must be backed per §3.1:

```tsx
import { cva, type VariantProps } from "class-variance-authority"

export const nameVariants = cva("base", {
  variants: {/* ... */},
  defaultVariants: {/* ... */},
})

export type NameVariantProps = VariantProps<typeof nameVariants>
```

**Without variants** — a frozen string map, no `cva()` call:

```tsx
export const name = {
  entry1: "classes",
  entry2: "classes",
} as const

export type NameKey = keyof typeof name
```

A frozen map is a property read rather than a function call at every usage site. Reach for `cva` only when you genuinely have variant axes.

If the recipe also ships a styled wrapper component, follow §3.8.

### 4.4 Wire the four in-package touchpoints

1. `src/styles/index.css` — add `@import "./<name>.css";`
2. `package.json` `exports` — add `"./styles/<name>.css": "./dist/styles/<name>.css"`
3. `src/index.ts` — re-export the recipe symbols. **Both profiles** have a TS entry point; this is not Tailwind-only.
4. `src/meta.ts` — add the primitive to `supportedPrimitives`.

### 4.5 Rebuild so `source/` and the registry stay correct

`source/` is a build artifact produced by the tsup `onSuccess` hook (`src` → `source`), but for the recipe packages it **is tracked in git** — 31 files in `recipes-css`, 32 in `recipes-tailwind`. Never hand-edit it; rebuild it and commit the result.

This matters beyond tidiness: `detectStylingOutputs()` in `tools/registry-build.ts` decides a primitive's registry `styling.outputs` by testing for `packages/recipes-*/source/recipes/<name>.tsx`. Skip the rebuild and the primitive's registry entry silently omits your profile, which propagates to the site's catalog metadata.

```sh
pnpm --filter @solidiom/recipes-css build
pnpm --filter @solidiom/recipes-tailwind build
pnpm run registry:build
```

RECIPE-006 adds recipe packages to the parity checks; `tests/package-source-parity` covers primitives only today, so this step is currently unverified by CI.

### 4.6 Verify

```sh
# Canonical contract — CI-enforced
pnpm run recipe:contract

# Drift check — CI-enforced
pnpm run audit:recipe-drift

# Selector audit — CI-enforced
pnpm run audit:recipe-contract   # must print 0 violations

# Contract, vocabulary, token, and selector fixtures
pnpm exec vitest run tools/recipe-contract-validate.test.ts tools/recipe-contract-vocabulary.test.ts tools/recipe-contract-tokens.test.ts tools/audit-recipe-contract.test.ts

# Build and typecheck both profiles
pnpm --filter @solidiom/recipes-css build
pnpm --filter @solidiom/recipes-tailwind build
pnpm --filter @solidiom/recipes-css typecheck
pnpm --filter @solidiom/recipes-tailwind typecheck

# Confirm emitted output
ls packages/recipes-css/dist/styles/<name>.css
ls packages/recipes-tailwind/dist/styles/<name>.css
ls packages/recipes-css/source/recipes/<name>.tsx

# Registry reflects the new styling output
pnpm run registry:build
```

If you touched `packages/runtime/src`, rebuild it before running the tools tests — they resolve `@solidiom/runtime` through `dist/`:

```sh
pnpm --filter @solidiom/runtime build
```

Then check by hand what no tool checks yet: that both forms cover the same slots, variants, and states (§3.3). RECIPE-005 automates it.

---

## 5. Composite recipes

When a recipe styles a **subtree of arbitrary HTML** — rendered Markdown, rich text — use element descendant selectors under an attribute-scoped root:

```css
[data-scope="prose"] h1 {
  /* ... */
}
[data-scope="prose"] p {
  /* ... */
}
[data-scope="prose"] a {
  /* ... */
}
```

Differences from a granular recipe:

- no `data-part` on children — consumers do not control the inner HTML structure;
- size and density variants go on the root: `[data-scope="prose"][data-size="lg"]`;
- element descendant selectors are legal here — §3.2 forbids _ancestor-state_ selectors reaching a named part, not element styling inside a composite subtree;
- no JS export needed — consumers apply `data-scope="prose"` directly.

We use `[data-scope="prose"]` rather than the industry-conventional `.prose` because it stays inside the attribute contract, needs no plugin dependency, and matches every other recipe.

---

## 6. Known defects — do not copy these patterns

Each is real, present in `main`, and slated for repair by the RECIPE task line. `docs/recipe-contract-inventory.md` (RECIPE-001a) will be the complete list.

| Location                                                            | Defect                                                                                                                                   | Repaired by    |
| ------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- | -------------- |
| `recipes-css/src/recipes/button.tsx`                                | 11 `solidiom-btn--*` classes with no definition anywhere                                                                                 | RECIPE-002     |
| `styles/switch.css`, both profiles                                  | Ancestor-state selector styling the thumb (§3.2)                                                                                         | RECIPE-002/003 |
| `styles/button.css`, both profiles                                  | Stylesheet covers the default variant only (§3.3)                                                                                        | RECIPE-002/003 |
| `dialog.css`, `popover.css`, `tooltip.css`, `menu.css`, `toast.css` | No presence-state styling (§3.4)                                                                                                         | RECIPE-002/003 |
| `recipes-unocss`                                                    | Declared but unimplemented — now reports as pending in the drift check instead of passing silently                                       | RECIPE-004     |
| `recipes-tailwind/src/styles/alert.css`                             | Hardcodes Tailwind palette colours (`blue-50`, `red-800`) where the CSS profile uses semantic `--ui-info-*`/`--ui-error-*` tokens (§3.5) | RECIPE-003     |
| `tools/audit-recipe-contract.ts`                                    | Reads only `.css`, so class-string output is unchecked                                                                                   | RECIPE-005     |
| `tests/package-source-parity`                                       | No recipe package in its list                                                                                                            | RECIPE-006     |

---

## 7. Troubleshooting

| Symptom                                                                                     | Cause                                                    | Fix                                                                    |
| ------------------------------------------------------------------------------------------- | -------------------------------------------------------- | ---------------------------------------------------------------------- |
| Selector audit: "Class selector without data-\* qualifier"                                  | Used `.foo` in recipe CSS                                | Replace with a `[data-scope][data-part]` selector                      |
| Drift check: "CSS file has no matching TSX recipe"                                          | Added a stylesheet without its class-string form         | Add `src/recipes/<name>.tsx`, or name the file as a utility stylesheet |
| Drift check: "data-part is not rendered by ... and has no documented composition exception" | Stylesheet styles a part the wrapper does not render     | Render it, or add a reasoned `COMPOSED_PART_ALLOWLIST` entry (§3.7)    |
| Drift check: "data-scope does not match imported primitive"                                 | Scope name differs from the imported package             | Rename the scope to the package name                                   |
| `dist/styles/<name>.css` missing after build                                                | Not imported in `index.css`                              | Add `@import "./<name>.css";`                                          |
| Consumer: "Package subpath not defined"                                                     | Missing `exports` entry                                  | Add `"./styles/<name>.css": "./dist/styles/<name>.css"`                |
| Tailwind `@apply` not resolving                                                             | Rules outside `@layer components`                        | Wrap in `@layer components { … }`                                      |
| TypeScript cannot find the exported symbol                                                  | Missing re-export                                        | Add it to `src/index.ts`                                               |
| Registry `styling.outputs` missing your profile                                             | `source/` not rebuilt after adding the recipe            | Rebuild the package, then `pnpm run registry:build` (§4.5)             |
| Variant has no visual effect                                                                | Class emitted with no backing declarations               | §3.1 — add the declarations or drop the variant                        |
| Child part ignores root state                                                               | Ancestor-state selector, or the part has no `data-state` | §3.2 — emit `data-state` on the part                                   |
| Build and typecheck pass but styling is wrong                                               | Neither validates styling at all                         | Run the audits in §4.6 and hand-check coverage                         |

---

## 8. Related documents

- `docs/contracts/recipe-contract.md` — the canonical contract: schema, vocabulary, token model, exception model, capability matrix, validation rules
- `docs/architecture/solid2-migration-notes.md` — Solid 2 API rules for TSX wrappers, including headless `data-state` propagation
- `docs/plans/website-tasks.md` §7.1 — the RECIPE task line and its acceptance boundaries
- `docs/plans/typeset-plan.md` — composite-recipe precedent
