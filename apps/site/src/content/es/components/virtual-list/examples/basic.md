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
package: "@solidiom/recipes-css"
recipe: "virtual-list"
section: examples
exampleId: virtual-list-component-basic
source:
  path: apps/site/src/components/VirtualListExample.tsx
  export: VirtualListExample
  language: tsx
  runnable: true
translationSourceHash: "1761fb4cab1470222b2957ad5f6ed6ca56b8d4f62e6a2dda9bc03a638065816e"
translationStatus: draft
---

El componente Virtual List solo renderiza los elementos visibles en una lista grande para un rendimiento óptimo.

```tsx
import { StyledVirtualList, VirtualList } from "@solidiom/recipes-css"

;<VirtualList.Root totalCount={1000} itemSize={40} height="200px">
  {(items) =>
    items().map((item) => <VirtualList.Item item={item}>Item {item.index + 1}</VirtualList.Item>)
  }
</VirtualList.Root>
```
