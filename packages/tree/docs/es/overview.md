---
contentSchemaVersion: 1
title: Tree
description: Hierarchical tree view with expand/collapse.
keywords: [collapse, expand, hierarchical, navigation, runtime, tree, view]
locale: es
maturity: ga
product: Tree
productLayer: primitive
status: draft
package: "@solidiom/tree"
primitive: tree
section: overview
notApplicable:
  - section: relationships
    reason: Tree no tiene primitivos hermanos; se usa dentro de otras composiciones pero no posee un contrato inter-primitivo.
  - section: migration
    reason: Sin API previa; esta es la primera versión publicada.
  - section: testing
    reason: La guía estándar de pruebas cubre este primitivo.
translationSourceHash: "fa0f840660c6199207592840704b24030690df2295bc275dd52317f88b0833d3"
translationStatus: "human-reviewed"
translationReviewedBy: "solidiom-team"
translationReviewedAt: "2026-08-18"
---

Hierarchical tree view with expand/collapse.

## Uso

Compón `Root`, `Item`, `Branch`, `ItemIndicator`.

```tsx
import * as Tree from "@solidiom/tree"

;<Tree.Root>Contenido de Tree</Tree.Root>
```

## Instalación

Instala el paquete con `pnpm add @solidiom/tree`. El paquete requiere dependencias pares compatibles de `solid-js` y `@solidjs/web`.

## Partes

Tree expone 4 partes:

- **Root** — `data-part="root"`.
- **Item** — `data-part="item"`.
- **Branch** — `data-part="branch"`.
- **ItemIndicator** — `data-part="itemindicator"`.

## Estilos

Tree lleva los atributos `data-scope="tree"` y `data-part` en cada parte para la selección CSS/receta. Los atributos de estado como `data-state`, `data-disabled` y `data-highlighted` se exponen donde corresponda.

## Interacción con teclado

Este primitivo no tiene interacción con teclado. Renderiza contenido que no recibe foco ni responde a eventos de teclado de forma independiente.

## Composición

Tree está diseñado para componerse con otras primitivas. Sus partes pueden combinarse con Field, Button u otras primitivas según sea necesario.

## Renderizado SSR e hidratación

Tree se renderiza como HTML semántico durante el renderizado en servidor. El comportamiento interactivo (manejadores de teclado, gestión de estado) se activa en la hidratación sin desplazamiento de diseño.
