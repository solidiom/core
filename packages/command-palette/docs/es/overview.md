---
contentSchemaVersion: 1
title: Command Palette
description: Modal search and action launcher.
keywords: [action, and, command, launcher, modal, navigation, palette]
locale: es
maturity: ga
product: Command Palette
productLayer: primitive
status: draft
package: "@solidiom/command-palette"
primitive: command-palette
section: overview
notApplicable:
  - section: relationships
    reason: Command Palette no tiene primitivos hermanos; se usa dentro de otras composiciones pero no posee un contrato inter-primitivo.
  - section: migration
    reason: Sin API previa; esta es la primera versión publicada.
  - section: testing
    reason: La guía estándar de pruebas cubre este primitivo.
translationSourceHash: "b862a0b7c15eb9d7ff0a5b555351f426736d92d22789c5bae49841cddd31f417"
translationStatus: draft
---

Modal search and action launcher.

## Uso

Compón `Root`, `Input`, `List`, `Group`, `Item`, `Empty`.

```tsx
import * as CommandPalette from "@solidiom/command-palette"

;<CommandPalette.Root>Contenido de Command Palette</CommandPalette.Root>
```

## Instalación

Instala el paquete con `pnpm add @solidiom/command-palette`. El paquete requiere dependencias pares compatibles de `solid-js` y `@solidjs/web`.

## Partes

Command Palette expone 6 partes:

- **Root** — `data-part="root"`.
- **Input** — `data-part="input"`.
- **List** — `data-part="list"`.
- **Group** — `data-part="group"`.
- **Item** — `data-part="item"`.
- **Empty** — `data-part="empty"`.

## Estilos

Command Palette lleva los atributos `data-scope="command-palette"` y `data-part` en cada parte para la selección CSS/receta. Los atributos de estado como `data-state`, `data-disabled` y `data-highlighted` se exponen donde corresponda.

## Interacción con teclado

Este primitivo no tiene interacción con teclado. Renderiza contenido que no recibe foco ni responde a eventos de teclado de forma independiente.

## Composición

Command Palette está diseñado para componerse con otras primitivas. Sus partes pueden combinarse con Field, Button u otras primitivas según sea necesario.

## Renderizado SSR e hidratación

Command Palette se renderiza como HTML semántico durante el renderizado en servidor. El comportamiento interactivo (manejadores de teclado, gestión de estado) se activa en la hidratación sin desplazamiento de diseño.
