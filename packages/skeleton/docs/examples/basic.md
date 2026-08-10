---
contentSchemaVersion: 1
title: Skeleton - Basic usage
description: Basic skeleton example demonstrating core behavior.
keywords: [skeleton, basic, example]
locale: en
maturity: draft
product: Skeleton
productLayer: primitive
status: draft
package: "@solidiom/skeleton"
primitive: skeleton
section: examples
exampleId: skeleton-basic
source:
  path: packages/skeleton/src/index.tsx
  export: Root
  language: tsx
runnable: false
runnableReason: "No keyboard interaction declared in the accessibility contract."
---

```tsx
import * as Skeleton from "@solidiom/skeleton"

;<div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
  <Skeleton.Root variant="text" width={300} />
  <Skeleton.Root variant="rectangular" width={300} height={100} />
  <Skeleton.Root variant="circular" width={40} height={40} />

  <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
    <Skeleton.Root variant="circular" width={48} height={48} />
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <Skeleton.Root variant="text" width={140} />
      <Skeleton.Root variant="text" width={200} />
    </div>
  </div>
</div>
```

The skeleton is purely decorative and marked `aria-hidden="true"`. Use the `variant` prop ("text", "circular", "rectangular") and explicit `width`/`height` to match the shapes of content being loaded.
