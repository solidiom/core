---
contentSchemaVersion: 1
title: Radio Group
description: Single-select radio button set with keyboard navigation.
keywords: [button, group, input, keyboard, navigation, radio, runtime]
locale: en
maturity: draft
product: Radio Group
productLayer: primitive
status: draft
package: "@solidiom/radio-group"
primitive: radio-group
section: overview
notApplicable:
  - section: relationships
    reason: Radio Group has no sibling primitives; it is used within other compositions but owns no inter-primitive contract.
  - section: migration
    reason: No prior API; this is the first shipped version.
  - section: testing
    reason: Standard testing guidance covers this primitive.
---

Single-select radio button set with keyboard navigation.

## Usage

Compose `Root`, `Item`, `Indicator`.

```tsx
import * as RadioGroup from "@solidiom/radio-group"

;<RadioGroup.Root>Radio Group content</RadioGroup.Root>
```

## Installation

Install the package with `pnpm add @solidiom/radio-group`. The package requires compatible `solid-js` and `@solidjs/web` peer dependencies.

## Parts

Radio Group exposes 3 parts:

- **Root** — `data-part="root"`.
- **Item** — `data-part="item"`.
- **Indicator** — `data-part="indicator"`.

## Styling

Radio Group carries `data-scope="radio-group"` and `data-part` attributes on each part for CSS/recipe targeting. State attributes like `data-state`, `data-disabled`, and `data-highlighted` are exposed where applicable.

## Keyboard & behavior

| Key                  | Behavior                                    |
| -------------------- | ------------------------------------------- |
| ArrowDown/ArrowRight | Moves selection to the next radio item.     |
| ArrowUp/ArrowLeft    | Moves selection to the previous radio item. |

## Composition

Radio Group is designed to compose with other primitives. Its parts can be combined with Field, Button, or other primitives as needed.

## SSR and hydration

Radio Group renders as semantic HTML during server rendering. Interactive behavior (keyboard handlers, state management) activates on hydration without layout shift.
