---
contentSchemaVersion: 1
title: Badge
description: Inline status or label indicator with semantic markup.
keywords: [badge, label, status, indicator, inline]
locale: en
maturity: draft
product: Badge
productLayer: primitive
status: draft
package: "@solidiom/badge"
primitive: badge
section: overview
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

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `JSX.Element` | — | Content to display inside the badge. |
| `class` | `string` | — | Additional CSS class for styling. |

## Styling

Badge carries `data-scope="badge"` and `data-part="root"` attributes. Style it with appropriate background colors, text colors, padding, and border-radius for your design system. The element renders as a `<span>`; apply your visual recipe using the data attributes for targeting.

## SSR and hydration

Badge is a passive display element with no interactive state. It renders as static HTML and requires no client-side hydration.