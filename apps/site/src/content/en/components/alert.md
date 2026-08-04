---
contentSchemaVersion: 1
title: Alert
description: Styled alert component — the recipe wrapper for the css, tailwind, unocss profile(s) using the alert primitive.
keywords: [alert, component, css, tailwind, unocss]
locale: en
maturity: draft
product: Alert
productLayer: component
status: draft
package: "@solidiom/recipes-css"
recipe: "alert"
stylingOutputs: ["css", "tailwind", "unocss"]
---

Styled alert component — the recipe wrapper for the css, tailwind, unocss profile(s) using the alert primitive.

## Usage

The Alert component is a styled recipe wrapper around the `@solidiom/alert` primitive. It adds composition, semantic styling slots, and variant support while delegating all state management and keyboard behavior to the underlying primitive.

```tsx
import { Alert } from "@solidiom/recipes-css"

;<Alert>Content</Alert>
```

## Installation

```sh
pnpm add @solidiom/recipes-css @solidiom/recipes-tailwind @solidiom/recipes-unocss
```

Install the recipe package for your chosen styling profile. The component requires the corresponding `@solidiom/alert` primitive as a peer dependency.

## Anatomy

The Alert component wraps the `@solidiom/alert` primitive. It exposes the primitive's parts through a recipe-applied composition layer:

- **Root** — the wrapper element that applies recipe styles and delegates to the primitive.

## Variants & states

Alert inherits its variant and state support from `@solidiom/alert`. Consult the primitive's documentation for the full list of supported variants, compound variants, and interactive states.

## Styling

Alert is available in css, tailwind, unocss profiles. Each profile applies the same semantic slots and variant classes, allowing you to swap profiles without changing component usage.

Recipe classes follow the `solidiom-alert` namespace for CSS profiling and targeting.

## SSR and hydration

Alert renders as semantic HTML during server rendering. Interactive behavior activates on hydration without layout shift. The recipe layer adds no JavaScript dependencies beyond the underlying primitive.

## Accessibility

Alert delegates accessibility to `@solidiom/alert`. See the [Alert primitive accessibility contract](/primitives/alert/accessibility/) for the full keyboard, focus, and ARIA contract. The recipe wrapper does not introduce new semantics or interact with the accessibility tree beyond styling.
