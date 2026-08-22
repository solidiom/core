---
contentSchemaVersion: 1
title: Lightbox
description: Visor superpuesto de imágenes y medios con controles de navegación.
keywords: [lightbox, overlay, image, media, viewer, navigation, gallery]
locale: es
maturity: ga
product: Lightbox
productLayer: primitive
status: draft
package: "@solidiom/lightbox"
primitive: lightbox
section: overview
notApplicable:
  - section: migration
    reason: No existe una API anterior; esta es la primera versión publicada.
  - section: testing
    reason: La guía de pruebas estándar cubre este primitivo.
translationSourceHash: "4542410e933e15f1b216972fd59eba206d1d635ba35c5b6b69d975cd93aa2e4d"
translationStatus: "draft"
---

Lightbox es un visor superpuesto de imágenes y medios con controles de navegación. Admite navegación y cierre mediante el teclado.

## Uso

Compón `Root`, `Backdrop`, `Content`, `Image`, `CloseButton`, `NextButton`, `PrevButton` y `Counter`.

```tsx
import * as Lightbox from "@solidiom/lightbox"

function MediaViewer() {
  return (
    <Lightbox.Root>
      <Lightbox.Backdrop />
      <Lightbox.Content>
        <Lightbox.CloseButton>Cerrar</Lightbox.CloseButton>
        <Lightbox.PrevButton>Anterior</Lightbox.PrevButton>
        <Lightbox.Image src="/photos/1.jpg" alt="Foto 1" />
        <Lightbox.NextButton>Siguiente</Lightbox.NextButton>
        <Lightbox.Counter>1 / 12</Lightbox.Counter>
      </Lightbox.Content>
    </Lightbox.Root>
  )
}
```

## Instalación

Instala el paquete con `pnpm add @solidiom/lightbox`. El paquete requiere dependencias pares compatibles de `solid-js` y `@solidjs/web`.

## Partes

lightbox expone 8 partes:

- **Root** — `data-part="root"`. Contenedor del visor superpuesto.
- **Backdrop** — `data-part="backdrop"`. Fondo detrás del contenido del visor.
- **Content** — `data-part="content"`. Contiene los medios y controles.
- **Image** — `data-part="image"`. Muestra la imagen o medio actual.
- **CloseButton** — `data-part="closebutton"`. Cierra el lightbox.
- **NextButton** — `data-part="nextbutton"`. Avanza al elemento siguiente.
- **PrevButton** — `data-part="prevbutton"`. Vuelve al elemento anterior.
- **Counter** — `data-part="counter"`. Muestra la posición actual dentro del conjunto.

## Estilos

lightbox incluye los atributos `data-scope="lightbox"` y `data-part` en cada parte para seleccionar estilos CSS o recetas.

## Teclado y comportamiento

| Tecla      | Comportamiento            |
| ---------- | ------------------------- |
| Escape     | Cierra el lightbox.       |
| ArrowRight | Va al elemento siguiente. |
| ArrowLeft  | Va al elemento anterior.  |

## Composición

Lightbox se compone con galerías y cuadrículas de medios, abriéndose sobre el contenido de la página para presentar un visor enfocado.

## SSR e hidratación

Lightbox renderiza sus marcas en el servidor y activa los manejadores de navegación y cierre durante la hidratación.
