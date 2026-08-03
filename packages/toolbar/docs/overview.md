---
contentSchemaVersion: 1
title: Toolbar
description: Grouped actions and controls in a horizontal bar.
keywords: [actions, and, bar, controls, grouped, horizontal, layout]
locale: en
maturity: draft
product: Toolbar
productLayer: primitive
status: draft
package: "@solidiom/toolbar"
primitive: toolbar
section: overview
notApplicable:
  - section: relationships
    reason: Toolbar has no sibling primitives; it is used within other compositions but owns no inter-primitive contract.
  - section: migration
    reason: No prior API; this is the first shipped version.
  - section: testing
    reason: Standard testing guidance covers this primitive.
---

Grouped actions and controls in a horizontal bar.

## Usage

Compose `Root`, `Button`, `Separator`, `ToggleGroup`, `ToggleItem`.

```tsx
import * as Toolbar from "@solidiom/toolbar"

;<Toolbar.Root>Toolbar content</Toolbar.Root>
```

## Installation

Install the package with `pnpm add @solidiom/toolbar`. The package requires compatible `solid-js` and `@solidjs/web` peer dependencies.

## Parts

Toolbar exposes 5 parts:

- **Root** — `data-part="root"`.
- **Button** — `data-part="button"`.
- **Separator** — `data-part="separator"`.
- **ToggleGroup** — `data-part="togglegroup"`.
- **ToggleItem** — `data-part="toggleitem"`.

## Styling

Toolbar carries `data-scope="toolbar"` and `data-part` attributes on each part for CSS/recipe targeting. State attributes like `data-state`, `data-disabled`, and `data-highlighted` are exposed where applicable.

## Keyboard & behavior

This primitive has no keyboard interaction. It renders content that does not independently receive focus or respond to key events.

## Composition

Toolbar is designed to compose with other primitives. Its parts can be combined with Field, Button, or other primitives as needed.

## SSR and hydration

Toolbar renders as semantic HTML during server rendering. Interactive behavior (keyboard handlers, state management) activates on hydration without layout shift.
