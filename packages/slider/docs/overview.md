---
contentSchemaVersion: 1
title: Slider
description: Numeric range input with thumb control.
keywords: [control, input, numeric, range, runtime, slider, thumb]
locale: en
maturity: draft
product: Slider
productLayer: primitive
status: draft
package: "@solidiom/slider"
primitive: slider
section: overview
notApplicable:
  - section: relationships
    reason: Slider has no sibling primitives; it is used within other compositions but owns no inter-primitive contract.
  - section: migration
    reason: No prior API; this is the first shipped version.
  - section: testing
    reason: Standard testing guidance covers this primitive.
---

Numeric range input with thumb control.

## Usage

Compose `Root`, `Track`, `Range`, `Thumb`.

```tsx
import * as Slider from "@solidiom/slider"

;<Slider.Root>Slider content</Slider.Root>
```

## Installation

Install the package with `pnpm add @solidiom/slider`. The package requires compatible `solid-js` and `@solidjs/web` peer dependencies.

## Parts

Slider exposes 4 parts:

- **Root** — `data-part="root"`.
- **Track** — `data-part="track"`.
- **Range** — `data-part="range"`.
- **Thumb** — `data-part="thumb"`.

## Styling

Slider carries `data-scope="slider"` and `data-part` attributes on each part for CSS/recipe targeting. State attributes like `data-state`, `data-disabled`, and `data-highlighted` are exposed where applicable.

## Keyboard & behavior

This primitive has no keyboard interaction. It renders content that does not independently receive focus or respond to key events.

## Composition

Slider is designed to compose with other primitives. Its parts can be combined with Field, Button, or other primitives as needed.

## SSR and hydration

Slider renders as semantic HTML during server rendering. Interactive behavior (keyboard handlers, state management) activates on hydration without layout shift.
