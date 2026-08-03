---
contentSchemaVersion: 1
title: Tabs
description: Tabbed content switcher.
keywords: [content, navigation, runtime, switcher, tabbed, tabs]
locale: es
maturity: draft
product: Tabs
productLayer: primitive
status: draft
package: "@solidiom/tabs"
primitive: tabs
section: overview
translationSourceHash: "924f569ed83bcd00112772b7dafd3229c8a351c8a37a902f8fbbb6644222ad06"
translationStatus: draft
notApplicable:
  - section: relationships
    reason: Tabs no tiene primitivos hermanos; se usa dentro de otras composiciones pero no posee un contrato inter-primitivo.
  - section: migration
    reason: Sin API previa; esta es la primera versión publicada.
  - section: testing
    reason: La guía estándar de pruebas cubre este primitivo.
---

Tabbed content switcher.

## Uso

Compón `Root`, `List`, `Trigger`, `Content`.

```tsx
import * as Tabs from "@solidiom/tabs"

;<Tabs.Root>Contenido de Tabs</Tabs.Root>
```

## Instalación

Instala el paquete con `pnpm add @solidiom/tabs`. El paquete requiere dependencias pares compatibles de `solid-js` y `@solidjs/web`.

## Partes

Tabs expone 4 partes:

- **Root** — `data-part="root"`.
- **List** — `data-part="list"`.
- **Trigger** — `data-part="trigger"`.
- **Content** — `data-part="content"`.

## Estilos

Tabs lleva los atributos `data-scope="tabs"` y `data-part` en cada parte para la selección CSS/receta. Los atributos de estado como `data-state`, `data-disabled` y `data-highlighted` se exponen donde corresponda.

## Interacción con teclado

| Tecla       | Comportamiento                                             |
| ----------- | ---------------------------------------------------------- |
| ArrowRight  | Mueve el foco al siguiente disparador de pestaña.          |
| ArrowLeft   | Mueve el foco al disparador de pestaña anterior.           |
| Home        | Mueve el foco al primer disparador de pestaña.             |
| End         | Mueve el foco al último disparador de pestaña.             |
| Enter/Space | Activa la pestaña enfocada (en modo de activación manual). |

## Composición

Tabs está diseñado para componerse con otras primitivas. Sus partes pueden combinarse con Field, Button u otras primitivas según sea necesario.

## Renderizado SSR e hidratación

Tabs se renderiza como HTML semántico durante el renderizado en servidor. El comportamiento interactivo (manejadores de teclado, gestión de estado) se activa en la hidratación sin desplazamiento de diseño.
