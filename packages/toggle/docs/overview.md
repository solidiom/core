---
contentSchemaVersion: 1
title: Toggle
description: A two-state button that can be toggled on or off.
keywords: [button, can, input, off, runtime, state, that]
locale: en
maturity: ga
product: Toggle
productLayer: primitive
status: draft
package: "@solidiom/toggle"
primitive: toggle
section: overview
notApplicable:
  - section: composition
    reason: Toggle is a self-contained primitive with no compound sub-primitives to compose.
  - section: relationships
    reason: Toggle has no sibling primitives; it is used within other compositions but owns no inter-primitive contract.
  - section: migration
    reason: No prior API; this is the first shipped version.
  - section: testing
    reason: Standard testing guidance covers this primitive.
---

A two-state button that can be toggled on or off.

## Usage

Import and render `Root`.

```tsx
import * as Toggle from "@solidiom/toggle"

;<Toggle.Root>Toggle content</Toggle.Root>
```

## Installation

Install the package with `pnpm add @solidiom/toggle`. The package requires compatible `solid-js` and `@solidjs/web` peer dependencies.

## Parts

Toggle exposes 1 part:

- **Root** — `data-part="root"`.

## Styling

Toggle carries `data-scope="toggle"` and `data-part` attributes on each part for CSS/recipe targeting. State attributes like `data-state`, `data-disabled`, and `data-highlighted` are exposed where applicable.

## Keyboard & behavior

This primitive has no keyboard interaction. It renders content that does not independently receive focus or respond to key events.

## SSR and hydration

Toggle renders as semantic HTML during server rendering. Interactive behavior (keyboard handlers, state management) activates on hydration without layout shift.
