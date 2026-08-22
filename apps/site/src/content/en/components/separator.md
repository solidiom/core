---
contentSchemaVersion: 1
title: Separator
description: Headless separator primitive for horizontal or vertical dividers.
keywords: [separator, divider, primitive, accessibility]
locale: en
maturity: beta
product: Separator
productLayer: component
status: published
package: "@solidiom/separator"
---

The `@solidiom/separator` package exports the `Separator.Root` primitive. No `StyledSeparator` wrapper is exported by the recipe packages.

## Usage

```tsx
import * as Separator from "@solidiom/separator"

;<Separator.Root orientation="horizontal" />
```

`Separator.Root` accepts `orientation` (`horizontal` or `vertical`), `decorative`, `class`, and `style` props.

## Installation

```sh
pnpm add @solidiom/separator
```

## Styling

The primitive emits semantic data attributes and accepts `class` and `style` props. Add application styles directly; a recipe wrapper is not currently exported for this primitive.

## Accessibility

By default, `Separator.Root` renders with `role="separator"` and the selected `aria-orientation`. Set `decorative` to render it with `role="none"`. See the [Separator primitive accessibility contract](/primitives/separator/accessibility/).
