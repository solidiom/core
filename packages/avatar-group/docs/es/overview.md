---
contentSchemaVersion: 1
title: Avatar Group
description: Visualización apilada de avatares para mostrar varios usuarios.
keywords: [avatar, group, stack, users, overflow, avatars, presence]
locale: es
maturity: ga
product: Avatar Group
productLayer: primitive
status: draft
package: "@solidiom/avatar-group"
primitive: avatar-group
section: overview
notApplicable:
  - section: migration
    reason: No existe una API anterior; esta es la primera versión publicada.
  - section: testing
    reason: La guía de pruebas estándar cubre este primitivo.
translationSourceHash: "a70f99841e3c9b296a5e62fad2716f5bd656b57f15b24bfed37cad6b107ba3e6"
translationStatus: "draft"
---

Avatar Group proporciona una visualización apilada de avatares para mostrar varios usuarios. Renderiza los avatares superpuestos y un indicador de exceso cuando el número de avatares supera el límite visible.

## Uso

Compón `Root` y `Overflow`.

```tsx
import * as AvatarGroup from "@solidiom/avatar-group"

function TeamAvatars() {
  return (
    <AvatarGroup.Root>
      <img src="/users/ada.png" alt="Ada" />
      <img src="/users/linus.png" alt="Linus" />
      <img src="/users/grace.png" alt="Grace" />
      <AvatarGroup.Overflow>+3</AvatarGroup.Overflow>
    </AvatarGroup.Root>
  )
}
```

## Instalación

Instala el paquete con `pnpm add @solidiom/avatar-group`. El paquete requiere dependencias pares compatibles de `solid-js` y `@solidjs/web`.

## Partes

avatar-group expone 2 partes:

- **Root** — `data-part="root"`. Contenedor que organiza los avatares en un diseño apilado y superpuesto.
- **Overflow** — `data-part="overflow"`. Indicador de exceso que aparece cuando el número de avatares supera el límite visible.

## Estilos

avatar-group incluye los atributos `data-scope="avatar-group"` y `data-part` en cada parte para seleccionar estilos CSS o recetas.

## Teclado y comportamiento

Este primitivo no tiene interacción de teclado propia.

## Composición

Avatar Group se compone naturalmente con primitivos de avatar individuales o elementos de imagen normales como hijos, y puede colocarse dentro de tarjetas, listas o encabezados.

## SSR e hidratación

Avatar Group se renderiza como HTML estático y no requiere hidratación, ya que es un primitivo puramente estructural y visual.
