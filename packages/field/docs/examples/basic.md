---
contentSchemaVersion: 1
title: Field - Basic usage
description: Basic field example demonstrating core behavior.
keywords: [field, basic, example]
locale: en
maturity: draft
product: Field
productLayer: primitive
status: draft
package: "@solidiom/field"
primitive: field
section: examples
exampleId: field-basic
source:
  path: packages/field/src/index.tsx
  export: Root
  language: tsx
runnable: false
runnableReason: "No keyboard interaction declared in the accessibility contract."
---

```tsx
import * as Field from "@solidiom/field"
import * as Input from "@solidiom/input"

;<Field.Root required invalid={false}>
  <Field.Label>Email address</Field.Label>

  <Field.Control>
    {(controlProps) => (
      <Input.Root {...controlProps()} type="email" placeholder="you@example.com" />
    )}
  </Field.Control>

  <Field.Description>We'll never share your email.</Field.Description>
  <Field.Error>Please enter a valid email address.</Field.Error>
</Field.Root>
```

The Field primitive wires ARIA relationships between label, control, description, and error. The Error is shown when `invalid` is true, and the Description is hidden in that case. The Control's render function receives props to spread on the underlying input element.
