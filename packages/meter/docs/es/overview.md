---
contentSchemaVersion: 1
title: Meter
description: Scalar measurement within a known range (e.g. disk usage, signal strength).
keywords: [disk, feedback, known, measurement, meter, range, runtime]
locale: es
maturity: draft
product: Meter
productLayer: primitive
status: draft
package: "@solidiom/meter"
primitive: meter
section: overview
translationSourceHash: "31f6e0e5cde4afbcc07a0314605703d65ea4a976aff5a47f3e4202fc0a54e531"
translationStatus: draft
notApplicable:
  - section: composition
    reason: Meter es un primitivo autónomo sin sub-primitivos compuestos.
  - section: relationships
    reason: Meter no tiene primitivos hermanos; se usa dentro de otras composiciones pero no posee un contrato inter-primitivo.
  - section: migration
    reason: Sin API previa; esta es la primera versión publicada.
  - section: testing
    reason: La guía estándar de pruebas cubre este primitivo.
---

Scalar measurement within a known range (e.g. disk usage, signal strength).

## Uso

Importa y renderiza `Root`.

```tsx
import * as Meter from "@solidiom/meter"

;<Meter.Root>Contenido de Meter</Meter.Root>
```

## Instalación

Instala el paquete con `pnpm add @solidiom/meter`. El paquete requiere dependencias pares compatibles de `solid-js` y `@solidjs/web`.

## Partes

Meter expone 1 parte:

- **Root** — `data-part="root"`.

## Estilos

Meter lleva los atributos `data-scope="meter"` y `data-part` en cada parte para la selección CSS/receta. Los atributos de estado como `data-state`, `data-disabled` y `data-highlighted` se exponen donde corresponda.

## Interacción con teclado

Este primitivo no tiene interacción con teclado. Renderiza contenido que no recibe foco ni responde a eventos de teclado de forma independiente.

## Renderizado SSR e hidratación

Meter se renderiza como HTML semántico durante el renderizado en servidor. El comportamiento interactivo (manejadores de teclado, gestión de estado) se activa en la hidratación sin desplazamiento de diseño.
