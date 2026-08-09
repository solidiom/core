---
contentSchemaVersion: 1
title: Toggle Group
description: Group of mutually-exclusive or multi-select toggle buttons.
keywords: [buttons, exclusive, group, input, multi, mutually, runtime]
locale: es
maturity: ga
product: Toggle Group
productLayer: primitive
status: draft
package: "@solidiom/toggle-group"
primitive: toggle-group
section: overview
translationSourceHash: "03f1a40761ca4010a6549cf8d609b39422710b83600efa3dd2b4582d4297ace5"
translationStatus: human-reviewed
translationReviewedBy: "G5-gate"
translationReviewedAt: "2026-08-07"
notApplicable:
  - section: composition
    reason: Toggle Group es un primitivo autónomo sin sub-primitivos compuestos.
  - section: relationships
    reason: Toggle Group no tiene primitivos hermanos; se usa dentro de otras composiciones pero no posee un contrato inter-primitivo.
  - section: migration
    reason: Sin API previa; esta es la primera versión publicada.
  - section: testing
    reason: La guía estándar de pruebas cubre este primitivo.
---

Group of mutually-exclusive or multi-select toggle buttons.

## Uso

Compón `Root`, `Item`.

```tsx
import * as ToggleGroup from "@solidiom/toggle-group"

;<ToggleGroup.Root>Contenido de Toggle Group</ToggleGroup.Root>
```

## Instalación

Instala el paquete con `pnpm add @solidiom/toggle-group`. El paquete requiere dependencias pares compatibles de `solid-js` y `@solidjs/web`.

## Partes

Toggle Group expone 2 partes:

- **Root** — `data-part="root"`.
- **Item** — `data-part="item"`.

## Estilos

Toggle Group lleva los atributos `data-scope="toggle-group"` y `data-part` en cada parte para la selección CSS/receta. Los atributos de estado como `data-state`, `data-disabled` y `data-highlighted` se exponen donde corresponda.

## Interacción con teclado

Este primitivo no tiene interacción con teclado. Renderiza contenido que no recibe foco ni responde a eventos de teclado de forma independiente.

## Renderizado SSR e hidratación

Toggle Group se renderiza como HTML semántico durante el renderizado en servidor. El comportamiento interactivo (manejadores de teclado, gestión de estado) se activa en la hidratación sin desplazamiento de diseño.
