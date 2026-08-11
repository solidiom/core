---
contentSchemaVersion: 1
title: Spinner
description: Styled spinner component — the recipe wrapper for the css, tailwind, unocss profile(s) using the spinner primitive.
keywords: [spinner, loading, component, css, tailwind, unocss]
locale: en
maturity: beta
product: Spinner
productLayer: component
status: published
package: "@solidiom/recipes-css"
recipe: "spinner"
stylingOutputs: ["css", "tailwind", "unocss"]
---

Styled spinner component — the recipe wrapper for the css, tailwind, unocss profile(s) using the spinner primitive.

## Usage

The Spinner component is a styled recipe wrapper around the `@solidiom/spinner` primitive. It adds composition, semantic styling slots, and variant support while delegating all state management and keyboard behavior to the underlying primitive.

```tsx
import { StyledSpinner } from "@solidiom/recipes-css"

;<StyledSpinner>Loading...</StyledSpinner>
```

## Installation

```sh
pnpm add @solidiom/recipes-css @solidiom/recipes-tailwind @solidiom/recipes-unocss
```

Install the recipe package for your chosen styling profile. The component requires the corresponding `@solidiom/spinner` primitive as a peer dependency.

## Anatomy

The Spinner component wraps the `@solidiom/spinner` primitive. It exposes the primitive's parts through a recipe-applied composition layer:

- **Root** — the wrapper element that applies recipe styles and delegates to the primitive.

## Variants & states

Spinner inherits its variant and state support from `@solidiom/spinner`. Consult the primitive's documentation for the full list of supported variants, compound variants, and interactive states.

## Styling

Spinner is available in css, tailwind, unocss profiles. Each profile applies the same semantic slots and variant classes, allowing you to swap profiles without changing component usage.

Recipe classes follow the `solidiom-spinner` namespace for CSS profiling and targeting.

## SSR and hydration

Spinner renders as semantic HTML during server rendering. Interactive behavior activates on hydration without layout shift. The recipe layer adds no JavaScript dependencies beyond the underlying primitive.

## Accessibility

Spinner delegates accessibility to `@solidiom/spinner`. See the [Spinner primitive accessibility contract](/primitives/spinner/accessibility/) for the full keyboard, focus, and ARIA contract. The recipe wrapper does not introduce new semantics or interact with the accessibility tree beyond styling.
