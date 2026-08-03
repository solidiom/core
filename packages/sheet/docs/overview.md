---
contentSchemaVersion: 1
title: Sheet
description: Side-panel dialog with slide animation.
keywords: [animation, dialog, overlay, panel, runtime, sheet, side]
locale: en
maturity: draft
product: Sheet
productLayer: primitive
status: draft
package: "@solidiom/sheet"
primitive: sheet
section: overview
notApplicable:
  - section: relationships
    reason: Sheet has no sibling primitives; it is used within other compositions but owns no inter-primitive contract.
  - section: migration
    reason: No prior API; this is the first shipped version.
  - section: testing
    reason: Standard testing guidance covers this primitive.
---

Side-panel dialog with slide animation.

## Usage

Compose `Root`, `Trigger`, `Portal`, `Backdrop`, `Content`, `Title`, `Description`, `Close`.

```tsx
import * as Sheet from "@solidiom/sheet"

;<Sheet.Root>Sheet content</Sheet.Root>
```

## Installation

Install the package with `pnpm add @solidiom/sheet`. The package requires compatible `solid-js` and `@solidjs/web` peer dependencies.

## Parts

Sheet exposes 8 parts:

- **Root** — `data-part="root"`.
- **Trigger** — `data-part="trigger"`.
- **Portal** — `data-part="portal"`.
- **Backdrop** — `data-part="backdrop"`.
- **Content** — `data-part="content"`.
- **Title** — `data-part="title"`.
- **Description** — `data-part="description"`.
- **Close** — `data-part="close"`.

## Styling

Sheet carries `data-scope="sheet"` and `data-part` attributes on each part for CSS/recipe targeting. State attributes like `data-state`, `data-disabled`, and `data-highlighted` are exposed where applicable.

## Keyboard & behavior

| Key    | Behavior                                              |
| ------ | ----------------------------------------------------- |
| Escape | Closes the sheet and returns focus to the trigger.    |
| Tab    | Moves focus within the sheet content (focus trapped). |

## Composition

Sheet is designed to compose with other primitives. Its parts can be combined with Field, Button, or other primitives as needed.

## SSR and hydration

Sheet renders as semantic HTML during server rendering. Interactive behavior (keyboard handlers, state management) activates on hydration without layout shift.
