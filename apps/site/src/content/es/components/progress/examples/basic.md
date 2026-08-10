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
translationSourceHash: "c65ef6a1743946e8d6d92eacdd6bad8d42fd1ccad8c4475f5aa5075ea8b8fbef"
translationStatus: draft
---

El componente Progress indica el estado de completitud de una tarea.

```tsx
import { StyledProgress, Progress } from "@solidiom/recipes-css"

;<StyledProgress value={65} aria-label="Progreso de carga">
  <Progress.Indicator />
</StyledProgress>
```

## Indeterminado

Para operaciones con duración desconocida:

```tsx
import { StyledProgress, Progress } from "@solidiom/recipes-css"

;<StyledProgress value={null} aria-label="Cargando">
  <Progress.Indicator />
</StyledProgress>
```
