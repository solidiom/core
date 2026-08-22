---
contentSchemaVersion: 1
title: Grid
description: Primitivo de diseño CSS Grid con columnas responsivas y separación configurable.
keywords: [grid, layout, css grid, columns, gap, responsive]
locale: es
maturity: ga
product: Grid
productLayer: primitive
status: draft
package: "@solidiom/grid"
primitive: grid
section: overview
notApplicable:
  - section: migration
    reason: No existe una API anterior; esta es la primera versión publicada.
  - section: testing
    reason: La guía de pruebas estándar cubre este primitivo.
translationSourceHash: "1ab68644a7e090a7d7d957e9f2fd1b802de5a75e379c5d6e21047f3ab6a19471"
translationStatus: "draft"
---

Grid es un primitivo de diseño CSS Grid que admite columnas responsivas y separación. `Root` es un contenedor CSS grid e `Item` es una celda de la cuadrícula.

## Uso

Compón `Root` e `Item`. `Root` establece el contenedor grid y cada `Item` es una celda.

```tsx
import * as Grid from "@solidiom/grid"

;<Grid.Root>
  <Grid.Item>Uno</Grid.Item>
  <Grid.Item>Dos</Grid.Item>
  <Grid.Item>Tres</Grid.Item>
</Grid.Root>
```

## Instalación

Instala el paquete con `pnpm add @solidiom/grid`. El paquete requiere dependencias pares compatibles de `solid-js` y `@solidjs/web`.

## Partes

grid expone 2 partes:

- **Root** — el contenedor CSS grid.
- **Item** — una celda dentro del contenedor.

## Estilos

grid incluye `data-scope="grid"` y atributos `data-part` en cada parte para seleccionar estilos CSS o recetas.

## Teclado y comportamiento

Este primitivo no tiene interacción de teclado propia.

## Composición

Coloca cualquier primitivo dentro de las celdas `Item` para organizarlo en una cuadrícula responsiva.

## SSR e hidratación

Grid renderiza HTML estático y no requiere hidratación.
