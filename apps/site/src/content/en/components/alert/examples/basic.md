---
contentSchemaVersion: 1
title: Basic alert
description: Alert primitive with info, success, warning, and error types using recipe styles.
keywords: [alert, notification, feedback, variant]
locale: en
maturity: draft
product: Alert
productLayer: component
status: draft
package: "@solidiom/recipes-css"
recipe: "alert"
section: examples
exampleId: alert-component-basic
source:
  path: apps/site/src/components/AlertExample.tsx
  export: AlertExample
  language: tsx
runnable: true
---

The executable example uses the `@solidiom/alert` primitive and the CSS recipe stylesheet. The primitive owns the `type` values and parts; the recipe stylesheet supplies the visual styling.

```tsx
import * as Alert from "@solidiom/alert"
import "@solidiom/recipes-css/styles/alert.css"

;<Alert.Root type="info">
  <Alert.Title>Information</Alert.Title>
  <Alert.Description>A new software update is available.</Alert.Description>
</Alert.Root>
```

Supported primitive types used by the example are `info`, `success`, `warning`, and `error`.
