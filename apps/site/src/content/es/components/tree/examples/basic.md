---
contentSchemaVersion: 1
title: Basic tree
description: Tree component with hierarchical items and expandable branches.
keywords: [tree, hierarchical, expandable, branches, primitive]
locale: es
maturity: draft
product: Tree
productLayer: component
status: draft
package: "@solidiom/tree"
section: examples
exampleId: tree-component-basic
source:
  path: apps/site/src/components/TreeExample.tsx
  export: TreeExample
  language: tsx
  runnable: true
translationSourceHash: "44af5a5dbabc9be7578708ed8769434f1ac2a8f92974088746d5aa356690d209"
translationStatus: "human-reviewed"
translationReviewedBy: "solidiom-team"
translationReviewedAt: "2026-08-18"
---

El componente Tree muestra una lista jerárquica de elementos con ramas expandibles.

```tsx
import * as Tree from "@solidiom/tree"

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
