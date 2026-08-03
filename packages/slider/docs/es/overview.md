---
contentSchemaVersion: 1
title: Slider
description: Numeric range input with thumb control.
keywords: [control, input, numeric, range, runtime, slider, thumb]
locale: es
maturity: draft
product: Slider
productLayer: primitive
status: draft
package: "@solidiom/slider"
primitive: slider
section: overview
translationSourceHash: "540bbf7d7d77c653851813b5fdb5a8841631f2422d8ae1131820f5cfa0a9cca2"
translationStatus: draft
notApplicable:
  - section: relationships
    reason: Slider no tiene primitivos hermanos; se usa dentro de otras composiciones pero no posee un contrato inter-primitivo.
  - section: migration
    reason: Sin API previa; esta es la primera versión publicada.
  - section: testing
    reason: La guía estándar de pruebas cubre este primitivo.
---

Numeric range input with thumb control.

## Uso

Compón `Root`, `Track`, `Range`, `Thumb`.

```tsx
import * as Slider from "@solidiom/slider"

;<Slider.Root>Contenido de Slider</Slider.Root>
```

## Instalación

Instala el paquete con `pnpm add @solidiom/slider`. El paquete requiere dependencias pares compatibles de `solid-js` y `@solidjs/web`.

## Partes

Slider expone 4 partes:

- **Root** — `data-part="root"`.
- **Track** — `data-part="track"`.
- **Range** — `data-part="range"`.
- **Thumb** — `data-part="thumb"`.

## Estilos

Slider lleva los atributos `data-scope="slider"` y `data-part` en cada parte para la selección CSS/receta. Los atributos de estado como `data-state`, `data-disabled` y `data-highlighted` se exponen donde corresponda.

## Interacción con teclado

Este primitivo no tiene interacción con teclado. Renderiza contenido que no recibe enfoque ni responde a eventos de teclado de forma independiente.

## Composición

Slider está diseñado para componerse con otras primitivas. Sus partes pueden combinarse con Field, Button u otras primitivas según sea necesario.

## Renderizado SSR e hidratación

Slider se renderiza como HTML semántico durante el renderizado en servidor. El comportamiento interactivo (manejadores de teclado, gestión de estado) se activa en la hidratación sin desplazamiento de diseño.
