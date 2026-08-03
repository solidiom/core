---
contentSchemaVersion: 1
title: Toast
description: Temporary non-blocking notification.
keywords: [blocking, feedback, non, notification, runtime, temporary, toast]
locale: es
maturity: draft
product: Toast
productLayer: primitive
status: draft
package: "@solidiom/toast"
primitive: toast
section: overview
translationSourceHash: "8915be60855a9a3c81225de5f1acabe55e32c61f657565f54425d06712063dda"
translationStatus: draft
notApplicable:
  - section: relationships
    reason: Toast no tiene primitivos hermanos; se usa dentro de otras composiciones pero no posee un contrato inter-primitivo.
  - section: migration
    reason: Sin API previa; esta es la primera versión publicada.
  - section: testing
    reason: La guía estándar de pruebas cubre este primitivo.
---

Temporary non-blocking notification.

## Uso

Compón `Region`, `Root`, `Title`, `Description`, `Close`.

```tsx
import * as Toast from "@solidiom/toast"

;<Toast.Region>Contenido de Toast</Toast.Region>
```

## Instalación

Instala el paquete con `pnpm add @solidiom/toast`. El paquete requiere dependencias pares compatibles de `solid-js` y `@solidjs/web`.

## Partes

Toast expone 5 partes:

- **Region** — `data-part="region"`.
- **Root** — `data-part="root"`.
- **Title** — `data-part="title"`.
- **Description** — `data-part="description"`.
- **Close** — `data-part="close"`.

## Estilos

Toast lleva los atributos `data-scope="toast"` y `data-part` en cada parte para la selección CSS/receta. Los atributos de estado como `data-state`, `data-disabled` y `data-highlighted` se exponen donde corresponda.

## Interacción con teclado

Este primitivo no tiene interacción con teclado. Renderiza contenido que no recibe enfoque ni responde a eventos de teclado de forma independiente.

## Composición

Toast está diseñado para componerse con otras primitivas. Sus partes pueden combinarse con Field, Button u otras primitivas según sea necesario.

## Renderizado SSR e hidratación

Toast se renderiza como HTML semántico durante el renderizado en servidor. El comportamiento interactivo (manejadores de teclado, gestión de estado) se activa en la hidratación sin desplazamiento de diseño.
