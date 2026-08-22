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
translationStatus: "human-reviewed"
translationReviewedBy: "solidiom-team"
translationReviewedAt: "2026-08-18"
---

El componente Label proporciona etiquetas accesibles para campos de formulario.

```tsx
import * as Label from "@solidiom/label"
import * as Input from "@solidiom/input"

;<div>
  <Label.Root htmlFor="username" required>
    Username
  </Label.Root>
  <Input.Root id="username" type="text" />
</div>
```
