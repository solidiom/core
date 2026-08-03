---
contentSchemaVersion: 1
title: Alert básico
description: Ejemplos de variantes de alert y asertividad.
keywords: [alert, notificación, info, éxito, advertencia, error, assertive, polite]
locale: es
maturity: draft
product: Alert
productLayer: primitive
status: draft
package: "@solidiom/alert"
primitive: alert
section: examples
exampleId: alert-basic
source:
  path: packages/alert/src/index.tsx
  export: Root
  language: tsx
runnable: false
translationSourceHash: "1461b9dad4f13d90cf14fe425d53c3a404090b6fc12b51e659bbd5891353dbdd"
translationStatus: draft
---

```tsx
import * as Alert from "@solidiom/alert"

;<Alert.Root type="info">
  <Alert.Title>Información</Alert.Title>
  <Alert.Description>Una nueva característica está disponible en tu panel.</Alert.Description>
</Alert.Root>
```

## Variantes

Alert soporta cuatro variantes visuales controladas por el prop `type`.

```tsx
;<Alert.Root type="success">
  <Alert.Title>Éxito</Alert.Title>
  <Alert.Description>Tus cambios han sido guardados.</Alert.Description>
</Alert.Root>

;<Alert.Root type="warning">
  <Alert.Title>Advertencia</Alert.Title>
  <Alert.Description>Estás acercándote a tu límite de almacenamiento.</Alert.Description>
</Alert.Root>

;<Alert.Root type="error">
  <Alert.Title>Error</Alert.Title>
  <Alert.Description>No se pudo conectar al servidor.</Alert.Description>
</Alert.Root>
```

## Asertividad

Controla cómo se anuncia el alert a los lector de pantalla con el prop `assertiveness`. Usa `polite` para actualizaciones no urgentes que no deberían interrumpir al usuario.

```tsx
;<Alert.Root type="info" assertiveness="polite">
  <Alert.Title>Actualización</Alert.Title>
  <Alert.Description>Se han recibido nuevos mensajes.</Alert.Description>
</Alert.Root>
```
