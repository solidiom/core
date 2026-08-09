---
contentSchemaVersion: 1
title: Visually Hidden
description: Oculta contenido visualmente manteniéndolo accesible para lectores de pantalla.
keywords:
  [visually-hidden, lector-de-pantalla, accesibilidad, etiqueta, encabezado, tecnologia-asistiva]
locale: es
maturity: ga
product: Visually Hidden
productLayer: primitive
status: draft
package: "@solidiom/visually-hidden"
primitive: visually-hidden
section: overview
translationSourceHash: "c59df02bee085e7c42125494eba9e293b18ae52a0c4116e5ec5d3f3d94683195"
translationStatus: human-reviewed
translationReviewedBy: "G5-gate"
translationReviewedAt: "2026-08-07"
notApplicable:
  - section: composition
    reason: Primitivo autónomo sin sub-primitivos compuestos.
  - section: relationships
    reason: Sin primitivos hermanos; se usa dentro de otras composiciones pero no posee un contrato inter-primitivo.
  - section: migration
    reason: Sin API previa; esta es la primera versión publicada.
  - section: testing
    reason: La guía estándar de pruebas cubre este primitivo. No existe comportamiento no obvio específico.
---

Visually Hidden oculta contenido visualmente manteniéndolo accesible para lector de pantalla. Utiliza la técnica estándar de clip/overflow para eliminar contenido del diseño visual sin retirarlo del árbol de accesibilidad.

## Uso

Visually Hidden tiene una sola parte `Root`. Envuelve cualquier contenido que deba ocultarse visualmente pero permanecer disponible para las tecnologías de asistencia.

```tsx
import * as VisuallyHidden from "@solidiom/visually-hidden"

;<VisuallyHidden.Root>
  <label>Búsqueda</label>
</VisuallyHidden.Root>
```

## Instalación

Instala el paquete con `pnpm add @solidiom/visually-hidden`. El paquete requiere dependencias pares compatibles de `solid-js` y `@solidjs/web`.

## Props

| Prop       | Tipo          | Default | Descripción                                    |
| ---------- | ------------- | ------- | ---------------------------------------------- |
| `children` | `JSX.Element` | —       | Contenido a ocultar visualmente.               |
| `class`    | `string`      | —       | Clase CSS adicional para sobrescribir estilos. |

## Estilos

Visually Hidden lleva los atributos `data-scope="visually-hidden"` y `data-part="root"`. Se renderiza como un elemento `<span>` con estilos en línea para la técnica de recorte. Los estilos usan `position: absolute`, `clip: rect(0, 0, 0, 0)`, `white-space: nowrap`, `width: 1px`, `height: 1px` y `overflow: hidden` para asegurar que el contenido sea completamente invisible mientras permanece en el flujo del documento para las tecnologías de asistencia.

## Interacción con teclado

Este primitivo no tiene interacción con teclado. Renderiza contenido estático que no recibe foco ni responde a eventos de teclado.

## Renderizado SSR e hidratación

Visually Hidden es un elemento de presentación pasivo sin estado interactivo. Se renderiza como HTML estático y no requiere hidratación en el cliente.
