---
contentSchemaVersion: 1
title: Alerta básica
description: Primitiva de alerta con tipos de información, éxito, advertencia y error usando estilos de receta.
keywords: [alert, notification, feedback, variant]
locale: es
maturity: draft
product: Alert
productLayer: component
status: draft
package: "@solidiom/recipes-css"
recipe: "alert"
section: examples
exampleId: alert-component-basic
source:
  path: apps/site/src/components/AlertExample.tsx
  export: AlertExample
  language: tsx
runnable: true
translationSourceHash: "17c4de3af9bd1a7ac7de8524306f0e9a8ae9c1c450852202d0d88b75df189f13"
translationStatus: "human-reviewed"
translationReviewedBy: "solidiom-team"
translationReviewedAt: "2026-08-18"
---

El ejemplo ejecutable usa la primitiva `@solidiom/alert` y la hoja de estilos de receta CSS. La primitiva define los valores de `type` y las partes; la hoja de estilos de receta aporta el estilo visual.

```tsx
import * as Alert from "@solidiom/alert"
import "@solidiom/recipes-css/styles/alert.css"

;<Alert.Root type="info">
  <Alert.Title>Información</Alert.Title>
  <Alert.Description>Hay una nueva actualización disponible.</Alert.Description>
</Alert.Root>
```

Los tipos de la primitiva usados por el ejemplo son `info`, `success`, `warning` y `error`.
