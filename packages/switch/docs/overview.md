---
contentSchemaVersion: 1
title: Switch
description: Binary toggle with on/off semantics.
keywords: [binary, input, off, runtime, semantics, switch, toggle]
locale: en
maturity: draft
product: Switch
productLayer: primitive
status: draft
package: "@solidiom/switch"
primitive: switch
section: overview
notApplicable:
  - section: composition
    reason: Switch is a self-contained primitive with no compound sub-primitives to compose.
  - section: relationships
    reason: Switch has no sibling primitives; it is used within other compositions but owns no inter-primitive contract.
  - section: migration
    reason: No prior API; this is the first shipped version.
  - section: testing
    reason: Standard testing guidance covers this primitive.
---

Binary toggle with on/off semantics.

## Usage

Compose `Root`, `Thumb`.

```tsx
import * as Switch from "@solidiom/switch"

;<Switch.Root>Switch content</Switch.Root>
```

## Installation

Install the package with `pnpm add @solidiom/switch`. The package requires compatible `solid-js` and `@solidjs/web` peer dependencies.

## Parts

Switch exposes 2 parts:

- **Root** — `data-part="root"`.
- **Thumb** — `data-part="thumb"`.

## Styling

Switch carries `data-scope="switch"` and `data-part` attributes on each part for CSS/recipe targeting. State attributes like `data-state`, `data-disabled`, and `data-highlighted` are exposed where applicable.

## Keyboard & behavior

| Key   | Behavior                               |
| ----- | -------------------------------------- |
| Space | Toggles the switch between on and off. |
| Enter | Toggles the switch between on and off. |

## SSR and hydration

Switch renders as semantic HTML during server rendering. Interactive behavior (keyboard handlers, state management) activates on hydration without layout shift.
