---
contentSchemaVersion: 1
title: Empty State
description: Placeholder for empty content areas.
keywords: [areas, content, empty, feedback, for, placeholder, runtime]
locale: es
maturity: ga
product: Empty State
productLayer: primitive
status: draft
package: "@solidiom/empty-state"
primitive: empty-state
section: overview
translationSourceHash: "ac1c7cd2ba31a4ef8a096e37501b470b7de0cc611e5af861548e52357299c5ef"
translationStatus: human-reviewed
translationReviewedBy: "G5-gate"
translationReviewedAt: "2026-08-07"
notApplicable:
  - section: relationships
    reason: Empty State no tiene primitivos hermanos; se usa dentro de otras composiciones pero no posee un contrato inter-primitivo.
  - section: migration
    reason: Sin API previa; esta es la primera versión publicada.
  - section: testing
    reason: La guía estándar de pruebas cubre este primitivo.
---

Placeholder for empty content areas.

## Uso

Compón `Root`, `Icon`, `Title`, `Description`, `Action`.

```tsx
import * as EmptyState from "@solidiom/empty-state"

;<EmptyState.Root>Contenido de Empty State</EmptyState.Root>
```

## Instalación

Instala el paquete con `pnpm add @solidiom/empty-state`. El paquete requiere dependencias pares compatibles de `solid-js` y `@solidjs/web`.

## Partes

Empty State expone 5 partes:

- **Root** — `data-part="root"`.
- **Icon** — `data-part="icon"`.
- **Title** — `data-part="title"`.
- **Description** — `data-part="description"`.
- **Action** — `data-part="action"`.

## Estilos

Empty State lleva los atributos `data-scope="empty-state"` y `data-part` en cada parte para la selección CSS/receta. Los atributos de estado como `data-state`, `data-disabled` y `data-highlighted` se exponen donde corresponda.

## Interacción con teclado

Este primitivo no tiene interacción con teclado. Renderiza contenido que no recibe foco ni responde a eventos de teclado de forma independiente.

## Composición

Empty State está diseñado para componerse con otras primitivas. Sus partes pueden combinarse con Field, Button u otras primitivas según sea necesario.

## Renderizado SSR e hidratación

Empty State se renderiza como HTML semántico durante el renderizado en servidor. El comportamiento interactivo (manejadores de teclado, gestión de estado) se activa en la hidratación sin desplazamiento de diseño.
