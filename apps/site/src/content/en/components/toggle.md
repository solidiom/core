---
contentSchemaVersion: 1
title: Toggle
description: Styled toggle component — the recipe wrapper for the css, tailwind, unocss profile(s) using the toggle primitive.
keywords: [toggle, button, pressed, component, css, tailwind, unocss]
locale: en
maturity: beta
product: Toggle
productLayer: component
status: published
package: "@solidiom/recipes-css"
recipe: "toggle"
stylingOutputs: ["css", "tailwind", "unocss"]
---

Styled toggle component — the recipe wrapper for the css, tailwind, unocss profile(s) using the toggle primitive.

## Usage

The Toggle component is a styled recipe wrapper around the `@solidiom/toggle` primitive. It adds composition, semantic styling slots, and variant support while delegating all state management and keyboard behavior to the underlying primitive.

```tsx
import { Toggle } from "@solidiom/recipes-css"

;<Toggle aria-label="Toggle bold">
  <strong>B</strong>
</Toggle>
```

## Installation

```sh
pnpm add @solidiom/recipes-css @solidiom/recipes-tailwind @solidiom/recipes-unocss
```

Install the recipe package for your chosen styling profile. The component requires the corresponding `@solidiom/toggle` primitive as a peer dependency.

## Anatomy

The Toggle component wraps the `@solidiom/toggle` primitive. It exposes the primitive's parts through a recipe-applied composition layer:

- **Root** — the toggle button element that applies recipe styles and delegates to the primitive.

## Variants & states

Toggle inherits its variant and state support from `@solidiom/toggle`. Consult the primitive's documentation for the full list of supported variants, compound variants, and interactive states.

## Styling

Toggle is available in css, tailwind, unocss profiles. Each profile applies the same semantic slots and variant classes, allowing you to swap profiles without changing component usage.

Recipe classes follow the `solidiom-toggle` namespace for CSS profiling and targeting.

## SSR and hydration

Toggle renders as semantic HTML during server rendering. Interactive behavior activates on hydration without layout shift. The recipe layer adds no JavaScript dependencies beyond the underlying primitive.

## Accessibility

Toggle delegates accessibility to `@solidiom/toggle`. See the [Toggle primitive accessibility contract](/primitives/toggle/accessibility/) for the full keyboard, focus, and ARIA contract. The recipe wrapper does not introduce new semantics or interact with the accessibility tree beyond styling.
