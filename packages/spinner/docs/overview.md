---
contentSchemaVersion: 1
title: Spinner
description: Loading spinner indicator.
keywords: [feedback, indicator, loading, runtime, spinner]
locale: en
maturity: draft
product: Spinner
productLayer: primitive
status: draft
package: "@solidiom/spinner"
primitive: spinner
section: overview
notApplicable:
  - section: composition
    reason: Spinner is a self-contained primitive with no compound sub-primitives to compose.
  - section: relationships
    reason: Spinner has no sibling primitives; it is used within other compositions but owns no inter-primitive contract.
  - section: migration
    reason: No prior API; this is the first shipped version.
  - section: testing
    reason: Standard testing guidance covers this primitive.
---

Loading spinner indicator.

## Usage

Import and render `Root`.

```tsx
import * as Spinner from "@solidiom/spinner"

;<Spinner.Root>Spinner content</Spinner.Root>
```

## Installation

Install the package with `pnpm add @solidiom/spinner`. The package requires compatible `solid-js` and `@solidjs/web` peer dependencies.

## Parts

Spinner exposes 1 part:

- **Root** — `data-part="root"`.

## Styling

Spinner carries `data-scope="spinner"` and `data-part` attributes on each part for CSS/recipe targeting. State attributes like `data-state`, `data-disabled`, and `data-highlighted` are exposed where applicable.

## Keyboard & behavior

This primitive has no keyboard interaction. It renders content that does not independently receive focus or respond to key events.

## SSR and hydration

Spinner renders as semantic HTML during server rendering. Interactive behavior (keyboard handlers, state management) activates on hydration without layout shift.
