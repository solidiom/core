---
contentSchemaVersion: 1
title: Virtual List
description: Viewport-windowed list for large datasets.
keywords: [datasets, for, large, layout, list, runtime, viewport]
locale: en
maturity: draft
product: Virtual List
productLayer: primitive
status: draft
package: "@solidiom/virtual-list"
primitive: virtual-list
section: overview
notApplicable:
  - section: composition
    reason: Virtual List is a self-contained primitive with no compound sub-primitives to compose.
  - section: relationships
    reason: Virtual List has no sibling primitives; it is used within other compositions but owns no inter-primitive contract.
  - section: migration
    reason: No prior API; this is the first shipped version.
  - section: testing
    reason: Standard testing guidance covers this primitive.
---

Viewport-windowed list for large datasets.

## Usage

Compose `Root`, `Item`.

```tsx
import * as VirtualList from "@solidiom/virtual-list"

;<VirtualList.Root>Virtual List content</VirtualList.Root>
```

## Installation

Install the package with `pnpm add @solidiom/virtual-list`. The package requires compatible `solid-js` and `@solidjs/web` peer dependencies.

## Parts

Virtual List exposes 2 parts:

- **Root** — `data-part="root"`.
- **Item** — `data-part="item"`.

## Styling

Virtual List carries `data-scope="virtual-list"` and `data-part` attributes on each part for CSS/recipe targeting. State attributes like `data-state`, `data-disabled`, and `data-highlighted` are exposed where applicable.

## Keyboard & behavior

This primitive has no keyboard interaction. It renders content that does not independently receive focus or respond to key events.

## SSR and hydration

Virtual List renders as semantic HTML during server rendering. Interactive behavior (keyboard handlers, state management) activates on hydration without layout shift.
