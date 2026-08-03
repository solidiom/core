---
contentSchemaVersion: 1
title: Popover
description: Non-modal floating content panel.
keywords: [content, floating, modal, non, overlay, panel, popover]
locale: en
maturity: draft
product: Popover
productLayer: primitive
status: draft
package: "@solidiom/popover"
primitive: popover
section: overview
notApplicable:
  - section: relationships
    reason: Popover has no sibling primitives; it is used within other compositions but owns no inter-primitive contract.
  - section: migration
    reason: No prior API; this is the first shipped version.
  - section: testing
    reason: Standard testing guidance covers this primitive.
---

Non-modal floating content panel.

## Usage

Compose `Root`, `Anchor`, `Trigger`, `Content`, `Close`.

```tsx
import * as Popover from "@solidiom/popover"

;<Popover.Root>Popover content</Popover.Root>
```

## Installation

Install the package with `pnpm add @solidiom/popover`. The package requires compatible `solid-js` and `@solidjs/web` peer dependencies.

## Parts

Popover exposes 5 parts:

- **Root** — `data-part="root"`.
- **Anchor** — `data-part="anchor"`.
- **Trigger** — `data-part="trigger"`.
- **Content** — `data-part="content"`.
- **Close** — `data-part="close"`.

## Styling

Popover carries `data-scope="popover"` and `data-part` attributes on each part for CSS/recipe targeting. State attributes like `data-state`, `data-disabled`, and `data-highlighted` are exposed where applicable.

## Keyboard & behavior

| Key    | Behavior                                             |
| ------ | ---------------------------------------------------- |
| Escape | Closes the popover and returns focus to the trigger. |

## Composition

Popover is designed to compose with other primitives. Its parts can be combined with Field, Button, or other primitives as needed.

## SSR and hydration

Popover renders as semantic HTML during server rendering. Interactive behavior (keyboard handlers, state management) activates on hydration without layout shift.
