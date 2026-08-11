---
contentSchemaVersion: 1
title: Basic virtual list
description: Virtual List component that renders only visible items for optimal performance.
keywords: [virtual-list, virtualization, performance, large-list, primitive]
locale: en
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
---

The Virtual List component renders only the visible items in a large list for optimal performance.

```tsx
import { StyledVirtualList, VirtualList } from "@solidiom/recipes-css"

;<VirtualList.Root totalCount={1000} itemSize={40} height="200px">
  {(items) =>
    items().map((item) => <VirtualList.Item item={item}>Item {item.index + 1}</VirtualList.Item>)
  }
</VirtualList.Root>
```
