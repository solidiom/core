---
contentSchemaVersion: 1
title: Drawer
description: Slide-in panel from any screen edge.
keywords: [any, drawer, edge, from, overlay, panel, runtime]
locale: es
maturity: ga
product: Drawer
productLayer: primitive
status: draft
package: "@solidiom/drawer"
primitive: drawer
section: overview
translationSourceHash: "77cf13de16b810e396cc7df462c84afbd801b633670b3d2a64095f39737167e5"
translationStatus: human-reviewed
translationReviewedBy: "G5-gate"
translationReviewedAt: "2026-08-07"
notApplicable:
  - section: relationships
    reason: Drawer no tiene primitivos hermanos; se usa dentro de otras composiciones pero no posee un contrato inter-primitivo.
  - section: migration
    reason: Sin API previa; esta es la primera versión publicada.
  - section: testing
    reason: La guía estándar de pruebas cubre este primitivo.
---

Slide-in panel from any screen edge.

## Uso

Compón `Root`, `Trigger`, `Backdrop`, `Content`, `Close`, `Title`, `Description`.

```tsx
import * as Drawer from "@solidiom/drawer"

;<Drawer.Root>Contenido de Drawer</Drawer.Root>
```

## Instalación

Instala el paquete con `pnpm add @solidiom/drawer`. El paquete requiere dependencias pares compatibles de `solid-js` y `@solidjs/web`.

## Partes

Drawer expone 7 partes:

- **Root** — `data-part="root"`.
- **Trigger** — `data-part="trigger"`.
- **Backdrop** — `data-part="backdrop"`.
- **Content** — `data-part="content"`.
- **Close** — `data-part="close"`.
- **Title** — `data-part="title"`.
- **Description** — `data-part="description"`.

## Estilos

Drawer lleva los atributos `data-scope="drawer"` y `data-part` en cada parte para la selección CSS/receta. Los atributos de estado como `data-state`, `data-disabled` y `data-highlighted` se exponen donde corresponda.

## Interacción con teclado

Este primitivo no tiene interacción con teclado. Renderiza contenido que no recibe foco ni responde a eventos de teclado de forma independiente.

## Composición

Drawer está diseñado para componerse con otras primitivas. Sus partes pueden combinarse con Field, Button u otras primitivas según sea necesario.

## Renderizado SSR e hidratación

Drawer se renderiza como HTML semántico durante el renderizado en servidor. El comportamiento interactivo (manejadores de teclado, gestión de estado) se activa en la hidratación sin desplazamiento de diseño.
