---
id: typeset-plan
title: "Typeset Implementation Plan: Recipes over Primitives"
sidebar_label: Typeset Plan
description: Design and phased plan for shipping solidiom typography as recipes, not primitives.
doc_type: explanation
audience: "solidiom maintainers, recipe authors"
tags: [typeset, recipes, typography, architecture]
lifecycle: current
---

> **Purpose:** For solidiom maintainers, explains why typography ships in the recipe layer (not as a primitive) and how to implement it across the existing `recipes-css` and `recipes-tailwind` profiles without violating the recipe-contract audit.

## Philosophy: "Typeset = Recipes"

solidiom is **behavior-first**: a primitive exists to own interactive runtime behavior (state, focus, keyboard, ARIA wiring). Standard text elements (`<h1>`, `<p>`, `<blockquote>`) have no such behavior — they are 100% presentation. Wrapping them in a `<Text as="h1">` primitive would add a component, props plumbing, and reactive overhead to manage styling alone.

Therefore Typeset skips the primitive layer and lives entirely in the **recipe** layer, alongside the existing `button`, `badge`, and `alert` recipes.

### What "zero runtime" actually means here

The recipe layer already ships JavaScript (e.g. `StyledButton`, `buttonVariants`). The honest claim for Typeset is narrower:

1. **No primitive runtime.** Typeset introduces no signals, effects, event handlers, or reactive lifecycle — nothing to execute to render text.
2. **CSS-profile is genuinely zero-JS.** `@solidiom/recipes-css` ships stylesheets applied via `data-*` attributes; no JavaScript participates.
3. **Tailwind-profile granular scale is zero-call.** Because headings/paragraphs have no variants, they are exported as plain class-name **string constants**, not `cva()` functions. Applying one is a property read, not a function call.

This is why the granular API is `typeset.heading1` (a string), not `heading1()` (a call) as the original draft proposed.

### Core principles

