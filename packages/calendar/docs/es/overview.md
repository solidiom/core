---
contentSchemaVersion: 1
title: Calendar
description: Date selection with day/month/year views.
keywords: [calendar, date, date-math, day, input, month, runtime]
locale: es
maturity: ga
product: Calendar
productLayer: primitive
status: draft
package: "@solidiom/calendar"
primitive: calendar
section: overview
translationSourceHash: "585e20fa5fb10146347044b7768feb7d3885c4f2a89557db4dc6be8bba495875"
translationStatus: human-reviewed
translationReviewedBy: "G5-gate"
translationReviewedAt: "2026-08-07"
notApplicable:
  - section: relationships
    reason: Calendar no tiene primitivos hermanos; se usa dentro de otras composiciones pero no posee un contrato inter-primitivo.
  - section: migration
    reason: Sin API previa; esta es la primera versión publicada.
  - section: testing
    reason: La guía estándar de pruebas cubre este primitivo.
---

Date selection with day/month/year views.

## Uso

Compón `Root`, `Header`, `PrevButton`, `Title`, `NextButton`, `Grid`, `Cell`.

```tsx
import * as Calendar from "@solidiom/calendar"

;<Calendar.Root>Contenido de Calendar</Calendar.Root>
```

## Instalación

Instala el paquete con `pnpm add @solidiom/calendar`. El paquete requiere dependencias pares compatibles de `solid-js` y `@solidjs/web`.

## Partes

Calendar expone 7 partes:

- **Root** — `data-part="root"`.
- **Header** — `data-part="header"`.
- **PrevButton** — `data-part="prevbutton"`.
- **Title** — `data-part="title"`.
- **NextButton** — `data-part="nextbutton"`.
- **Grid** — `data-part="grid"`.
- **Cell** — `data-part="cell"`.

## Estilos

Calendar lleva los atributos `data-scope="calendar"` y `data-part` en cada parte para la selección CSS/receta. Los atributos de estado como `data-state`, `data-disabled` y `data-highlighted` se exponen donde corresponda.

## Interacción con teclado

Este primitivo no tiene interacción con teclado. Renderiza contenido que no recibe foco ni responde a eventos de teclado de forma independiente.

## Composición

Calendar está diseñado para componerse con otras primitivas. Sus partes pueden combinarse con Field, Button u otras primitivas según sea necesario.

## Renderizado SSR e hidratación

Calendar se renderiza como HTML semántico durante el renderizado en servidor. El comportamiento interactivo (manejadores de teclado, gestión de estado) se activa en la hidratación sin desplazamiento de diseño.
