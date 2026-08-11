---
contentSchemaVersion: 1
title: Tooltip
description: Styled tooltip component — the recipe wrapper for the css, tailwind, unocss profile(s) using the tooltip primitive.
keywords: [component, css, tailwind, tooltip, unocss]
locale: en
maturity: beta
product: Tooltip
productLayer: component
status: published
package: "@solidiom/recipes-css"
recipe: "tooltip"
stylingOutputs: ["css", "tailwind", "unocss"]
---

Styled tooltip component — the recipe wrapper for the css, tailwind, unocss profile(s) using the tooltip primitive.

## Usage

The Tooltip component is a styled recipe wrapper around the `@solidiom/tooltip` primitive. It adds composition, semantic styling slots, and variant support while delegating all state management and keyboard behavior to the underlying primitive.

```tsx
import { Tooltip } from "@solidiom/recipes-css"

;<Tooltip>Content</Tooltip>
```

## Installation

```sh
pnpm add @solidiom/recipes-css @solidiom/recipes-tailwind @solidiom/recipes-unocss
```

Install the recipe package for your chosen styling profile. The component requires the corresponding `@solidiom/tooltip` primitive as a peer dependency.

## Anatomy

The Tooltip component wraps the `@solidiom/tooltip` primitive. It exposes the primitive's parts through a recipe-applied composition layer:

- **Root** — the wrapper element that applies recipe styles and delegates to the primitive.

## Variants & states

Tooltip inherits its variant and state support from `@solidiom/tooltip`. Consult the primitive's documentation for the full list of supported variants, compound variants, and interactive states.

## Styling

Tooltip is available in css, tailwind, unocss profiles. Each profile applies the same semantic slots and variant classes, allowing you to swap profiles without changing component usage.

Recipe classes follow the `solidiom-tooltip` namespace for CSS profiling and targeting.

## SSR and hydration

Tooltip renders as semantic HTML during server rendering. Interactive behavior activates on hydration without layout shift. The recipe layer adds no JavaScript dependencies beyond the underlying primitive.

## Accessibility

Tooltip delegates accessibility to `@solidiom/tooltip`. See the [Tooltip primitive accessibility contract](/primitives/tooltip/accessibility/) for the full keyboard, focus, and ARIA contract. The recipe wrapper does not introduce new semantics or interact with the accessibility tree beyond styling.
