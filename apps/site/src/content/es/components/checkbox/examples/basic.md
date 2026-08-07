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
translationSourceHash: "d84ebb42ff432b3c34664f79baa117c6f1340c62dafc6b1bba3adafba6fc94bc"
translationStatus: draft
---

The Checkbox component is a styled recipe wrapper around the `@solidiom/checkbox` primitive. It provides a toggle button with checked, unchecked, and indeterminate states, keyboard support, and form integration.

```tsx
import { StyledCheckbox, Checkbox } from "@solidiom/recipes-css"

;<StyledCheckbox>
  <Checkbox.Box />
  <Checkbox.Label>I agree to the terms</Checkbox.Label>
</StyledCheckbox>
```

## Controlled checkbox

Use a controlled checkbox when the checked state is managed by parent state.

```tsx
import { createSignal } from "solid-js"
import { StyledCheckbox, Checkbox } from "@solidiom/recipes-css"

export function ControlledCheckbox() {
  const [checked, setChecked] = createSignal(false)

  return (
    <StyledCheckbox
      checked={checked()}
      onCheckedChange={(val) => setChecked(val === "checked")}
    >
      <Checkbox.Box />
      <Checkbox.Label>Controlled checkbox</Checkbox.Label>
    </StyledCheckbox>
  )
}
```