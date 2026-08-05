---
contentSchemaVersion: 1
title: Basic input
description: Text input and textarea with validation states and styling.
keywords: [input, textarea, form, styled, recipe]
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
  path: apps/site/src/components/InputComponentExample.tsx
  export: InputComponentExample
  language: tsx
runnable: true
---

The Input component provides styled text input and textarea with validation state hooks.

```tsx
import { StyledInput, StyledTextarea } from "@solidiom/recipes-css"

;<StyledInput placeholder="Enter your name" />
```

## With validation state

Use the `invalid` prop to indicate validation errors.

```tsx
;<StyledInput placeholder="Email address" type="email" invalid />
```

## Textarea

Use `StyledTextarea` for multi-line text input.

```tsx
;<StyledTextarea placeholder="Enter a message" rows={4} />
```

## Disabled state

```tsx
;<StyledInput placeholder="Read-only field" disabled />
```