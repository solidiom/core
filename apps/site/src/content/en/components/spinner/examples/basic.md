---
contentSchemaVersion: 1
title: Basic spinner
description: Spinner component with loading indicator examples.
keywords: [spinner, loading, indicator, primitive]
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

The Spinner component is a styled recipe wrapper around the `@solidiom/spinner` primitive. It provides a lightweight loading indicator with an accessible status role, announced to screen readers.

```tsx
import { StyledSpinner } from "@solidiom/recipes-css"

;<StyledSpinner>Loading...</StyledSpinner>
```

## With custom label

Control the accessible label announced by screen readers.

```tsx
import { StyledSpinner } from "@solidiom/recipes-css"

;<StyledSpinner label="Saving changes...">Saving...</StyledSpinner>
```