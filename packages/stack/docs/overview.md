---
contentSchemaVersion: 1
title: Stack
description: Flex layout primitive with configurable gap, direction, and alignment.
keywords: [stack, layout, flex, gap, direction, alignment]
locale: en
maturity: ga
product: Stack
productLayer: primitive
status: draft
package: "@solidiom/stack"
primitive: stack
section: overview
notApplicable:
  - section: migration
    reason: No prior API; this is the first shipped version.
  - section: testing
    reason: Standard testing guidance covers this primitive.
---

Stack is a flex layout primitive with configurable gap, direction, and alignment. It arranges its children in a single flex container.

## Usage

Stack has a single `Root` part. Place children directly inside it to lay them out with the configured gap, direction, and alignment.

```tsx
import * as Stack from "@solidiom/stack"

;<Stack.Root>
  <div>One</div>
  <div>Two</div>
  <div>Three</div>
</Stack.Root>
```

## Installation

Install the package with `pnpm add @solidiom/stack`. The package requires compatible `solid-js` and `@solidjs/web` peer dependencies.

## Parts

stack has a single `Root` part. It is a flex container with configurable gap, direction, and alignment.

## Styling

stack carries `data-scope="stack"` and a `data-part="root"` attribute for CSS/recipe targeting.

## Keyboard & behavior

This primitive has no keyboard interaction of its own.

## Composition

Wrap any primitives to arrange them in a flex layout with consistent spacing and alignment.

## SSR and hydration

Stack renders static HTML and requires no hydration.
