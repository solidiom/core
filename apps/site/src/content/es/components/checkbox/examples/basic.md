---
contentSchemaVersion: 1
title: Basic checkbox
description: Checkbox component with controlled and uncontrolled examples.
keywords: [checkbox, form, input, selection, primitive]
locale: es
maturity: draft
product: Checkbox
productLayer: component
status: draft
package: "@solidiom/recipes-css"
recipe: "checkbox"
section: examples
exampleId: checkbox-component-basic
source:
  path: apps/site/src/components/CheckboxExample.tsx
  export: CheckboxExample
  language: tsx
runnable: true
translationSourceHash: "bb73254b3196f2f4fd0681544560f31e9446d194ac77098bb22619a299376b9a"
translationStatus: draft
---

El componente Checkbox es un wrapper de receta con estilos sobre el primitivo `@solidiom/checkbox`. Proporciona un botón de alternancia con estados marcado, desmarcado e indeterminado, soporte de teclado e integración con formularios.

```tsx
import { StyledCheckbox, Checkbox } from "@solidiom/recipes-css"

;<StyledCheckbox>
  <Checkbox.Box />
  <Checkbox.Label>I agree to the terms</Checkbox.Label>
</StyledCheckbox>
```

## Checkbox controlado

Usa un checkbox controlado cuando el estado marcado es gestionado por el estado del componente padre.

```tsx
import { createSignal } from "solid-js"
import { StyledCheckbox, Checkbox } from "@solidiom/recipes-css"

export function ControlledCheckbox() {
  const [checked, setChecked] = createSignal(false)

  return (
    <StyledCheckbox checked={checked()} onCheckedChange={(val) => setChecked(val === "checked")}>
      <Checkbox.Box />
      <Checkbox.Label>Controlled checkbox</Checkbox.Label>
    </StyledCheckbox>
  )
}
```
