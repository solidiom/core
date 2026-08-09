---
contentSchemaVersion: 1
title: Command Palette
description: Modal search and action launcher.
keywords: [action, and, command, launcher, modal, navigation, palette]
locale: en
maturity: ga
product: Command Palette
productLayer: primitive
status: draft
package: "@solidiom/command-palette"
primitive: command-palette
section: overview
notApplicable:
  - section: relationships
    reason: Command Palette has no sibling primitives; it is used within other compositions but owns no inter-primitive contract.
  - section: migration
    reason: No prior API; this is the first shipped version.
  - section: testing
    reason: Standard testing guidance covers this primitive.
---

Modal search and action launcher.

## Usage

Compose `Root`, `Input`, `List`, `Group`, `Item`, `Empty`.

```tsx
import * as CommandPalette from "@solidiom/command-palette"

;<CommandPalette.Root>Command Palette content</CommandPalette.Root>
```

## Installation

Install the package with `pnpm add @solidiom/command-palette`. The package requires compatible `solid-js` and `@solidjs/web` peer dependencies.

## Parts

Command Palette exposes 6 parts:

- **Root** — `data-part="root"`.
- **Input** — `data-part="input"`.
- **List** — `data-part="list"`.
- **Group** — `data-part="group"`.
- **Item** — `data-part="item"`.
- **Empty** — `data-part="empty"`.

## Styling

Command Palette carries `data-scope="command-palette"` and `data-part` attributes on each part for CSS/recipe targeting. State attributes like `data-state`, `data-disabled`, and `data-highlighted` are exposed where applicable.

## Keyboard & behavior

This primitive has no keyboard interaction. It renders content that does not independently receive focus or respond to key events.

## Composition

Command Palette is designed to compose with other primitives. Its parts can be combined with Field, Button, or other primitives as needed.

## SSR and hydration

Command Palette renders as semantic HTML during server rendering. Interactive behavior (keyboard handlers, state management) activates on hydration without layout shift.
