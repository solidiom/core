---
contentSchemaVersion: 1
title: Stack
description: Primitivo de diseño flex con separación, dirección y alineación configurables.
keywords: [stack, layout, flex, gap, direction, alignment]
locale: es
maturity: ga
product: Stack
productLayer: primitive
status: draft
package: "@solidiom/stack"
primitive: stack
section: overview
notApplicable:
  - section: migration
    reason: No existe una API anterior; esta es la primera versión publicada.
  - section: testing
    reason: La guía de pruebas estándar cubre este primitivo.
translationSourceHash: "9e01b3f9f621e1dc279eab3db1d67633db6f47bb0728221558eb8fa56bae9569"
translationStatus: "draft"
---

Stack es un primitivo de diseño flex con separación, dirección y alineación configurables. Organiza sus hijos en un único contenedor flex.

## Uso

Stack tiene una única parte `Root`. Coloca los hijos directamente dentro para organizarlos con la separación, dirección y alineación configuradas.

```tsx
import * as Stack from "@solidiom/stack"

;<Stack.Root>
  <div>Uno</div>
  <div>Dos</div>
  <div>Tres</div>
</Stack.Root>
```

## Instalación

Instala el paquete con `pnpm add @solidiom/stack`. El paquete requiere dependencias pares compatibles de `solid-js` y `@solidjs/web`.

## Partes

stack tiene una única parte `Root`. Es un contenedor flex con separación, dirección y alineación configurables.

## Estilos

stack incluye `data-scope="stack"` y un atributo `data-part="root"` para seleccionar estilos CSS o recetas.

## Teclado y comportamiento

Este primitivo no tiene interacción de teclado propia.

## Composición

Envuelve cualquier primitivo para organizarlo en un diseño flex con espaciado y alineación coherentes.

## SSR e hidratación

Stack renderiza HTML estático y no requiere hidratación.
