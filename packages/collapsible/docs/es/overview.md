---
contentSchemaVersion: 1
title: Collapsible
description: Single expandable/collapsible section.
keywords: [collapsible, expandable, layout, runtime, section, single]
locale: es
maturity: draft
product: Collapsible
productLayer: primitive
status: draft
package: "@solidiom/collapsible"
primitive: collapsible
section: overview
translationSourceHash: "178e7b358b651daffff4c8c3a5fc94b8f8117ca0ac7543796c60d6040c09b0ff"
translationStatus: draft
notApplicable:
  - section: relationships
    reason: Collapsible no tiene primitivos hermanos; se usa dentro de otras composiciones pero no posee un contrato inter-primitivo.
  - section: migration
    reason: Sin API previa; esta es la primera versión publicada.
  - section: testing
    reason: La guía estándar de pruebas cubre este primitivo.
---

Single expandable/collapsible section.

## Uso

Compón `Root`, `Trigger`, `Content`.

```tsx
import * as Collapsible from "@solidiom/collapsible"

;<Collapsible.Root>Contenido de Collapsible</Collapsible.Root>
```

## Instalación

Instala el paquete con `pnpm add @solidiom/collapsible`. El paquete requiere dependencias pares compatibles de `solid-js` y `@solidjs/web`.

## Partes

Collapsible expone 3 partes:

- **Root** — `data-part="root"`.
- **Trigger** — `data-part="trigger"`.
- **Content** — `data-part="content"`.

## Estilos

Collapsible lleva los atributos `data-scope="collapsible"` y `data-part` en cada parte para la selección CSS/receta. Los atributos de estado como `data-state`, `data-disabled` y `data-highlighted` se exponen donde corresponda.

## Interacción con teclado

Este primitivo no tiene interacción con teclado. Renderiza contenido que no recibe foco ni responde a eventos de teclado de forma independiente.

## Composición

Collapsible está diseñado para componerse con otras primitivas. Sus partes pueden combinarse con Field, Button u otras primitivas según sea necesario.

## Renderizado SSR e hidratación

Collapsible se renderiza como HTML semántico durante el renderizado en servidor. El comportamiento interactivo (manejadores de teclado, gestión de estado) se activa en la hidratación sin desplazamiento de diseño.
