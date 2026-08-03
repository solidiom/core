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
translationSourceHash: "6a391e13fd94d4d2808f7450b2374db928f4958ba4fa95dd67619a048f94551a"
translationStatus: draft
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

## Interacción con teclado

Este primitivo no tiene interacción con teclado. Renderiza contenido estático que no recibe enfoque ni responde a eventos de teclado.

## Renderizado SSR e hidratación

Badge es un elemento de visualización pasivo sin estado interactivo. Se renderiza como HTML estático y no requiere hidratación en el cliente.
