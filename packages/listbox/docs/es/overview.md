---
contentSchemaVersion: 1
title: Listbox
description: Single or multi-select list of options.
keywords: [input, list, listbox, multi, options, runtime, select]
locale: es
maturity: ga
product: Listbox
productLayer: primitive
status: draft
package: "@solidiom/listbox"
primitive: listbox
section: overview
translationSourceHash: "d7ddf8dd81bbf90965deb3758e6c66005559e6bf4c62a36d285334aebe95a8ac"
translationStatus: human-reviewed
translationReviewedBy: "G5-gate"
translationReviewedAt: "2026-08-07"
notApplicable:
  - section: composition
    reason: Listbox es un primitivo autónomo sin sub-primitivos compuestos.
  - section: relationships
    reason: Listbox no tiene primitivos hermanos; se usa dentro de otras composiciones pero no posee un contrato inter-primitivo.
  - section: migration
    reason: Sin API previa; esta es la primera versión publicada.
  - section: testing
    reason: La guía estándar de pruebas cubre este primitivo.
---

Single or multi-select list of options.

## Uso

Compón `Root`, `Item`.

```tsx
import * as Listbox from "@solidiom/listbox"

;<Listbox.Root>Contenido de Listbox</Listbox.Root>
```

## Instalación

Instala el paquete con `pnpm add @solidiom/listbox`. El paquete requiere dependencias pares compatibles de `solid-js` y `@solidjs/web`.

## Partes

Listbox expone 2 partes:

- **Root** — `data-part="root"`.
- **Item** — `data-part="item"`.

## Estilos

Listbox lleva los atributos `data-scope="listbox"` y `data-part` en cada parte para la selección CSS/receta. Los atributos de estado como `data-state`, `data-disabled` y `data-highlighted` se exponen donde corresponda.

## Interacción con teclado

Este primitivo no tiene interacción con teclado. Renderiza contenido que no recibe foco ni responde a eventos de teclado de forma independiente.

## Renderizado SSR e hidratación

Listbox se renderiza como HTML semántico durante el renderizado en servidor. El comportamiento interactivo (manejadores de teclado, gestión de estado) se activa en la hidratación sin desplazamiento de diseño.
