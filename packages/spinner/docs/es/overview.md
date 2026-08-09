---
contentSchemaVersion: 1
title: Spinner
description: Loading spinner indicator.
keywords: [feedback, indicator, loading, runtime, spinner]
locale: es
maturity: ga
product: Spinner
productLayer: primitive
status: draft
package: "@solidiom/spinner"
primitive: spinner
section: overview
translationSourceHash: "fd27b43ecda287a6376a4d27a61647968c748246fa67b8ea3eaa413dc66c92cd"
translationStatus: human-reviewed
translationReviewedBy: "G5-gate"
translationReviewedAt: "2026-08-07"
notApplicable:
  - section: composition
    reason: Spinner es un primitivo autónomo sin sub-primitivos compuestos.
  - section: relationships
    reason: Spinner no tiene primitivos hermanos; se usa dentro de otras composiciones pero no posee un contrato inter-primitivo.
  - section: migration
    reason: Sin API previa; esta es la primera versión publicada.
  - section: testing
    reason: La guía estándar de pruebas cubre este primitivo.
---

Loading spinner indicator.

## Uso

Importa y renderiza `Root`.

```tsx
import * as Spinner from "@solidiom/spinner"

;<Spinner.Root>Contenido de Spinner</Spinner.Root>
```

## Instalación

Instala el paquete con `pnpm add @solidiom/spinner`. El paquete requiere dependencias pares compatibles de `solid-js` y `@solidjs/web`.

## Partes

Spinner expone 1 parte:

- **Root** — `data-part="root"`.

## Estilos

Spinner lleva los atributos `data-scope="spinner"` y `data-part` en cada parte para la selección CSS/receta. Los atributos de estado como `data-state`, `data-disabled` y `data-highlighted` se exponen donde corresponda.

## Interacción con teclado

Este primitivo no tiene interacción con teclado. Renderiza contenido que no recibe foco ni responde a eventos de teclado de forma independiente.

## Renderizado SSR e hidratación

Spinner se renderiza como HTML semántico durante el renderizado en servidor. El comportamiento interactivo (manejadores de teclado, gestión de estado) se activa en la hidratación sin desplazamiento de diseño.
