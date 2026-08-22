---
contentSchemaVersion: 1
title: Date Range Input
description: Date range selection with start/end text fields and calendar picker.
keywords: [date range, date input, calendar, picker, start, end, validation]
locale: en
maturity: ga
product: Date Range Input
productLayer: primitive
status: draft
package: "@solidiom/date-range-input"
primitive: date-range-input
section: overview
notApplicable:
  - section: migration
    reason: No prior API; this is the first shipped version.
  - section: testing
    reason: Standard testing guidance covers this primitive.
---

Date Range Input provides date range selection through start and end text fields paired with a calendar picker. It carries semantic data attributes for styling hooks, integrates validation state, and participates in native forms.

## Usage

Compose `Root`, `StartInput`, `EndInput`, `Separator`, and `Trigger`. The `Trigger` opens the picker, and the primitive is designed to compose with a calendar popover primitive for date selection.

```tsx
import * as DateRangeInput from "@solidiom/date-range-input"

;<DateRangeInput.Root>
  <DateRangeInput.StartInput />
  <DateRangeInput.Separator>–</DateRangeInput.Separator>
  <DateRangeInput.EndInput />
  <DateRangeInput.Trigger>Open calendar</DateRangeInput.Trigger>
</DateRangeInput.Root>
```

## Installation

Install the package with `pnpm add @solidiom/date-range-input`. The package requires compatible `solid-js` and `@solidjs/web` peer dependencies.

## Parts

date-range-input exposes 5 parts:

- **Root** — the container that manages range state, validation, and native form participation.
- **StartInput** — the text field for the start of the range.
- **EndInput** — the text field for the end of the range.
- **Separator** — the visual divider between the start and end fields.
- **Trigger** — the control that opens the calendar picker.

## Styling

date-range-input carries `data-scope="date-range-input"` and `data-part` attributes on each part for CSS/recipe targeting. Validation state is exposed via semantic data attributes for styling hooks.

## Keyboard & behavior

This primitive activates the calendar picker via the Trigger and participates in native forms; its interaction beyond opening the picker is delegated to the composed calendar popover. Keyboard handling within the picker is provided by that primitive.

## Composition

Designed to compose with a calendar popover primitive for date picking; the Trigger opens the picker while StartInput and EndInput accept typed entry.

## SSR and hydration

The fields render as static HTML on the server and participate in native form submission. Interactive handlers, including the picker Trigger, activate on hydration.
