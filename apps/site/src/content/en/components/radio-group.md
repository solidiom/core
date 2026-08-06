---
contentSchemaVersion: 1
title: Radio Group
description: Styled radio group component — the recipe wrapper for the css, tailwind, unocss profile(s) using the radio-group primitive.
keywords: [radio-group, radio, selection, form, component, css, tailwind, unocss]
locale: en
maturity: draft
product: Radio Group
productLayer: component
status: draft
package: "@solidiom/recipes-css"
recipe: "radio-group"
stylingOutputs: ["css", "tailwind", "unocss"]
---

Styled radio group component — the recipe wrapper for the css, tailwind, unocss profile(s) using the radio-group primitive.

## Usage

The Radio Group component is a styled recipe wrapper around the `@solidiom/radio-group` primitive. It provides accessible single-selection from a group of options with roving tabindex keyboard navigation.

```tsx
import { StyledRadioGroup, RadioGroup } from "@solidiom/recipes-css"

;<StyledRadioGroup defaultValue="option1">
  <RadioGroup.Item value="option1">Option 1</RadioGroup.Item>
  <RadioGroup.Item value="option2">Option 2</RadioGroup.Item>
</StyledRadioGroup>
```

## Installation

```sh
pnpm add @solidiom/recipes-css @solidiom/recipes-tailwind @solidiom/recipes-unocss
```

Install the recipe package for your chosen styling profile. The component requires the corresponding `@solidiom/radio-group` primitive as a peer dependency.

## Anatomy

The Radio Group component wraps the `@solidiom/radio-group` primitive. It exposes the primitive's parts through a recipe-applied composition layer:

- **Root** — the wrapper element that applies recipe styles and delegates to the primitive.
- **Item** — individual radio option with roving tabindex.
- **Indicator** — visual indicator rendered inside an Item.

## Variants & states

Radio Group inherits its state support from `@solidiom/radio-group`. Items carry `data-state="checked"` or `data-state="unchecked"` attributes. The primitive supports `orientation` (horizontal/vertical) which affects keyboard navigation direction. Consult the primitive's documentation for the full list of supported props.

## Styling

Radio Group is available in css, tailwind, unocss profiles. Each profile applies the same semantic slots and variant classes, allowing you to swap profiles without changing component usage.

Recipe classes follow the `solidiom-radio-group` namespace for CSS profiling and targeting.

## SSR and hydration

Radio Group renders as semantic HTML during server rendering. The recipe layer adds no JavaScript dependencies beyond the underlying primitive.

## Accessibility

Radio Group delegates accessibility to `@solidiom/radio-group`. The primitive implements the WAI-ARIA radiogroup pattern with roving tabindex keyboard navigation where arrow keys move focus and select. See the primitive's `evidence.json` for the accessibility contract and test results.
