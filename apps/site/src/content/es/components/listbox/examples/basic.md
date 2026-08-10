---
contentSchemaVersion: 1
title: Listbox básico
description: Componente de listbox con una lista desplazable de opciones seleccionables.
keywords: [listbox, selection, list, options, form]
locale: es
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
translationSourceHash: "0767e8307043554b979080a79c1ded1ec5c20fc80edbff7381875b22d332a4e3"
translationStatus: draft
---

El componente Listbox proporciona una lista desplazable de opciones desde las cuales el usuario puede seleccionar uno o más elementos.

```tsx
import { StyledListbox, Listbox } from "@solidiom/recipes-css"

;<StyledListbox selectionMode="single" aria-label="Selecciona una fruta">
  <Listbox.Item value="apple">Manzana</Listbox.Item>
  <Listbox.Item value="banana">Plátano</Listbox.Item>
  <Listbox.Item value="cherry">Cereza</Listbox.Item>
</StyledListbox>
```
