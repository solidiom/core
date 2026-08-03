---
contentSchemaVersion: 1
title: Listbox
description: Single or multi-select list of options.
keywords: [input, list, listbox, multi, options, runtime, select]
locale: en
maturity: draft
product: Listbox
productLayer: primitive
status: draft
package: "@solidiom/listbox"
primitive: listbox
section: overview
notApplicable:
  - section: composition
    reason: Listbox is a self-contained primitive with no compound sub-primitives to compose.
  - section: relationships
    reason: Listbox has no sibling primitives; it is used within other compositions but owns no inter-primitive contract.
  - section: migration
    reason: No prior API; this is the first shipped version.
  - section: testing
    reason: Standard testing guidance covers this primitive.
---

Single or multi-select list of options.

## Usage

Compose `Root`, `Item`.

```tsx
import * as Listbox from "@solidiom/listbox"

;<Listbox.Root>Listbox content</Listbox.Root>
```

## Installation

Install the package with `pnpm add @solidiom/listbox`. The package requires compatible `solid-js` and `@solidjs/web` peer dependencies.

## Parts

Listbox exposes 2 parts:

- **Root** — `data-part="root"`.
- **Item** — `data-part="item"`.

## Styling

Listbox carries `data-scope="listbox"` and `data-part` attributes on each part for CSS/recipe targeting. State attributes like `data-state`, `data-disabled`, and `data-highlighted` are exposed where applicable.

## Keyboard & behavior

This primitive has no keyboard interaction. It renders content that does not independently receive focus or respond to key events.

## SSR and hydration

Listbox renders as semantic HTML during server rendering. Interactive behavior (keyboard handlers, state management) activates on hydration without layout shift.
