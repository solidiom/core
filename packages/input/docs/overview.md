---
contentSchemaVersion: 1
title: Input
description: Text input and textarea with validation states and Field integration.
keywords: [and, field, input, integration, runtime, states, text]
locale: en
maturity: draft
product: Input
productLayer: primitive
status: draft
package: "@solidiom/input"
primitive: input
section: overview
notApplicable:
  - section: composition
    reason: Input is a self-contained primitive with no compound sub-primitives to compose.
  - section: relationships
    reason: Input has no sibling primitives; it is used within other compositions but owns no inter-primitive contract.
  - section: migration
    reason: No prior API; this is the first shipped version.
  - section: testing
    reason: Standard testing guidance covers this primitive.
---

Text input and textarea with validation states and Field integration.

## Usage

Compose `Root`, `Textarea`.

```tsx
import * as Input from "@solidiom/input"

;<Input.Root>Input content</Input.Root>
```

## Installation

Install the package with `pnpm add @solidiom/input`. The package requires compatible `solid-js` and `@solidjs/web` peer dependencies.

## Parts

Input exposes 2 parts:

- **Root** — `data-part="root"`.
- **Textarea** — `data-part="textarea"`.

## Styling

Input carries `data-scope="input"` and `data-part` attributes on each part for CSS/recipe targeting. State attributes like `data-state`, `data-disabled`, and `data-highlighted` are exposed where applicable.

## Keyboard & behavior

This primitive has no keyboard interaction. It renders content that does not independently receive focus or respond to key events.

## SSR and hydration

Input renders as semantic HTML during server rendering. Interactive behavior (keyboard handlers, state management) activates on hydration without layout shift.
