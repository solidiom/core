---
contentSchemaVersion: 1
title: Combobox
description: Styled combobox component — the recipe wrapper for the css, tailwind, unocss profile(s) using the combobox primitive.
keywords: [combobox, autocomplete, selection, input, component, css, tailwind, unocss]
locale: en
maturity: beta
product: Combobox
productLayer: component
status: published
package: "@solidiom/recipes-css"
recipe: "combobox"
stylingOutputs: ["css", "tailwind", "unocss"]
---

Styled combobox component — the recipe wrapper for the css, tailwind, unocss profile(s) using the combobox primitive.

## Usage

The Combobox component is a styled recipe wrapper around the `@solidiom/combobox` primitive. It provides an autocomplete dropdown with filtering and keyboard navigation.

```tsx
import { StyledCombobox, Combobox } from "@solidiom/recipes-css"

;<StyledCombobox>
  <Combobox.Input placeholder="Search..." />
  <Combobox.Content>
    <Combobox.Item value="apple">Apple</Combobox.Item>
    <Combobox.Item value="banana">Banana</Combobox.Item>
  </Combobox.Content>
</StyledCombobox>
```

## Installation

```sh
pnpm add @solidiom/recipes-css @solidiom/recipes-tailwind @solidiom/recipes-unocss
```

Install the recipe package for your chosen styling profile. The component requires the corresponding `@solidiom/combobox` primitive as a peer dependency.

## Anatomy

The Combobox component wraps the `@solidiom/combobox` primitive. It exposes the primitive's parts through a recipe-applied composition layer:

- **Root** — the wrapper element that applies recipe styles and delegates to the primitive.
- **Input** — the text input for filtering options.
- **Content** — the dropdown content container.
- **Item** — individual selectable option.
- **ItemText** — text content within an item.

## Variants & states

Combobox inherits its state support from `@solidiom/combobox`. Items carry `data-state` and `data-selected` attributes. The primitive manages open/closed state and filtered item highlighting. Consult the primitive's documentation for the full list of supported props.

## Styling

Combobox is available in css, tailwind, unocss profiles. Each profile applies the same semantic slots and variant classes, allowing you to swap profiles without changing component usage.

Recipe classes follow the `solidiom-combobox` namespace for CSS profiling and targeting.

## SSR and hydration

Combobox renders as semantic HTML during server rendering. The recipe layer adds no JavaScript dependencies beyond the underlying primitive.

## Accessibility

Combobox delegates accessibility to `@solidiom/combobox`. The primitive implements the WAI-ARIA combobox pattern with proper keyboard navigation, focus management, and screen reader support. See the [Combobox primitive accessibility contract](/primitives/combobox/accessibility/) for the full keyboard, focus, and ARIA contract. The recipe wrapper does not introduce new semantics or interact with the accessibility tree beyond styling.
