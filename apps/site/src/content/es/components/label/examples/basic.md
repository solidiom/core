---
contentSchemaVersion: 1
title: Etiqueta básica
description: Componente de etiqueta con htmlFor enlazado, estados requeridos y no válidos.
keywords: [label, form, accessibility, field]
locale: es
maturity: draft
product: Label
productLayer: component
status: draft
package: "@solidiom/recipes-css"
recipe: "label"
section: examples
exampleId: label-component-basic
source:
  path: apps/site/src/components/LabelExample.tsx
  export: LabelExample
  language: tsx
runnable: true
translationSourceHash: "a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2"
translationStatus: draft
---

El componente Label proporciona etiquetas accesibles para campos de formulario.

```tsx
import { StyledLabel } from "@solidiom/recipes-css"
import * as Input from "@solidiom/input"

;<div>
  <StyledLabel htmlFor="username" required>
    Username
  </StyledLabel>
  <Input.Root id="username" type="text" />
</div>
```
