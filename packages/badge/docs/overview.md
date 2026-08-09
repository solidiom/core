---
contentSchemaVersion: 1
title: Badge
description: Inline status or label indicator with semantic markup.
keywords: [badge, label, status, indicator, inline]
locale: en
maturity: ga
product: Badge
productLayer: primitive
status: draft
package: "@solidiom/badge"
primitive: badge
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

Badge renders a small inline label or status indicator with accessible semantics. It provides a headless primitive that carries semantic data attributes for styling integration with your design system.

## Usage

Badge has a single `Root` part. Pass content as children.

```tsx
import * as Badge from "@solidiom/badge"

;<Badge.Root>New</Badge.Root>
```

## Installation

Install the package with `pnpm add @solidiom/badge`. The package requires compatible `solid-js` and `@solidjs/web` peer dependencies.

## Props

| Prop       | Type          | Default | Description                          |
| ---------- | ------------- | ------- | ------------------------------------ |
| `children` | `JSX.Element` | —       | Content to display inside the badge. |
| `class`    | `string`      | —       | Additional CSS class for styling.    |

## Styling

Badge carries `data-scope="badge"` and `data-part="root"` attributes. Style it with appropriate background colors, text colors, padding, and border-radius for your design system. The element renders as a `<span>`; apply your visual recipe using the data attributes for targeting.

## Keyboard & behavior

This primitive has no keyboard interaction. It renders static content that does not receive focus or respond to key events.

## SSR and hydration

Badge is a passive display element with no interactive state. It renders as static HTML and requires no client-side hydration.
