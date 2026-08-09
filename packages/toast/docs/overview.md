---
contentSchemaVersion: 1
title: Toast
description: Temporary non-blocking notification.
keywords: [blocking, feedback, non, notification, runtime, temporary, toast]
locale: en
maturity: ga
product: Toast
productLayer: primitive
status: draft
package: "@solidiom/toast"
primitive: toast
section: overview
notApplicable:
  - section: relationships
    reason: Toast has no sibling primitives; it is used within other compositions but owns no inter-primitive contract.
  - section: migration
    reason: No prior API; this is the first shipped version.
  - section: testing
    reason: Standard testing guidance covers this primitive.
---

Temporary non-blocking notification.

## Usage

Compose `Region`, `Root`, `Title`, `Description`, `Close`.

```tsx
import * as Toast from "@solidiom/toast"

;<Toast.Region>Toast content</Toast.Region>
```

## Installation

Install the package with `pnpm add @solidiom/toast`. The package requires compatible `solid-js` and `@solidjs/web` peer dependencies.

## Parts

Toast exposes 5 parts:

- **Region** — `data-part="region"`.
- **Root** — `data-part="root"`.
- **Title** — `data-part="title"`.
- **Description** — `data-part="description"`.
- **Close** — `data-part="close"`.

## Styling

Toast carries `data-scope="toast"` and `data-part` attributes on each part for CSS/recipe targeting. State attributes like `data-state`, `data-disabled`, and `data-highlighted` are exposed where applicable.

## Keyboard & behavior

This primitive has no keyboard interaction. It renders content that does not independently receive focus or respond to key events.

## Composition

Toast is designed to compose with other primitives. Its parts can be combined with Field, Button, or other primitives as needed.

## SSR and hydration

Toast renders as semantic HTML during server rendering. Interactive behavior (keyboard handlers, state management) activates on hydration without layout shift.
