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
package: "@solidiom/listbox"
section: examples
exampleId: listbox-component-basic
source:
  path: apps/site/src/components/ListboxExample.tsx
  export: ListboxExample
  language: tsx
  runnable: true
translationSourceHash: "80b853973a307192db6490444ca5668feb4b658cfd4080fa6afe9333a97a345b"
translationStatus: "human-reviewed"
translationReviewedBy: "solidiom-team"
translationReviewedAt: "2026-08-18"
---

El componente Listbox proporciona una lista desplazable de opciones desde las cuales el usuario puede seleccionar uno o más elementos.

```tsx
import * as Listbox from "@solidiom/listbox"

;<Listbox.Root selectionMode="single" aria-label="Selecciona una fruta">
  <Listbox.Item value="apple">Manzana</Listbox.Item>
  <Listbox.Item value="banana">Plátano</Listbox.Item>
  <Listbox.Item value="cherry">Cereza</Listbox.Item>
</Listbox.Root>
```
