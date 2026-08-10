---
contentSchemaVersion: 1
title: Basic toggle
description: Toggle button component with pressed and unpressed states.
keywords: [toggle, button, pressed, state]
locale: es
maturity: draft
product: Toggle
productLayer: component
status: draft
package: "@solidiom/recipes-css"
recipe: "toggle"
section: examples
exampleId: toggle-component-basic
source:
  path: apps/site/src/components/ToggleExample.tsx
  export: ToggleExample
  language: tsx
runnable: true
translationSourceHash: "f477182cd4dfcba8047e1ddc641232e23ad9d3cadd04b93d3ac89bb0f1cb52d5"
translationStatus: draft
---

The Toggle component is a two-state button that can be pressed or released.

```tsx
import { StyledToggle } from "@solidiom/recipes-css"

;<StyledToggle defaultPressed>Bold</StyledToggle>
```
