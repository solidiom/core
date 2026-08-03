---
contentSchemaVersion: 1
title: Navigation Menu
description: A top-level navigation component with accessible dropdown sub-menus.
keywords: [accessible, component, dropdown, level, menu, menus, navigation]
locale: en
maturity: draft
product: Navigation Menu
productLayer: primitive
status: draft
package: "@solidiom/navigation-menu"
primitive: navigation-menu
section: overview
notApplicable:
  - section: relationships
    reason: Navigation Menu has no sibling primitives; it is used within other compositions but owns no inter-primitive contract.
  - section: migration
    reason: No prior API; this is the first shipped version.
  - section: testing
    reason: Standard testing guidance covers this primitive.
---

A top-level navigation component with accessible dropdown sub-menus.

## Usage

Compose `Root`, `List`, `Item`, `Trigger`, `Content`, `Link`.

```tsx
import * as NavigationMenu from "@solidiom/navigation-menu"

;<NavigationMenu.Root>Navigation Menu content</NavigationMenu.Root>
```

## Installation

Install the package with `pnpm add @solidiom/navigation-menu`. The package requires compatible `solid-js` and `@solidjs/web` peer dependencies.

## Parts

Navigation Menu exposes 6 parts:

- **Root** — `data-part="root"`.
- **List** — `data-part="list"`.
- **Item** — `data-part="item"`.
- **Trigger** — `data-part="trigger"`.
- **Content** — `data-part="content"`.
- **Link** — `data-part="link"`.

## Styling

Navigation Menu carries `data-scope="navigation-menu"` and `data-part` attributes on each part for CSS/recipe targeting. State attributes like `data-state`, `data-disabled`, and `data-highlighted` are exposed where applicable.

## Keyboard & behavior

| Key       | Behavior                                                     |
| --------- | ------------------------------------------------------------ |
| ArrowDown | Opens the dropdown content when focus is on a trigger.       |
| Escape    | Closes the dropdown content.                                 |
| Tab       | Moves focus to the next focusable element in the navigation. |

## Composition

Navigation Menu is designed to compose with other primitives. Its parts can be combined with Field, Button, or other primitives as needed.

## SSR and hydration

Navigation Menu renders as semantic HTML during server rendering. Interactive behavior (keyboard handlers, state management) activates on hydration without layout shift.
