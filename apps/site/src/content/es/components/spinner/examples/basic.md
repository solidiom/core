---
contentSchemaVersion: 1
title: Spinner básico
description: Componente spinner con ejemplos de indicador de carga.
keywords: [spinner, loading, indicator, primitive]
locale: es
maturity: draft
product: Spinner
productLayer: component
status: draft
package: "@solidiom/recipes-css"
recipe: "spinner"
section: examples
exampleId: spinner-component-basic
source:
  path: apps/site/src/components/SpinnerExample.tsx
  export: SpinnerExample
  language: tsx
runnable: true
translationSourceHash: "9cc696230497383e41a6c0961e7f0b2aa6eeb1bee7ed7b56ed8b6c9c49a90b85"
translationStatus: draft
---

El componente Spinner es un envoltorio de receta estilizado alrededor del primitivo `@solidiom/spinner`. Proporciona un indicador de carga ligero con un rol de estado accesible, anunciado a lectores de pantalla.

```tsx
import { StyledSpinner } from "@solidiom/recipes-css"

;<StyledSpinner>Cargando...</StyledSpinner>
```

## Con etiqueta personalizada

Controla la etiqueta accesible anunciada por los lectores de pantalla.

```tsx
import { StyledSpinner } from "@solidiom/recipes-css"

;<StyledSpinner label="Guardando cambios...">Guardando...</StyledSpinner>
```