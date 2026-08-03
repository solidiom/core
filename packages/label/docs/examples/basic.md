---
contentSchemaVersion: 1
title: Label - Basic usage
description: Label linked to an input field with state hints.
keywords: [label, basic, form, input]
locale: en
maturity: draft
product: Label
productLayer: primitive
status: draft
package: "@solidiom/label"
primitive: label
section: examples
exampleId: label-basic
source:
  path: packages/label/src/index.tsx
  export: Root
  language: tsx
runnable: false
---

```tsx
import * as Label from "@solidiom/label"
import * as Input from "@solidiom/input"

;<div>
  <Label.Root htmlFor="username" required>
    Username
  </Label.Root>
  <Input.Root id="username" type="text" required />
</div>
```

## States

The `required` prop on Label emits `data-required` for styling. The `disabled` and `invalid` props work the same way. These are purely presentational; the actual form validation state lives on the control.