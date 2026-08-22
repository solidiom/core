---
contentSchemaVersion: 1
title: Basic combobox
description: Combobox component with autocomplete and dropdown selection.
keywords: [combobox, autocomplete, selection, input, primitive]
locale: en
maturity: draft
product: Combobox
productLayer: component
status: draft
package: "@solidiom/recipes-css"
recipe: "combobox"
section: examples
exampleId: combobox-component-basic
source:
  path: apps/site/src/components/ComboboxExample.tsx
  export: ComboboxExample
  language: tsx
  runnable: true
---

The Combobox component is a styled recipe wrapper around the `@solidiom/combobox` primitive. It provides an autocomplete dropdown with filtering and keyboard navigation.

```tsx
import { StyledCombobox } from "@solidiom/recipes-css"
import * as Combobox from "@solidiom/combobox"

;<StyledCombobox>
  <Combobox.Input placeholder="Select an item..." />
  <Combobox.Content>
    <Combobox.Item value="item1">Item 1</Combobox.Item>
    <Combobox.Item value="item2">Item 2</Combobox.Item>
  </Combobox.Content>
</StyledCombobox>
```
