---
contentSchemaVersion: 1
title: Card
description: Contenedor de contenido con secciones de encabezado, cuerpo y pie.
keywords: [card, contenedor, encabezado, titulo, descripcion, contenido, pie]
locale: es
maturity: draft
product: Card
productLayer: primitive
status: draft
package: "@solidiom/card"
primitive: card
section: overview
translationSourceHash: "e3c450e61ea3422353cb708e31efc84ebb57491ea3936bccd3bfaf66053b6ada"
translationStatus: draft
---

Card renderiza un contenedor de contenido con partes componibles para encabezado, titulo, descripcion, cuerpo de contenido y pie. Proporciona una estructura semántica para agrupar contenido y acciones relacionadas.

## Uso

Card proporciona múltiples partes componibles. Usa las partes que necesites para tu estructura de contenido.

```tsx
import * as Card from "@solidiom/card"

;<Card.Root>
  <Card.Header>
    <Card.Title>Titulo de la Tarjeta</Card.Title>
    <Card.Description>Texto de descripcion opcional.</Card.Description>
  </Card.Header>
  <Card.Content>El contenido principal va aqui.</Card.Content>
  <Card.Footer>Contenido del pie o acciones.</Card.Footer>
</Card.Root>
```

## Instalación

Instala el paquete con `pnpm add @solidiom/card`. El paquete requiere dependencias pares compatibles de `solid-js` y `@solidjs/web`.

## Partes

| Parte         | Elemento | Props                        | Descripción                                     |
| ------------- | -------- | ---------------------------- | ----------------------------------------------- |
| `Root`        | `<div>`  | `class`, `style`, `children` | Contenedor externo de la tarjeta.               |
| `Header`      | `<div>`  | `class`, `style`, `children` | Sección de encabezado de la tarjeta.            |
| `Title`       | `<h3>`   | `class`, `children`          | Titulo del encabezado de la tarjeta.            |
| `Description` | `<p>`    | `class`, `children`          | Texto descriptivo del encabezado de la tarjeta. |
| `Content`     | `<div>`  | `class`, `style`, `children` | Cuerpo principal de contenido de la tarjeta.    |
| `Footer`      | `<div>`  | `class`, `style`, `children` | Sección de pie de la tarjeta.                   |

## Estilos

Card lleva los atributos `data-scope="card"` y `data-part` en cada parte. Estiliza las partes individuales usando los atributos data para seleccionar. Las partes se renderizan como elementos HTML semánticos; aplica tu receta visual usando los atributos data para la selección.

## Renderizado SSR e hidratación

Card es un elemento de visualización pasivo sin estado interactivo. Se renderiza como HTML estático y no requiere hidratación en el cliente.
