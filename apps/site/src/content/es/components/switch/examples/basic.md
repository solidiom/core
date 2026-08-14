---
contentSchemaVersion: 1
title: Basic switch
description: Switch component with controlled and uncontrolled examples.
keywords: [switch, toggle, form, input, primitive]
locale: es
maturity: draft
product: Switch
productLayer: component
status: draft
package: "@solidiom/recipes-css"
recipe: "switch"
section: examples
exampleId: switch-component-basic
source:
  path: apps/site/src/components/SwitchExample.tsx
  export: SwitchExample
  language: tsx
runnable: true
translationSourceHash: "1fdecb888c7b71c53668c85aaa9fad308be82929ba16a00f676c416f8a4e374e"
translationStatus: draft
---

El componente Switch es un wrapper de receta con estilos sobre el primitivo `@solidiom/switch`. Proporciona un control de alternancia con estados encendido/apagado, soporte de teclado (Space y Enter) y accesibilidad para lector de pantalla.

```tsx
import { StyledSwitch, Switch } from "@solidiom/recipes-css"

;<StyledSwitch>
  <Switch.Box />
  <Switch.Label>Enable notifications</Switch.Label>
</StyledSwitch>
```

## Switch controlado

Usa el modo controlado cuando el estado marcado es gestionado por el estado del componente padre.

```tsx
import { createSignal } from "solid-js"
import { StyledSwitch, Switch } from "@solidiom/recipes-css"

export function ControlledSwitch() {
  const [checked, setChecked] = createSignal(false)

  return (
    <StyledSwitch checked={checked()} onCheckedChange={setChecked}>
      <Switch.Box />
      <Switch.Label>Dark mode</Switch.Label>
    </StyledSwitch>
  )
}
```
