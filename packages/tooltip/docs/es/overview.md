---
contentSchemaVersion: 1
title: Tooltip
description: Contextual hint shown on hover/focus.
keywords: [contextual, focus, hint, hover, overlay, positioning, runtime]
locale: es
maturity: draft
product: Tooltip
productLayer: primitive
status: draft
package: "@solidiom/tooltip"
primitive: tooltip
section: overview
translationSourceHash: "31fdd5bc54e3575d360d248ceb637b380fdd9f0a4a66a6d08a9cdfc4a4e3a23a"
translationStatus: draft
notApplicable:
  - section: relationships
    reason: Tooltip no tiene primitivos hermanos; se usa dentro de otras composiciones pero no posee un contrato inter-primitivo.
  - section: migration
    reason: Sin API previa; esta es la primera versión publicada.
  - section: testing
    reason: La guía estándar de pruebas cubre este primitivo.
---

Contextual hint shown on hover/focus.

## Uso

Compón `Root`, `Trigger`, `Content`.

```tsx
import * as Tooltip from "@solidiom/tooltip"

;<Tooltip.Root>Contenido de Tooltip</Tooltip.Root>
```

## Instalación

Instala el paquete con `pnpm add @solidiom/tooltip`. El paquete requiere dependencias pares compatibles de `solid-js` y `@solidjs/web`.

## Partes

Tooltip expone 3 partes:

- **Root** — `data-part="root"`.
- **Trigger** — `data-part="trigger"`.
- **Content** — `data-part="content"`.

## Estilos

Tooltip lleva los atributos `data-scope="tooltip"` y `data-part` en cada parte para la selección CSS/receta. Los atributos de estado como `data-state`, `data-disabled` y `data-highlighted` se exponen donde corresponda.

## Interacción con teclado

Este primitivo no tiene interacción con teclado. Renderiza contenido que no recibe enfoque ni responde a eventos de teclado de forma independiente.

## Composición

Tooltip está diseñado para componerse con otras primitivas. Sus partes pueden combinarse con Field, Button u otras primitivas según sea necesario.

## Renderizado SSR e hidratación

Tooltip se renderiza como HTML semántico durante el renderizado en servidor. El comportamiento interactivo (manejadores de teclado, gestión de estado) se activa en la hidratación sin desplazamiento de diseño.
