---
contentSchemaVersion: 1
title: Basic label
description: Label component with linked htmlFor, required, and invalid states.
keywords: [label, form, accessibility, field]
locale: en
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
---

The Label component provides accessible labels for form fields.

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
