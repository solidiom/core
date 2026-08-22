---
contentSchemaVersion: 1
title: Progreso básico
description: Componente de barra de progreso con estados determinista e indeterminado.
keywords: [progress, bar, loading, indicator]
locale: es
maturity: draft
product: Progress
productLayer: component
status: draft
package: "@solidiom/recipes-css"
recipe: "progress"
section: examples
exampleId: progress-component-basic
source:
  path: apps/site/src/components/ProgressExample.tsx
  export: ProgressExample
  language: tsx
runnable: true
translationSourceHash: "e635dd4c6782b8b63218d2ced9c8434f6e355cdadb57cf729503fcc9d3b4677d"
translationStatus: "human-reviewed"
translationReviewedBy: "solidiom-team"
translationReviewedAt: "2026-08-18"
---

El componente Progress indica el estado de completitud de una tarea.

```tsx
import { StyledProgress } from "@solidiom/recipes-css"

;<StyledProgress value={65} aria-label="Progreso de carga">
  <Progress.Indicator />
</StyledProgress>
```

## Indeterminado

Para operaciones con duración desconocida:

```tsx
import { StyledProgress } from "@solidiom/recipes-css"

;<StyledProgress value={null} aria-label="Cargando">
  <Progress.Indicator />
</StyledProgress>
```
