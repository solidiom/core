---
contentSchemaVersion: 1
title: Switch
description: Binary toggle with on/off semantics.
keywords: [binary, input, off, runtime, semantics, switch, toggle]
locale: es
maturity: draft
product: Switch
productLayer: primitive
status: draft
package: "@solidiom/switch"
primitive: switch
section: overview
translationSourceHash: "ef80e64fc7f37ac27f11aea009482b7315fd89a1dda60f647ea8601383442ad8"
translationStatus: draft
notApplicable:
  - section: composition
    reason: Switch es un primitivo autónomo sin sub-primitivos compuestos.
  - section: relationships
    reason: Switch no tiene primitivos hermanos; se usa dentro de otras composiciones pero no posee un contrato inter-primitivo.
  - section: migration
    reason: Sin API previa; esta es la primera versión publicada.
  - section: testing
    reason: La guía estándar de pruebas cubre este primitivo.
---

Binary toggle with on/off semantics.

## Uso

Compón `Root`, `Thumb`.

```tsx
import * as Switch from "@solidiom/switch"

;<Switch.Root>Contenido de Switch</Switch.Root>
```

## Instalación

Instala el paquete con `pnpm add @solidiom/switch`. El paquete requiere dependencias pares compatibles de `solid-js` y `@solidjs/web`.

## Partes

Switch expone 2 partes:

- **Root** — `data-part="root"`.
- **Thumb** — `data-part="thumb"`.

## Estilos

Switch lleva los atributos `data-scope="switch"` y `data-part` en cada parte para la selección CSS/receta. Los atributos de estado como `data-state`, `data-disabled` y `data-highlighted` se exponen donde corresponda.

## Interacción con teclado

| Tecla | Comportamiento                               |
| ----- | -------------------------------------------- |
| Space | Alterna el switch entre encendido y apagado. |
| Enter | Alterna el switch entre encendido y apagado. |

## Renderizado SSR e hidratación

Switch se renderiza como HTML semántico durante el renderizado en servidor. El comportamiento interactivo (manejadores de teclado, gestión de estado) se activa en la hidratación sin desplazamiento de diseño.
