---
contentSchemaVersion: 1
title: Basic toolbar
description: Toolbar component with action groups and navigation examples.
keywords: [toolbar, tools, actions, group, component]
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

The Toolbar component is a styled recipe wrapper around the `@solidiom/toolbar` primitive. It provides a toolbar with action groups and keyboard navigation using roving tabindex.

```tsx
import { StyledToolbar } from "@solidiom/recipes-css"

;<StyledToolbar>
  <StyledToolbar.Button>Undo</StyledToolbar.Button>
  <StyledToolbar.Button>Redo</StyledToolbar.Button>
  <StyledToolbar.Separator />
  <StyledToolbar.Button>Save</StyledToolbar.Button>
</StyledToolbar>
```

## With groups

Separate actions into groups with visual separators.

```tsx
import { StyledToolbar } from "@solidiom/recipes-css"

;<StyledToolbar>
  <StyledToolbar.Button>Cut</StyledToolbar.Button>
  <StyledToolbar.Button>Copy</StyledToolbar.Button>
  <StyledToolbar.Button>Paste</StyledToolbar.Button>
  <StyledToolbar.Separator />
  <StyledToolbar.Button>Bold</StyledToolbar.Button>
  <StyledToolbar.Button>Italic</StyledToolbar.Button>
  <StyledToolbar.Button>Underline</StyledToolbar.Button>
</StyledToolbar>
```
