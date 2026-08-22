---
contentSchemaVersion: 1
title: Basic toolbar
description: Toolbar component with action buttons, toggle buttons, and separators.
keywords: [toolbar, actions, toggle, separator, component]
locale: en
maturity: draft
product: Toolbar
productLayer: component
status: draft
package: "@solidiom/recipes-css"
recipe: "toolbar"
section: examples
exampleId: toolbar-component-basic
source:
  path: apps/site/src/components/ToolbarExample.tsx
  export: ToolbarExample
  language: tsx
runnable: true
---

The Toolbar component provides a container for grouping action buttons, toggle buttons, and separators.

```tsx
import { StyledToolbar } from "@solidiom/recipes-css"
import * as Toolbar from "@solidiom/toolbar"

;<StyledToolbar>
  <Toolbar.Button>Cut</Toolbar.Button>
  <Toolbar.Button>Copy</Toolbar.Button>
  <Toolbar.Button>Paste</Toolbar.Button>
  <Toolbar.Separator />
  <Toolbar.ToggleGroup type="single">
    <Toolbar.ToggleItem pressed={false}>Bold</Toolbar.ToggleItem>
    <Toolbar.ToggleItem pressed={false}>Italic</Toolbar.ToggleItem>
  </Toolbar.ToggleGroup>
</StyledToolbar>
```
