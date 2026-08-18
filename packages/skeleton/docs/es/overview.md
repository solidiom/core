---
contentSchemaVersion: 1
title: Skeleton
description: Loading placeholder with pulse animation.
keywords: [animation, feedback, loading, placeholder, pulse, runtime, skeleton]
locale: es
maturity: ga
product: Skeleton
productLayer: primitive
status: draft
package: "@solidiom/skeleton"
primitive: skeleton
section: overview
notApplicable:
  - section: composition
    reason: Skeleton es un primitivo autónomo sin sub-primitivos compuestos.
  - section: relationships
    reason: Skeleton no tiene primitivos hermanos; se usa dentro de otras composiciones pero no posee un contrato inter-primitivo.
  - section: migration
    reason: Sin API previa; esta es la primera versión publicada.
  - section: testing
    reason: La guía estándar de pruebas cubre este primitivo.
translationSourceHash: "886b7877358bf36dd89e9c624975110ffb9a0e29b8000ed5251aa812efeaaf72"
translationStatus: "human-reviewed"
translationReviewedBy: "solidiom-team"
translationReviewedAt: "2026-08-18"
---

Loading placeholder with pulse animation.

## Uso

Importa y renderiza `Root`.

```tsx
import * as Skeleton from "@solidiom/skeleton"

;<Skeleton.Root>Contenido de Skeleton</Skeleton.Root>
```

## Instalación

Instala el paquete con `pnpm add @solidiom/skeleton`. El paquete requiere dependencias pares compatibles de `solid-js` y `@solidjs/web`.

## Partes

Skeleton expone 1 parte:

- **Root** — `data-part="root"`.

## Estilos

Skeleton lleva los atributos `data-scope="skeleton"` y `data-part` en cada parte para la selección CSS/receta. Los atributos de estado como `data-state`, `data-disabled` y `data-highlighted` se exponen donde corresponda.

## Interacción con teclado

Este primitivo no tiene interacción con teclado. Renderiza contenido que no recibe foco ni responde a eventos de teclado de forma independiente.

## Renderizado SSR e hidratación

Skeleton se renderiza como HTML semántico durante el renderizado en servidor. El comportamiento interactivo (manejadores de teclado, gestión de estado) se activa en la hidratación sin desplazamiento de diseño.
