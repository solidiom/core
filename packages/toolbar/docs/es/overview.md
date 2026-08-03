---
contentSchemaVersion: 1
title: Toolbar
description: Grouped actions and controls in a horizontal bar.
keywords: [actions, and, bar, controls, grouped, horizontal, layout]
locale: es
maturity: draft
product: Toolbar
productLayer: primitive
status: draft
package: "@solidiom/toolbar"
primitive: toolbar
section: overview
translationSourceHash: "e9b363ea4a0913ebb269c518fb4c3abee3a1245dcd5c22b4179254b2d42b3982"
translationStatus: draft
notApplicable:
  - section: relationships
    reason: Toolbar no tiene primitivos hermanos; se usa dentro de otras composiciones pero no posee un contrato inter-primitivo.
  - section: migration
    reason: Sin API previa; esta es la primera versión publicada.
  - section: testing
    reason: La guía estándar de pruebas cubre este primitivo.
---

Grouped actions and controls in a horizontal bar.

## Uso

Compón `Root`, `Button`, `Separator`, `ToggleGroup`, `ToggleItem`.

```tsx
import * as Toolbar from "@solidiom/toolbar"

;<Toolbar.Root>Contenido de Toolbar</Toolbar.Root>
```

## Instalación

Instala el paquete con `pnpm add @solidiom/toolbar`. El paquete requiere dependencias pares compatibles de `solid-js` y `@solidjs/web`.

## Partes

Toolbar expone 5 partes:

- **Root** — `data-part="root"`.
- **Button** — `data-part="button"`.
- **Separator** — `data-part="separator"`.
- **ToggleGroup** — `data-part="togglegroup"`.
- **ToggleItem** — `data-part="toggleitem"`.

## Estilos

Toolbar lleva los atributos `data-scope="toolbar"` y `data-part` en cada parte para la selección CSS/receta. Los atributos de estado como `data-state`, `data-disabled` y `data-highlighted` se exponen donde corresponda.

## Interacción con teclado

Este primitivo no tiene interacción con teclado. Renderiza contenido que no recibe foco ni responde a eventos de teclado de forma independiente.

## Composición

Toolbar está diseñado para componerse con otras primitivas. Sus partes pueden combinarse con Field, Button u otras primitivas según sea necesario.

## Renderizado SSR e hidratación

Toolbar se renderiza como HTML semántico durante el renderizado en servidor. El comportamiento interactivo (manejadores de teclado, gestión de estado) se activa en la hidratación sin desplazamiento de diseño.
