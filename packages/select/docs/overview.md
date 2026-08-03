---
contentSchemaVersion: 1
title: Select
description: Dropdown selection from a list of options.
keywords: [dropdown, from, input, list, options, runtime, select]
locale: en
maturity: draft
product: Select
productLayer: primitive
status: draft
package: "@solidiom/select"
primitive: select
section: overview
notApplicable:
  - section: relationships
    reason: Select has no sibling primitives; it is used within other compositions but owns no inter-primitive contract.
  - section: migration
    reason: No prior API; this is the first shipped version.
  - section: testing
    reason: Standard testing guidance covers this primitive.
---

Dropdown selection from a list of options.

## Usage

Compose `Root`, `Trigger`, `Content`, `Item`, `Value`, `HiddenInput`, `ScrollUpButton`, `ScrollDownButton`.

```tsx
import * as Select from "@solidiom/select"

;<Select.Root>Select content</Select.Root>
```

## Installation

Install the package with `pnpm add @solidiom/select`. The package requires compatible `solid-js` and `@solidjs/web` peer dependencies.

## Parts

Select exposes 8 parts:

- **Root** — `data-part="root"`.
- **Trigger** — `data-part="trigger"`.
- **Content** — `data-part="content"`.
- **Item** — `data-part="item"`.
- **Value** — `data-part="value"`.
- **HiddenInput** — `data-part="hiddeninput"`.
- **ScrollUpButton** — `data-part="scrollupbutton"`.
- **ScrollDownButton** — `data-part="scrolldownbutton"`.

## Styling

Select carries `data-scope="select"` and `data-part` attributes on each part for CSS/recipe targeting. State attributes like `data-state`, `data-disabled`, and `data-highlighted` are exposed where applicable.

## Keyboard & behavior

| Key       | Behavior                                                         |
| --------- | ---------------------------------------------------------------- |
| ArrowDown | Opens the listbox if closed; moves highlight to the next option. |
| ArrowUp   | Moves highlight to the previous option.                          |
| Enter     | Selects the highlighted option and closes the listbox.           |
| Escape    | Closes the listbox without changing the selection.               |
| Space     | Opens the listbox or selects the highlighted option.             |

## Composition

Select is designed to compose with other primitives. Its parts can be combined with Field, Button, or other primitives as needed.

## SSR and hydration

Select renders as semantic HTML during server rendering. Interactive behavior (keyboard handlers, state management) activates on hydration without layout shift.
