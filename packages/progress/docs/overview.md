---
contentSchemaVersion: 1
title: Progress
description: Determinate and indeterminate progress indicator.
keywords: [and, determinate, feedback, indeterminate, indicator, progress, runtime]
locale: en
maturity: draft
product: Progress
productLayer: primitive
status: draft
package: "@solidiom/progress"
primitive: progress
section: overview
notApplicable:
  - section: composition
    reason: Progress is a self-contained primitive with no compound sub-primitives to compose.
  - section: relationships
    reason: Progress has no sibling primitives; it is used within other compositions but owns no inter-primitive contract.
  - section: migration
    reason: No prior API; this is the first shipped version.
  - section: testing
    reason: Standard testing guidance covers this primitive.
---

Determinate and indeterminate progress indicator.

## Usage

Compose `Root`, `Indicator`.

```tsx
import * as Progress from "@solidiom/progress"

;<Progress.Root>Progress content</Progress.Root>
```

## Installation

Install the package with `pnpm add @solidiom/progress`. The package requires compatible `solid-js` and `@solidjs/web` peer dependencies.

## Parts

Progress exposes 2 parts:

- **Root** — `data-part="root"`.
- **Indicator** — `data-part="indicator"`.

## Styling

Progress carries `data-scope="progress"` and `data-part` attributes on each part for CSS/recipe targeting. State attributes like `data-state`, `data-disabled`, and `data-highlighted` are exposed where applicable.

## Keyboard & behavior

This primitive has no keyboard interaction. It renders content that does not independently receive focus or respond to key events.

## SSR and hydration

Progress renders as semantic HTML during server rendering. Interactive behavior (keyboard handlers, state management) activates on hydration without layout shift.
