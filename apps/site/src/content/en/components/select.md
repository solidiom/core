---
contentSchemaVersion: 1
title: Select
description: Styled select component — the recipe wrapper for the css, tailwind, unocss profile(s) using the select primitive.
keywords: [component, css, select, tailwind, unocss]
locale: en
maturity: beta
product: Select
productLayer: component
status: published
package: "@solidiom/recipes-css"
recipe: "select"
stylingOutputs: ["css", "tailwind", "unocss"]
---

Styled select component — the recipe wrapper for the css, tailwind, unocss profile(s) using the select primitive.

## Usage

The Select component is a styled recipe wrapper around the `@solidiom/select` primitive. It adds composition, semantic styling slots, and variant support while delegating all state management and keyboard behavior to the underlying primitive.

```tsx
import { Select } from "@solidiom/recipes-css"

;<Select>Content</Select>
```

## Installation

```sh
pnpm add @solidiom/recipes-css @solidiom/recipes-tailwind @solidiom/recipes-unocss
```

Install the recipe package for your chosen styling profile. The component requires the corresponding `@solidiom/select` primitive as a peer dependency.

## Anatomy

The Select component wraps the `@solidiom/select` primitive. It exposes the primitive's parts through a recipe-applied composition layer:

- **Root** — the wrapper element that applies recipe styles and delegates to the primitive.

## Variants & states

Select inherits its variant and state support from `@solidiom/select`. Consult the primitive's documentation for the full list of supported variants, compound variants, and interactive states.

## Styling

Select is available in css, tailwind, unocss profiles. Each profile applies the same semantic slots and variant classes, allowing you to swap profiles without changing component usage.

Recipe classes follow the `solidiom-select` namespace for CSS profiling and targeting.

## SSR and hydration

Select renders as semantic HTML during server rendering. Interactive behavior activates on hydration without layout shift. The recipe layer adds no JavaScript dependencies beyond the underlying primitive.

## Accessibility

Select delegates accessibility to `@solidiom/select`. See the [Select primitive accessibility contract](/primitives/select/accessibility/) for the full keyboard, focus, and ARIA contract. The recipe wrapper does not introduce new semantics or interact with the accessibility tree beyond styling.
