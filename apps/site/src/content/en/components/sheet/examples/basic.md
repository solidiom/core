---
contentSchemaVersion: 1
title: Basic sheet
description: Sheet component with side-panel overlay dialog.
keywords: [sheet, side-panel, dialog, overlay, primitive]
locale: en
maturity: draft
product: Sheet
productLayer: component
status: draft
package: "@solidiom/recipes-css"
recipe: "sheet"
section: examples
exampleId: sheet-component-basic
source:
  path: apps/site/src/components/SheetExample.tsx
  export: SheetExample
  language: tsx
  runnable: true
---

The Sheet component is a styled recipe wrapper around the `@solidiom/sheet` primitive. It provides a side-panel overlay dialog that slides in from any edge.

```tsx
import { StyledSheet } from "@solidiom/recipes-css"
import * as Sheet from "@solidiom/sheet"

;<StyledSheet>
  <Sheet.Trigger>Open Sheet</Sheet.Trigger>
  <Sheet.Content side="right">
    <Sheet.Title>Sheet Title</Sheet.Title>
    <Sheet.Description>Content goes here.</Sheet.Description>
  </Sheet.Content>
</StyledSheet>
```
