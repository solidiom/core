---
contentSchemaVersion: 1
title: Context Menu
description: Right-click triggered menu.
keywords: [click, context, menu, overlay, right, runtime, triggered]
locale: es
maturity: draft
product: Context Menu
productLayer: primitive
status: draft
package: "@solidiom/context-menu"
primitive: context-menu
section: overview
translationSourceHash: "7dcf4036af0f531b73929b0a7944fd5c40821f7ff6cb5e909412f873decd9f09"
translationStatus: draft
notApplicable:
  - section: relationships
    reason: Context Menu no tiene primitivos hermanos; se usa dentro de otras composiciones pero no posee un contrato inter-primitivo.
  - section: migration
    reason: Sin API previa; esta es la primera versión publicada.
  - section: testing
    reason: La guía estándar de pruebas cubre este primitivo.
---

Right-click triggered menu.

## Uso

Compón `Root`, `Trigger`, `Content`, `Item`, `CheckboxItem`, `RadioGroup`, `RadioItem`, `Separator`, `Label`.

```tsx
import * as ContextMenu from "@solidiom/context-menu"

;<ContextMenu.Root>Contenido de Context Menu</ContextMenu.Root>
```

## Instalación

Instala el paquete con `pnpm add @solidiom/context-menu`. El paquete requiere dependencias pares compatibles de `solid-js` y `@solidjs/web`.

## Partes

Context Menu expone 9 partes:

- **Root** — `data-part="root"`.
- **Trigger** — `data-part="trigger"`.
- **Content** — `data-part="content"`.
- **Item** — `data-part="item"`.
- **CheckboxItem** — `data-part="checkboxitem"`.
- **RadioGroup** — `data-part="radiogroup"`.
- **RadioItem** — `data-part="radioitem"`.
- **Separator** — `data-part="separator"`.
- **Label** — `data-part="label"`.

## Estilos

Context Menu lleva los atributos `data-scope="context-menu"` y `data-part` en cada parte para la selección CSS/receta. Los atributos de estado como `data-state`, `data-disabled` y `data-highlighted` se exponen donde corresponda.

## Interacción con teclado

Este primitivo no tiene interacción con teclado. Renderiza contenido que no recibe foco ni responde a eventos de teclado de forma independiente.

## Composición

Context Menu está diseñado para componerse con otras primitivas. Sus partes pueden combinarse con Field, Button u otras primitivas según sea necesario.

## Renderizado SSR e hidratación

Context Menu se renderiza como HTML semántico durante el renderizado en servidor. El comportamiento interactivo (manejadores de teclado, gestión de estado) se activa en la hidratación sin desplazamiento de diseño.
