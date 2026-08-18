---
contentSchemaVersion: 1
title: Sheet
description: Side-panel dialog with slide animation.
keywords: [animation, dialog, overlay, panel, runtime, sheet, side]
locale: es
maturity: ga
product: Sheet
productLayer: primitive
status: draft
package: "@solidiom/sheet"
primitive: sheet
section: overview
notApplicable:
  - section: relationships
    reason: Sheet no tiene primitivos hermanos; se usa dentro de otras composiciones pero no posee un contrato inter-primitivo.
  - section: migration
    reason: Sin API previa; esta es la primera versión publicada.
  - section: testing
    reason: La guía estándar de pruebas cubre este primitivo.
translationSourceHash: "44b358e5bcc821c406ae4b8675278fd10f29f9608eb8068143dcea69d4308ec3"
translationStatus: "human-reviewed"
translationReviewedBy: "solidiom-team"
translationReviewedAt: "2026-08-18"
---

Side-panel dialog with slide animation.

## Uso

Compón `Root`, `Trigger`, `Portal`, `Backdrop`, `Content`, `Title`, `Description`, `Close`.

```tsx
import * as Sheet from "@solidiom/sheet"

;<Sheet.Root>Contenido de Sheet</Sheet.Root>
```

## Instalación

Instala el paquete con `pnpm add @solidiom/sheet`. El paquete requiere dependencias pares compatibles de `solid-js` y `@solidjs/web`.

## Partes

Sheet expone 8 partes:

- **Root** — `data-part="root"`.
- **Trigger** — `data-part="trigger"`.
- **Portal** — `data-part="portal"`.
- **Backdrop** — `data-part="backdrop"`.
- **Content** — `data-part="content"`.
- **Title** — `data-part="title"`.
- **Description** — `data-part="description"`.
- **Close** — `data-part="close"`.

## Estilos

Sheet lleva los atributos `data-scope="sheet"` y `data-part` en cada parte para la selección CSS/receta. Los atributos de estado como `data-state`, `data-disabled` y `data-highlighted` se exponen donde corresponda.

## Interacción con teclado

| Tecla  | Comportamiento                                                |
| ------ | ------------------------------------------------------------- |
| Escape | Cierra el panel y devuelve el foco al disparador.             |
| Tab    | Mueve el foco dentro del contenido del panel (foco atrapado). |

## Composición

Sheet está diseñado para componerse con otras primitivas. Sus partes pueden combinarse con Field, Button u otras primitivas según sea necesario.

## Renderizado SSR e hidratación

Sheet se renderiza como HTML semántico durante el renderizado en servidor. El comportamiento interactivo (manejadores de teclado, gestión de estado) se activa en la hidratación sin desplazamiento de diseño.
