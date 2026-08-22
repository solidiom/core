---
contentSchemaVersion: 1
title: Number Input
description: Numeric input with increment/decrement controls and locale-aware formatting.
keywords: [number input, spinbutton, increment, decrement, numeric, locale, formatting]
locale: en
maturity: ga
product: Number Input
productLayer: primitive
status: draft
package: "@solidiom/number-input"
primitive: number-input
section: overview
notApplicable:
  - section: migration
    reason: No prior API; this is the first shipped version.
  - section: testing
    reason: Standard testing guidance covers this primitive.
---

Number Input is a numeric field with increment and decrement controls and locale-aware formatting. It implements the WAI-ARIA spinbutton pattern.

## Usage

Compose `Root`, `Input`, `IncrementButton`, and `DecrementButton`. The buttons step the value and the `Input` accepts typed numeric entry.

```tsx
import * as NumberInput from "@solidiom/number-input"

;<NumberInput.Root>
  <NumberInput.DecrementButton>−</NumberInput.DecrementButton>
  <NumberInput.Input />
  <NumberInput.IncrementButton>+</NumberInput.IncrementButton>
</NumberInput.Root>
```

## Installation

Install the package with `pnpm add @solidiom/number-input`. The package requires compatible `solid-js` and `@solidjs/web` peer dependencies.

## Parts

number-input exposes 4 parts:

- **Root** — the container implementing the spinbutton pattern and locale-aware formatting.
- **Input** — the numeric text field.
- **IncrementButton** — steps the value up.
- **DecrementButton** — steps the value down.

## Styling

number-input carries `data-scope="number-input"` and `data-part` attributes on each part for CSS/recipe targeting.

## Keyboard & behavior

number-input follows the WAI-ARIA spinbutton pattern with locale-aware formatting.

| Key       | Behavior                   |
| --------- | -------------------------- |
| ArrowUp   | Increment the value        |
| ArrowDown | Decrement the value        |
| Home      | Set the value to the min   |
| End       | Set the value to the max   |
| PageUp    | Increment by a larger step |
| PageDown  | Decrement by a larger step |

## Composition

Compose with label and field primitives to build a labeled, validated numeric control.

## SSR and hydration

The field renders as static HTML on the server; spinbutton keyboard handlers and the increment/decrement buttons activate on hydration.
