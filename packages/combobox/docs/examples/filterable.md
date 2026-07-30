---
contentSchemaVersion: 1
title: Filterable combobox
description: A filterable fruit list that demonstrates the complete Combobox composition with keyboard navigation.
locale: en
maturity: beta
product: Combobox
productLayer: primitive
status: published
package: "@solidiom/combobox"
primitive: combobox
section: examples
exampleId: combobox-filterable
source:
  path: apps/site/src/components/ComboboxExample.tsx
  export: ComboboxExample
  language: tsx
runnable: true
---

The live example filters a fruit list as you type. Use <kbd>ArrowDown</kbd> and <kbd>ArrowUp</kbd> to navigate items, <kbd>Enter</kbd> to select the highlighted item, and <kbd>Escape</kbd> to close the listbox. The input retains focus throughout the interaction using the active-descendant pattern.

The filter logic runs in the consumer, not inside the primitive. This keeps Combobox agnostic to matching strategy so consumers can implement fuzzy, substring, or server-side search.
