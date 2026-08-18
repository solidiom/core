---
contentSchemaVersion: 1
title: Button
description: Control clickeable para acciones con soporte de carga, deshabilitado y variantes.
keywords: [button, clickeable, acción, carga, deshabilitado, enviar, alternar]
locale: es
maturity: ga
product: Button
productLayer: primitive
status: draft
package: "@solidiom/button"
primitive: button
section: overview
notApplicable:
  - section: composition
    reason: Button es un primitivo autónomo sin sub-primitivos compuestos.
  - section: relationships
    reason: Button no tiene primitivos hermanos; se usa dentro de otras composiciones pero no posee un contrato inter-primitivo.
  - section: migration
    reason: Button no tiene una API previa; esta es la primera versión publicada.
  - section: testing
    reason: La guía estándar de pruebas de botones se cubre en la guía compartida de pruebas. No existe comportamiento no obvio específico del primitivo más allá de la activación por teclado documentada arriba.
translationSourceHash: "a750e8c13bc5dab018ce823e4a37fccdb1130d40e3a10c2823fff3c02ec476d3"
translationStatus: "human-reviewed"
translationReviewedBy: "solidiom-team"
translationReviewedAt: "2026-08-18"
---

Button renderiza un control clickeable para acciones con semántica accesible. Soporta un estado de carga, estado deshabilitado y múltiples partes de componente: `Root`, `IconButton`, `ToggleButton` y `ButtonGroup`.

## Uso

Button expone cuatro partes. Usa `Root` para botones de acción estándar, `IconButton` para botones solo con icono, `ToggleButton` para estados alternables y `ButtonGroup` para diseños de botones agrupados.

```tsx
import * as Button from "@solidiom/button"

;<Button.Root onClick={() => alert("clickeado")}>Haz clic</Button.Root>
```

## Instalación

Instala el paquete con `pnpm add @solidiom/button`. El paquete requiere dependencias pares compatibles de `solid-js` y `@solidjs/web`.

## Partes

### Root

El botón estándar. Acepta props `disabled`, `loading`, `type`, `onClick` y `aria-label`.

| Prop         | Tipo                              | Default    | Descripción                                                        |
| ------------ | --------------------------------- | ---------- | ------------------------------------------------------------------ |
| `children`   | `JSX.Element`                     | —          | Contenido del botón.                                               |
| `disabled`   | `boolean`                         | —          | Si el botón está deshabilitado.                                    |
| `loading`    | `boolean`                         | —          | Si el botón está en estado de carga. Establece `aria-busy="true"`. |
| `type`       | `"button" \| "submit" \| "reset"` | `"button"` | Tipo nativo del botón.                                             |
| `onClick`    | `() => void`                      | —          | Manejador de clic.                                                 |
| `aria-label` | `string`                          | —          | Etiqueta accesible para el botón.                                  |

### IconButton

Un botón destinado a contenido solo con icono. Requiere `aria-label` y envuelve los hijos en `aria-hidden="true"`.

### ToggleButton

Un botón que mantiene un estado presionado. Gestiona `aria-pressed` y llama a `onPressedChange` al activarse.

### ButtonGroup

Un contenedor de diseño que agrupa botones con `role="group"` y soporte de orientación.

## Estilos

Button lleva los atributos `data-scope="button"` y `data-part` para seleccionar:

- `Root`: `data-part="root"`, con `data-disabled` y `data-loading` cuando correspondan
- `IconButton`: `data-part="root"` (envuelve Root)
- `ToggleButton`: `data-part="toggle"`, con `data-state="on"` o `data-state="off"`
- `ButtonGroup`: `data-part="group"`, con `data-orientation`

Aplica tu receta visual — variantes (default, destructive, outline, secondary, ghost) y tamaños (default, sm, lg, icon) — usando estos atributos data para seleccionar.

## Interacción con teclado

Button soporta la activación estándar de botones:

- **Enter** o **Space** activa el botón cuando tiene foco.
- Los estados deshabilitado y de carga previenen la activación.

## Renderizado SSR e hidratación

Button se renderiza como un elemento nativo `<button>`. No requiere hidratación en el cliente para renderizado estático. El estado interactivo (`loading`, `disabled`) se gestiona a través de props.
