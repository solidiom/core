---
contentSchemaVersion: 1
title: Select
description: Dropdown selection from a list of options.
keywords: [dropdown, from, input, list, options, runtime, select]
locale: es
maturity: draft
product: Select
productLayer: primitive
status: draft
package: "@solidiom/select"
primitive: select
section: overview
translationSourceHash: "4b3163a2ea8751bf0d2595a1f2bfe60e059e71ce9a23901d70da207e2aebe8eb"
translationStatus: draft
notApplicable:
  - section: relationships
    reason: Select no tiene primitivos hermanos; se usa dentro de otras composiciones pero no posee un contrato inter-primitivo.
  - section: migration
    reason: Sin API previa; esta es la primera versión publicada.
  - section: testing
    reason: La guía estándar de pruebas cubre este primitivo.
---

Dropdown selection from a list of options.

## Uso

Compón `Root`, `Trigger`, `Content`, `Item`, `Value`, `HiddenInput`, `ScrollUpButton`, `ScrollDownButton`.

```tsx
import * as Select from "@solidiom/select"

;<Select.Root>Contenido de Select</Select.Root>
```

## Instalación

Instala el paquete con `pnpm add @solidiom/select`. El paquete requiere dependencias pares compatibles de `solid-js` y `@solidjs/web`.

## Partes

Select expone 8 partes:

- **Root** — `data-part="root"`.
- **Trigger** — `data-part="trigger"`.
- **Content** — `data-part="content"`.
- **Item** — `data-part="item"`.
- **Value** — `data-part="value"`.
- **HiddenInput** — `data-part="hiddeninput"`.
- **ScrollUpButton** — `data-part="scrollupbutton"`.
- **ScrollDownButton** — `data-part="scrolldownbutton"`.

## Estilos

Select lleva los atributos `data-scope="select"` y `data-part` en cada parte para la selección CSS/receta. Los atributos de estado como `data-state`, `data-disabled` y `data-highlighted` se exponen donde corresponda.

## Interacción con teclado

| Tecla     | Comportamiento                                                           |
| --------- | ------------------------------------------------------------------------ |
| ArrowDown | Abre la lista si está cerrada; mueve el resaltado a la siguiente opción. |
| ArrowUp   | Mueve el resaltado a la opción anterior.                                 |
| Enter     | Selecciona la opción resaltada y cierra la lista.                        |
| Escape    | Cierra la lista sin cambiar la selección.                                |
| Space     | Abre la lista o selecciona la opción resaltada.                          |

## Composición

Select está diseñado para componerse con otras primitivas. Sus partes pueden combinarse con Field, Button u otras primitivas según sea necesario.

## Renderizado SSR e hidratación

Select se renderiza como HTML semántico durante el renderizado en servidor. El comportamiento interactivo (manejadores de teclado, gestión de estado) se activa en la hidratación sin desplazamiento de diseño.
