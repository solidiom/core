---
contentSchemaVersion: 1
title: Basic listbox
description: Listbox component with a scrollable list of selectable options.
keywords: [listbox, selection, list, options, form]
locale: en
maturity: draft
product: Listbox
productLayer: component
status: draft
package: "@solidiom/recipes-css"
recipe: "listbox"
section: examples
exampleId: listbox-component-basic
source:
  path: apps/site/src/components/ListboxExample.tsx
  export: ListboxExample
  language: tsx
  runnable: true
---

The Listbox component provides a scrollable list of options from which the user can select one or more items.

```tsx
import { StyledListbox, Listbox } from "@solidiom/recipes-css"

;<StyledListbox selectionMode="single" aria-label="Select a fruit">
  <Listbox.Item value="apple">Apple</Listbox.Item>
  <Listbox.Item value="banana">Banana</Listbox.Item>
  <Listbox.Item value="cherry">Cherry</Listbox.Item>
</StyledListbox>
```
