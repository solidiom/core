---
contentSchemaVersion: 1
title: Scroll Area
description: Custom-styled scrollbar with native scrolling performance.
keywords: [area, custom, layout, native, performance, runtime, scroll]
locale: en
maturity: ga
product: Scroll Area
productLayer: primitive
status: draft
package: "@solidiom/scroll-area"
primitive: scroll-area
section: overview
notApplicable:
  - section: relationships
    reason: Scroll Area has no sibling primitives; it is used within other compositions but owns no inter-primitive contract.
  - section: migration
    reason: No prior API; this is the first shipped version.
  - section: testing
    reason: Standard testing guidance covers this primitive.
---

Custom-styled scrollbar with native scrolling performance.

## Usage

Compose `Root`, `Viewport`, `Scrollbar`, `Thumb`.

```tsx
import * as ScrollArea from "@solidiom/scroll-area"

;<ScrollArea.Root>Scroll Area content</ScrollArea.Root>
```

## Installation

Install the package with `pnpm add @solidiom/scroll-area`. The package requires compatible `solid-js` and `@solidjs/web` peer dependencies.

## Parts

Scroll Area exposes 4 parts:

- **Root** — `data-part="root"`.
- **Viewport** — `data-part="viewport"`.
- **Scrollbar** — `data-part="scrollbar"`.
- **Thumb** — `data-part="thumb"`.

## Styling

Scroll Area carries `data-scope="scroll-area"` and `data-part` attributes on each part for CSS/recipe targeting. State attributes like `data-state`, `data-disabled`, and `data-highlighted` are exposed where applicable.

## Keyboard & behavior

This primitive has no keyboard interaction. It renders content that does not independently receive focus or respond to key events.

## Composition

Scroll Area is designed to compose with other primitives. Its parts can be combined with Field, Button, or other primitives as needed.

## SSR and hydration

Scroll Area renders as semantic HTML during server rendering. Interactive behavior (keyboard handlers, state management) activates on hydration without layout shift.
