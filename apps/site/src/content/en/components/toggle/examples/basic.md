---
contentSchemaVersion: 1
title: Basic toggle
description: Toggle button component with pressed and unpressed states.
keywords: [toggle, button, pressed, state]
locale: en
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
---

The Toggle component is a two-state button that can be pressed or released.

```tsx
import { StyledToggle } from "@solidiom/recipes-css"

;<StyledToggle defaultPressed>Bold</StyledToggle>
```
