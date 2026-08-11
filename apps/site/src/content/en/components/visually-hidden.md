---
contentSchemaVersion: 1
title: Visually Hidden
description: Styled visually hidden component — the recipe wrapper for the css, tailwind, unocss profile(s) using the visually-hidden primitive.
keywords: [visually-hidden, sr-only, accessibility, component, css, tailwind, unocss]
locale: en
maturity: beta
product: Visually Hidden
productLayer: component
status: published
package: "@solidiom/recipes-css"
recipe: "visually-hidden"
stylingOutputs: ["css", "tailwind", "unocss"]
---

Styled visually hidden component — the recipe wrapper for the css, tailwind, unocss profile(s) using the visually-hidden primitive.

## Usage

The Visually Hidden component is a styled recipe wrapper around the `@solidiom/visually-hidden` primitive. It hides content visually while keeping it accessible to screen readers.

```tsx
import { VisuallyHidden } from "@solidiom/recipes-css"

;<button>
  <VisuallyHidden>Close dialog</VisuallyHidden>
  <span aria-hidden="true">×</span>
</button>
```

## Installation

```sh
pnpm add @solidiom/recipes-css @solidiom/recipes-tailwind @solidiom/recipes-unocss
```

Install the recipe package for your chosen styling profile. The component requires the corresponding `@solidiom/visually-hidden` primitive as a peer dependency.

## Anatomy

The Visually Hidden component wraps the `@solidiom/visually-hidden` primitive. It exposes the primitive's parts through a recipe-applied composition layer:

- **Root** — the wrapper element that applies screen-reader-only styles.

## Variants & states

Visually Hidden inherits its variant and state support from `@solidiom/visually-hidden`. Consult the primitive's documentation for the full list of supported variants, compound variants, and interactive states.

## Styling

Visually Hidden is available in css, tailwind, unocss profiles. Each profile applies the same semantic slots and variant classes, allowing you to swap profiles without changing component usage.

Recipe classes follow the `solidiom-visually-hidden` namespace for CSS profiling and targeting.

## SSR and hydration

Visually Hidden renders as semantic HTML during server rendering. No interactive behavior is needed — the component is purely a styling utility.

## Accessibility

Visually Hidden delegates accessibility to `@solidiom/visually-hidden`. See the [Visually Hidden primitive accessibility contract](/primitives/visually-hidden/accessibility/) for the full keyboard, focus, and ARIA contract. The recipe wrapper does not introduce new semantics or interact with the accessibility tree beyond styling.
