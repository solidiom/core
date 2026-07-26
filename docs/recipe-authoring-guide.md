---
id: recipe-authoring-guide
title: "Recipe Authoring Guide"
sidebar_label: Recipe Authoring
description: How to add new recipes to the solidiom recipe packages without breaking the contract audit.
doc_type: how-to
audience: "solidiom contributors, recipe authors"
tags: [recipes, css, tailwind, authoring]
---

> **Purpose:** For solidiom contributors, shows how to author, wire, and verify new recipes in the `recipes-css` and `recipes-tailwind` packages while staying compliant with the recipe-contract audit.

## Prerequisites

- Familiarity with the solidiom monorepo layout (`packages/recipes-css`, `packages/recipes-tailwind`)
- Understanding of `data-scope` / `data-part` attribute conventions
- Access to run `pnpm nx run @solidiom/recipes-css:build` and `pnpm exec tsx tools/audit-recipe-contract.ts`

## Recipe-contract rules

`tools/audit-recipe-contract.ts` scans every `.css` file under `packages/recipes-{css,tailwind,unocss}/src/`. It **fails CI** on:

- Any raw class selector (`.my-class`)
- Any ID selector (`#my-id`)

Allowed selectors:

- `[data-scope="…"]`, `[data-part="…"]`, `[data-state="…"]`, `[data-size="…"]`, and other `[data-*]` attributes
- State pseudo-classes (`:hover`, `:focus`, `:focus-visible`, `:active`, `:disabled`)
- Structural pseudos (`:first-child`, `:last-child`, `:not(…)`)
- Pseudo-elements (`::before`, `::after`)
- **Element** descendant selectors (`[data-scope="prose"] h1`) — these pass the audit

Run the audit locally before every commit touching recipe CSS:

```sh
pnpm exec tsx tools/audit-recipe-contract.ts
# Must print: 0 violations found
```

## Step-by-step: adding a new recipe

### 1. Choose your scope name

Pick a kebab-case name for `data-scope`. It must be unique across all recipes. Check existing scopes:

```sh
grep -rh 'data-scope=' packages/recipes-css/src/styles/ | sort -u
```

### 2. CSS profile (`@solidiom/recipes-css`)

Create `packages/recipes-css/src/styles/<name>.css`:

```css
/* @solidiom/recipes-css — <Name> */
[data-scope="<name>"][data-part="root"] {
  /* styles using --ui-* token fallbacks */
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

Token convention for the CSS profile: use `var(--ui-<token>, <fallback>)` so the stylesheet renders without a theme.

### 3. Tailwind profile (`@solidiom/recipes-tailwind`)

**If the recipe has variants** (e.g. size, color), use `cva`:

```tsx
// packages/recipes-tailwind/src/recipes/<name>.tsx
import { cva, type VariantProps } from "class-variance-authority"

export const <name>Variants = cva("base classes", {
  variants: { /* ... */ },
  defaultVariants: { /* ... */ },
})

export type <Name>VariantProps = VariantProps<typeof <name>Variants>
```

**If the recipe has no variants** (e.g. typography scale), export a frozen string map:

```tsx
// packages/recipes-tailwind/src/recipes/<name>.tsx
export const <name> = {
  entry1: "tailwind classes",
  entry2: "tailwind classes",
} as const

export type <Name>Key = keyof typeof <name>
```

A frozen string map avoids a `cva()` function call at every usage site — zero runtime cost for variant-free recipes.

Also create `packages/recipes-tailwind/src/styles/<name>.css` with `@apply`-based rules using the same `[data-scope][data-part]` selectors, wrapped in `@layer components`:

```css
@layer components {
  [data-scope="<name>"][data-part="root"] {
    @apply inline-flex items-center rounded-md bg-primary text-sm;
  }
}
```

This stylesheet is for consumers who prefer the data-attribute approach over class strings.

### 4. Wire the imports and exports

For each profile:

1. **`src/styles/index.css`** — add `@import "./<name>.css";`
2. **`package.json` `exports`** — add `"./styles/<name>.css": "./dist/styles/<name>.css"`
3. **`src/index.ts`** (Tailwind only) — re-export the recipe symbols

### 5. Verify

```sh
# Audit (both profiles)
pnpm exec tsx tools/audit-recipe-contract.ts

