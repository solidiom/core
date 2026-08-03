---
contentSchemaVersion: 1
title: Alert Dialog
description: Modal confirmation dialog requiring explicit user action.
keywords: [action, alert, confirmation, dialog, explicit, modal, overlay]
locale: es
maturity: draft
product: Alert Dialog
productLayer: primitive
status: draft
package: "@solidiom/alert-dialog"
primitive: alert-dialog
section: overview
translationSourceHash: "4d13300543207be8e0b66f5d02980eb0e43534ecb27133db8035415a9d471a53"
translationStatus: draft
notApplicable:
  - section: relationships
    reason: Alert Dialog no tiene primitivos hermanos; se usa dentro de otras composiciones pero no posee un contrato inter-primitivo.
  - section: migration
    reason: Sin API previa; esta es la primera versión publicada.
  - section: testing
    reason: La guía estándar de pruebas cubre este primitivo.
---

Modal confirmation dialog requiring explicit user action.

## Uso

Compón `Root`, `Trigger`, `Portal`, `Content`, `Title`, `Description`, `Cancel`, `Action`.

```tsx
import * as AlertDialog from "@solidiom/alert-dialog"

;<AlertDialog.Root>Contenido de Alert Dialog</AlertDialog.Root>
```

## Instalación

Instala el paquete con `pnpm add @solidiom/alert-dialog`. El paquete requiere dependencias pares compatibles de `solid-js` y `@solidjs/web`.

## Partes

Alert Dialog expone 8 partes:

- **Root** — `data-part="root"`.
- **Trigger** — `data-part="trigger"`.
- **Portal** — `data-part="portal"`.
- **Content** — `data-part="content"`.
- **Title** — `data-part="title"`.
- **Description** — `data-part="description"`.
- **Cancel** — `data-part="cancel"`.
- **Action** — `data-part="action"`.

## Estilos

Alert Dialog lleva los atributos `data-scope="alert-dialog"` y `data-part` en cada parte para la selección CSS/receta. Los atributos de estado como `data-state`, `data-disabled` y `data-highlighted` se exponen donde corresponda.

## Interacción con teclado

Este primitivo no tiene interacción con teclado. Renderiza contenido que no recibe enfoque ni responde a eventos de teclado de forma independiente.

## Composición

Alert Dialog está diseñado para componerse con otras primitivas. Sus partes pueden combinarse con Field, Button u otras primitivas según sea necesario.

## Renderizado SSR e hidratación

Alert Dialog se renderiza como HTML semántico durante el renderizado en servidor. El comportamiento interactivo (manejadores de teclado, gestión de estado) se activa en la hidratación sin desplazamiento de diseño.
