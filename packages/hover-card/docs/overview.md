---
contentSchemaVersion: 1
title: Hover Card
description: Content preview on hover with open delay and anchored positioning.
keywords: [anchored, and, card, content, delay, hover, open]
locale: en
maturity: draft
product: Hover Card
productLayer: primitive
status: draft
package: "@solidiom/hover-card"
primitive: hover-card
section: overview
notApplicable:
  - section: relationships
    reason: Hover Card has no sibling primitives; it is used within other compositions but owns no inter-primitive contract.
  - section: migration
    reason: No prior API; this is the first shipped version.
  - section: testing
    reason: Standard testing guidance covers this primitive.
---

Content preview on hover with open delay and anchored positioning.

## Usage

Compose `Root`, `Trigger`, `Content`.

```tsx
import * as HoverCard from "@solidiom/hover-card"

;<HoverCard.Root>Hover Card content</HoverCard.Root>
```

## Installation

Install the package with `pnpm add @solidiom/hover-card`. The package requires compatible `solid-js` and `@solidjs/web` peer dependencies.

## Parts

Hover Card exposes 3 parts:

- **Root** — `data-part="root"`.
- **Trigger** — `data-part="trigger"`.
- **Content** — `data-part="content"`.

## Styling

Hover Card carries `data-scope="hover-card"` and `data-part` attributes on each part for CSS/recipe targeting. State attributes like `data-state`, `data-disabled`, and `data-highlighted` are exposed where applicable.

## Keyboard & behavior

This primitive has no keyboard interaction. It renders content that does not independently receive focus or respond to key events.

## Composition

Hover Card is designed to compose with other primitives. Its parts can be combined with Field, Button, or other primitives as needed.

## SSR and hydration

Hover Card renders as semantic HTML during server rendering. Interactive behavior (keyboard handlers, state management) activates on hydration without layout shift.
