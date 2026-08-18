---
contentSchemaVersion: 1
title: Basic kbd
description: Kbd component for displaying keyboard shortcuts.
keywords: [kbd, keyboard, shortcut, display, primitive]
locale: es
maturity: draft
product: Kbd
productLayer: component
status: draft
package: "@solidiom/recipes-css"
recipe: "kbd"
section: examples
exampleId: kbd-component-basic
source:
  path: apps/site/src/components/KbdExample.tsx
  export: KbdExample
  language: tsx
  runnable: true
translationSourceHash: "5e4ff2d4ae7cea27094af7b9f278151cee912b3bd0d503cf493e8f341b9866eb"
translationStatus: "human-reviewed"
translationReviewedBy: "solidiom-team"
translationReviewedAt: "2026-08-18"
---

The Kbd component is a styled recipe wrapper around the `@solidiom/kbd` primitive. It renders a semantic keyboard key element for displaying shortcuts.

```tsx
import { StyledKbd } from "@solidiom/recipes-css"

;<StyledKbd>Ctrl</StyledKbd>
```
