---
contentSchemaVersion: 1
title: Separator
description: Horizontal or vertical visual divider with semantic markup.
keywords: [separator, divider, horizontal, vertical, decorative]
locale: en
maturity: draft
product: Separator
productLayer: primitive
status: draft
package: "@solidiom/separator"
primitive: separator
section: overview
notApplicable:
  - section: composition
    reason: Self-contained primitive with no compound sub-primitives to compose.
  - section: relationships
    reason: No sibling primitives; used within other compositions but owns no inter-primitive contract.
  - section: migration
    reason: No prior API; this is the first shipped version.
  - section: testing
    reason: Standard testing guidance covers this primitive. No primitive-specific non-obvious behavior exists.
---

Separator renders a visual divider between content sections with accessible semantics. It supports horizontal and vertical orientations and can be marked as purely decorative to hide from the accessibility tree.

## Usage

Separator has a single `Root` part. Configure orientation and decorative state through props.

```tsx
import * as Separator from "@solidiom/separator"

;<Separator.Root />
```

## Installation

Install the package with `pnpm add @solidiom/separator`. The package requires compatible `solid-js` and `@solidjs/web` peer dependencies.

## Props

| Prop          | Type                         | Default        | Description                                                                           |
| ------------- | ---------------------------- | -------------- | ------------------------------------------------------------------------------------- |
| `orientation` | `"horizontal" \| "vertical"` | `"horizontal"` | Orientation of the separator.                                                         |
| `decorative`  | `boolean`                    | `false`        | When true, the separator is purely decorative and hidden from the accessibility tree. |

## Styling

Separator carries `data-scope="separator"`, `data-part="root"`, and `data-orientation` attributes. Style it with appropriate borders, margins, or background colors for your design system. The element renders as a `<div>`; apply your visual recipe using the data attributes for targeting.

## Keyboard & behavior

This primitive has no keyboard interaction. It renders static content that does not receive focus or respond to key events.

## SSR and hydration

Separator is a passive display element with no interactive state. It renders as static HTML and requires no client-side hydration.
