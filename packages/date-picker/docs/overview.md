---
contentSchemaVersion: 1
title: Date Picker
description: Calendar popup for selecting dates.
keywords: [calendar, date, date-math, dates, for, input, picker]
locale: en
maturity: ga
product: Date Picker
productLayer: primitive
status: draft
package: "@solidiom/date-picker"
primitive: date-picker
section: overview
notApplicable:
  - section: relationships
    reason: Date Picker has no sibling primitives; it is used within other compositions but owns no inter-primitive contract.
  - section: migration
    reason: No prior API; this is the first shipped version.
  - section: testing
    reason: Standard testing guidance covers this primitive.
---

Calendar popup for selecting dates.

## Usage

Compose `Root`, `Input`, `Trigger`, `Content`, `Calendar`, `Header`, `Grid`, `Cell`.

```tsx
import * as DatePicker from "@solidiom/date-picker"

;<DatePicker.Root>Date Picker content</DatePicker.Root>
```

## Installation

Install the package with `pnpm add @solidiom/date-picker`. The package requires compatible `solid-js` and `@solidjs/web` peer dependencies.

## Parts

Date Picker exposes 8 parts:

- **Root** — `data-part="root"`.
- **Input** — `data-part="input"`.
- **Trigger** — `data-part="trigger"`.
- **Content** — `data-part="content"`.
- **Calendar** — `data-part="calendar"`.
- **Header** — `data-part="header"`.
- **Grid** — `data-part="grid"`.
- **Cell** — `data-part="cell"`.

## Styling

Date Picker carries `data-scope="date-picker"` and `data-part` attributes on each part for CSS/recipe targeting. State attributes like `data-state`, `data-disabled`, and `data-highlighted` are exposed where applicable.

## Keyboard & behavior

This primitive has no keyboard interaction. It renders content that does not independently receive focus or respond to key events.

## Composition

Date Picker is designed to compose with other primitives. Its parts can be combined with Field, Button, or other primitives as needed.

## SSR and hydration

Date Picker renders as semantic HTML during server rendering. Interactive behavior (keyboard handlers, state management) activates on hydration without layout shift.
