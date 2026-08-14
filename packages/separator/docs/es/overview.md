---
contentSchemaVersion: 1
title: Separator
description: Divisor visual horizontal o vertical con marcado semántico.
keywords: [separator, divisor, horizontal, vertical, decorativo]
locale: es
maturity: ga
product: Separator
productLayer: primitive
status: draft
package: "@solidiom/separator"
primitive: separator
section: overview
notApplicable:
  - section: composition
    reason: Primitivo autónomo sin sub-primitivos compuestos.
  - section: relationships
    reason: Sin primitivos hermanos; se usa dentro de otras composiciones pero no posee un contrato inter-primitivo.
  - section: migration
    reason: Sin API previa; esta es la primera versión publicada.
  - section: testing
    reason: La guía estándar de pruebas cubre este primitivo. No existe comportamiento no obvio específico.
translationSourceHash: "efc61e246d90a4495347503c29bb11a1f251f9e5a137565493320d1927bc56db"
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

| Prop          | Tipo                         | Default        | Descripción                                                                                  |
| ------------- | ---------------------------- | -------------- | -------------------------------------------------------------------------------------------- |
| `orientation` | `"horizontal" \| "vertical"` | `"horizontal"` | Orientación del separator.                                                                   |
| `decorative`  | `boolean`                    | `false`        | Cuando es true, el separator es puramente decorativo y se oculta del árbol de accesibilidad. |

## Estilos

Separator lleva los atributos `data-scope="separator"`, `data-part="root"` y `data-orientation`. Estílalo con bordes, márgenes o colores de fondo apropiados para tu sistema de diseño. El elemento se renderiza como un `<div>`; aplica tu receta visual usando los atributos data para seleccionar.

## Interacción con teclado

Este primitivo no tiene interacción con teclado. Renderiza contenido estático que no recibe foco ni responde a eventos de teclado.

## Renderizado SSR e hidratación

Separator es un elemento de visualización pasivo sin estado interactivo. Se renderiza como HTML estático y no requiere hidratación en el cliente.
