---
contentSchemaVersion: 1
title: Field
description: "Composition wrapper: label + control + description + error with automatic ARIA wiring."
keywords: [aria, automatic, composition, control, description, error, field]
locale: en
maturity: ga
product: Field
productLayer: primitive
status: draft
package: "@solidiom/field"
primitive: field
section: overview
notApplicable:
  - section: relationships
    reason: Field has no sibling primitives; it is used within other compositions but owns no inter-primitive contract.
  - section: migration
    reason: No prior API; this is the first shipped version.
  - section: testing
    reason: Standard testing guidance covers this primitive.
---

Composition wrapper: label + control + description + error with automatic ARIA wiring.

## Usage

Compose `Root`, `Label`, `Control`, `Description`, `Error`.

```tsx
import * as Field from "@solidiom/field"

;<Field.Root>Field content</Field.Root>
```

## Installation

Install the package with `pnpm add @solidiom/field`. The package requires compatible `solid-js` and `@solidjs/web` peer dependencies.

## Parts

Field exposes 5 parts:

- **Root** — `data-part="root"`.
- **Label** — `data-part="label"`.
- **Control** — `data-part="control"`.
- **Description** — `data-part="description"`.
- **Error** — `data-part="error"`.

## Styling

Field carries `data-scope="field"` and `data-part` attributes on each part for CSS/recipe targeting. State attributes like `data-state`, `data-disabled`, and `data-highlighted` are exposed where applicable.

## Keyboard & behavior

This primitive has no keyboard interaction. It renders content that does not independently receive focus or respond to key events.

## Composition

Field is designed to compose with other primitives. Its parts can be combined with Field, Button, or other primitives as needed.

## SSR and hydration

Field renders as semantic HTML during server rendering. Interactive behavior (keyboard handlers, state management) activates on hydration without layout shift.
