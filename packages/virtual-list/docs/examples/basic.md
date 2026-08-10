---
contentSchemaVersion: 1
title: Virtual List - Basic usage
description: Basic virtual list example demonstrating core behavior.
keywords: [virtual-list, basic, example]
locale: en
maturity: draft
product: Virtual List
productLayer: primitive
status: draft
package: "@solidiom/virtual-list"
primitive: virtual-list
section: examples
exampleId: virtual-list-basic
source:
  path: packages/virtual-list/src/index.tsx
  export: Root
  language: tsx
runnable: false
runnableReason: "Runnable island to be created when this primitive is fully retrofitted."
---

```tsx
import * as VirtualList from "@solidiom/virtual-list"
import { For } from "solid-js"

const TOTAL_ITEMS = 10_000
const ITEM_HEIGHT = 40

;<VirtualList.Root
  totalCount={TOTAL_ITEMS}
  itemSize={ITEM_HEIGHT}
  height="400px"
>
  {(virtualItems) => (
    <For each={virtualItems()}>
      {(item) => (
        <VirtualList.Item item={item}>
          <div style={{ padding: "0 12px", display: "flex", alignItems: "center", height: `${item.size}px` }}>
            Item {item.index + 1}
          </div>
        </VirtualList.Item>
      )}
    </For>
  )}
</VirtualList.Root>
```

The render function receives an accessor of visible virtual items. Each VirtualList.Item is positioned absolutely within the scroll container. Only items within the viewport (plus overscan) are rendered, making it efficient for large datasets. Use `createVirtualizer()` for standalone usage outside the component tree.
