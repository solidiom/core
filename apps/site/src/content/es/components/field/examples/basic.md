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
runnable: true
translationSourceHash: "e1723eecacef0e5663071bd7c53dd5e19fe8a98d6d5eab96d1850b94cb5c2c41"
translationStatus: draft
---

El componente Field proporciona un envoltorio estilizado alrededor de los controles de formulario con etiqueta, descripción y composición de mensajes de error.

```tsx
import { StyledField, Field } from "@solidiom/recipes-css"
import { StyledInput } from "@solidiom/recipes-css"

;<StyledField>
  <Field.Label>Dirección de email</Field.Label>
  <Field.Control>
    {(controlProps) => (
      <StyledInput {...controlProps()} placeholder="you@example.com" type="email" />
    )}
  </Field.Control>
  <Field.Description>Nunca compartiremos tu email.</Field.Description>
</StyledField>
```

## Con estado de error

Usa la propiedad `invalid` para mostrar mensajes de error.

```tsx
;<StyledField invalid>
  <Field.Label>Dirección de email</Field.Label>
  <Field.Control>
    {(controlProps) => (
      <StyledInput {...controlProps()} placeholder="you@example.com" type="email" invalid />
    )}
  </Field.Control>
  <Field.Error>Por favor ingresa una dirección de email válida.</Field.Error>
</StyledField>
```

## Estado deshabilitado

```tsx
;<StyledField disabled>
  <Field.Label>Nombre de usuario</Field.Label>
  <Field.Control>
    {(controlProps) => (
      <StyledInput {...controlProps()} placeholder="johndoe" disabled />
    )}
  </Field.Control>
  <Field.Description>No puede ser cambiado después de la creación de la cuenta.</Field.Description>
</StyledField>
```