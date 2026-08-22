---
contentSchemaVersion: 1
title: Calendar
description: Selección de fechas con vistas de día, mes y año.
keywords: [calendar, date, date-math, day, input, month, runtime]
locale: es
maturity: ga
product: Calendar
productLayer: primitive
status: draft
package: "@solidiom/calendar"
primitive: calendar
section: overview
notApplicable:
  - section: relationships
    reason: Calendar no tiene primitivos hermanos; se usa dentro de otras composiciones pero no posee un contrato inter-primitivo.
  - section: migration
    reason: No existe una API anterior; esta es la primera versión publicada.
  - section: testing
    reason: La guía de pruebas estándar cubre este primitivo.
translationSourceHash: "fe95243661a87721e125474a76bf7bf97406373b5e19e35f485ef6cdf34e25ec"
translationStatus: "human-reviewed"
translationReviewedBy: "solidiom-team"
translationReviewedAt: "2026-08-22"
---

Selección de fechas con vistas de día, mes y año.

## Uso

Compón `Root`, `Header`, `PrevButton`, `Title`, `NextButton`, `Grid` y `Cell`.

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

## RangeCalendar

El paquete también exporta **RangeCalendar**, una variante de selección de rango con semántica de inicio, fin y reinicio. Su contrato de valor es `{ start: DateValue; end?: DateValue }`: el primer clic establece `start`, el segundo establece `end` y un tercer clic reinicia el ciclo con un nuevo `start`. Reutiliza los elementos internos compartidos de cuadrícula, aritmética de fechas, foco, localización, RTL y fechas deshabilitadas de Calendar, e incluye `data-scope="range-calendar"`.

```tsx
import * as Calendar from "@solidiom/calendar"

;<Calendar.RangeRoot onValueChange={(range) => console.log(range)}>
  <Calendar.RangeHeader>
    <Calendar.RangePrevButton />
    <Calendar.RangeTitle />
    <Calendar.RangeNextButton />
  </Calendar.RangeHeader>
  <Calendar.RangeGrid>{/* renderiza las semanas de Calendar.RangeCell */}</Calendar.RangeGrid>
</Calendar.RangeRoot>
```

RangeCalendar expone 7 partes, que reflejan las de Calendar:

- **RangeRoot** — `data-part="root"`. Gestiona el estado de selección de rango, la navegación por meses y el foco.
- **RangeHeader** — `data-part="header"`.
- **RangePrevButton** — `data-part="prevbutton"`.
- **RangeTitle** — `data-part="title"`.
- **RangeNextButton** — `data-part="nextbutton"`.
- **RangeGrid** — `data-part="grid"`.
- **RangeCell** — `data-part="cell"`.

El hook `useRangeCalendarContext` y el tipo `RangeValue` se exportan para composición avanzada.

## Estilos

Calendar incluye los atributos `data-scope="calendar"` y `data-part` en cada parte para seleccionar estilos CSS o recetas. Los atributos de estado como `data-state`, `data-disabled` y `data-highlighted` se exponen cuando corresponde.

## Teclado y comportamiento

Este primitivo no tiene interacción de teclado. Renderiza contenido que no recibe el foco ni responde de forma independiente a eventos de teclado.

## Composición

Calendar está diseñado para componerse con otros primitivos. Sus partes pueden combinarse con Field, Button u otros primitivos según sea necesario.

## SSR e hidratación

Calendar se renderiza como HTML semántico durante el renderizado en servidor. El comportamiento interactivo, incluidos los manejadores de teclado y la gestión de estado, se activa durante la hidratación sin desplazamiento de diseño.
