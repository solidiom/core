---
contentSchemaVersion: 1
title: Accordion
description: Styled accordion component — the recipe wrapper for the css, tailwind, unocss profile(s) using the accordion primitive.
keywords: [accordion, component, css, tailwind, unocss]
locale: en
maturity: beta
product: Accordion
productLayer: component
status: published
package: "@solidiom/recipes-css"
recipe: "accordion"
stylingOutputs: ["css", "tailwind", "unocss"]
---

Styled accordion component — the recipe wrapper for the css, tailwind, unocss profile(s) using the accordion primitive.

## Usage

The Accordion component is a styled recipe wrapper around the `@solidiom/accordion` primitive. It adds composition, semantic styling slots, and variant support while delegating all state management and keyboard behavior to the underlying primitive.

```tsx
import { StyledAccordion } from "@solidiom/recipes-css"

;<StyledAccordion>Content</StyledAccordion>
```

## Installation

```sh
pnpm add @solidiom/recipes-css @solidiom/recipes-tailwind @solidiom/recipes-unocss
```

Install the recipe package for your chosen styling profile. The component requires the corresponding `@solidiom/accordion` primitive as a peer dependency.

## Anatomy

The Accordion component wraps the `@solidiom/accordion` primitive. It exposes the primitive's parts through a recipe-applied composition layer:

- **Root** — the wrapper element that applies recipe styles and delegates to the primitive.

## Variants & states

Accordion inherits its variant and state support from `@solidiom/accordion`. Consult the primitive's documentation for the full list of supported variants, compound variants, and interactive states.

## Styling

Accordion is available in css, tailwind, unocss profiles. Each profile applies the same semantic slots and variant classes, allowing you to swap profiles without changing component usage.

Recipe classes follow the `solidiom-accordion` namespace for CSS profiling and targeting.

## SSR and hydration

Accordion renders as semantic HTML during server rendering. Interactive behavior activates on hydration without layout shift. The recipe layer adds no JavaScript dependencies beyond the underlying primitive.

## Accessibility

Accordion delegates accessibility to `@solidiom/accordion`. See the [Accordion primitive accessibility contract](/primitives/accordion/accessibility/) for the full keyboard, focus, and ARIA contract. The recipe wrapper does not introduce new semantics or interact with the accessibility tree beyond styling.
