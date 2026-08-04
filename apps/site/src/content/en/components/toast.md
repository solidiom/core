---
contentSchemaVersion: 1
title: Toast
description: Styled toast component — the recipe wrapper for the css, tailwind, unocss profile(s) using the toast primitive.
keywords: [component, css, tailwind, toast, unocss]
locale: en
maturity: draft
product: Toast
productLayer: component
status: draft
package: "@solidiom/recipes-css"
recipe: "toast"
stylingOutputs: ["css", "tailwind", "unocss"]
---

Styled toast component — the recipe wrapper for the css, tailwind, unocss profile(s) using the toast primitive.

## Usage

The Toast component is a styled recipe wrapper around the `@solidiom/toast` primitive. It adds composition, semantic styling slots, and variant support while delegating all state management and keyboard behavior to the underlying primitive.

```tsx
import { Toast } from "@solidiom/recipes-css"

;<Toast>Content</Toast>
```

## Installation

```sh
pnpm add @solidiom/recipes-css @solidiom/recipes-tailwind @solidiom/recipes-unocss
```

Install the recipe package for your chosen styling profile. The component requires the corresponding `@solidiom/toast` primitive as a peer dependency.

## Anatomy

The Toast component wraps the `@solidiom/toast` primitive. It exposes the primitive's parts through a recipe-applied composition layer:

- **Root** — the wrapper element that applies recipe styles and delegates to the primitive.

## Variants & states

Toast inherits its variant and state support from `@solidiom/toast`. Consult the primitive's documentation for the full list of supported variants, compound variants, and interactive states.

## Styling

Toast is available in css, tailwind, unocss profiles. Each profile applies the same semantic slots and variant classes, allowing you to swap profiles without changing component usage.

Recipe classes follow the `solidiom-toast` namespace for CSS profiling and targeting.

## SSR and hydration

Toast renders as semantic HTML during server rendering. Interactive behavior activates on hydration without layout shift. The recipe layer adds no JavaScript dependencies beyond the underlying primitive.

## Accessibility

Toast delegates accessibility to `@solidiom/toast`. See the [Toast primitive accessibility contract](/primitives/toast/accessibility/) for the full keyboard, focus, and ARIA contract. The recipe wrapper does not introduce new semantics or interact with the accessibility tree beyond styling.
