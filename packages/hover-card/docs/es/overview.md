---
contentSchemaVersion: 1
title: Hover Card
description: Content preview on hover with open delay and anchored positioning.
keywords: [anchored, and, card, content, delay, hover, open]
locale: es
maturity: ga
product: Hover Card
productLayer: primitive
status: draft
package: "@solidiom/hover-card"
primitive: hover-card
section: overview
notApplicable:
  - section: relationships
    reason: Hover Card no tiene primitivos hermanos; se usa dentro de otras composiciones pero no posee un contrato inter-primitivo.
  - section: migration
    reason: Sin API previa; esta es la primera versión publicada.
  - section: testing
    reason: La guía estándar de pruebas cubre este primitivo.
translationSourceHash: "b2bbba2307036a3245d374dce56ff2ebcdde4f049dee17984cacb5ef624f4d72"
translationStatus: "human-reviewed"
translationReviewedBy: "solidiom-team"
translationReviewedAt: "2026-08-18"
---

Content preview on hover with open delay and anchored positioning.

## Uso

Compón `Root`, `Trigger`, `Content`.

```tsx
import * as HoverCard from "@solidiom/hover-card"

;<HoverCard.Root>Contenido de Hover Card</HoverCard.Root>
```

## Instalación

Instala el paquete con `pnpm add @solidiom/hover-card`. El paquete requiere dependencias pares compatibles de `solid-js` y `@solidjs/web`.

## Partes

Hover Card expone 3 partes:

- **Root** — `data-part="root"`.
- **Trigger** — `data-part="trigger"`.
- **Content** — `data-part="content"`.

## Estilos

Hover Card lleva los atributos `data-scope="hover-card"` y `data-part` en cada parte para la selección CSS/receta. Los atributos de estado como `data-state`, `data-disabled` y `data-highlighted` se exponen donde corresponda.

## Interacción con teclado

Este primitivo no tiene interacción con teclado. Renderiza contenido que no recibe foco ni responde a eventos de teclado de forma independiente.

## Composición

Hover Card está diseñado para componerse con otras primitivas. Sus partes pueden combinarse con Field, Button u otras primitivas según sea necesario.

## Renderizado SSR e hidratación

Hover Card se renderiza como HTML semántico durante el renderizado en servidor. El comportamiento interactivo (manejadores de teclado, gestión de estado) se activa en la hidratación sin desplazamiento de diseño.
