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

;<Skeleton.Root>Skeleton content</Skeleton.Root>
```
