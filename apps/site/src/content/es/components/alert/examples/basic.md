---
contentSchemaVersion: 1
title: Alerta básica
description: Componente de alerta con variantes de información, éxito, advertencia y error.
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
translationSourceHash: "a31670f5f9060e8a263eecb72e33bab5e7869603af27fd0845191d52a3e36cd9"
translationStatus: draft
---

El componente Alert es un envoltorio de receta estilizado alrededor del primitivo `@solidiom/alert`. Añade estilos de variante, composición con `Alert.Title` y `Alert.Description`, y slots de estilo semántico mientras delega toda la gestión de estado y el comportamiento ARIA al primitivo subyacente.

```tsx
import { StyledAlert, Alert } from "@solidiom/recipes-css"

;<StyledAlert variant="info">
  <Alert.Title>Information</Alert.Title>
  <Alert.Description>A new software update is available.</Alert.Description>
</StyledAlert>
```

## Variante de éxito

Usa la variante de éxito para resultados positivos y confirmaciones.

```tsx
import { StyledAlert, Alert } from "@solidiom/recipes-css"

;<StyledAlert variant="success">
  <Alert.Title>Success</Alert.Title>
  <Alert.Description>Your changes have been saved.</Alert.Description>
</StyledAlert>
```

## Variante de advertencia

Usa la variante de advertencia para mensajes de precaución que requieren atención.

```tsx
import { StyledAlert, Alert } from "@solidiom/recipes-css"

;<StyledAlert variant="warning">
  <Alert.Title>Warning</Alert.Title>
  <Alert.Description>Your session will expire in 5 minutes.</Alert.Description>
</StyledAlert>
```

## Variante de error

Usa la variante de error para fallos críticos y mensajes que requieren acción.

```tsx
import { StyledAlert, Alert } from "@solidiom/recipes-css"

;<StyledAlert variant="error">
  <Alert.Title>Error</Alert.Title>
  <Alert.Description>Failed to connect to the server. Please try again.</Alert.Description>
</StyledAlert>
```