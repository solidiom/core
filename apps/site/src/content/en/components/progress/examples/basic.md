---
contentSchemaVersion: 1
title: Basic progress
description: Progress bar component with determinate and indeterminate states.
keywords: [progress, bar, loading, indicator]
locale: en
maturity: draft
product: Progress
productLayer: component
status: draft
package: "@solidiom/recipes-css"
recipe: "progress"
section: examples
exampleId: progress-component-basic
source:
  path: apps/site/src/components/ProgressExample.tsx
  export: ProgressExample
  language: tsx
runnable: true
---

The Progress component indicates the completion status of a task.

```tsx
import { StyledProgress } from "@solidiom/recipes-css"

;<StyledProgress value={65} aria-label="Upload progress">
  <Progress.Indicator />
</StyledProgress>
```

## Indeterminate

For operations with unknown duration:

```tsx
import { StyledProgress } from "@solidiom/recipes-css"

;<StyledProgress value={null} aria-label="Loading">
  <Progress.Indicator />
</StyledProgress>
```
