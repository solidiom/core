---
contentSchemaVersion: 1
title: Date Picker
description: Styled date picker component — the recipe wrapper for the css, tailwind, unocss profile(s) using the date-picker primitive.
keywords: [date-picker, date, input, component, css, tailwind, unocss]
locale: en
maturity: beta
product: Date Picker
productLayer: component
status: published
package: "@solidiom/date-picker"
---

Styled date picker component — the recipe wrapper for the css, tailwind, unocss profile(s) using the date-picker primitive.

## Usage

The Date Picker component is a styled recipe wrapper around the `@solidiom/date-picker` primitive. It adds composition, semantic styling slots, and variant support while delegating all state management and keyboard behavior to the underlying primitive.

```tsx
import * as DatePicker from "@solidiom/date-picker"

;<DatePicker.Root>
  <DatePicker.Label>Select date</DatePicker.Label>
  <DatePicker.Input />
  <DatePicker.Trigger />
  <DatePicker.Content>
    <DatePicker.Calendar />
  </DatePicker.Content>
</DatePicker.Root>
```

## Installation

```sh
pnpm add @solidiom/date-picker
```

Install the recipe package for your chosen styling profile. The component requires the corresponding `@solidiom/date-picker` primitive as a peer dependency.

## Anatomy

The Date Picker component wraps the `@solidiom/date-picker` primitive. It exposes the primitive's parts through a recipe-applied composition layer:

- **Root** — the wrapper element that manages picker state.
- **Label** — the accessible label for the input.
- **Input** — the text input displaying the selected date.
- **Trigger** — the button that opens the calendar popup.
- **Content** — the popup container for the calendar.
- **Calendar** — the embedded calendar for date selection.

## Variants & states

Date Picker inherits its variant and state support from `@solidiom/date-picker`. Consult the primitive's documentation for the full list of supported variants, compound variants, and interactive states.

## Styling

Date Picker is available in css, tailwind, unocss profiles. Each profile applies the same semantic slots and variant classes, allowing you to swap profiles without changing component usage.

Recipe classes follow the `solidiom-date-picker` namespace for CSS profiling and targeting.

## SSR and hydration

Date Picker renders as semantic HTML during server rendering. Interactive behavior activates on hydration without layout shift. The recipe layer adds no JavaScript dependencies beyond the underlying primitive.

## Accessibility

Date Picker delegates accessibility to `@solidiom/date-picker`. See the [Date Picker primitive accessibility contract](/primitives/date-picker/accessibility/) for the full keyboard, focus, and ARIA contract. The recipe wrapper does not introduce new semantics or interact with the accessibility tree beyond styling.
