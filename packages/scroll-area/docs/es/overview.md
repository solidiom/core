---
contentSchemaVersion: 1
title: Scroll Area
description: Custom-styled scrollbar with native scrolling performance.
keywords: [area, custom, layout, native, performance, runtime, scroll]
locale: es
maturity: ga
product: Scroll Area
productLayer: primitive
status: draft
package: "@solidiom/scroll-area"
primitive: scroll-area
section: overview
translationSourceHash: "b66bffcfbf3e8d82228f1e42d67f71b333fc8c7f8dfc65735c525e5b25b381dd"
translationStatus: human-reviewed
translationReviewedBy: "G5-gate"
translationReviewedAt: "2026-08-07"
notApplicable:
  - section: relationships
    reason: Scroll Area no tiene primitivos hermanos; se usa dentro de otras composiciones pero no posee un contrato inter-primitivo.
  - section: migration
    reason: Sin API previa; esta es la primera versión publicada.
  - section: testing
    reason: La guía estándar de pruebas cubre este primitivo.
---

Custom-styled scrollbar with native scrolling performance.

## Uso

Compón `Root`, `Viewport`, `Scrollbar`, `Thumb`.

```tsx
import * as ScrollArea from "@solidiom/scroll-area"

;<ScrollArea.Root>Contenido de Scroll Area</ScrollArea.Root>
```

## Instalación

Instala el paquete con `pnpm add @solidiom/scroll-area`. El paquete requiere dependencias pares compatibles de `solid-js` y `@solidjs/web`.

## Partes

Scroll Area expone 4 partes:

- **Root** — `data-part="root"`.
- **Viewport** — `data-part="viewport"`.
- **Scrollbar** — `data-part="scrollbar"`.
- **Thumb** — `data-part="thumb"`.

## Estilos

Scroll Area lleva los atributos `data-scope="scroll-area"` y `data-part` en cada parte para la selección CSS/receta. Los atributos de estado como `data-state`, `data-disabled` y `data-highlighted` se exponen donde corresponda.

## Interacción con teclado

Este primitivo no tiene interacción con teclado. Renderiza contenido que no recibe foco ni responde a eventos de teclado de forma independiente.

## Composición

Scroll Area está diseñado para componerse con otras primitivas. Sus partes pueden combinarse con Field, Button u otras primitivas según sea necesario.

## Renderizado SSR e hidratación

Scroll Area se renderiza como HTML semántico durante el renderizado en servidor. El comportamiento interactivo (manejadores de teclado, gestión de estado) se activa en la hidratación sin desplazamiento de diseño.
