---
contentSchemaVersion: 1
title: Virtual List
description: Viewport-windowed list for large datasets.
keywords: [datasets, for, large, layout, list, runtime, viewport]
locale: es
maturity: draft
product: Virtual List
productLayer: primitive
status: draft
package: "@solidiom/virtual-list"
primitive: virtual-list
section: overview
translationSourceHash: "cbdc882c94f86f9d871f8158bb8b4640efd733fbeb7d61d907f4a180361db82e"
translationStatus: draft
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

Este primitivo no tiene interacción con teclado. Renderiza contenido que no recibe enfoque ni responde a eventos de teclado de forma independiente.

## Renderizado SSR e hidratación

Virtual List se renderiza como HTML semántico durante el renderizado en servidor. El comportamiento interactivo (manejadores de teclado, gestión de estado) se activa en la hidratación sin desplazamiento de diseño.
