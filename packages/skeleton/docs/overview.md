---
contentSchemaVersion: 1
title: Skeleton
description: Loading placeholder with pulse animation.
keywords: [animation, feedback, loading, placeholder, pulse, runtime, skeleton]
locale: en
maturity: draft
product: Skeleton
productLayer: primitive
status: draft
package: "@solidiom/skeleton"
primitive: skeleton
section: overview
notApplicable:
  - section: composition
    reason: Skeleton is a self-contained primitive with no compound sub-primitives to compose.
  - section: relationships
    reason: Skeleton has no sibling primitives; it is used within other compositions but owns no inter-primitive contract.
  - section: migration
    reason: No prior API; this is the first shipped version.
  - section: testing
    reason: Standard testing guidance covers this primitive.
---

Loading placeholder with pulse animation.

## Usage

Import and render `Root`.

```tsx
import * as Skeleton from "@solidiom/skeleton"

;<Skeleton.Root>Skeleton content</Skeleton.Root>
```

## Installation

Install the package with `pnpm add @solidiom/skeleton`. The package requires compatible `solid-js` and `@solidjs/web` peer dependencies.

## Parts

Skeleton exposes 1 part:

- **Root** — `data-part="root"`.

## Styling

Skeleton carries `data-scope="skeleton"` and `data-part` attributes on each part for CSS/recipe targeting. State attributes like `data-state`, `data-disabled`, and `data-highlighted` are exposed where applicable.

## Keyboard & behavior

This primitive has no keyboard interaction. It renders content that does not independently receive focus or respond to key events.

## SSR and hydration

Skeleton renders as semantic HTML during server rendering. Interactive behavior (keyboard handlers, state management) activates on hydration without layout shift.
