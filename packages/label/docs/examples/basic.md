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

;<div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
  <Label.Root htmlFor="username" required>
    Username
  </Label.Root>
  <Input.Root id="username" type="text" required placeholder="Enter username" />

  <Label.Root htmlFor="email" invalid>
    Email
  </Label.Root>
  <Input.Root id="email" type="email" invalid placeholder="Invalid email" />

  <Label.Root htmlFor="disabled-field" disabled>
    Disabled Field
  </Label.Root>
  <Input.Root id="disabled-field" type="text" disabled placeholder="Cannot edit" />
</div>
```

## States

The `required` prop emits `data-required`, the `disabled` prop emits `data-disabled`, and the `invalid` prop emits `data-invalid` as semantic data attributes for styling hooks. These are purely presentational; the actual form validation state lives on the control element.
