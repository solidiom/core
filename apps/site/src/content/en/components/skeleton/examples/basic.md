---
contentSchemaVersion: 1
title: Basic skeleton
description: Loading placeholder component with text, circular, and rectangular variants.
keywords: [skeleton, loading, placeholder, shimmer]
locale: en
maturity: draft
product: Skeleton
productLayer: component
status: draft
package: "@solidiom/recipes-css"
recipe: "skeleton"
section: examples
exampleId: skeleton-component-basic
source:
  path: apps/site/src/components/SkeletonExample.tsx
  export: SkeletonExample
  language: tsx
runnable: true
---

The Skeleton component provides placeholder elements that mimic the shape of content while it loads.

```tsx
import * as Skeleton from "@solidiom/skeleton"

;<Skeleton.Root variant="text" width="200" />
```

## Circular variant

```tsx
import * as Skeleton from "@solidiom/skeleton"

;<Skeleton.Root variant="circular" width="48" height="48" />
```
