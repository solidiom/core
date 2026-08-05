---
contentSchemaVersion: 1
title: Basic select
description: Select component with trigger and item options.
keywords: [select, dropdown, picker, form]
locale: en
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
---

The Select component is a styled recipe wrapper around the `@solidiom/select` primitive. It adds composition, semantic styling slots, and controlled value state while delegating all state management and keyboard behavior to the underlying primitive.

```tsx
import { createSignal } from "solid-js"
import { StyledSelect } from "@solidiom/recipes-css"

export function SelectExample() {
  const [value, setValue] = createSignal("")

  return (
    <StyledSelect
      trigger={
        <button class="solidiom-btn">
          {value() || "Choose a framework"}
        </button>
      }
      value={value}
      onValueChange={(v) => setValue(v as string)}
    >
      <div class="solidiom-select-item" data-value="react">React</div>
      <div class="solidiom-select-item" data-value="solid">Solid</div>
      <div class="solidiom-select-item" data-value="vue">Vue</div>
      <div class="solidiom-select-item" data-value="svelte">Svelte</div>
    </StyledSelect>
  )
}
```

## Controlled value state

Use `createSignal` to manage the select's value. Pass the signal's getter as `value` and the setter as `onValueChange` to enable controlled selection behavior.

## Items

Each child element inside the `StyledSelect` becomes a selectable item. Use the `data-value` attribute to associate a value with each option.