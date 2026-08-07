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
translationSourceHash: "e7f0d635ef6ff51fe3a79f11d48fd710fc9ce36da63ca990394bd9c309c1446a"
translationStatus: draft
---

The Switch component is a styled recipe wrapper around the `@solidiom/switch` primitive. It provides a toggle control with on/off states, keyboard support (Space and Enter), and screen reader accessibility.

```tsx
import { StyledSwitch, Switch } from "@solidiom/recipes-css"

;<StyledSwitch>
  <Switch.Box />
  <Switch.Label>Enable notifications</Switch.Label>
</StyledSwitch>
```

## Controlled switch

Use controlled mode when the checked state is managed by parent state.

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