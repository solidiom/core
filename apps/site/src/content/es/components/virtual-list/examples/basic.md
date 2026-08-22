---
contentSchemaVersion: 1
title: Basic virtual list
description: Virtual List component that renders only visible items for optimal performance.
keywords: [virtual-list, virtualization, performance, large-list, primitive]
locale: es
maturity: draft
product: Virtual List
productLayer: component
status: draft
package: "@solidiom/virtual-list"
section: examples
exampleId: virtual-list-component-basic
source:
  path: apps/site/src/components/VirtualListExample.tsx
  export: VirtualListExample
  language: tsx
  runnable: true
translationSourceHash: "ec6794a67bbbf4a527cb9e04f113236c0a939544b3d7a8cc33d2f0b7d9e6f756"
translationStatus: "human-reviewed"
translationReviewedBy: "solidiom-team"
translationReviewedAt: "2026-08-18"
---

El componente Virtual List solo renderiza los elementos visibles en una lista grande para un rendimiento óptimo.

```tsx
import * as VirtualList from "@solidiom/virtual-list"

;<VirtualList.Root totalCount={1000} itemSize={40} height="200px">
  {(items) =>
    items().map((item) => <VirtualList.Item item={item}>Item {item.index + 1}</VirtualList.Item>)
  }
</VirtualList.Root>
```