# Build
pnpm nx run @solidiom/recipes-css:build
pnpm nx run @solidiom/recipes-tailwind:build

# Typecheck (Tailwind profile — has TS exports)
pnpm nx run @solidiom/recipes-tailwind:typecheck

# Confirm dist output
ls packages/recipes-css/dist/styles/<name>.css
ls packages/recipes-tailwind/dist/styles/<name>.css
```

## Composite recipes (prose-style)

When a recipe styles a **subtree** of arbitrary HTML (rendered Markdown, rich text), use element descendant selectors scoped by an attribute:

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

Key differences from granular recipes:

- No `[data-part]` on children — consumers don't control the inner HTML structure
- Size/density variants go on the root: `[data-scope="prose"][data-size="lg"]`
- Element selectors pass the audit (they're not class selectors)
- No JS export needed — consumers apply `data-scope="prose"` directly

## Lessons learned

### String constants beat `cva()` for variant-free recipes

The Typeset recipe exports a frozen object of class strings. Applying `typeset.heading1` is a property read, not a function call. This matters at scale — dozens of headings per page with zero runtime overhead.

Only reach for `cva()` when you genuinely have variants (size, color, shape). Consistency with `buttonVariants` is not a reason — correctness and minimal overhead are.

### Attribute-scoped prose avoids audit exceptions

Industry convention is `.prose` (à la `@tailwindcss/typography`). We use `[data-scope="prose"]` instead because:

- It passes `audit-recipe-contract.ts` without special-casing
- It needs no external plugin dependency
- It follows the same attribute pattern every other recipe uses

### Token strategy: don't invent cross-profile contracts

Each profile consumes its own existing tokens:

- **Tailwind:** use theme utilities directly (`text-muted-foreground`, `bg-muted`, `font-mono`)
- **CSS:** use `--ui-*` fallbacks (`var(--ui-fg, hsl(222 47% 11%))`)

Do not create a shared `--text-foreground` or `--font-serif` token unless a design system decision demands it. Let profiles diverge in implementation while converging in visual output.

### Wire all four touchpoints or the recipe silently doesn't ship

A recipe isn't available to consumers until all four are wired:

1. `src/styles/<name>.css` (the file exists)
2. `src/styles/index.css` (the `@import`)
3. `package.json` `exports` (the subpath)
4. `src/index.ts` (the JS re-export, Tailwind only)

Missing any one of these means the build succeeds but consumers get import errors or missing styles. The build doesn't validate export map correctness — only a consumer importing the subpath would catch it.

### The audit is your gate, not the build

Both `pnpm nx run @solidiom/recipes-css:build` and `:typecheck` will pass even if your CSS contains `.my-class` selectors. The **audit tool** is the only thing that catches contract violations. Always run it:

```sh
pnpm exec tsx tools/audit-recipe-contract.ts
```

## Troubleshooting

| Symptom                                                 | Cause                                     | Fix                                                     |
| ------------------------------------------------------- | ----------------------------------------- | ------------------------------------------------------- |
| Audit reports "Class selector without data-* qualifier" | Used `.foo` in recipe CSS                 | Replace with `[data-scope="…"][data-part="…"]` selector |
| `dist/styles/<name>.css` missing after build            | File not imported in `index.css`          | Add `@import "./<name>.css";` to `src/styles/index.css` |
| Consumer gets "Package subpath not defined"             | Missing `exports` entry in `package.json` | Add `"./styles/<name>.css": "./dist/styles/<name>.css"` |
| Tailwind `@apply` classes not resolving                 | CSS not inside `@layer components`        | Wrap rules in `@layer components { … }`                 |
| TypeScript can't find exported symbol                   | Missing re-export from `src/index.ts`     | Add `export { … } from "./recipes/<name>"`              |
