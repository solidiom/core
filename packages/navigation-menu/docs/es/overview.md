---
contentSchemaVersion: 1
title: Navigation Menu
description: Un componente de navegación de nivel superior con sub-menús desplegables accesibles.
keywords: [accessible, component, dropdown, level, menu, menus, navigation]
locale: es
maturity: ga
product: Navigation Menu
productLayer: primitive
status: draft
package: "@solidiom/navigation-menu"
primitive: navigation-menu
section: overview
translationSourceHash: "1dedf4562982d481b82bd8425ecafb5c2179ba91d596fb628856686e851fe026"
translationStatus: human-reviewed
translationReviewedBy: "G5-gate"
translationReviewedAt: "2026-08-07"
notApplicable:
  - section: relationships
    reason: Navigation Menu no tiene primitivos hermanos; se usa dentro de otras composiciones pero no posee un contrato inter-primitivo.
  - section: migration
    reason: Sin API previa; esta es la primera versión publicada.
  - section: testing
    reason: La guía estándar de pruebas cubre este primitivo.
---

Un componente de navegación de nivel superior con sub-menús desplegables accesibles.

## Uso

Compón `Root`, `List`, `Item`, `Trigger`, `Content`, `Link`.

```tsx
import * as NavigationMenu from "@solidiom/navigation-menu"

;<NavigationMenu.Root>Contenido de Navigation Menu</NavigationMenu.Root>
```

## Instalación

Instala el paquete con `pnpm add @solidiom/navigation-menu`. El paquete requiere dependencias pares compatibles de `solid-js` y `@solidjs/web`.

## Partes

Navigation Menu expone 6 partes:

- **Root** — `data-part="root"`.
- **List** — `data-part="list"`.
- **Item** — `data-part="item"`.
- **Trigger** — `data-part="trigger"`.
- **Content** — `data-part="content"`.
- **Link** — `data-part="link"`.

## Estilos

Navigation Menu lleva los atributos `data-scope="navigation-menu"` y `data-part` en cada parte para la selección CSS/receta. Los atributos de estado como `data-state`, `data-disabled` y `data-highlighted` se exponen donde corresponda.

## Interacción con teclado

| Tecla     | Comportamiento                                                      |
| --------- | ------------------------------------------------------------------- |
| ArrowDown | Abre el contenido desplegable cuando el foco está en un disparador. |
| Escape    | Cierra el contenido desplegable.                                    |
| Tab       | Mueve el foco al siguiente elemento enfocable en la navegación.     |

## Composición

Navigation Menu está diseñado para componerse con otras primitivas. Sus partes pueden combinarse con Field, Button u otras primitivas según sea necesario.

## Renderizado SSR e hidratación

Navigation Menu se renderiza como HTML semántico durante el renderizado en servidor. El comportamiento interactivo (manejadores de teclado, gestión de estado) se activa en la hidratación sin desplazamiento de diseño.
