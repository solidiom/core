---
contentSchemaVersion: 1
title: Tabs
description: Tabbed content switcher.
keywords: [content, navigation, runtime, switcher, tabbed, tabs]
locale: en
maturity: draft
product: Tabs
productLayer: primitive
status: draft
package: "@solidiom/tabs"
primitive: tabs
section: overview
notApplicable:
  - section: relationships
    reason: Tabs has no sibling primitives; it is used within other compositions but owns no inter-primitive contract.
  - section: migration
    reason: No prior API; this is the first shipped version.
  - section: testing
    reason: Standard testing guidance covers this primitive.
---

Tabbed content switcher.

## Usage

Compose `Root`, `List`, `Trigger`, `Content`.

```tsx
import * as Tabs from "@solidiom/tabs"

;<Tabs.Root>Tabs content</Tabs.Root>
```

## Installation

Install the package with `pnpm add @solidiom/tabs`. The package requires compatible `solid-js` and `@solidjs/web` peer dependencies.

## Parts

Tabs exposes 4 parts:

- **Root** — `data-part="root"`.
- **List** — `data-part="list"`.
- **Trigger** — `data-part="trigger"`.
- **Content** — `data-part="content"`.

## Styling

Tabs carries `data-scope="tabs"` and `data-part` attributes on each part for CSS/recipe targeting. State attributes like `data-state`, `data-disabled`, and `data-highlighted` are exposed where applicable.

## Keyboard & behavior

| Key         | Behavior                                               |
| ----------- | ------------------------------------------------------ |
| ArrowRight  | Moves focus to the next tab trigger.                   |
| ArrowLeft   | Moves focus to the previous tab trigger.               |
| Home        | Moves focus to the first tab trigger.                  |
| End         | Moves focus to the last tab trigger.                   |
| Enter/Space | Activates the focused tab (in manual activation mode). |

## Composition

Tabs is designed to compose with other primitives. Its parts can be combined with Field, Button, or other primitives as needed.

## SSR and hydration

Tabs renders as semantic HTML during server rendering. Interactive behavior (keyboard handlers, state management) activates on hydration without layout shift.
