---
contentSchemaVersion: 1
title: Basic sheet
description: Sheet component with side-panel overlay dialog.
keywords: [sheet, side-panel, dialog, overlay, primitive]
locale: es
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
translationSourceHash: "096a9ccba3fb37b6c57da6fcb742891fe0bab5f1a7b989d730c0cb5e9c472a96"
translationStatus: "human-reviewed"
translationReviewedBy: "solidiom-team"
translationReviewedAt: "2026-08-18"
---

The Sheet component is a styled recipe wrapper around the `@solidiom/sheet` primitive. It provides a side-panel overlay dialog that slides in from any edge.

```tsx
import { StyledSheet, Sheet } from "@solidiom/recipes-css"

;<StyledSheet>
  <Sheet.Trigger>Open Sheet</Sheet.Trigger>
  <Sheet.Content side="right">
    <Sheet.Title>Sheet Title</Sheet.Title>
    <Sheet.Description>Content goes here.</Sheet.Description>
  </Sheet.Content>
</StyledSheet>
```
