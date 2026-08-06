---
contentSchemaVersion: 1
title: Basic progress
description: Progress component with determinate and indeterminate examples.
keywords: [progress, indicator, loading, determinate, indeterminate]
locale: en
maturity: draft
product: Progress
productLayer: component
status: draft
package: "@solidiom/recipes-css"
recipe: "progress"
section: examples
exampleId: progress-component-basic
runnable: true
---

The Progress component is a styled recipe wrapper around the `@solidiom/progress` primitive. It provides a visual linear progress indicator with semantic ARIA attributes for assistive technologies.

```tsx
import { StyledProgress, Progress } from "@solidiom/recipes-css"

;<StyledProgress value={65}>
  <Progress.Indicator />
</StyledProgress>
```

## Indeterminate progress

Use `value={null}` for an indeterminate loading state.

```tsx
;<StyledProgress value={null}>
  <Progress.Indicator />
</StyledProgress>
```

## With custom max

Control the maximum value for percentage calculation.

```tsx
;<StyledProgress value={75} max={200}>
  <Progress.Indicator />
</StyledProgress>
```