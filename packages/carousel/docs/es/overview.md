---
contentSchemaVersion: 1
title: Carousel
description: Horizontal slide-based content viewer.
keywords: [based, carousel, carousel-physics, content, horizontal, layout, runtime]
locale: es
maturity: ga
product: Carousel
productLayer: primitive
status: draft
package: "@solidiom/carousel"
primitive: carousel
section: overview
notApplicable:
  - section: relationships
    reason: Carousel no tiene primitivos hermanos; se usa dentro de otras composiciones pero no posee un contrato inter-primitivo.
  - section: migration
    reason: Sin API previa; esta es la primera versión publicada.
  - section: testing
    reason: La guía estándar de pruebas cubre este primitivo.
translationSourceHash: "96a23553a6959a2e1b237fde6389808f16e436e48f9ac64023de3014951b0bdd"
translationStatus: draft
---

Horizontal slide-based content viewer.

## Uso

Compón `Root`, `Viewport`, `Slide`, `PrevButton`, `NextButton`.

```tsx
import * as Carousel from "@solidiom/carousel"

;<Carousel.Root>Contenido de Carousel</Carousel.Root>
```

## Instalación

Instala el paquete con `pnpm add @solidiom/carousel`. El paquete requiere dependencias pares compatibles de `solid-js` y `@solidjs/web`.

## Partes

Carousel expone 5 partes:

- **Root** — `data-part="root"`.
- **Viewport** — `data-part="viewport"`.
- **Slide** — `data-part="slide"`.
- **PrevButton** — `data-part="prevbutton"`.
- **NextButton** — `data-part="nextbutton"`.

## Estilos

Carousel lleva los atributos `data-scope="carousel"` y `data-part` en cada parte para la selección CSS/receta. Los atributos de estado como `data-state`, `data-disabled` y `data-highlighted` se exponen donde corresponda.

## Interacción con teclado

Este primitivo no tiene interacción con teclado. Renderiza contenido que no recibe foco ni responde a eventos de teclado de forma independiente.

## Composición

Carousel está diseñado para componerse con otras primitivas. Sus partes pueden combinarse con Field, Button u otras primitivas según sea necesario.

## Renderizado SSR e hidratación

Carousel se renderiza como HTML semántico durante el renderizado en servidor. El comportamiento interactivo (manejadores de teclado, gestión de estado) se activa en la hidratación sin desplazamiento de diseño.
