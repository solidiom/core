---
contentSchemaVersion: 1
title: Toggle
description: A two-state button that can be toggled on or off.
keywords: [button, can, input, off, runtime, state, that]
locale: es
maturity: ga
product: Toggle
productLayer: primitive
status: draft
package: "@solidiom/toggle"
primitive: toggle
section: overview
translationSourceHash: "4b9decb6b9740616a87d9870c42da5f2e49b6c9e34e421aba6878242699b4f4d"
translationStatus: human-reviewed
translationReviewedBy: "G5-gate"
translationReviewedAt: "2026-08-07"
notApplicable:
  - section: composition
    reason: Toggle es un primitivo autónomo sin sub-primitivos compuestos.
  - section: relationships
    reason: Toggle no tiene primitivos hermanos; se usa dentro de otras composiciones pero no posee un contrato inter-primitivo.
  - section: migration
    reason: Sin API previa; esta es la primera versión publicada.
  - section: testing
    reason: La guía estándar de pruebas cubre este primitivo.
---

A two-state button that can be toggled on or off.

## Uso

Importa y renderiza `Root`.

```tsx
import * as Toggle from "@solidiom/toggle"

;<Toggle.Root>Contenido de Toggle</Toggle.Root>
```

## Instalación

Instala el paquete con `pnpm add @solidiom/toggle`. El paquete requiere dependencias pares compatibles de `solid-js` y `@solidjs/web`.

## Partes

Toggle expone 1 parte:

- **Root** — `data-part="root"`.

## Estilos

Toggle lleva los atributos `data-scope="toggle"` y `data-part` en cada parte para la selección CSS/receta. Los atributos de estado como `data-state`, `data-disabled` y `data-highlighted` se exponen donde corresponda.

## Interacción con teclado

Este primitivo no tiene interacción con teclado. Renderiza contenido que no recibe foco ni responde a eventos de teclado de forma independiente.

## Renderizado SSR e hidratación

Toggle se renderiza como HTML semántico durante el renderizado en servidor. El comportamiento interactivo (manejadores de teclado, gestión de estado) se activa en la hidratación sin desplazamiento de diseño.
