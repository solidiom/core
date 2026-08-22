---
contentSchemaVersion: 1
title: Number Input
description: Entrada numérica con controles de incremento y decremento y formato adaptado a la configuración regional.
keywords: [number input, spinbutton, increment, decrement, numeric, locale, formatting]
locale: es
maturity: ga
product: Number Input
productLayer: primitive
status: draft
package: "@solidiom/number-input"
primitive: number-input
section: overview
notApplicable:
  - section: migration
    reason: No existe una API anterior; esta es la primera versión publicada.
  - section: testing
    reason: La guía de pruebas estándar cubre este primitivo.
translationSourceHash: "9784355a01519103b77a37a10d9434a3fa4d8b72c82841806b1ca52e2bc84047"
translationStatus: "draft"
---

Number Input es un campo numérico con controles de incremento y decremento y formato adaptado a la configuración regional. Implementa el patrón spinbutton de WAI-ARIA.

## Uso

Compón `Root`, `Input`, `IncrementButton` y `DecrementButton`. Los botones ajustan el valor y `Input` acepta entradas numéricas escritas.

```tsx
import * as NumberInput from "@solidiom/number-input"

;<NumberInput.Root>
  <NumberInput.DecrementButton>−</NumberInput.DecrementButton>
  <NumberInput.Input />
  <NumberInput.IncrementButton>+</NumberInput.IncrementButton>
</NumberInput.Root>
```

## Instalación

Instala el paquete con `pnpm add @solidiom/number-input`. El paquete requiere dependencias pares compatibles de `solid-js` y `@solidjs/web`.

## Partes

number-input expone 4 partes:

- **Root** — contenedor que implementa el patrón spinbutton y el formato adaptado a la configuración regional.
- **Input** — campo de texto numérico.
- **IncrementButton** — aumenta el valor según el paso.
- **DecrementButton** — reduce el valor según el paso.

## Estilos

number-input incluye los atributos `data-scope="number-input"` y `data-part` en cada parte para seleccionar estilos CSS o recetas.

## Teclado y comportamiento

number-input sigue el patrón spinbutton de WAI-ARIA con formato adaptado a la configuración regional.

| Tecla     | Comportamiento               |
| --------- | ---------------------------- |
| ArrowUp   | Incrementa el valor          |
| ArrowDown | Decrementa el valor          |
| Home      | Establece el valor mínimo    |
| End       | Establece el valor máximo    |
| PageUp    | Incrementa con un paso mayor |
| PageDown  | Decrementa con un paso mayor |

## Composición

Compón con primitivos de etiqueta y campo para crear un control numérico etiquetado y validado.

## SSR e hidratación

El campo se renderiza como HTML estático en el servidor; los manejadores de teclado del spinbutton y los botones de incremento/decremento se activan durante la hidratación.
