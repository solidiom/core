---
contentSchemaVersion: 1
title: Checkbox
description: Binary or indeterminate toggle control.
keywords: [binary, checkbox, control, indeterminate, input, runtime, toggle]
locale: es
maturity: draft
product: Checkbox
productLayer: primitive
status: draft
package: "@solidiom/checkbox"
primitive: checkbox
section: overview
translationSourceHash: "17a67fba42916a0c4cead791a420ae2731864b7bedf48943ee79ab5c1504402c"
translationStatus: draft
notApplicable:
  - section: relationships
    reason: Checkbox no tiene primitivos hermanos; se usa dentro de otras composiciones pero no posee un contrato inter-primitivo.
  - section: migration
    reason: Sin API previa; esta es la primera versión publicada.
  - section: testing
    reason: La guía estándar de pruebas cubre este primitivo.
---

Binary or indeterminate toggle control.

## Uso

Compón `Group`, `Root`, `Indicator`.

```tsx
import * as Checkbox from "@solidiom/checkbox"

;<Checkbox.Group>Contenido de Checkbox</Checkbox.Group>
```

## Instalación

Instala el paquete con `pnpm add @solidiom/checkbox`. El paquete requiere dependencias pares compatibles de `solid-js` y `@solidjs/web`.

## Partes

Checkbox expone 3 partes:

- **Group** — `data-part="group"`.
- **Root** — `data-part="root"`.
- **Indicator** — `data-part="indicator"`.

## Estilos

Checkbox lleva los atributos `data-scope="checkbox"` y `data-part` en cada parte para la selección CSS/receta. Los atributos de estado como `data-state`, `data-disabled` y `data-highlighted` se exponen donde corresponda.

## Interacción con teclado

| Tecla | Comportamiento                                  |
| ----- | ----------------------------------------------- |
| Space | Alterna el checkbox entre marcado y desmarcado. |

## Composición

Checkbox está diseñado para componerse con otras primitivas. Sus partes pueden combinarse con Field, Button u otras primitivas según sea necesario.

## Renderizado SSR e hidratación

Checkbox se renderiza como HTML semántico durante el renderizado en servidor. El comportamiento interactivo (manejadores de teclado, gestión de estado) se activa en la hidratación sin desplazamiento de diseño.
