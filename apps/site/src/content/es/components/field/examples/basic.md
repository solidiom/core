---
contentSchemaVersion: 1
title: Campo básico
description: Campo de formulario con etiqueta, control, descripción y estilos de estado de error.
keywords: [field, form, label, validation, error, styled]
locale: es
maturity: draft
product: Field
productLayer: component
status: draft
package: "@solidiom/recipes-css"
recipe: "field"
section: examples
exampleId: field-component-basic
source:
  path: apps/site/src/components/FieldExample.tsx
  export: FieldExample
  language: tsx
  runnable: true
translationSourceHash: "1a851ac24229b111d236019b4b59cad5a56b4a23d321484f004bdfcefed3c90f"
translationStatus: draft
---

El componente Field envuelve un control de formulario con una etiqueta, descripción y mensaje de validación para campos de formulario accesibles.

```tsx
import { StyledField, Field } from "@solidiom/recipes-css"

;<StyledField required>
  <Field.Label>Email</Field.Label>
  <Field.Description>Nunca compartiremos su email.</Field.Description>
  <Field.Control>
    {(cp) => <input type="email" {...cp()} placeholder="usted@ejemplo.com" />}
  </Field.Control>
</StyledField>
```
