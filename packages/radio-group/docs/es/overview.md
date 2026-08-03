---
contentSchemaVersion: 1
title: Radio Group
description: Single-select radio button set with keyboard navigation.
keywords: [button, group, input, keyboard, navigation, radio, runtime]
locale: es
maturity: draft
product: Radio Group
productLayer: primitive
status: draft
package: "@solidiom/radio-group"
primitive: radio-group
section: overview
translationSourceHash: "09b9475e9bc53e8debc3cdc7cb716dcfd9d2d40445d780387bae596e4e762e7f"
translationStatus: draft
notApplicable:
  - section: relationships
    reason: Radio Group no tiene primitivos hermanos; se usa dentro de otras composiciones pero no posee un contrato inter-primitivo.
  - section: migration
    reason: Sin API previa; esta es la primera versión publicada.
  - section: testing
    reason: La guía estándar de pruebas cubre este primitivo.
---

Single-select radio button set with keyboard navigation.

## Uso

Compón `Root`, `Item`, `Indicator`.

```tsx
import * as RadioGroup from "@solidiom/radio-group"

;<RadioGroup.Root>Contenido de Radio Group</RadioGroup.Root>
```

## Instalación

Instala el paquete con `pnpm add @solidiom/radio-group`. El paquete requiere dependencias pares compatibles de `solid-js` y `@solidjs/web`.

## Partes

Radio Group expone 3 partes:

- **Root** — `data-part="root"`.
- **Item** — `data-part="item"`.
- **Indicator** — `data-part="indicator"`.

## Estilos

Radio Group lleva los atributos `data-scope="radio-group"` y `data-part` en cada parte para la selección CSS/receta. Los atributos de estado como `data-state`, `data-disabled` y `data-highlighted` se exponen donde corresponda.

## Interacción con teclado

| Tecla                | Comportamiento                                  |
| -------------------- | ----------------------------------------------- |
| ArrowDown/ArrowRight | Mueve la selección al siguiente elemento radio. |
| ArrowUp/ArrowLeft    | Mueve la selección al elemento radio anterior.  |

## Composición

Radio Group está diseñado para componerse con otras primitivas. Sus partes pueden combinarse con Field, Button u otras primitivas según sea necesario.

## Renderizado SSR e hidratación

Radio Group se renderiza como HTML semántico durante el renderizado en servidor. El comportamiento interactivo (manejadores de teclado, gestión de estado) se activa en la hidratación sin desplazamiento de diseño.
