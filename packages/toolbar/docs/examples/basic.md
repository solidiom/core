---
contentSchemaVersion: 1
title: Toolbar - Basic usage
description: Basic toolbar example demonstrating core behavior.
keywords: [toolbar, basic, example]
locale: en
maturity: draft
product: Toolbar
productLayer: primitive
status: draft
package: "@solidiom/toolbar"
primitive: toolbar
section: examples
exampleId: toolbar-basic
source:
  path: packages/toolbar/src/index.tsx
  export: Root
  language: tsx
runnable: true
---

```tsx
import * as Toolbar from "@solidiom/toolbar"
import { createSignal } from "solid-js"

const [bold, setBold] = createSignal(false)
const [italic, setItalic] = createSignal(false)

;<Toolbar.Root orientation="horizontal">
  <Toolbar.Button onClick={() => console.log("Undo")}>Undo</Toolbar.Button>
  <Toolbar.Button onClick={() => console.log("Redo")}>Redo</Toolbar.Button>

  <Toolbar.Separator />

  <Toolbar.ToggleGroup>
    <Toolbar.ToggleItem pressed={bold()} onPressedChange={setBold}>
      Bold
    </Toolbar.ToggleItem>
    <Toolbar.ToggleItem pressed={italic()} onPressedChange={setItalic}>
      Italic
    </Toolbar.ToggleItem>
  </Toolbar.ToggleGroup>

  <Toolbar.Separator />

  <Toolbar.Button disabled>Export</Toolbar.Button>
</Toolbar.Root>
```

The toolbar provides `role="toolbar"` and groups actions. Use Button for simple actions, Separator for visual grouping, and ToggleGroup/ToggleItem for stateful tools.
