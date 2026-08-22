---
contentSchemaVersion: 1
title: Direction
description: RTL/LTR direction context provider component.
keywords: [direction, rtl, ltr, context, provider, internationalization]
locale: en
maturity: ga
product: Direction
productLayer: primitive
status: draft
package: "@solidiom/direction"
primitive: direction
section: overview
notApplicable:
  - section: migration
    reason: No prior API; this is the first shipped version.
  - section: testing
    reason: Standard testing guidance covers this primitive.
---

Direction is a context provider that supplies text direction (`ltr` or `rtl`) to descendants via `DirectionContext`. It produces no visual output.

## Usage

Direction has a single `Root` part. Wrap descendants that should consume the direction value; there is no visual output.

```tsx
import * as Direction from "@solidiom/direction"

;<Direction.Root>{/* descendants read direction via DirectionContext */}</Direction.Root>
```

## Installation

Install the package with `pnpm add @solidiom/direction`. The package requires compatible `solid-js` and `@solidjs/web` peer dependencies.

## Parts

direction has a single `Root` part. It provides the direction (`ltr`/`rtl`) via `DirectionContext` to descendants and renders no visual output.

## Styling

direction carries `data-scope="direction"` and a `data-part="root"` attribute for CSS/recipe targeting. As a context provider it emits no visual styling of its own.

## Keyboard & behavior

This primitive has no keyboard interaction of its own.

## Composition

Wrap other primitives to propagate `ltr`/`rtl` direction through `DirectionContext`, letting descendants adapt their layout and behavior.

## SSR and hydration

As a context provider with no visual output, direction contributes no markup and requires no hydration; the direction value is available during both server rendering and on the client.
