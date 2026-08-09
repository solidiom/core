---
contentSchemaVersion: 1
title: Calendar
description: Date selection with day/month/year views.
keywords: [calendar, date, date-math, day, input, month, runtime]
locale: en
maturity: ga
product: Calendar
productLayer: primitive
status: draft
package: "@solidiom/calendar"
primitive: calendar
section: overview
notApplicable:
  - section: relationships
    reason: Calendar has no sibling primitives; it is used within other compositions but owns no inter-primitive contract.
  - section: migration
    reason: No prior API; this is the first shipped version.
  - section: testing
    reason: Standard testing guidance covers this primitive.
---

Date selection with day/month/year views.

## Usage

Compose `Root`, `Header`, `PrevButton`, `Title`, `NextButton`, `Grid`, `Cell`.

```tsx
import * as Calendar from "@solidiom/calendar"

;<Calendar.Root>Calendar content</Calendar.Root>
```

## Installation

Install the package with `pnpm add @solidiom/calendar`. The package requires compatible `solid-js` and `@solidjs/web` peer dependencies.

## Parts

Calendar exposes 7 parts:

- **Root** — `data-part="root"`.
- **Header** — `data-part="header"`.
- **PrevButton** — `data-part="prevbutton"`.
- **Title** — `data-part="title"`.
- **NextButton** — `data-part="nextbutton"`.
- **Grid** — `data-part="grid"`.
- **Cell** — `data-part="cell"`.

## Styling

Calendar carries `data-scope="calendar"` and `data-part` attributes on each part for CSS/recipe targeting. State attributes like `data-state`, `data-disabled`, and `data-highlighted` are exposed where applicable.

## Keyboard & behavior

This primitive has no keyboard interaction. It renders content that does not independently receive focus or respond to key events.

## Composition

Calendar is designed to compose with other primitives. Its parts can be combined with Field, Button, or other primitives as needed.

## SSR and hydration

Calendar renders as semantic HTML during server rendering. Interactive behavior (keyboard handlers, state management) activates on hydration without layout shift.
