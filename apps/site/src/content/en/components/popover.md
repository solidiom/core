---
contentSchemaVersion: 1
title: Popover
description: Styled popover component — the recipe wrapper for the css, tailwind, unocss profile(s) using the popover primitive.
keywords: [component, css, popover, tailwind, unocss]
locale: en
maturity: beta
product: Popover
productLayer: component
status: published
package: "@solidiom/recipes-css"
recipe: "popover"
stylingOutputs: ["css", "tailwind", "unocss"]
---

Styled popover component — the recipe wrapper for the css, tailwind, unocss profile(s) using the popover primitive.

## Usage

The Popover component is a styled recipe wrapper around the `@solidiom/popover` primitive. It adds composition, semantic styling slots, and variant support while delegating all state management and keyboard behavior to the underlying primitive.

```tsx
import { Popover } from "@solidiom/recipes-css"

;<Popover>Content</Popover>
```

## Installation

```sh
pnpm add @solidiom/recipes-css @solidiom/recipes-tailwind @solidiom/recipes-unocss
```

Install the recipe package for your chosen styling profile. The component requires the corresponding `@solidiom/popover` primitive as a peer dependency.

## Anatomy

The Popover component wraps the `@solidiom/popover` primitive. It exposes the primitive's parts through a recipe-applied composition layer:

- **Root** — the wrapper element that applies recipe styles and delegates to the primitive.

## Variants & states

Popover inherits its variant and state support from `@solidiom/popover`. Consult the primitive's documentation for the full list of supported variants, compound variants, and interactive states.

## Styling

Popover is available in css, tailwind, unocss profiles. Each profile applies the same semantic slots and variant classes, allowing you to swap profiles without changing component usage.

Recipe classes follow the `solidiom-popover` namespace for CSS profiling and targeting.

## SSR and hydration

Popover renders as semantic HTML during server rendering. Interactive behavior activates on hydration without layout shift. The recipe layer adds no JavaScript dependencies beyond the underlying primitive.

## Accessibility

Popover delegates accessibility to `@solidiom/popover`. See the [Popover primitive accessibility contract](/primitives/popover/accessibility/) for the full keyboard, focus, and ARIA contract. The recipe wrapper does not introduce new semantics or interact with the accessibility tree beyond styling.
