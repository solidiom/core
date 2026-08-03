---
contentSchemaVersion: 1
title: Visually Hidden
description: Oculta contenido visualmente manteniéndolo accesible para lectores de pantalla.
keywords: [visually-hidden, lector-de-pantalla, accesibilidad, etiqueta, encabezado, tecnologia-asistiva]
locale: es
maturity: draft
product: Visually Hidden
productLayer: primitive
status: draft
package: "@solidiom/visually-hidden"
primitive: visually-hidden
section: overview
translationSourceHash: "dd09d5a4b2f71a9051eb93b8ed7e5c9bde1e7b7143ec0d5c04a6f4b1c536160a"
translationStatus: draft
---

Visually Hidden oculta contenido visualmente manteniéndolo accesible para lectores de pantalla. Utiliza la técnica estándar de clip/overflow para eliminar contenido del diseño visual sin retirarlo del árbol de accesibilidad.

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

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `children` | `JSX.Element` | — | Contenido a ocultar visualmente. |
| `class` | `string` | — | Clase CSS adicional para sobrescribir estilos. |

## Estilos

Visually Hidden lleva los atributos `data-scope="visually-hidden"` y `data-part="root"`. Se renderiza como un elemento `<span>` con estilos en línea para la técnica de recorte. Los estilos usan `position: absolute`, `clip: rect(0, 0, 0, 0)`, `white-space: nowrap`, `width: 1px`, `height: 1px` y `overflow: hidden` para asegurar que el contenido sea completamente invisible mientras permanece en el flujo del documento para las tecnologías de asistencia.

## Renderizado SSR e hidratación

Visually Hidden es un elemento de presentación pasivo sin estado interactivo. Se renderiza como HTML estático y no requiere hidratación en el cliente.