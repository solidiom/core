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
notApplicable:
  - section: relationships
    reason: Calendar no tiene primitivos hermanos; se usa dentro de otras composiciones pero no posee un contrato inter-primitivo.
  - section: migration
    reason: Sin API previa; esta es la primera versión publicada.
  - section: testing
    reason: La guía estándar de pruebas cubre este primitivo.
translationSourceHash: "b5e2becdece40080b72fbd07ed88eec704e63c7ad377f864fee5b807166370ec"
translationStatus: "stale"
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

## RangeCalendar

El paquete también exporta **RangeCalendar** — una variante de selección de rango con semántica de inicio/fin/reinicio. Su contrato de valor es `{ start: DateValue; end?: DateValue }`: el primer clic fija `start`, el segundo fija `end`, y un tercer clic reinicia el ciclo con un nuevo `start`. Reutiliza la cuadrícula compartida, la aritmética de fechas, el foco, la localización, el RTL y las fechas deshabilitadas de Calendar, y lleva `data-scope="range-calendar"`.

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

RangeCalendar expone 7 partes, reflejando las de Calendar:

- **RangeRoot** — `data-part="root"`. Gestiona el estado de selección de rango, la navegación por meses y el foco.
- **RangeHeader** — `data-part="header"`.
- **RangePrevButton** — `data-part="prevbutton"`.
- **RangeTitle** — `data-part="title"`.
- **RangeNextButton** — `data-part="nextbutton"`.
- **RangeGrid** — `data-part="grid"`.
- **RangeCell** — `data-part="cell"`.

El hook `useRangeCalendarContext` y el tipo `RangeValue` se exportan para composición avanzada.

## Estilos

Calendar lleva los atributos `data-scope="calendar"` y `data-part` en cada parte para la selección CSS/receta. Los atributos de estado como `data-state`, `data-disabled` y `data-highlighted` se exponen donde corresponda.

## Interacción con teclado

Este primitivo no tiene interacción con teclado. Renderiza contenido que no recibe foco ni responde a eventos de teclado de forma independiente.

## Composición

Calendar está diseñado para componerse con otras primitivas. Sus partes pueden combinarse con Field, Button u otras primitivas según sea necesario.

## Renderizado SSR e hidratación

Calendar se renderiza como HTML semántico durante el renderizado en servidor. El comportamiento interactivo (manejadores de teclado, gestión de estado) se activa en la hidratación sin desplazamiento de diseño.
