---
contentSchemaVersion: 1
title: Tree
description: Hierarchical tree view with expand/collapse.
keywords: [collapse, expand, hierarchical, navigation, runtime, tree, view]
locale: en
maturity: ga
product: Tree
productLayer: primitive
status: draft
package: "@solidiom/tree"
primitive: tree
section: overview
notApplicable:
  - section: relationships
    reason: Tree has no sibling primitives; it is used within other compositions but owns no inter-primitive contract.
  - section: migration
    reason: No prior API; this is the first shipped version.
  - section: testing
    reason: Standard testing guidance covers this primitive.
---

Hierarchical tree view with expand/collapse.

## Usage

Compose `Root`, `Item`, `Branch`, `ItemIndicator`.

```tsx
import * as Tree from "@solidiom/tree"

;<Tree.Root>Tree content</Tree.Root>
```

## Installation

Install the package with `pnpm add @solidiom/tree`. The package requires compatible `solid-js` and `@solidjs/web` peer dependencies.

## Parts

Tree exposes 4 parts:

- **Root** — `data-part="root"`.
- **Item** — `data-part="item"`.
- **Branch** — `data-part="branch"`.
- **ItemIndicator** — `data-part="itemindicator"`.

## Styling

Tree carries `data-scope="tree"` and `data-part` attributes on each part for CSS/recipe targeting. State attributes like `data-state`, `data-disabled`, and `data-highlighted` are exposed where applicable.

## Keyboard & behavior

This primitive has no keyboard interaction. It renders content that does not independently receive focus or respond to key events.

## Composition

Tree is designed to compose with other primitives. Its parts can be combined with Field, Button, or other primitives as needed.

## SSR and hydration

Tree renders as semantic HTML during server rendering. Interactive behavior (keyboard handlers, state management) activates on hydration without layout shift.
