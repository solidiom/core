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
translationSourceHash: "b44beedb54591fc74e86b5b45ed7a95ee973415a0081c1bc796db04373c028f3"
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
