---
contentSchemaVersion: 1
title: Separator
description: Divisor visual horizontal o vertical con marcado semántico.
keywords: [separator, divisor, horizontal, vertical, decorativo]
locale: es
maturity: draft
product: Separator
productLayer: primitive
status: draft
package: "@solidiom/separator"
primitive: separator
section: overview
translationSourceHash: "8921cf801e455519dc6dfbe16f01d7953304e4de8d023969cc2e2318a06aa7bf"
translationStatus: draft
---

Separator renderiza un divisor visual entre secciones de contenido con semántica accesible. Soporta orientaciones horizontal y vertical y puede marcarse como puramente decorativo para ocultarlo del árbol de accesibilidad.

## Uso

Separator tiene una sola parte `Root`. Configura la orientación y el estado decorativo a través de props.

```tsx
import * as Separator from "@solidiom/separator"

;<Separator.Root />
```

## Instalación

Instala el paquete con `pnpm add @solidiom/separator`. El paquete requiere dependencias pares compatibles de `solid-js` y `@solidjs/web`.

## Props

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `orientation` | `"horizontal" \| "vertical"` | `"horizontal"` | Orientación del separator. |
| `decorative` | `boolean` | `false` | Cuando es true, el separator es puramente decorativo y se oculta del árbol de accesibilidad. |

## Estilos

Separator lleva los atributos `data-scope="separator"`, `data-part="root"` y `data-orientation`. Estílalo con bordes, márgenes o colores de fondo apropiados para tu sistema de diseño. El elemento se renderiza como un `<div>`; aplica tu receta visual usando los atributos data para seleccionar.

## Renderizado SSR e hidratación

Separator es un elemento de visualización pasivo sin estado interactivo. Se renderiza como HTML estático y no requiere hidratación en el cliente.