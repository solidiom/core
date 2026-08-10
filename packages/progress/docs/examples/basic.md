---
contentSchemaVersion: 1
title: Progress - Basic usage
description: Basic progress example demonstrating core behavior.
keywords: [progress, basic, example]
locale: en
maturity: draft
product: Progress
productLayer: primitive
status: draft
package: "@solidiom/progress"
primitive: progress
section: examples
exampleId: progress-basic
source:
  path: packages/progress/src/index.tsx
  export: Root
  language: tsx
runnable: false
runnableReason: "No keyboard interaction declared in the accessibility contract."
---

```tsx
import * as Progress from "@solidiom/progress"

;<div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
  <Progress.Root value={65} aria-label="Upload progress">
    <Progress.Indicator />
  </Progress.Root>

  <Progress.Root value={100} aria-label="Complete">
    <Progress.Indicator />
  </Progress.Root>

  <Progress.Root value={null} aria-label="Loading">
    <Progress.Indicator />
  </Progress.Root>
</div>
```

Pass a numeric value (0 to `max`, default 100) for determinate progress, or `null` for indeterminate loading. The Root emits `data-state` of "loading" or "complete" and `data-percent` for styling the Indicator fill.
