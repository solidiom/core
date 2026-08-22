---
contentSchemaVersion: 1
title: Time Input
description: Entrada de hora segmentada con campos de hora, minuto, segundo y alternancia AM/PM.
keywords: [time input, segmented, hour, minute, second, spinbutton, am pm]
locale: es
maturity: ga
product: Time Input
productLayer: primitive
status: draft
package: "@solidiom/time-input"
primitive: time-input
section: overview
notApplicable:
  - section: migration
    reason: No existe una API anterior; esta es la primera versión publicada.
  - section: testing
    reason: La guía de pruebas estándar cubre este primitivo.
translationSourceHash: "005512453e9c144c236e2f32a53c4d5bc347d0ce4717f731ae1258f8183553ae"
translationStatus: "draft"
---

Time Input es una entrada de hora segmentada y accesible con campos para hora, minuto y segundo y una alternancia AM/PM. Proporciona semántica spinbutton, navegación con teclado, avance automático y participación en formularios nativos.

## Uso

Compón `Root`, `Segment` y `Separator`. Repite `Segment` para hora, minuto, segundo y periodo, con `Separator` entre segmentos.

```tsx
import * as TimeInput from "@solidiom/time-input"

;<TimeInput.Root>
  <TimeInput.Segment />
  <TimeInput.Separator>:</TimeInput.Separator>
  <TimeInput.Segment />
  <TimeInput.Separator>:</TimeInput.Separator>
  <TimeInput.Segment />
  <TimeInput.Segment />
</TimeInput.Root>
```

## Instalación

Instala el paquete con `pnpm add @solidiom/time-input`. El paquete requiere dependencias pares compatibles de `solid-js` y `@solidjs/web`.

## Partes

time-input expone 3 partes:

- **Root** — contenedor que gestiona el estado de los segmentos y la participación en formularios nativos.
- **Segment** — un segmento de hora individual, repetido para hora/minuto/segundo/periodo.
- **Separator** — divisor que se renderiza entre segmentos.

## Estilos

time-input incluye los atributos `data-scope="time-input"` y `data-part` en cada parte para seleccionar estilos CSS o recetas.

## Teclado y comportamiento

time-input proporciona semántica spinbutton por segmento con avance automático.

| Tecla     | Comportamiento                                       |
| --------- | ---------------------------------------------------- |
| ArrowUp   | Ajusta hacia arriba el segmento enfocado             |
| ArrowDown | Ajusta hacia abajo el segmento enfocado              |
| Left      | Va al segmento anterior                              |
| Right     | Va al segmento siguiente                             |
| Dígitos   | Escribe valores en el segmento con avance automático |

## Composición

Compón con primitivos de etiqueta y campo para crear un control de hora etiquetado y validado; Root gestiona la participación en formularios nativos.

## SSR e hidratación

Los segmentos se renderizan como HTML estático en el servidor y participan en formularios nativos; el manejo de teclado spinbutton y el avance automático se activan durante la hidratación.
