---
contentSchemaVersion: 1
title: Tarjeta básica
description: Componente Card con encabezado, título, descripción, contenido y pie de página.
keywords: [card, container, layout, header, footer, styled]
locale: es
maturity: draft
product: Card
productLayer: component
status: draft
package: "@solidiom/recipes-css"
recipe: "card"
section: examples
exampleId: card-component-basic
runnable: true
translationSourceHash: "272f8a21132b8f0cae307f2a3332edc78e6f165f843028a148bc325257f47ac3"
translationStatus: draft
---

El componente Card proporciona un envoltorio estilizado alrededor de contenedores de contenido con composición de encabezado, contenido principal y pie de página.

```tsx
import { StyledCard, Card } from "@solidiom/recipes-css"

;<StyledCard>
  <Card.Header>
    <Card.Title>Comenzar</Card.Title>
    <Card.Description>
      Todo lo que necesitas saber para empezar.
    </Card.Description>
  </Card.Header>
  <Card.Content>Comienza a construir tu proyecto hoy.</Card.Content>
  <Card.Footer>Acción del pie de página o metadatos van aquí.</Card.Footer>
</StyledCard>
```

## Tarjeta minimalista

Una tarjeta con solo contenido y sin encabezado ni pie de página.

```tsx
;<StyledCard>
  <Card.Content>Contenido simple de tarjeta sin encabezado ni pie de página.</Card.Content>
</StyledCard>
```

## Tarjeta con solo encabezado

```tsx
;<StyledCard>
  <Card.Header>
    <Card.Title>Título de la Tarjeta</Card.Title>
    <Card.Description>Una breve descripción del contenido de la tarjeta.</Card.Description>
  </Card.Header>
  <Card.Content>El cuerpo principal de la tarjeta va aquí.</Card.Content>
</StyledCard>
```