---
contentSchemaVersion: 1
title: Label
description: Styled label component — the recipe wrapper for the css, tailwind, unocss profile(s) using the label primitive.
keywords: [label, form, input, component, css, tailwind, unocss]
locale: en
maturity: beta
product: Label
productLayer: component
status: published
package: "@solidiom/recipes-css"
recipe: "label"
stylingOutputs: ["css", "tailwind", "unocss"]
---

Styled label component — the recipe wrapper for the css, tailwind, unocss profile(s) using the label primitive.

## Usage

The Label component is a styled recipe wrapper around the `@solidiom/label` primitive. It adds composition, semantic styling slots, and variant support while delegating all state management and keyboard behavior to the underlying primitive.

```tsx
import { Label } from "@solidiom/recipes-css"

;<Label for="email">Email address</Label>
```

## Installation

```sh
pnpm add @solidiom/recipes-css @solidiom/recipes-tailwind @solidiom/recipes-unocss
```

Install the recipe package for your chosen styling profile. The component requires the corresponding `@solidiom/label` primitive as a peer dependency.

## Anatomy

The Label component wraps the `@solidiom/label` primitive. It exposes the primitive's parts through a recipe-applied composition layer:

- **Root** — the label element that applies recipe styles and delegates to the primitive.

## Variants & states

Label inherits its variant and state support from `@solidiom/label`. Consult the primitive's documentation for the full list of supported variants, compound variants, and interactive states.

## Styling

Label is available in css, tailwind, unocss profiles. Each profile applies the same semantic slots and variant classes, allowing you to swap profiles without changing component usage.

Recipe classes follow the `solidiom-label` namespace for CSS profiling and targeting.

## SSR and hydration

Label renders as semantic HTML during server rendering. Interactive behavior activates on hydration without layout shift. The recipe layer adds no JavaScript dependencies beyond the underlying primitive.

## Accessibility

Label delegates accessibility to `@solidiom/label`. See the [Label primitive accessibility contract](/primitives/label/accessibility/) for the full keyboard, focus, and ARIA contract. The recipe wrapper does not introduce new semantics or interact with the accessibility tree beyond styling.
