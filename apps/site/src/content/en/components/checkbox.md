---
contentSchemaVersion: 1
title: Checkbox
description: Styled checkbox component — the recipe wrapper for the css, tailwind, unocss profile(s) using the checkbox primitive.
keywords: [checkbox, component, css, tailwind, unocss]
locale: en
maturity: beta
product: Checkbox
productLayer: component
status: published
package: "@solidiom/recipes-css"
recipe: "checkbox"
stylingOutputs: ["css", "tailwind", "unocss"]
---

Styled checkbox component — the recipe wrapper for the css, tailwind, unocss profile(s) using the checkbox primitive.

## Usage

The Checkbox component is a styled recipe wrapper around the `@solidiom/checkbox` primitive. It adds composition, semantic styling slots, and variant support while delegating all state management and keyboard behavior to the underlying primitive.

```tsx
import { StyledCheckbox } from "@solidiom/recipes-css"

;<StyledCheckbox>Content</StyledCheckbox>
```

## Installation

```sh
pnpm add @solidiom/recipes-css @solidiom/recipes-tailwind @solidiom/recipes-unocss
```

Install the recipe package for your chosen styling profile. The component requires the corresponding `@solidiom/checkbox` primitive as a peer dependency.

## Anatomy

The Checkbox component wraps the `@solidiom/checkbox` primitive. It exposes the primitive's parts through a recipe-applied composition layer:

- **Root** — the wrapper element that applies recipe styles and delegates to the primitive.

## Variants & states

Checkbox inherits its variant and state support from `@solidiom/checkbox`. Consult the primitive's documentation for the full list of supported variants, compound variants, and interactive states.

## Styling

Checkbox is available in css, tailwind, unocss profiles. Each profile applies the same semantic slots and variant classes, allowing you to swap profiles without changing component usage.

Recipe classes follow the `solidiom-checkbox` namespace for CSS profiling and targeting.

## SSR and hydration

Checkbox renders as semantic HTML during server rendering. Interactive behavior activates on hydration without layout shift. The recipe layer adds no JavaScript dependencies beyond the underlying primitive.

## Accessibility

Checkbox delegates accessibility to `@solidiom/checkbox`. See the [Checkbox primitive accessibility contract](/primitives/checkbox/accessibility/) for the full keyboard, focus, and ARIA contract. The recipe wrapper does not introduce new semantics or interact with the accessibility tree beyond styling.
