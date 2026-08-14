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
translationSourceHash: "acc87c194e7a3569006869cc89d73cee199bcc61cbf3cbefa66a3f424c5259a4"
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
