---
contentSchemaVersion: 1
title: Popover
description: Non-modal floating content panel.
keywords: [content, floating, modal, non, overlay, panel, popover]
locale: es
maturity: ga
product: Popover
productLayer: primitive
status: draft
package: "@solidiom/popover"
primitive: popover
section: overview
notApplicable:
  - section: relationships
    reason: Popover no tiene primitivos hermanos; se usa dentro de otras composiciones pero no posee un contrato inter-primitivo.
  - section: migration
    reason: Sin API previa; esta es la primera versión publicada.
  - section: testing
    reason: La guía estándar de pruebas cubre este primitivo.
translationSourceHash: "2393f0b5f94918d1a53b7acd418868e2d117c99f3c9d384cb2b2acf532e93d62"
translationStatus: "human-reviewed"
translationReviewedBy: "solidiom-team"
translationReviewedAt: "2026-08-18"
---

Non-modal floating content panel.

## Uso

Compón `Root`, `Anchor`, `Trigger`, `Content`, `Close`.

```tsx
import * as Popover from "@solidiom/popover"

;<Popover.Root>Contenido de Popover</Popover.Root>
```

## Instalación

Instala el paquete con `pnpm add @solidiom/popover`. El paquete requiere dependencias pares compatibles de `solid-js` y `@solidjs/web`.

## Partes

Popover expone 5 partes:

- **Root** — `data-part="root"`.
- **Anchor** — `data-part="anchor"`.
- **Trigger** — `data-part="trigger"`.
- **Content** — `data-part="content"`.
- **Close** — `data-part="close"`.

## Estilos

Popover lleva los atributos `data-scope="popover"` y `data-part` en cada parte para la selección CSS/receta. Los atributos de estado como `data-state`, `data-disabled` y `data-highlighted` se exponen donde corresponda.

## Interacción con teclado

| Tecla  | Comportamiento                                      |
| ------ | --------------------------------------------------- |
| Escape | Cierra el popover y devuelve el foco al disparador. |

## Composición

Popover está diseñado para componerse con otras primitivas. Sus partes pueden combinarse con Field, Button u otras primitivas según sea necesario.

## Renderizado SSR e hidratación

Popover se renderiza como HTML semántico durante el renderizado en servidor. El comportamiento interactivo (manejadores de teclado, gestión de estado) se activa en la hidratación sin desplazamiento de diseño.
