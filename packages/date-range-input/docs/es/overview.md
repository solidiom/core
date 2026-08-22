---
contentSchemaVersion: 1
title: Date Range Input
description: Selección de un intervalo de fechas con campos de texto inicial y final y selector de calendario.
keywords: [date range, date input, calendar, picker, start, end, validation]
locale: es
maturity: ga
product: Date Range Input
productLayer: primitive
status: draft
package: "@solidiom/date-range-input"
primitive: date-range-input
section: overview
notApplicable:
  - section: migration
    reason: No existe una API anterior; esta es la primera versión publicada.
  - section: testing
    reason: La guía de pruebas estándar cubre este primitivo.
translationSourceHash: "a2abd591b3df8cb2ac6c034644b99f2ed1da76cb2ea8cea51c7d3d71833513a4"
translationStatus: "draft"
---

Date Range Input permite seleccionar un intervalo de fechas mediante campos de texto inicial y final combinados con un selector de calendario. Incluye atributos data semánticos para puntos de estilo, integra el estado de validación y participa en formularios nativos.

## Uso

Compón `Root`, `StartInput`, `EndInput`, `Separator` y `Trigger`. `Trigger` abre el selector, y el primitivo está diseñado para componerse con un primitivo de popover de calendario.

```tsx
import * as DateRangeInput from "@solidiom/date-range-input"

;<DateRangeInput.Root>
  <DateRangeInput.StartInput />
  <DateRangeInput.Separator>–</DateRangeInput.Separator>
  <DateRangeInput.EndInput />
  <DateRangeInput.Trigger>Abrir calendario</DateRangeInput.Trigger>
</DateRangeInput.Root>
```

## Instalación

Instala el paquete con `pnpm add @solidiom/date-range-input`. El paquete requiere dependencias pares compatibles de `solid-js` y `@solidjs/web`.

## Partes

date-range-input expone 5 partes:

- **Root** — contenedor que gestiona el estado del intervalo, la validación y la participación en formularios nativos.
- **StartInput** — campo de texto para el inicio del intervalo.
- **EndInput** — campo de texto para el final del intervalo.
- **Separator** — divisor visual entre los campos inicial y final.
- **Trigger** — control que abre el selector de calendario.

## Estilos

date-range-input incluye los atributos `data-scope="date-range-input"` y `data-part` en cada parte para seleccionar estilos CSS o recetas. El estado de validación se expone mediante atributos data semánticos.

## Teclado y comportamiento

Este primitivo activa el selector mediante Trigger y participa en formularios nativos; la interacción adicional de apertura del selector se delega al popover de calendario compuesto. El manejo de teclado dentro del selector lo proporciona ese primitivo.

## Composición

Está diseñado para componerse con un primitivo de popover de calendario; Trigger abre el selector, mientras StartInput y EndInput aceptan entradas escritas.

## SSR e hidratación

Los campos se renderizan como HTML estático en el servidor y participan en el envío de formularios nativos. Los manejadores interactivos, incluido Trigger, se activan durante la hidratación.
