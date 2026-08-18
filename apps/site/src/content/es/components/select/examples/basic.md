---
contentSchemaVersion: 1
title: Selector básico
description: Componente de selector con disparador y opciones.
keywords: [select, dropdown, picker, form]
locale: es
maturity: draft
product: Select
productLayer: component
status: draft
package: "@solidiom/recipes-css"
recipe: "select"
section: examples
exampleId: select-component-basic
source:
  path: apps/site/src/components/SelectExample.tsx
  export: SelectExample
  language: tsx
runnable: true
translationSourceHash: "8af00d0ebb43ad3be01f8e0c7b75e79d99d09e33d27dd8c718dc10ef3ada79c8"
translationStatus: "human-reviewed"
translationReviewedBy: "solidiom-team"
translationReviewedAt: "2026-08-18"
---

El componente Select es un envoltorio de receta estilizado alrededor del primitivo `@solidiom/select`. Añade composición, slots de estilo semántico y estado de valor controlado mientras delega toda la gestión de estado y el comportamiento de teclado al primitivo subyacente.

```tsx
import { createSignal } from "solid-js"
import { StyledSelect } from "@solidiom/recipes-css"

export function SelectExample() {
  const [value, setValue] = createSignal("")

  return (
    <StyledSelect
      trigger={<button class="solidiom-btn">{value() || "Elige un framework"}</button>}
      value={value}
      onValueChange={(v) => setValue(v as string)}
    >
      <div class="solidiom-select-item" data-value="react">
        React
      </div>
      <div class="solidiom-select-item" data-value="solid">
        Solid
      </div>
      <div class="solidiom-select-item" data-value="vue">
        Vue
      </div>
      <div class="solidiom-select-item" data-value="svelte">
        Svelte
      </div>
    </StyledSelect>
  )
}
```

## Estado de valor controlado

Usa `createSignal` para gestionar el valor del selector. Pasa el getter de la señal como `value` y el setter como `onValueChange` para habilitar el comportamiento de selección controlada.

## Opciones

Cada elemento hijo dentro de `StyledSelect` se convierte en una opción seleccionable. Usa el atributo `data-value` para asociar un valor con cada opción.
