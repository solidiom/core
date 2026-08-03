---
contentSchemaVersion: 1
title: Badge
description: Indicador de estado o etiqueta en línea con marcado semántico.
keywords: [badge, etiqueta, estado, indicador, inline]
locale: es
maturity: draft
product: Badge
productLayer: primitive
status: draft
package: "@solidiom/badge"
primitive: badge
section: overview
translationSourceHash: "2c02fea2d679e012ca5e2aba72a03162b50d8642e59bae6cd6e959f3455a6ce4"
translationStatus: draft
---

Badge renderiza una etiqueta o indicador de estado pequeño en línea con semántica accesible. Proporciona un primitivo headless que携带 atributos de datos semánticos para la integración de estilos con tu sistema de diseño.

## Uso

Badge tiene una sola parte `Root`. Pasa el contenido como children.

```tsx
import * as Badge from "@solidiom/badge"

;<Badge.Root>Nuevo</Badge.Root>
```

## Instalación

Instala el paquete con `pnpm add @solidiom/badge`. El paquete requiere dependencias pares compatibles de `solid-js` y `@solidjs/web`.

## Props

| Prop       | Tipo          | Default | Descripción                              |
| ---------- | ------------- | ------- | ---------------------------------------- |
| `children` | `JSX.Element` | —       | Contenido para mostrar dentro del badge. |
| `class`    | `string`      | —       | Clase CSS adicional para estilos.        |

## Estilos

Badge lleva los atributos `data-scope="badge"` y `data-part="root"`. Estílalo con colores de fondo, colores de texto, padding y border-radius apropiados para tu sistema de diseño. El elemento se renderiza como un `<span>`; aplica tu receta visual usando los atributos data para seleccionar.

## Renderizado SSR e hidratación

Badge es un elemento de visualización pasivo sin estado interactivo. Se renderiza como HTML estático y no requiere hidratación en el cliente.
