---
contentSchemaVersion: 1
title: Status Dot
description: Punto pequeño de color que indica presencia o estado.
keywords: [status dot, presence, indicator, status, dot, feedback]
locale: es
maturity: ga
product: Status Dot
productLayer: primitive
status: draft
package: "@solidiom/status-dot"
primitive: status-dot
section: overview
notApplicable:
  - section: migration
    reason: No existe una API anterior; esta es la primera versión publicada.
  - section: testing
    reason: La guía de pruebas estándar cubre este primitivo.
translationSourceHash: "c9aa65f554ddcd73f5d79571fe409db51fe01e42569622c673970998fc621ac4"
translationStatus: "draft"
---

Status Dot es un pequeño punto de color que indica presencia o estado. Es un indicador pasivo de presencia.

## Uso

Status Dot tiene una única parte `Root`. Renderízala en línea para indicar presencia o estado.

```tsx
import * as StatusDot from "@solidiom/status-dot"

;<StatusDot.Root />
```

## Instalación

Instala el paquete con `pnpm add @solidiom/status-dot`. El paquete requiere dependencias pares compatibles de `solid-js` y `@solidjs/web`.

## Partes

status-dot tiene una única parte `Root`. Es un punto indicador de presencia.

## Estilos

status-dot incluye `data-scope="status-dot"` y un atributo `data-part="root"` para seleccionar estilos CSS o recetas.

## Teclado y comportamiento

Este primitivo no tiene interacción de teclado propia.

## Composición

Colócalo junto a avatares, elementos de lista o etiquetas para comunicar presencia o estado.

## SSR e hidratación

Status Dot renderiza HTML estático y no requiere hidratación.
