---
contentSchemaVersion: 1
title: Resizable Panels
description: Drag-to-resize panel layout.
keywords: [drag, layout, panel, panels, resizable, resize, runtime]
locale: es
maturity: draft
product: Resizable Panels
productLayer: primitive
status: draft
package: "@solidiom/resizable-panels"
primitive: resizable-panels
section: overview
translationSourceHash: "5a9eaad753e5e18211fdca3a429306648ce822a28b6d8a9eb03a16d8e4f2d8db"
translationStatus: draft
notApplicable:
  - section: relationships
    reason: Resizable Panels no tiene primitivos hermanos; se usa dentro de otras composiciones pero no posee un contrato inter-primitivo.
  - section: migration
    reason: Sin API previa; esta es la primera versión publicada.
  - section: testing
    reason: La guía estándar de pruebas cubre este primitivo.
---

Drag-to-resize panel layout.

## Uso

Compón `PanelGroup`, `Panel`, `Handle`.

```tsx
import * as ResizablePanels from "@solidiom/resizable-panels"

;<ResizablePanels.PanelGroup>Contenido de Resizable Panels</ResizablePanels.PanelGroup>
```

## Instalación

Instala el paquete con `pnpm add @solidiom/resizable-panels`. El paquete requiere dependencias pares compatibles de `solid-js` y `@solidjs/web`.

## Partes

Resizable Panels expone 3 partes:

- **PanelGroup** — `data-part="panelgroup"`.
- **Panel** — `data-part="panel"`.
- **Handle** — `data-part="handle"`.

## Estilos

Resizable Panels lleva los atributos `data-scope="resizable-panels"` y `data-part` en cada parte para la selección CSS/receta. Los atributos de estado como `data-state`, `data-disabled` y `data-highlighted` se exponen donde corresponda.

## Interacción con teclado

Este primitivo no tiene interacción con teclado. Renderiza contenido que no recibe enfoque ni responde a eventos de teclado de forma independiente.

## Composición

Resizable Panels está diseñado para componerse con otras primitivas. Sus partes pueden combinarse con Field, Button u otras primitivas según sea necesario.

## Renderizado SSR e hidratación

Resizable Panels se renderiza como HTML semántico durante el renderizado en servidor. El comportamiento interactivo (manejadores de teclado, gestión de estado) se activa en la hidratación sin desplazamiento de diseño.
