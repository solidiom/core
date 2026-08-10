---
contentSchemaVersion: 1
title: Basic spinner
description: Animated loading spinner component.
keywords: [spinner, loading, progress, feedback]
locale: en
maturity: draft
product: Spinner
productLayer: component
status: draft
package: "@solidiom/recipes-css"
recipe: "spinner"
section: examples
exampleId: spinner-component-basic
source:
  path: apps/site/src/components/SpinnerExample.tsx
  export: SpinnerExample
  language: tsx
runnable: true
---

The Spinner component provides a visual indication of ongoing operations.

```tsx
import { StyledSpinner } from "@solidiom/recipes-css"

;<StyledSpinner label="Loading" />
```
