---
contentSchemaVersion: 1
title: Virtual List
description: Viewport-windowed list for large datasets.
keywords: [datasets, for, large, layout, list, runtime, viewport]
locale: es
maturity: ga
product: Virtual List
productLayer: primitive
status: draft
package: "@solidiom/virtual-list"
primitive: virtual-list
section: overview
translationSourceHash: "f5fbaa2b0bdeb8d4771f7063123360095c571540441c00755377b92d5c5f3292"
translationStatus: human-reviewed
translationReviewedBy: "G5-gate"
translationReviewedAt: "2026-08-07"
notApplicable:
  - section: composition
    reason: Virtual List es un primitivo autónomo sin sub-primitivos compuestos.
  - section: relationships
    reason: Virtual List no tiene primitivos hermanos; se usa dentro de otras composiciones pero no posee un contrato inter-primitivo.
  - section: migration
    reason: Sin API previa; esta es la primera versión publicada.
  - section: testing
    reason: La guía estándar de pruebas cubre este primitivo.
---

Viewport-windowed list for large datasets.

## Uso

Compón `Root`, `Item`.

```tsx
import * as VirtualList from "@solidiom/virtual-list"

;<VirtualList.Root>Contenido de Virtual List</VirtualList.Root>
```

## Instalación

Instala el paquete con `pnpm add @solidiom/virtual-list`. El paquete requiere dependencias pares compatibles de `solid-js` y `@solidjs/web`.

## Partes

Virtual List expone 2 partes:

- **Root** — `data-part="root"`.
- **Item** — `data-part="item"`.

## Estilos

Virtual List lleva los atributos `data-scope="virtual-list"` y `data-part` en cada parte para la selección CSS/receta. Los atributos de estado como `data-state`, `data-disabled` y `data-highlighted` se exponen donde corresponda.

## Interacción con teclado

Este primitivo no tiene interacción con teclado. Renderiza contenido que no recibe foco ni responde a eventos de teclado de forma independiente.

## Renderizado SSR e hidratación

Virtual List se renderiza como HTML semántico durante el renderizado en servidor. El comportamiento interactivo (manejadores de teclado, gestión de estado) se activa en la hidratación sin desplazamiento de diseño.
