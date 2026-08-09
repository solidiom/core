---
contentSchemaVersion: 1
title: Menu
description: Action list triggered by a button.
keywords: [action, button, list, menu, navigation, runtime, triggered]
locale: en
maturity: ga
product: Menu
productLayer: primitive
status: draft
package: "@solidiom/menu"
primitive: menu
section: overview
notApplicable:
  - section: relationships
    reason: Menu has no sibling primitives; it is used within other compositions but owns no inter-primitive contract.
  - section: migration
    reason: No prior API; this is the first shipped version.
  - section: testing
    reason: Standard testing guidance covers this primitive.
---

Action list triggered by a button.

## Usage

Compose `Root`, `Trigger`, `Content`, `Item`, `Separator`, `CheckboxItem`, `RadioGroup`, `RadioItem`, `Label`, `Sub`, `SubTrigger`, `SubContent`.

```tsx
import * as Menu from "@solidiom/menu"

;<Menu.Root>Menu content</Menu.Root>
```

## Installation

Install the package with `pnpm add @solidiom/menu`. The package requires compatible `solid-js` and `@solidjs/web` peer dependencies.

## Parts

Menu exposes 12 parts:

- **Root** — `data-part="root"`.
- **Trigger** — `data-part="trigger"`.
- **Content** — `data-part="content"`.
- **Item** — `data-part="item"`.
- **Separator** — `data-part="separator"`.
- **CheckboxItem** — `data-part="checkboxitem"`.
- **RadioGroup** — `data-part="radiogroup"`.
- **RadioItem** — `data-part="radioitem"`.
- **Label** — `data-part="label"`.
- **Sub** — `data-part="sub"`.
- **SubTrigger** — `data-part="subtrigger"`.
- **SubContent** — `data-part="subcontent"`.

## Styling

Menu carries `data-scope="menu"` and `data-part` attributes on each part for CSS/recipe targeting. State attributes like `data-state`, `data-disabled`, and `data-highlighted` are exposed where applicable.

## Keyboard & behavior

| Key         | Behavior                                             |
| ----------- | ---------------------------------------------------- |
| ArrowDown   | Moves focus to the next menu item.                   |
| ArrowUp     | Moves focus to the previous menu item.               |
| Enter/Space | Activates the focused menu item.                     |
| Escape      | Closes the menu and returns focus to the trigger.    |
| ArrowRight  | Opens a sub-menu when focus is on a sub-trigger.     |
| ArrowLeft   | Closes the sub-menu and returns focus to the parent. |

## Composition

Menu is designed to compose with other primitives. Its parts can be combined with Field, Button, or other primitives as needed.

## SSR and hydration

Menu renders as semantic HTML during server rendering. Interactive behavior (keyboard handlers, state management) activates on hydration without layout shift.
