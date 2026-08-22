---
contentSchemaVersion: 1
title: Segmented Control
description: Mutually exclusive option selector with connected segments.
keywords: [segmented control, radio group, selector, segments, roving focus, indicator]
locale: en
maturity: ga
product: Segmented Control
productLayer: primitive
status: draft
package: "@solidiom/segmented-control"
primitive: segmented-control
section: overview
notApplicable:
  - section: migration
    reason: No prior API; this is the first shipped version.
  - section: testing
    reason: Standard testing guidance covers this primitive.
---

Segmented Control is a mutually exclusive option selector rendered as connected segments. It provides accessible radio-group semantics, roving focus keyboard navigation, an animated `Indicator`, and native form participation via hidden radio inputs.

## Usage

Compose `Root`, `Item`, and `Indicator`. Each `Item` is a selectable segment and the `Indicator` animates to the active one.

```tsx
import * as SegmentedControl from "@solidiom/segmented-control"

;<SegmentedControl.Root>
  <SegmentedControl.Item value="list">List</SegmentedControl.Item>
  <SegmentedControl.Item value="grid">Grid</SegmentedControl.Item>
  <SegmentedControl.Indicator />
</SegmentedControl.Root>
```

## Installation

Install the package with `pnpm add @solidiom/segmented-control`. The package requires compatible `solid-js` and `@solidjs/web` peer dependencies.

## Parts

segmented-control exposes 3 parts:

- **Root** — the radio-group container managing selection, roving focus, and hidden radio inputs.
- **Item** — a selectable segment.
- **Indicator** — the animated element that tracks the active segment.

## Styling

segmented-control carries `data-scope="segmented-control"` and `data-part` attributes on each part for CSS/recipe targeting.

## Keyboard & behavior

segmented-control uses accessible radio-group semantics with roving focus.

| Key        | Behavior                                       |
| ---------- | ---------------------------------------------- |
| Arrow keys | Move selection between segments (roving focus) |

## Composition

Compose with icon or label content inside each `Item` to build a labeled option selector; native form participation is handled via hidden radio inputs.

## SSR and hydration

The segments render as static HTML with hidden radio inputs for form participation; roving focus and the animated indicator activate on hydration.
