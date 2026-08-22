---
contentSchemaVersion: 1
title: Input Group
description: Input wrapper with prefix/suffix addon slots for icons and buttons.
keywords: [input group, prefix, suffix, addon, input, icon, button]
locale: en
maturity: ga
product: Input Group
productLayer: primitive
status: draft
package: "@solidiom/input-group"
primitive: input-group
section: overview
notApplicable:
  - section: migration
    reason: No prior API; this is the first shipped version.
  - section: testing
    reason: Standard testing guidance covers this primitive.
---

Input Group is a flex container that composes an input with leading and trailing addon slots for icons, labels, or buttons. `Root` shares disabled/invalid state via context so child parts inherit it without prop drilling.

## Usage

Compose `Root`, `Prefix`, `Suffix`, and `Input`. `Prefix` and `Suffix` hold leading and trailing addons around the `Input`.

```tsx
import * as InputGroup from "@solidiom/input-group"

;<InputGroup.Root>
  <InputGroup.Prefix>@</InputGroup.Prefix>
  <InputGroup.Input />
  <InputGroup.Suffix>.com</InputGroup.Suffix>
</InputGroup.Root>
```

## Installation

Install the package with `pnpm add @solidiom/input-group`. The package requires compatible `solid-js` and `@solidjs/web` peer dependencies.

## Parts

input-group exposes 4 parts:

- **Root** — the flex container that shares disabled/invalid state via context.
- **Prefix** — the leading addon slot for icons, labels, or buttons.
- **Suffix** — the trailing addon slot for icons, labels, or buttons.
- **Input** — the input composed within the group.

## Styling

input-group carries `data-scope="input-group"` and `data-part` attributes on each part for CSS/recipe targeting. Disabled and invalid state is shared from `Root` so child parts can reflect it.

## Keyboard & behavior

This primitive has no keyboard interaction of its own; the composed `Input` handles text entry.

## Composition

Compose with icon, label, or button primitives in the Prefix and Suffix slots to build rich input controls.

## SSR and hydration

Input Group renders static HTML on the server; the composed input activates its handlers on hydration.
