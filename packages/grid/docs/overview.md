---
contentSchemaVersion: 1
title: Grid
description: CSS Grid layout primitive with responsive columns and gap.
keywords: [grid, layout, css grid, columns, gap, responsive]
locale: en
maturity: ga
product: Grid
productLayer: primitive
status: draft
package: "@solidiom/grid"
primitive: grid
section: overview
notApplicable:
  - section: migration
    reason: No prior API; this is the first shipped version.
  - section: testing
    reason: Standard testing guidance covers this primitive.
---

Grid is a CSS Grid layout primitive supporting responsive columns and gap. The `Root` is a CSS grid container and `Item` is a grid cell.

## Usage

Compose `Root` and `Item`. `Root` establishes the grid container and each `Item` is a grid cell.

```tsx
import * as Grid from "@solidiom/grid"

;<Grid.Root>
  <Grid.Item>One</Grid.Item>
  <Grid.Item>Two</Grid.Item>
  <Grid.Item>Three</Grid.Item>
</Grid.Root>
```

## Installation

Install the package with `pnpm add @solidiom/grid`. The package requires compatible `solid-js` and `@solidjs/web` peer dependencies.

## Parts

grid exposes 2 parts:

- **Root** — the CSS grid container.
- **Item** — a grid cell within the container.

## Styling

grid carries `data-scope="grid"` and `data-part` attributes on each part for CSS/recipe targeting.

## Keyboard & behavior

This primitive has no keyboard interaction of its own.

## Composition

Place any primitives inside `Item` cells to lay them out on a responsive grid.

## SSR and hydration

Grid renders static HTML and requires no hydration.
