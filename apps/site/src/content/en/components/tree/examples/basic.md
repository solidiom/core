---
contentSchemaVersion: 1
title: Basic tree
description: Tree component with hierarchical items and expandable branches.
keywords: [tree, hierarchical, expandable, branches, primitive]
locale: en
maturity: draft
product: Tree
productLayer: component
status: draft
package: "@solidiom/recipes-css"
recipe: "tree"
section: examples
exampleId: tree-component-basic
source:
  path: apps/site/src/components/TreeExample.tsx
  export: TreeExample
  language: tsx
  runnable: true
---

The Tree component displays a hierarchical list of items with expandable branches.

```tsx
import { StyledTree, Tree } from "@solidiom/recipes-css"

;<Tree.Root>
  <Tree.Item id="folder">
    <Tree.ItemIndicator>📁</Tree.ItemIndicator>
    Folder
    <Tree.Branch>
      <Tree.Item id="file">
        <Tree.ItemIndicator>📄</Tree.ItemIndicator>
        File.txt
      </Tree.Item>
    </Tree.Branch>
  </Tree.Item>
</Tree.Root>
```
