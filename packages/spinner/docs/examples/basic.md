---
contentSchemaVersion: 1
title: Spinner - Basic usage
description: Basic spinner example demonstrating core behavior.
keywords: [spinner, basic, example]
locale: en
maturity: draft
product: Spinner
productLayer: primitive
status: draft
package: "@solidiom/spinner"
primitive: spinner
section: examples
exampleId: spinner-basic
source:
  path: packages/spinner/src/index.tsx
  export: Root
  language: tsx
runnable: false
runnableReason: "No keyboard interaction declared in the accessibility contract."
---

```tsx
import * as Spinner from "@solidiom/spinner"

;<Spinner.Root label="Loading data..." />

;<Spinner.Root label="Processing">
  <div class="spinner-visual">
    <span class="spinner-dot" />
  </div>
</Spinner.Root>
```

The spinner renders a `<span>` with `role="status"` and announces its `label` to screen readers. Default label is "Loading". Provide custom children for your own spinner visual while keeping the accessible wrapper.
