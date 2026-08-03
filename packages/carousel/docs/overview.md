---
contentSchemaVersion: 1
title: Carousel
description: Horizontal slide-based content viewer.
keywords: [based, carousel, carousel-physics, content, horizontal, layout, runtime]
locale: en
maturity: draft
product: Carousel
productLayer: primitive
status: draft
package: "@solidiom/carousel"
primitive: carousel
section: overview
notApplicable:
  - section: relationships
    reason: Carousel has no sibling primitives; it is used within other compositions but owns no inter-primitive contract.
  - section: migration
    reason: No prior API; this is the first shipped version.
  - section: testing
    reason: Standard testing guidance covers this primitive.
---

Horizontal slide-based content viewer.

## Usage

Compose `Root`, `Viewport`, `Slide`, `PrevButton`, `NextButton`.

```tsx
import * as Carousel from "@solidiom/carousel"

;<Carousel.Root>Carousel content</Carousel.Root>
```

## Installation

Install the package with `pnpm add @solidiom/carousel`. The package requires compatible `solid-js` and `@solidjs/web` peer dependencies.

## Parts

Carousel exposes 5 parts:

- **Root** — `data-part="root"`.
- **Viewport** — `data-part="viewport"`.
- **Slide** — `data-part="slide"`.
- **PrevButton** — `data-part="prevbutton"`.
- **NextButton** — `data-part="nextbutton"`.

## Styling

Carousel carries `data-scope="carousel"` and `data-part` attributes on each part for CSS/recipe targeting. State attributes like `data-state`, `data-disabled`, and `data-highlighted` are exposed where applicable.

## Keyboard & behavior

This primitive has no keyboard interaction. It renders content that does not independently receive focus or respond to key events.

## Composition

Carousel is designed to compose with other primitives. Its parts can be combined with Field, Button, or other primitives as needed.

## SSR and hydration

Carousel renders as semantic HTML during server rendering. Interactive behavior (keyboard handlers, state management) activates on hydration without layout shift.
