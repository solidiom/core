---
contentSchemaVersion: 1
title: Checkbox
description: Binary or indeterminate toggle control.
keywords: [binary, checkbox, control, indeterminate, input, runtime, toggle]
locale: en
maturity: ga
product: Checkbox
productLayer: primitive
status: draft
package: "@solidiom/checkbox"
primitive: checkbox
section: overview
notApplicable:
  - section: relationships
    reason: Checkbox has no sibling primitives; it is used within other compositions but owns no inter-primitive contract.
  - section: migration
    reason: No prior API; this is the first shipped version.
  - section: testing
    reason: Standard testing guidance covers this primitive.
---

Binary or indeterminate toggle control.

## Usage

Compose `Group`, `Root`, `Indicator`.

```tsx
import * as Checkbox from "@solidiom/checkbox"

;<Checkbox.Group>Checkbox content</Checkbox.Group>
```

## Installation

Install the package with `pnpm add @solidiom/checkbox`. The package requires compatible `solid-js` and `@solidjs/web` peer dependencies.

## Parts

Checkbox exposes 3 parts:

- **Group** — `data-part="group"`.
- **Root** — `data-part="root"`.
- **Indicator** — `data-part="indicator"`.

## Styling

Checkbox carries `data-scope="checkbox"` and `data-part` attributes on each part for CSS/recipe targeting. State attributes like `data-state`, `data-disabled`, and `data-highlighted` are exposed where applicable.

## Keyboard & behavior

| Key   | Behavior                                            |
| ----- | --------------------------------------------------- |
| Space | Toggles the checkbox between checked and unchecked. |

## Composition

Checkbox is designed to compose with other primitives. Its parts can be combined with Field, Button, or other primitives as needed.

## SSR and hydration

Checkbox renders as semantic HTML during server rendering. Interactive behavior (keyboard handlers, state management) activates on hydration without layout shift.
