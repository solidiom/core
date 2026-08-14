---
contentSchemaVersion: 1
title: Field
description: "Composition wrapper: label + control + description + error with automatic ARIA wiring."
keywords: [aria, automatic, composition, control, description, error, field]
locale: es
maturity: ga
product: Field
productLayer: primitive
status: draft
package: "@solidiom/field"
primitive: field
section: overview
notApplicable:
  - section: relationships
    reason: Field no tiene primitivos hermanos; se usa dentro de otras composiciones pero no posee un contrato inter-primitivo.
  - section: migration
    reason: Sin API previa; esta es la primera versión publicada.
  - section: testing
    reason: La guía estándar de pruebas cubre este primitivo.
translationSourceHash: "ffa65cb74ddfd71eac6a6a2bf023be8280ffce1900ac2455fe844b73a4646c64"
translationStatus: draft
---

Composition wrapper: label + control + description + error with automatic ARIA wiring.

## Uso

Compón `Root`, `Label`, `Control`, `Description`, `Error`.

```tsx
import * as Field from "@solidiom/field"

;<Field.Root>Contenido de Field</Field.Root>
```

## Instalación

Instala el paquete con `pnpm add @solidiom/field`. El paquete requiere dependencias pares compatibles de `solid-js` y `@solidjs/web`.

## Partes

Field expone 5 partes:

- **Root** — `data-part="root"`.
- **Label** — `data-part="label"`.
- **Control** — `data-part="control"`.
- **Description** — `data-part="description"`.
- **Error** — `data-part="error"`.

## Estilos

Field lleva los atributos `data-scope="field"` y `data-part` en cada parte para la selección CSS/receta. Los atributos de estado como `data-state`, `data-disabled` y `data-highlighted` se exponen donde corresponda.

## Interacción con teclado

Este primitivo no tiene interacción con teclado. Renderiza contenido que no recibe foco ni responde a eventos de teclado de forma independiente.

## Composición

Field está diseñado para componerse con otras primitivas. Sus partes pueden combinarse con Field, Button u otras primitivas según sea necesario.

## Renderizado SSR e hidratación

Field se renderiza como HTML semántico durante el renderizado en servidor. El comportamiento interactivo (manejadores de teclado, gestión de estado) se activa en la hidratación sin desplazamiento de diseño.