1. **No primitive for text.** Text stays a recipe permanently (see [Future Considerations](#future-considerations)).
2. **Semantic HTML.** Consumers style native tags directly — Tailwind profile via a class string, CSS profile via `data-scope`/`data-part` attributes (the existing recipe convention).
3. **Opt-in composability.** Apply a single scale entry to one element, or a `prose` wrapper to a whole subtree of rendered Markdown.

---

## Repository grounding

This plan targets the packages and conventions that exist today. Verify against these before coding:

| Concern               | Reality in this repo                                                                                                                                                                                               |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Recipe packages       | `packages/recipes-css`, `packages/recipes-tailwind` (full), `packages/recipes-unocss` (metadata-only)                                                                                                              |
| Tailwind recipe API   | `class-variance-authority` `cva(...)` + `StyledX` wrapper + `XVariantProps`, re-exported from `src/index.ts`. No repo-wide `recipe()` helper. See `packages/recipes-tailwind/src/recipes/button.tsx`.              |
| CSS recipe API        | Plain stylesheet per feature at `src/styles/<name>.css`, targeting `[data-scope="…"][data-part="…"]`. See `packages/recipes-css/src/styles/button.css`.                                                            |
| Stylesheet exports    | `package.json` `exports` maps `./styles` and each `./styles/<name>.css` explicitly; `src/styles/index.css` imports every feature file.                                                                             |
| Build                 | `tsup` builds `src/index.ts`, copies `src/styles` → `dist/styles`, copies `src` → `source`.                                                                                                                        |
| Tokens (Tailwind)     | Semantic vars in `apps/docs/src/styles.css`: `--foreground`, `--muted-foreground`, `--font-sans`, `--font-mono`, mapped via `--color-*: hsl(var(--*))`. No `--font-serif`, no `--text-xs..9xl`.                    |
| Tokens (CSS)          | `--ui-*` fallback pattern, e.g. `var(--ui-primary, hsl(...))`.                                                                                                                                                     |
| Recipe-contract audit | `tools/audit-recipe-contract.ts` **fails CI on raw class (`.x`) or ID (`#x`) selectors** in any recipe `src/*.css`. Attribute selectors and **element** descendant selectors pass.                                 |
| Docs                  | `apps/docs/src/routes/recipes.tsx` renders entries from `apps/docs/src/demos/recipes/index.ts` via `ComponentPreview`; demos import the recipe symbol + its `./styles/<name>.css` subpath. Solid JSX uses `class`. |

---

## Architecture

Two categories, shipped in both full profiles (`recipes-css`, `recipes-tailwind`).

### 1. Granular scale

Per-element typography: `heading1`–`heading4`, `paragraph`, `lead`, `large`, `small`, `muted`, `blockquote`, `inlineCode`.

- **Tailwind profile:** a frozen `typeset` object of utility class strings + a companion `styles/typeset.css` (data-attribute driven, `@apply`-based) for consumers who prefer attributes over classes.
- **CSS profile:** `styles/typeset.css` only, using `[data-scope="typeset"][data-part="heading-1"]` etc.

### 2. Composite prose

One wrapper that formats a subtree of rendered HTML (Markdown output) without per-child classes, with a `sm | base | lg` size.

- Both profiles ship `styles/prose.css`.
- Scope is an **attribute**, not a class: `[data-scope="prose"]` with **element** descendant selectors (`[data-scope="prose"] h1 { … }`, `… p`, `… a`, `… ul`, `… li`). Size via `[data-scope="prose"][data-size="lg"]`.
- This is deliberately attribute-driven so it passes the recipe-contract audit (no `.prose` class selector) and needs no JavaScript. There is no `proseVariants()` function.

---

## Key decisions

**Granular scale as string constants, not `cva()`.** Headings have no variants, so a `cva()` call adds runtime for nothing. A frozen string map is zero-call and honest to principle 1.
_Devil's advocate:_ `cva()` would match `buttonVariants` for consistency and leave room for variants. Rejected because typography scale entries are variant-free; if one later needs variants, promote just that entry to `cva()` then. Consistency with a variant engine is not worth runtime on every heading.

**Prose is attribute-scoped, not class-scoped.** `[data-scope="prose"]` + element descendants keeps prose inside the existing audit contract and zero-JS.
_Devil's advocate:_ A `.prose` class (à la `@tailwindcss/typography`) is the industry-familiar ergonomic. Rejected because it fails `audit-recipe-contract.ts` and would either force a plugin dependency or a special-case audit exception — more surface area than an attribute selector, which consumers already use for every other recipe.

**No `@tailwindcss/typography` dependency.** The Tailwind profile ships its own `styles/prose.css` with `@apply`, mirroring how `styles/button.css` already works.
_Devil's advocate:_ the plugin is battery-included. Rejected: it pulls an external styling dependency (violates "zero mandatory styling dependencies") and its `prose prose-lg` classes would trip the audit.

**UnoCSS profile deferred.** `recipes-unocss` is metadata-only today; adding typeset there is out of scope for v1 (see [Scope](#scope--deferred-work)).

---

## Token strategy

Do not invent a new cross-profile token contract. Consume what each profile already uses.

- **Tailwind profile:** use existing theme utilities/vars only — `text-4xl`, `font-extrabold`, `tracking-tight`, `text-muted-foreground`, `font-mono`. No new tokens.
- **CSS profile:** use `--ui-*` fallbacks, adding at most two typography tokens, each with a working fallback so the stylesheet renders with no theme:
  - `--ui-fg` (fallback `hsl(222 47% 11%)`) — body/heading color
  - `--ui-muted-fg` (fallback `hsl(215 16% 47%)`) — `muted`/`lead` color
  - reuse `--ui-font-sans` / `--ui-font-mono` with `font-family` fallbacks

---

## Implementation phases

### Phase 1 — CSS profile granular scale

- Add `packages/recipes-css/src/styles/typeset.css` with `[data-scope="typeset"][data-part="…"]` rules for every scale entry.
- Import it from `packages/recipes-css/src/styles/index.css`.
- Add `"./styles/typeset.css": "./dist/styles/typeset.css"` to `packages/recipes-css/package.json` `exports`.
- **Verify:** `pnpm nx run @solidiom/recipes-css:build`; confirm `dist/styles/typeset.css` exists.

### Phase 2 — CSS profile prose

- Add `packages/recipes-css/src/styles/prose.css` (`[data-scope="prose"]` + element descendants + `[data-size]`).
- Wire into `index.css` and add the `./styles/prose.css` export entry.
- **Verify:** build succeeds; `pnpm exec tsx tools/audit-recipe-contract.ts` reports **0 violations**.

### Phase 3 — Tailwind profile

- Add `packages/recipes-tailwind/src/recipes/typeset.tsx` exporting a frozen `typeset` string map (see API below).
- Add `packages/recipes-tailwind/src/styles/typeset.css` and `styles/prose.css` (`@apply`-based, same attribute selectors as Phase 1–2).
- Re-export `typeset` from `packages/recipes-tailwind/src/index.ts`; wire the two stylesheets into `index.css` and `package.json` `exports`.
- **Verify:** `pnpm nx run @solidiom/recipes-tailwind:typecheck` and `:build`; audit still 0 violations.

### Phase 4 — Docs & examples

- Add a demo under `apps/docs/src/demos/recipes/` (e.g. `typeset-recipe-demo.tsx`) importing `typeset` from `@solidiom/recipes-tailwind`; configure the docs Tailwind entry point to scan `packages/recipes-tailwind/src/recipes/typeset.tsx` so its utility classes are emitted; register it in `apps/docs/src/demos/recipes/index.ts`.
- Add a prose demo rendering sample HTML inside `<article data-scope="prose" data-size="lg">` with `./styles/prose.css` imported.
- **Verify:** `pnpm nx run docs:build` (or the docs dev server) renders both demos.

---

## Public API

**Tailwind profile** (`@solidiom/recipes-tailwind`):

```tsx
// packages/recipes-tailwind/src/recipes/typeset.tsx
export const typeset = {
  heading1: "scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl",
  heading2: "scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight",
  heading3: "scroll-m-20 text-2xl font-semibold tracking-tight",
  heading4: "scroll-m-20 text-xl font-semibold tracking-tight",
  paragraph: "leading-7 [&:not(:first-child)]:mt-6",
  lead: "text-xl text-muted-foreground",
  large: "text-lg font-semibold",
  small: "text-sm font-medium leading-none",
  muted: "text-sm text-muted-foreground",
  blockquote: "mt-6 border-l-2 pl-6 italic",
  inlineCode: "relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold",
} as const
```

Usage (granular — apply a class string to a native tag):

```tsx
/* In your Tailwind CSS entry point, scan the recipe source:
@source "../node_modules/@solidiom/recipes-tailwind/source/recipes/typeset.tsx";
*/

import { typeset } from "@solidiom/recipes-tailwind"

export function Hero() {
  return (
    <div>
      <h1 class={typeset.heading1}>Welcome to solidiom</h1>
      <p class={typeset.paragraph}>Behavior first. Runtime first.</p>
    </div>
  )
}
```

Usage (prose — attribute wrapper, both profiles):

```tsx
import type { Element } from "solid-js"
import "@solidiom/recipes-tailwind/styles/prose.css" // or "@solidiom/recipes-css/styles/prose.css"

export function BlogPost(props: { children: Element }) {
  return (
    <article data-scope="prose" data-size="lg">
      {props.children}
    </article>
  )
}

// Render sanitized Markdown or rich-text output as children; do not assign untrusted
// content to innerHTML.
```

**CSS profile** (`@solidiom/recipes-css`) — no JS symbol; apply attributes:

```tsx
import "@solidiom/recipes-css/styles/typeset.css"

;<h1 data-scope="typeset" data-part="heading-1">
  Welcome
</h1>
```

---

## Recipe-contract compliance

Every new stylesheet is scanned by `tools/audit-recipe-contract.ts`. Rules to stay green:

- Use `[data-scope="typeset"]`, `[data-part="…"]`, `[data-scope="prose"]`, `[data-size="…"]` — never a `.class` or `#id` selector.
- Prose descendants use **element** selectors (`[data-scope="prose"] h1`), which the audit permits.
- Run `pnpm exec tsx tools/audit-recipe-contract.ts` before every commit touching recipe CSS; it must print `0 violations` and exit 0.

---

## Scope & deferred work

- **In scope (v1):** granular scale + prose for `recipes-css` and `recipes-tailwind`; one docs demo each.
- **Deferred:** `recipes-unocss` support (currently metadata-only — revisit whether its `meta.ts` registry should list typeset when that profile gains real recipes); `--font-serif` and an extended `--text-*` scale (add only when a design calls for them).

## Testing & verification

No recipe unit tests exist today (`vitest run --passWithNoTests`). Typeset is static styling, so verification is:

1. `pnpm nx run @solidiom/recipes-css:build` and `@solidiom/recipes-tailwind:build` succeed; expected `dist/styles/*.css` present.
2. `pnpm nx run @solidiom/recipes-tailwind:typecheck` passes.
3. `pnpm exec tsx tools/audit-recipe-contract.ts` → 0 violations.
4. `pnpm lint` and `pnpm format:check` clean.
5. Docs demos render.

Optional, cheap regression guard: a `vitest` test asserting the `typeset` string map is stable (snapshot) and that each declared `./styles/*.css` export path resolves. Add it if churn in these strings becomes a problem.

## Acceptance criteria

- [ ] Both full profiles export/ship a granular scale and a prose wrapper.
- [ ] Tailwind granular scale is string constants (no per-heading function call).
- [ ] Prose is attribute-scoped; no `.prose` class selector anywhere in recipe CSS.
- [ ] `package.json` `exports`, `styles/index.css`, and `dist/` all include the new stylesheets.
- [ ] Audit passes with 0 violations; builds, typecheck, lint, format all clean.
- [ ] One granular and one prose demo appear on the docs recipes route.

---

## Future considerations

If a typography element ever needs real behavior — accessible truncation with a "Read More" toggle, or a copy-to-clipboard code block — **only then** promote that specific element to an solidiom primitive that owns the behavior. Plain text remains a recipe permanently.
