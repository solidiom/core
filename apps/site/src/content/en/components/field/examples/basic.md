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
runnable: true
---

The Field component provides a styled wrapper around form controls with label, description, and error message composition.

```tsx
import { StyledField, Field } from "@solidiom/recipes-css"
import { StyledInput } from "@solidiom/recipes-css"

;<StyledField>
  <Field.Label>Email address</Field.Label>
  <Field.Control>
    {(controlProps) => (
      <StyledInput {...controlProps()} placeholder="you@example.com" type="email" />
    )}
  </Field.Control>
  <Field.Description>We'll never share your email.</Field.Description>
</StyledField>
```

## With error state

Use the `invalid` prop to show error messages.

```tsx
;<StyledField invalid>
  <Field.Label>Email address</Field.Label>
  <Field.Control>
    {(controlProps) => (
      <StyledInput {...controlProps()} placeholder="you@example.com" type="email" invalid />
    )}
  </Field.Control>
  <Field.Error>Please enter a valid email address.</Field.Error>
</StyledField>
```

## Disabled state

```tsx
;<StyledField disabled>
  <Field.Label>Username</Field.Label>
  <Field.Control>
    {(controlProps) => (
      <StyledInput {...controlProps()} placeholder="johndoe" disabled />
    )}
  </Field.Control>
  <Field.Description>Cannot be changed after account creation.</Field.Description>
</StyledField>
```