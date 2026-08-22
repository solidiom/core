---
contentSchemaVersion: 1
title: Input
description: Styled text input and textarea component — the recipe wrapper for the css, tailwind, unocss profile(s) using the input primitive.
keywords: [input, textarea, form, text, component, css, tailwind, unocss]
locale: en
maturity: beta
product: Input
productLayer: component
status: published
package: "@solidiom/recipes-css"
recipe: "input"
stylingOutputs: ["css", "tailwind", "unocss"]
---

Styled text input and textarea component — the recipe wrapper for the css, tailwind, unocss profile(s) using the input primitive.

## Usage

The Input component is a styled recipe wrapper around the `@solidiom/input` primitive. It adds semantic styling for validation states (invalid, disabled, readonly) and focus rings while delegating all form behavior to the underlying primitive.

```tsx
import { StyledInput } from "@solidiom/recipes-css"

;<StyledInput placeholder="Enter your email" type="email" />
;<StyledTextarea placeholder="Enter a message" rows={4} />
```

## Installation

```sh
pnpm add @solidiom/recipes-css @solidiom/recipes-tailwind @solidiom/recipes-unocss
```

Install the recipe package for your chosen styling profile. The component requires the corresponding `@solidiom/input` primitive as a peer dependency.

## Anatomy

The Input component wraps the `@solidiom/input` primitive. It exposes two parts through a recipe-applied composition layer:

- **StyledInput** — single-line text input with recipe styles and validation state hooks.
- **StyledTextarea** — multi-line textarea with the same styling conventions.

## Variants & states

Input does not use variants. Styling is driven by validation state:

- **Invalid** — red border when the input value fails validation.
- **Disabled** — muted background and reduced opacity.
- **Readonly** — muted background with a not-allowed cursor.
- **Focus** — primary-colored border with a focus ring on `:focus-visible`.

## Styling

Input is available in css, tailwind, unocss profiles. Each profile applies the same semantic states and focus behavior, allowing you to swap profiles without changing component usage.

Recipe classes follow the `solidiom-input` namespace for CSS profiling and targeting.

## SSR and hydration

Input renders as semantic HTML `<input>` or `<textarea>` during server rendering. Interactive behavior activates on hydration without layout shift. The recipe layer adds no JavaScript dependencies beyond the underlying primitive.

## Accessibility

Input delegates accessibility to `@solidiom/input`. See the [Input primitive accessibility contract](/primitives/input/accessibility/) for the full keyboard, focus, and ARIA contract. The recipe wrapper does not introduce new semantics or interact with the accessibility tree beyond styling.
