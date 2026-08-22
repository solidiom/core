---
contentSchemaVersion: 1
title: Input Group
description: Envoltorio de entrada con espacios de prefijo y sufijo para iconos y botones.
keywords: [input group, prefix, suffix, addon, input, icon, button]
locale: es
maturity: ga
product: Input Group
productLayer: primitive
status: draft
package: "@solidiom/input-group"
primitive: input-group
section: overview
notApplicable:
  - section: migration
    reason: No existe una API anterior; esta es la primera versión publicada.
  - section: testing
    reason: La guía de pruebas estándar cubre este primitivo.
translationSourceHash: "55a07e44337d0491fcb1f332cf336d9c285b67e22c5cbf8806eaa9c795a6b652"
translationStatus: "draft"
---

Input Group es un contenedor flex que combina una entrada con espacios de complementos iniciales y finales para iconos, etiquetas o botones. `Root` comparte el estado disabled/invalid mediante contexto para que las partes hijas lo hereden sin pasar props entre ellas.

## Uso

Compón `Root`, `Prefix`, `Suffix` e `Input`. `Prefix` y `Suffix` contienen los complementos inicial y final alrededor de `Input`.

```tsx
import * as InputGroup from "@solidiom/input-group"

;<InputGroup.Root>
  <InputGroup.Prefix>@</InputGroup.Prefix>
  <InputGroup.Input />
  <InputGroup.Suffix>.com</InputGroup.Suffix>
</InputGroup.Root>
```

## Instalación

Instala el paquete con `pnpm add @solidiom/input-group`. El paquete requiere dependencias pares compatibles de `solid-js` y `@solidjs/web`.

## Partes

input-group expone 4 partes:

- **Root** — contenedor flex que comparte el estado disabled/invalid mediante contexto.
- **Prefix** — espacio de complemento inicial para iconos, etiquetas o botones.
- **Suffix** — espacio de complemento final para iconos, etiquetas o botones.
- **Input** — la entrada compuesta dentro del grupo.

## Estilos

input-group incluye los atributos `data-scope="input-group"` y `data-part` en cada parte para seleccionar estilos CSS o recetas. El estado disabled e invalid se comparte desde `Root` para que las partes hijas puedan reflejarlo.

## Teclado y comportamiento

Este primitivo no tiene interacción de teclado propia; la entrada compuesta gestiona la escritura de texto.

## Composición

Compón con primitivos de icono, etiqueta o botón en los espacios Prefix y Suffix para crear controles de entrada enriquecidos.

## SSR e hidratación

Input Group renderiza HTML estático en el servidor; la entrada compuesta activa sus manejadores durante la hidratación.
