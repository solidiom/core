---
contentSchemaVersion: 1
title: Basic input
description: Text input component with various types and states.
keywords: [input, text, form, field]
locale: en
maturity: draft
product: Input
productLayer: component
status: draft
package: "@solidiom/recipes-css"
recipe: "input"
section: examples
exampleId: input-component-basic
source:
  path: apps/site/src/components/InputExample.tsx
  export: InputExample
  language: tsx
runnable: true
---

The Input component is a styled recipe wrapper around the `@solidiom/input` primitive. It supports multiple input types and states including disabled and invalid.

```tsx
import { StyledInput } from "@solidiom/recipes-css"

;<StyledInput type="text" placeholder="Enter your name" />
```

## Email input

```tsx
import { StyledInput } from "@solidiom/recipes-css"

;<StyledInput type="email" placeholder="you@example.com" />
```

## Disabled state

```tsx
import { StyledInput } from "@solidiom/recipes-css"

;<StyledInput type="text" placeholder="Cannot edit" disabled />
```
