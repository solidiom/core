---
contentSchemaVersion: 1
title: Drawer
description: Slide-in panel from any screen edge.
keywords: [any, drawer, edge, from, overlay, panel, runtime]
locale: en
maturity: ga
product: Drawer
productLayer: primitive
status: draft
package: "@solidiom/drawer"
primitive: drawer
section: overview
notApplicable:
  - section: relationships
    reason: Drawer has no sibling primitives; it is used within other compositions but owns no inter-primitive contract.
  - section: migration
    reason: No prior API; this is the first shipped version.
  - section: testing
    reason: Standard testing guidance covers this primitive.
---

Slide-in panel from any screen edge.

## Usage

Compose `Root`, `Trigger`, `Backdrop`, `Content`, `Close`, `Title`, `Description`.

```tsx
import * as Drawer from "@solidiom/drawer"

;<Drawer.Root>Drawer content</Drawer.Root>
```

## Installation

Install the package with `pnpm add @solidiom/drawer`. The package requires compatible `solid-js` and `@solidjs/web` peer dependencies.

## Parts

Drawer exposes 7 parts:

- **Root** — `data-part="root"`.
- **Trigger** — `data-part="trigger"`.
- **Backdrop** — `data-part="backdrop"`.
- **Content** — `data-part="content"`.
- **Close** — `data-part="close"`.
- **Title** — `data-part="title"`.
- **Description** — `data-part="description"`.

## Styling

Drawer carries `data-scope="drawer"` and `data-part` attributes on each part for CSS/recipe targeting. State attributes like `data-state`, `data-disabled`, and `data-highlighted` are exposed where applicable.

## Keyboard & behavior

This primitive has no keyboard interaction. It renders content that does not independently receive focus or respond to key events.

## Composition

Drawer is designed to compose with other primitives. Its parts can be combined with Field, Button, or other primitives as needed.

## SSR and hydration

Drawer renders as semantic HTML during server rendering. Interactive behavior (keyboard handlers, state management) activates on hydration without layout shift.
