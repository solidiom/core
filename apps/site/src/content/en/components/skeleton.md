---
contentSchemaVersion: 1
title: Skeleton
description: Headless skeleton loading placeholder primitive.
keywords: [skeleton, loading, placeholder, primitive]
locale: en
maturity: beta
product: Skeleton
productLayer: component
status: published
package: "@solidiom/skeleton"
---

The `@solidiom/skeleton` package exports the `Skeleton.Root` primitive. No `StyledSkeleton` wrapper is exported by the recipe packages.

## Usage

```tsx
import * as Skeleton from "@solidiom/skeleton"

;<div>
  <Skeleton.Root variant="circular" width="48" height="48" />
  <Skeleton.Root variant="text" width="200" />
  <Skeleton.Root variant="rectangular" width="200" height="80" />
</div>
```

`Skeleton.Root` accepts `variant` (`text`, `circular`, or `rectangular`), `width`, `height`, `class`, and `style` props.

## Installation

```sh
pnpm add @solidiom/skeleton
```

## Styling and accessibility

The primitive emits semantic data attributes, accepts `class` and `style` props, and renders the placeholder with `aria-hidden="true"`. A recipe wrapper is not currently exported for this primitive.

See the [Skeleton primitive accessibility contract](/primitives/skeleton/accessibility/).
