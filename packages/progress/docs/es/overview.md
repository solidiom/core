---
contentSchemaVersion: 1
title: Progress
description: Determinate and indeterminate progress indicator.
keywords: [and, determinate, feedback, indeterminate, indicator, progress, runtime]
locale: es
maturity: ga
product: Progress
productLayer: primitive
status: draft
package: "@solidiom/progress"
primitive: progress
section: overview
notApplicable:
  - section: composition
    reason: Progress es un primitivo autónomo sin sub-primitivos compuestos.
  - section: relationships
    reason: Progress no tiene primitivos hermanos; se usa dentro de otras composiciones pero no posee un contrato inter-primitivo.
  - section: migration
    reason: Sin API previa; esta es la primera versión publicada.
  - section: testing
    reason: La guía estándar de pruebas cubre este primitivo.
translationSourceHash: "66583a260b76827ab93e1febfc7bd14fcaebc5e07d2e34b6c694eb83d67b9f99"
translationStatus: "human-reviewed"
translationReviewedBy: "solidiom-team"
translationReviewedAt: "2026-08-18"
---

Determinate and indeterminate progress indicator.

## Uso

Compón `Root`, `Indicator`.

```tsx
import * as Progress from "@solidiom/progress"

;<Progress.Root>Contenido de Progress</Progress.Root>
```

## Instalación

Instala el paquete con `pnpm add @solidiom/progress`. El paquete requiere dependencias pares compatibles de `solid-js` y `@solidjs/web`.

## Partes

Progress expone 2 partes:

- **Root** — `data-part="root"`.
- **Indicator** — `data-part="indicator"`.

## Estilos

Progress lleva los atributos `data-scope="progress"` y `data-part` en cada parte para la selección CSS/receta. Los atributos de estado como `data-state`, `data-disabled` y `data-highlighted` se exponen donde corresponda.

## Interacción con teclado

Este primitivo no tiene interacción con teclado. Renderiza contenido que no recibe foco ni responde a eventos de teclado de forma independiente.

## Renderizado SSR e hidratación

Progress se renderiza como HTML semántico durante el renderizado en servidor. El comportamiento interactivo (manejadores de teclado, gestión de estado) se activa en la hidratación sin desplazamiento de diseño.
