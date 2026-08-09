---
contentSchemaVersion: 1
title: Context Menu
description: Right-click triggered menu.
keywords: [click, context, menu, overlay, right, runtime, triggered]
locale: en
maturity: ga
product: Context Menu
productLayer: primitive
status: draft
package: "@solidiom/context-menu"
primitive: context-menu
section: overview
notApplicable:
  - section: relationships
    reason: Context Menu has no sibling primitives; it is used within other compositions but owns no inter-primitive contract.
  - section: migration
    reason: No prior API; this is the first shipped version.
  - section: testing
    reason: Standard testing guidance covers this primitive.
---

Right-click triggered menu.

## Usage

Compose `Root`, `Trigger`, `Content`, `Item`, `CheckboxItem`, `RadioGroup`, `RadioItem`, `Separator`, `Label`.

```tsx
import * as ContextMenu from "@solidiom/context-menu"

;<ContextMenu.Root>Context Menu content</ContextMenu.Root>
```

## Installation

Install the package with `pnpm add @solidiom/context-menu`. The package requires compatible `solid-js` and `@solidjs/web` peer dependencies.

## Parts

Context Menu exposes 9 parts:

- **Root** — `data-part="root"`.
- **Trigger** — `data-part="trigger"`.
- **Content** — `data-part="content"`.
- **Item** — `data-part="item"`.
- **CheckboxItem** — `data-part="checkboxitem"`.
- **RadioGroup** — `data-part="radiogroup"`.
- **RadioItem** — `data-part="radioitem"`.
- **Separator** — `data-part="separator"`.
- **Label** — `data-part="label"`.

## Styling

Context Menu carries `data-scope="context-menu"` and `data-part` attributes on each part for CSS/recipe targeting. State attributes like `data-state`, `data-disabled`, and `data-highlighted` are exposed where applicable.

## Keyboard & behavior

This primitive has no keyboard interaction. It renders content that does not independently receive focus or respond to key events.

## Composition

Context Menu is designed to compose with other primitives. Its parts can be combined with Field, Button, or other primitives as needed.

## SSR and hydration

Context Menu renders as semantic HTML during server rendering. Interactive behavior (keyboard handlers, state management) activates on hydration without layout shift.
