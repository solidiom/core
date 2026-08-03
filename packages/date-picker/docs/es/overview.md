---
contentSchemaVersion: 1
title: Date Picker
description: Calendar popup for selecting dates.
keywords: [calendar, date, date-math, dates, for, input, picker]
locale: es
maturity: draft
product: Date Picker
productLayer: primitive
status: draft
package: "@solidiom/date-picker"
primitive: date-picker
section: overview
translationSourceHash: "7ad483091a44552b6b106fed00f5226baaff9999c3373da7861aff4ed41366cf"
translationStatus: draft
notApplicable:
  - section: relationships
    reason: Date Picker no tiene primitivos hermanos; se usa dentro de otras composiciones pero no posee un contrato inter-primitivo.
  - section: migration
    reason: Sin API previa; esta es la primera versión publicada.
  - section: testing
    reason: La guía estándar de pruebas cubre este primitivo.
---

Calendar popup for selecting dates.

## Uso

Compón `Root`, `Input`, `Trigger`, `Content`, `Calendar`, `Header`, `Grid`, `Cell`.

```tsx
import * as DatePicker from "@solidiom/date-picker"

;<DatePicker.Root>Contenido de Date Picker</DatePicker.Root>
```

## Instalación

Instala el paquete con `pnpm add @solidiom/date-picker`. El paquete requiere dependencias pares compatibles de `solid-js` y `@solidjs/web`.

## Partes

Date Picker expone 8 partes:

- **Root** — `data-part="root"`.
- **Input** — `data-part="input"`.
- **Trigger** — `data-part="trigger"`.
- **Content** — `data-part="content"`.
- **Calendar** — `data-part="calendar"`.
- **Header** — `data-part="header"`.
- **Grid** — `data-part="grid"`.
- **Cell** — `data-part="cell"`.

## Estilos

Date Picker lleva los atributos `data-scope="date-picker"` y `data-part` en cada parte para la selección CSS/receta. Los atributos de estado como `data-state`, `data-disabled` y `data-highlighted` se exponen donde corresponda.

## Interacción con teclado

Este primitivo no tiene interacción con teclado. Renderiza contenido que no recibe foco ni responde a eventos de teclado de forma independiente.

## Composición

Date Picker está diseñado para componerse con otras primitivas. Sus partes pueden combinarse con Field, Button u otras primitivas según sea necesario.

## Renderizado SSR e hidratación

Date Picker se renderiza como HTML semántico durante el renderizado en servidor. El comportamiento interactivo (manejadores de teclado, gestión de estado) se activa en la hidratación sin desplazamiento de diseño.
