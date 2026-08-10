---
contentSchemaVersion: 1
title: "Styling-System Neutrality"
description: "How Solidiom supports CSS, Tailwind, and UnoCSS without favoring any single approach."
keywords: [styling, css, tailwind, unocss, recipes, neutrality, article]
locale: en
maturity: draft
product: "Solidiom"
productLayer: article
status: draft
date: "2026-08-07"
authors:
  - solidiom-core
tags: [styling, tailwind, architecture]
---

# Styling-System Neutrality

Solidiom doesn't pick a side in the CSS-vs-Tailwind-vs-utility debate. It supports all three with equal fidelity through the recipe system.

## The Problem

Most component libraries force a styling choice:

- Tailwind libraries require Tailwind
- CSS-in-JS libraries require a runtime
- Headless libraries give you nothing — you style everything from scratch

Teams change their minds. Projects have constraints. A library shouldn't be the constraint.

## The Recipe Architecture

Solidiom separates behavior from styling at the architecture level:

```
Primitive (behavior) → Recipe (styling) → Component (composed)
```

- **Primitives** use semantic data attributes (`data-state`, `data-disabled`, `data-expanded`)
- **Recipes** target those attributes with styling rules
- **Components** compose primitives + recipes into installable units

Three recipe profiles ship:

| Profile | Technology | Approach |
|---------|-----------|----------|
| `css` | Plain CSS | BEM-like classes + data-attribute selectors |
| `tailwind` | Tailwind CSS | Utility classes + `@apply` for states |
| `unocss` | UnoCSS | Atomic utilities + custom rules |

## How Parity Is Enforced

The recipe parity audit (`pnpm run audit:recipe-parity`) ensures:

1. All three profiles cover the same primitive slots
2. All three profiles handle the same states (hover, focus, disabled, loading, error)
3. Visual output is equivalent across profiles (verified by computed-style comparison)
4. No profile has features the others lack

This means switching from Tailwind to plain CSS is a config change, not a rewrite.

## Choosing a Profile

Set your profile once in `.solidiom/config.json`:

```json
{
  "stylingProfile": "tailwind"
}
```

Or per-command:

```sh
solidiom add button --styling css
```

## The Theme Layer

Themes are profile-agnostic. The same theme preset (Ocean, Forest, Slate, Aurora) works identically across all three styling profiles because themes define CSS custom properties, not utility classes.

```css
/* Works with any profile */
:root {
  --sol-color-primary: oklch(0.6 0.2 250);
}
```

## Extending Recipes

Recipes are source-owned. To customize:

1. Install in source mode: `solidiom add button --source`
2. Modify the recipe file directly
3. The styling remains connected to the primitive's data attributes

You're never locked into our design decisions. The recipe is a starting point, not a cage.

## Compile-Time Optimization

Phase 3A introduces optional compile-time transforms:

- **Recipe extraction** — moves recipe styles to static CSS at build time
- **Dead-part elimination** — removes unused component slots from the bundle
- **Variant expansion** — pre-computes variant combinations

These optimizations work identically across all three profiles because they operate on the data-attribute contract, not on styling implementation details.
