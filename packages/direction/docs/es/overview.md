---
contentSchemaVersion: 1
title: Direction
description: Componente proveedor de contexto para dirección RTL/LTR.
keywords: [direction, rtl, ltr, context, provider, internationalization]
locale: es
maturity: ga
product: Direction
productLayer: primitive
status: draft
package: "@solidiom/direction"
primitive: direction
section: overview
notApplicable:
  - section: migration
    reason: No existe una API anterior; esta es la primera versión publicada.
  - section: testing
    reason: La guía de pruebas estándar cubre este primitivo.
translationSourceHash: "6bcc2f2d483d1f56ee8186f8dda2183c1759740b6b2ff5527bbf880dfaed758d"
translationStatus: "draft"
---

Direction es un proveedor de contexto que proporciona la dirección del texto (`ltr` o `rtl`) a sus descendientes mediante `DirectionContext`. No produce salida visual.

## Uso

Direction tiene una única parte `Root`. Envuelve los descendientes que deben consumir el valor de dirección; no produce salida visual.

```tsx
import * as Direction from "@solidiom/direction"

;<Direction.Root>
  {/* los descendientes leen la dirección mediante DirectionContext */}
</Direction.Root>
```

## Instalación

Instala el paquete con `pnpm add @solidiom/direction`. El paquete requiere dependencias pares compatibles de `solid-js` y `@solidjs/web`.

## Partes

direction tiene una única parte `Root`. Proporciona la dirección (`ltr`/`rtl`) mediante `DirectionContext` a los descendientes y no produce salida visual.

## Estilos

direction incluye `data-scope="direction"` y un atributo `data-part="root"` para seleccionar estilos CSS o recetas. Como proveedor de contexto, no emite estilos visuales propios.

## Teclado y comportamiento

Este primitivo no tiene interacción de teclado propia.

## Composición

Envuelve otros primitivos para propagar la dirección `ltr`/`rtl` mediante `DirectionContext`, permitiendo que los descendientes adapten su diseño y comportamiento.

## SSR e hidratación

Como proveedor de contexto sin salida visual, direction no añade marcas y no requiere hidratación; el valor de dirección está disponible tanto durante el renderizado en servidor como en el cliente.
