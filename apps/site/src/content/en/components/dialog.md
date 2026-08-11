---
contentSchemaVersion: 1
title: Dialog
description: Styled dialog component — the recipe wrapper for the css, tailwind, unocss profile(s) using the dialog primitive.
keywords: [component, css, dialog, tailwind, unocss]
locale: en
maturity: beta
product: Dialog
productLayer: component
status: published
package: "@solidiom/recipes-css"
recipe: "dialog"
stylingOutputs: ["css", "tailwind", "unocss"]
---

Styled dialog component — the recipe wrapper for the css, tailwind, unocss profile(s) using the dialog primitive.

## Usage

The Dialog component is a styled recipe wrapper around the `@solidiom/dialog` primitive. It adds composition, semantic styling slots, and variant support while delegating all state management and keyboard behavior to the underlying primitive.

```tsx
import { Dialog } from "@solidiom/recipes-css"

;<Dialog>Content</Dialog>
```

## Installation

```sh
pnpm add @solidiom/recipes-css @solidiom/recipes-tailwind @solidiom/recipes-unocss
```

Install the recipe package for your chosen styling profile. The component requires the corresponding `@solidiom/dialog` primitive as a peer dependency.

## Anatomy

The Dialog component wraps the `@solidiom/dialog` primitive. It exposes the primitive's parts through a recipe-applied composition layer:

- **Root** — the wrapper element that applies recipe styles and delegates to the primitive.

## Variants & states

Dialog inherits its variant and state support from `@solidiom/dialog`. Consult the primitive's documentation for the full list of supported variants, compound variants, and interactive states.

## Styling

Dialog is available in css, tailwind, unocss profiles. Each profile applies the same semantic slots and variant classes, allowing you to swap profiles without changing component usage.

Recipe classes follow the `solidiom-dialog` namespace for CSS profiling and targeting.

## SSR and hydration

Dialog renders as semantic HTML during server rendering. Interactive behavior activates on hydration without layout shift. The recipe layer adds no JavaScript dependencies beyond the underlying primitive.

## Accessibility

Dialog delegates accessibility to `@solidiom/dialog`. See the [Dialog primitive accessibility contract](/primitives/dialog/accessibility/) for the full keyboard, focus, and ARIA contract. The recipe wrapper does not introduce new semantics or interact with the accessibility tree beyond styling.
