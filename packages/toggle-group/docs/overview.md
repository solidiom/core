---
contentSchemaVersion: 1
title: Toggle Group
description: Group of mutually-exclusive or multi-select toggle buttons.
keywords: [buttons, exclusive, group, input, multi, mutually, runtime]
locale: en
maturity: ga
product: Toggle Group
productLayer: primitive
status: draft
package: "@solidiom/toggle-group"
primitive: toggle-group
section: overview
notApplicable:
  - section: composition
    reason: Toggle Group is a self-contained primitive with no compound sub-primitives to compose.
  - section: relationships
    reason: Toggle Group has no sibling primitives; it is used within other compositions but owns no inter-primitive contract.
  - section: migration
    reason: No prior API; this is the first shipped version.
  - section: testing
    reason: Standard testing guidance covers this primitive.
---

Group of mutually-exclusive or multi-select toggle buttons.

## Usage

Compose `Root`, `Item`.

```tsx
import * as ToggleGroup from "@solidiom/toggle-group"

;<ToggleGroup.Root>Toggle Group content</ToggleGroup.Root>
```

## Installation

Install the package with `pnpm add @solidiom/toggle-group`. The package requires compatible `solid-js` and `@solidjs/web` peer dependencies.

## Parts

Toggle Group exposes 2 parts:

- **Root** — `data-part="root"`.
- **Item** — `data-part="item"`.

## Styling

Toggle Group carries `data-scope="toggle-group"` and `data-part` attributes on each part for CSS/recipe targeting. State attributes like `data-state`, `data-disabled`, and `data-highlighted` are exposed where applicable.

## Keyboard & behavior

This primitive has no keyboard interaction. It renders content that does not independently receive focus or respond to key events.

## SSR and hydration

Toggle Group renders as semantic HTML during server rendering. Interactive behavior (keyboard handlers, state management) activates on hydration without layout shift.
