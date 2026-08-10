---
contentSchemaVersion: 1
title: Tree - Basic usage
description: Basic tree example demonstrating core behavior.
keywords: [tree, basic, example]
locale: en
maturity: draft
product: Tree
productLayer: primitive
status: draft
package: "@solidiom/tree"
primitive: tree
section: examples
exampleId: tree-basic
source:
  path: packages/tree/src/index.tsx
  export: Root
  language: tsx
runnable: true
---

```tsx
import * as Tree from "@solidiom/tree"

;<Tree.Root selectionMode="single" defaultExpandedIds={new Set(["src"])}>
  <Tree.Item id="src" textValue="src">
    <Tree.ItemIndicator>▶</Tree.ItemIndicator>
    src
    <Tree.Branch>
      <Tree.Item id="src-components" textValue="components">
        <Tree.ItemIndicator>▶</Tree.ItemIndicator>
        components
        <Tree.Branch>
          <Tree.Item id="src-components-button" textValue="button.tsx">
            <Tree.ItemIndicator>▶</Tree.ItemIndicator>
            button.tsx
          </Tree.Item>
          <Tree.Item id="src-components-modal" textValue="modal.tsx">
            <Tree.ItemIndicator>▶</Tree.ItemIndicator>
            modal.tsx
          </Tree.Item>
        </Tree.Branch>
      </Tree.Item>
      <Tree.Item id="src-utils" textValue="utils.ts">
        <Tree.ItemIndicator>▶</Tree.ItemIndicator>
        utils.ts
      </Tree.Item>
    </Tree.Branch>
  </Tree.Item>
</Tree.Root>
```

The Branch renders only when its parent Item is expanded. The ItemIndicator toggles expand/collapse on click. The tree supports keyboard navigation with Arrow keys, Home/End, and typeahead. Use `selectionMode="multiple"` for multi-select.
