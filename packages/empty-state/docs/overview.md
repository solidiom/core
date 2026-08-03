---
contentSchemaVersion: 1
title: Empty State
description: Placeholder for empty content areas.
keywords: [areas, content, empty, feedback, for, placeholder, runtime]
locale: en
maturity: draft
product: Empty State
productLayer: primitive
status: draft
package: "@solidiom/empty-state"
primitive: empty-state
section: overview
notApplicable:
  - section: relationships
    reason: Empty State has no sibling primitives; it is used within other compositions but owns no inter-primitive contract.
  - section: migration
    reason: No prior API; this is the first shipped version.
  - section: testing
    reason: Standard testing guidance covers this primitive.
---

Placeholder for empty content areas.

## Usage

Compose `Root`, `Icon`, `Title`, `Description`, `Action`.

```tsx
import * as EmptyState from "@solidiom/empty-state"

;<EmptyState.Root>Empty State content</EmptyState.Root>
```

## Installation

Install the package with `pnpm add @solidiom/empty-state`. The package requires compatible `solid-js` and `@solidjs/web` peer dependencies.

## Parts

Empty State exposes 5 parts:

- **Root** — `data-part="root"`.
- **Icon** — `data-part="icon"`.
- **Title** — `data-part="title"`.
- **Description** — `data-part="description"`.
- **Action** — `data-part="action"`.

## Styling

Empty State carries `data-scope="empty-state"` and `data-part` attributes on each part for CSS/recipe targeting. State attributes like `data-state`, `data-disabled`, and `data-highlighted` are exposed where applicable.

## Keyboard & behavior

This primitive has no keyboard interaction. It renders content that does not independently receive focus or respond to key events.

## Composition

Empty State is designed to compose with other primitives. Its parts can be combined with Field, Button, or other primitives as needed.

## SSR and hydration

Empty State renders as semantic HTML during server rendering. Interactive behavior (keyboard handlers, state management) activates on hydration without layout shift.
