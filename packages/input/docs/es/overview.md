---
contentSchemaVersion: 1
title: Input
description: Text input and textarea with validation states and Field integration.
keywords: [and, field, input, integration, runtime, states, text]
locale: es
maturity: ga
product: Input
productLayer: primitive
status: draft
package: "@solidiom/input"
primitive: input
section: overview
notApplicable:
  - section: composition
    reason: Input es un primitivo autónomo sin sub-primitivos compuestos.
  - section: relationships
    reason: Input no tiene primitivos hermanos; se usa dentro de otras composiciones pero no posee un contrato inter-primitivo.
  - section: migration
    reason: Sin API previa; esta es la primera versión publicada.
  - section: testing
    reason: La guía estándar de pruebas cubre este primitivo.
translationSourceHash: "a967980de1585fc5f47a190e9be11c27e1cf4f207383028668bb974721b80d6d"
translationStatus: "human-reviewed"
translationReviewedBy: "solidiom-team"
translationReviewedAt: "2026-08-18"
---

Text input and textarea with validation states and Field integration.

## Uso

Compón `Root`, `Textarea`.

```tsx
import * as Input from "@solidiom/input"

;<Input.Root>Contenido de Input</Input.Root>
```

## Instalación

Instala el paquete con `pnpm add @solidiom/input`. El paquete requiere dependencias pares compatibles de `solid-js` y `@solidjs/web`.

## Partes

Input expone 2 partes:

- **Root** — `data-part="root"`.
- **Textarea** — `data-part="textarea"`.

## Estilos

Input lleva los atributos `data-scope="input"` y `data-part` en cada parte para la selección CSS/receta. Los atributos de estado como `data-state`, `data-disabled` y `data-highlighted` se exponen donde corresponda.

## Interacción con teclado

Este primitivo no tiene interacción con teclado. Renderiza contenido que no recibe foco ni responde a eventos de teclado de forma independiente.

## Renderizado SSR e hidratación

Input se renderiza como HTML semántico durante el renderizado en servidor. El comportamiento interactivo (manejadores de teclado, gestión de estado) se activa en la hidratación sin desplazamiento de diseño.
