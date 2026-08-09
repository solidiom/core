---
contentSchemaVersion: 1
title: Collapsible
description: Single expandable/collapsible section.
keywords: [collapsible, expandable, layout, runtime, section, single]
locale: en
maturity: ga
product: Collapsible
productLayer: primitive
status: draft
package: "@solidiom/collapsible"
primitive: collapsible
section: overview
notApplicable:
  - section: relationships
    reason: Collapsible has no sibling primitives; it is used within other compositions but owns no inter-primitive contract.
  - section: migration
    reason: No prior API; this is the first shipped version.
  - section: testing
    reason: Standard testing guidance covers this primitive.
---

Single expandable/collapsible section.

## Usage

Compose `Root`, `Trigger`, `Content`.

```tsx
import * as Collapsible from "@solidiom/collapsible"

;<Collapsible.Root>Collapsible content</Collapsible.Root>
```

## Installation

Install the package with `pnpm add @solidiom/collapsible`. The package requires compatible `solid-js` and `@solidjs/web` peer dependencies.

## Parts

Collapsible exposes 3 parts:

- **Root** — `data-part="root"`.
- **Trigger** — `data-part="trigger"`.
- **Content** — `data-part="content"`.

## Styling

Collapsible carries `data-scope="collapsible"` and `data-part` attributes on each part for CSS/recipe targeting. State attributes like `data-state`, `data-disabled`, and `data-highlighted` are exposed where applicable.

## Keyboard & behavior

This primitive has no keyboard interaction. It renders content that does not independently receive focus or respond to key events.

## Composition

Collapsible is designed to compose with other primitives. Its parts can be combined with Field, Button, or other primitives as needed.

## SSR and hydration

Collapsible renders as semantic HTML during server rendering. Interactive behavior (keyboard handlers, state management) activates on hydration without layout shift.
