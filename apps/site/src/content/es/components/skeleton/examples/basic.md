---
contentSchemaVersion: 1
title: Skeleton básico
description: Componente de marcador de posición de carga con variantes de texto, circular y rectangular.
keywords: [skeleton, loading, placeholder, shimmer]
locale: es
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
translationSourceHash: "ee785ae3aab590816c891168cf10dfe626d0ffff4c881473098a39ec48790cb6"
translationStatus: draft
---

El componente Skeleton proporciona elementos de marcador de posición que imitan la forma del contenido mientras se carga.

```tsx
import { StyledSkeleton } from "@solidiom/recipes-css"

;<StyledSkeleton variant="text" width="200" />
```

## Variante circular

```tsx
import { StyledSkeleton } from "@solidiom/recipes-css"

;<StyledSkeleton variant="circular" width="48" height="48" />
```
