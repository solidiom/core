---
contentSchemaVersion: 1
title: Segmented Control
description: Selector de opciones mutuamente excluyentes representado como segmentos conectados.
keywords: [segmented control, radio group, selector, segments, roving focus, indicator]
locale: es
maturity: ga
product: Segmented Control
productLayer: primitive
status: draft
package: "@solidiom/segmented-control"
primitive: segmented-control
section: overview
notApplicable:
  - section: migration
    reason: No existe una API anterior; esta es la primera versión publicada.
  - section: testing
    reason: La guía de pruebas estándar cubre este primitivo.
translationSourceHash: "d03f080a7c2519dcbe238f48a4d88350adf8566735b6dbd91eb5e75052aafa15"
translationStatus: "draft"
---

Segmented Control es un selector de opciones mutuamente excluyentes representado como segmentos conectados. Proporciona semántica accesible de grupo de radio, navegación de foco roving con el teclado, un `Indicator` animado y participación en formularios nativos mediante inputs de radio ocultos.

## Uso

Compón `Root`, `Item` e `Indicator`. Cada `Item` es un segmento seleccionable e `Indicator` se anima hasta el segmento activo.

```tsx
import * as SegmentedControl from "@solidiom/segmented-control"

;<SegmentedControl.Root>
  <SegmentedControl.Item value="list">Lista</SegmentedControl.Item>
  <SegmentedControl.Item value="grid">Cuadrícula</SegmentedControl.Item>
  <SegmentedControl.Indicator />
</SegmentedControl.Root>
```

## Instalación

Instala el paquete con `pnpm add @solidiom/segmented-control`. El paquete requiere dependencias pares compatibles de `solid-js` y `@solidjs/web`.

## Partes

segmented-control expone 3 partes:

- **Root** — contenedor del grupo de radio que gestiona la selección, el foco roving y los inputs de radio ocultos.
- **Item** — segmento seleccionable.
- **Indicator** — elemento animado que sigue al segmento activo.

## Estilos

segmented-control incluye los atributos `data-scope="segmented-control"` y `data-part` en cada parte para seleccionar estilos CSS o recetas.

## Teclado y comportamiento

segmented-control usa semántica accesible de grupo de radio con foco roving.

| Tecla            | Comportamiento                                     |
| ---------------- | -------------------------------------------------- |
| Teclas de flecha | Mueven la selección entre segmentos (foco roving). |

## Composición

Compón con contenido de icono o etiqueta dentro de cada `Item` para crear un selector de opciones etiquetado; los inputs de radio ocultos gestionan la participación en formularios nativos.

## SSR e hidratación

Los segmentos se renderizan como HTML estático con inputs de radio ocultos para participar en formularios; el foco roving y el indicador animado se activan durante la hidratación.
