---
contentSchemaVersion: 1
title: Menu
description: Action list triggered by a button.
keywords: [action, button, list, menu, navigation, runtime, triggered]
locale: es
maturity: ga
product: Menu
productLayer: primitive
status: draft
package: "@solidiom/menu"
primitive: menu
section: overview
notApplicable:
  - section: relationships
    reason: Menu no tiene primitivos hermanos; se usa dentro de otras composiciones pero no posee un contrato inter-primitivo.
  - section: migration
    reason: Sin API previa; esta es la primera versión publicada.
  - section: testing
    reason: La guía estándar de pruebas cubre este primitivo.
translationSourceHash: "231fb02d34c83422f3ad4f6cb135bc792ee7f25cf575480e1963736404a27285"
translationStatus: "human-reviewed"
translationReviewedBy: "solidiom-team"
translationReviewedAt: "2026-08-18"
---

Action list triggered by a button.

## Uso

Compón `Root`, `Trigger`, `Content`, `Item`, `Separator`, `CheckboxItem`, `RadioGroup`, `RadioItem`, `Label`, `Sub`, `SubTrigger`, `SubContent`.

```tsx
import * as Menu from "@solidiom/menu"

;<Menu.Root>Contenido de Menu</Menu.Root>
```

## Instalación

Instala el paquete con `pnpm add @solidiom/menu`. El paquete requiere dependencias pares compatibles de `solid-js` y `@solidjs/web`.

## Partes

Menu expone 12 partes:

- **Root** — `data-part="root"`.
- **Trigger** — `data-part="trigger"`.
- **Content** — `data-part="content"`.
- **Item** — `data-part="item"`.
- **Separator** — `data-part="separator"`.
- **CheckboxItem** — `data-part="checkboxitem"`.
- **RadioGroup** — `data-part="radiogroup"`.
- **RadioItem** — `data-part="radioitem"`.
- **Label** — `data-part="label"`.
- **Sub** — `data-part="sub"`.
- **SubTrigger** — `data-part="subtrigger"`.
- **SubContent** — `data-part="subcontent"`.

## Estilos

Menu lleva los atributos `data-scope="menu"` y `data-part` en cada parte para la selección CSS/receta. Los atributos de estado como `data-state`, `data-disabled` y `data-highlighted` se exponen donde corresponda.

## Interacción con teclado

| Tecla       | Comportamiento                                             |
| ----------- | ---------------------------------------------------------- |
| ArrowDown   | Mueve el foco al siguiente elemento del menú.              |
| ArrowUp     | Mueve el foco al elemento anterior del menú.               |
| Enter/Space | Activa el elemento de menú enfocado.                       |
| Escape      | Cierra el menú y devuelve el foco al disparador.           |
| ArrowRight  | Abre un sub-menú cuando el foco está en un sub-disparador. |
| ArrowLeft   | Cierra el sub-menú y devuelve el foco al padre.            |

## Composición

Menu está diseñado para componerse con otras primitivas. Sus partes pueden combinarse con Field, Button u otras primitivas según sea necesario.

## Renderizado SSR e hidratación

Menu se renderiza como HTML semántico durante el renderizado en servidor. El comportamiento interactivo (manejadores de teclado, gestión de estado) se activa en la hidratación sin desplazamiento de diseño.
