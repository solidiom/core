---
contentSchemaVersion: 1
title: Basic field
description: Form field with label, control, description, and error state styling.
keywords: [field, form, label, validation, error, styled]
locale: en
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
---

The Field component wraps a form control with a label, description, and validation message for accessible form fields.

```tsx
import { StyledField } from "@solidiom/recipes-css"
import * as Field from "@solidiom/field"

;<StyledField required>
  <Field.Label>Email</Field.Label>
  <Field.Description>We'll never share your email.</Field.Description>
  <Field.Control>
    {(cp) => <input type="email" {...cp()} placeholder="you@example.com" />}
  </Field.Control>
</StyledField>
```
