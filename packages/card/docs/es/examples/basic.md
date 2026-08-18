---
contentSchemaVersion: 1
title: Card básica
description: Card simple con encabezado, contenido y pie.
keywords: [card, contenedor, encabezado, titulo, contenido, pie]
locale: es
maturity: draft
product: Card
productLayer: primitive
status: draft
package: "@solidiom/card"
primitive: card
section: examples
exampleId: card-basic
source:
  path: packages/card/src/index.tsx
  export: Root
  language: tsx
runnable: false
translationSourceHash: "a90a84d61d2061159e87f293c856727f3a4249a77d6baa9b200a71f81c935d26"
translationStatus: "human-reviewed"
translationReviewedBy: "solidiom-team"
translationReviewedAt: "2026-08-18"
---

```tsx
import * as Card from "@solidiom/card"

;<Card.Root>
  <Card.Header>
    <Card.Title>Bienvenido</Card.Title>
    <Card.Description>Una card simple con todas las partes estándar.</Card.Description>
  </Card.Header>
  <Card.Content>Este es el área de contenido principal de la card.</Card.Content>
  <Card.Footer>Sección de pie</Card.Footer>
</Card.Root>
```

## Mínimo

Usa solo las partes que necesites. Una card con solo contenido es perfectamente válida.

```tsx
;<Card.Root>
  <Card.Content>Card con solo contenido.</Card.Content>
</Card.Root>
```

## Solo Encabezado

Usa las partes del encabezado sin una sección de contenido o pie.

```tsx
;<Card.Root>
  <Card.Header>
    <Card.Title>Titulo de la Card</Card.Title>
  </Card.Header>
</Card.Root>
```
