---
contentSchemaVersion: 1
title: Tooltip
description: Contextual hint shown on hover/focus.
keywords: [contextual, focus, hint, hover, overlay, positioning, runtime]
locale: en
maturity: ga
product: Tooltip
productLayer: primitive
status: draft
package: "@solidiom/tooltip"
primitive: tooltip
section: overview
notApplicable:
  - section: relationships
    reason: Tooltip has no sibling primitives; it is used within other compositions but owns no inter-primitive contract.
  - section: migration
    reason: No prior API; this is the first shipped version.
  - section: testing
    reason: Standard testing guidance covers this primitive.
---

Contextual hint shown on hover/focus.

## Usage

Compose `Root`, `Trigger`, `Content`.

```tsx
import * as Tooltip from "@solidiom/tooltip"

;<Tooltip.Root>Tooltip content</Tooltip.Root>
```

## Installation

Install the package with `pnpm add @solidiom/tooltip`. The package requires compatible `solid-js` and `@solidjs/web` peer dependencies.

## Parts

Tooltip exposes 3 parts:

- **Root** — `data-part="root"`.
- **Trigger** — `data-part="trigger"`.
- **Content** — `data-part="content"`.

## Styling

Tooltip carries `data-scope="tooltip"` and `data-part` attributes on each part for CSS/recipe targeting. State attributes like `data-state`, `data-disabled`, and `data-highlighted` are exposed where applicable.

## Keyboard & behavior

This primitive has no keyboard interaction. It renders content that does not independently receive focus or respond to key events.

## Composition

Tooltip is designed to compose with other primitives. Its parts can be combined with Field, Button, or other primitives as needed.

## SSR and hydration

Tooltip renders as semantic HTML during server rendering. Interactive behavior (keyboard handlers, state management) activates on hydration without layout shift.
