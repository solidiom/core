---
contentSchemaVersion: 1
title: Meter
description: Scalar measurement within a known range (e.g. disk usage, signal strength).
keywords: [disk, feedback, known, measurement, meter, range, runtime]
locale: en
maturity: ga
product: Meter
productLayer: primitive
status: draft
package: "@solidiom/meter"
primitive: meter
section: overview
notApplicable:
  - section: composition
    reason: Meter is a self-contained primitive with no compound sub-primitives to compose.
  - section: relationships
    reason: Meter has no sibling primitives; it is used within other compositions but owns no inter-primitive contract.
  - section: migration
    reason: No prior API; this is the first shipped version.
  - section: testing
    reason: Standard testing guidance covers this primitive.
---

Scalar measurement within a known range (e.g. disk usage, signal strength).

## Usage

Import and render `Root`.

```tsx
import * as Meter from "@solidiom/meter"

;<Meter.Root>Meter content</Meter.Root>
```

## Installation

Install the package with `pnpm add @solidiom/meter`. The package requires compatible `solid-js` and `@solidjs/web` peer dependencies.

## Parts

Meter exposes 1 part:

- **Root** — `data-part="root"`.

## Styling

Meter carries `data-scope="meter"` and `data-part` attributes on each part for CSS/recipe targeting. State attributes like `data-state`, `data-disabled`, and `data-highlighted` are exposed where applicable.

## Keyboard & behavior

This primitive has no keyboard interaction. It renders content that does not independently receive focus or respond to key events.

## SSR and hydration

Meter renders as semantic HTML during server rendering. Interactive behavior (keyboard handlers, state management) activates on hydration without layout shift.
