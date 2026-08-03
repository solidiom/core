---
contentSchemaVersion: 1
title: Pagination
description: Page navigation with prev/next and page numbers.
keywords: [and, navigation, next, numbers, page, pagination, prev]
locale: es
maturity: draft
product: Pagination
productLayer: primitive
status: draft
package: "@solidiom/pagination"
primitive: pagination
section: overview
translationSourceHash: "320d9c76046a2bb3aa078059c49430b993f4f20b3f2a9e6a686184221ef24d8f"
translationStatus: draft
notApplicable:
  - section: relationships
    reason: Pagination no tiene primitivos hermanos; se usa dentro de otras composiciones pero no posee un contrato inter-primitivo.
  - section: migration
    reason: Sin API previa; esta es la primera versión publicada.
  - section: testing
    reason: La guía estándar de pruebas cubre este primitivo.
---

Page navigation with prev/next and page numbers.

## Uso

Compón `Root`, `Content`, `Item`, `PreviousButton`, `NextButton`, `Ellipsis`.

```tsx
import * as Pagination from "@solidiom/pagination"

;<Pagination.Root>Contenido de Pagination</Pagination.Root>
```

## Instalación

Instala el paquete con `pnpm add @solidiom/pagination`. El paquete requiere dependencias pares compatibles de `solid-js` y `@solidjs/web`.

## Partes

Pagination expone 6 partes:

- **Root** — `data-part="root"`.
- **Content** — `data-part="content"`.
- **Item** — `data-part="item"`.
- **PreviousButton** — `data-part="previousbutton"`.
- **NextButton** — `data-part="nextbutton"`.
- **Ellipsis** — `data-part="ellipsis"`.

## Estilos

Pagination lleva los atributos `data-scope="pagination"` y `data-part` en cada parte para la selección CSS/receta. Los atributos de estado como `data-state`, `data-disabled` y `data-highlighted` se exponen donde corresponda.

## Interacción con teclado

| Tecla       | Comportamiento                      |
| ----------- | ----------------------------------- |
| Enter/Space | Activa el botón de página enfocado. |

## Composición

Pagination está diseñado para componerse con otras primitivas. Sus partes pueden combinarse con Field, Button u otras primitivas según sea necesario.

## Renderizado SSR e hidratación

Pagination se renderiza como HTML semántico durante el renderizado en servidor. El comportamiento interactivo (manejadores de teclado, gestión de estado) se activa en la hidratación sin desplazamiento de diseño.
