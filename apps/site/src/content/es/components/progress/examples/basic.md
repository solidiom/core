---
contentSchemaVersion: 1
title: Progreso básico
description: Componente Progress con ejemplos determinista e indeterminado.
keywords: [progress, indicator, loading, determinate, indeterminate]
locale: es
maturity: draft
product: Progress
productLayer: component
status: draft
package: "@solidiom/recipes-css"
recipe: "progress"
section: examples
exampleId: progress-component-basic
runnable: true
translationSourceHash: "c65ef6a1743946e8d6d92eacdd6bad8d42fd1ccad8c4475f5aa5075ea8b8fbef"
translationStatus: draft
---

El componente Progress es un envoltorio de receta estilizado alrededor del primitivo `@solidiom/progress`. Proporciona un indicador de progreso lineal visual con atributos ARIA semánticos para tecnologías de asistencia.

```tsx
import { StyledProgress, Progress } from "@solidiom/recipes-css"

;<StyledProgress value={65}>
  <Progress.Indicator />
</StyledProgress>
```

## Progreso indeterminado

Usa `value={null}` para un estado de carga indeterminado.

```tsx
;<StyledProgress value={null}>
  <Progress.Indicator />
</StyledProgress>
```

## Con máximo personalizado

Controla el valor máximo para el cálculo del porcentaje.

```tsx
;<StyledProgress value={75} max={200}>
  <Progress.Indicator />
</StyledProgress>
```