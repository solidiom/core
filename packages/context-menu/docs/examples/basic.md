---
contentSchemaVersion: 1
title: Context Menu - Basic usage
description: Basic context menu example demonstrating core behavior.
keywords: [context-menu, basic, example]
locale: en
maturity: draft
product: Context Menu
productLayer: primitive
status: draft
package: "@solidiom/context-menu"
primitive: context-menu
section: examples
exampleId: context-menu-basic
source:
  path: packages/context-menu/src/index.tsx
  export: Root
  language: tsx
runnable: true
---

```tsx
import * as ContextMenu from "@solidiom/context-menu"
import { createSignal } from "solid-js"

const [showLineNumbers, setShowLineNumbers] = createSignal(true)
const [fontSize, setFontSize] = createSignal("medium")

;<ContextMenu.Root>
  <ContextMenu.Trigger>
    <div>Right-click anywhere in this area</div>
  </ContextMenu.Trigger>

  <ContextMenu.Content>
    <ContextMenu.Item onSelect={() => console.log("Cut")}>Cut</ContextMenu.Item>
    <ContextMenu.Item onSelect={() => console.log("Copy")}>Copy</ContextMenu.Item>
    <ContextMenu.Item onSelect={() => console.log("Paste")} disabled>
      Paste
    </ContextMenu.Item>

    <ContextMenu.Separator />

    <ContextMenu.CheckboxItem
      checked={showLineNumbers()}
      onCheckedChange={setShowLineNumbers}
    >
      Show Line Numbers
    </ContextMenu.CheckboxItem>

    <ContextMenu.RadioGroup value={fontSize()} onValueChange={setFontSize}>
      <ContextMenu.RadioItem value="small">Small</ContextMenu.RadioItem>
      <ContextMenu.RadioItem value="medium">Medium</ContextMenu.RadioItem>
      <ContextMenu.RadioItem value="large">Large</ContextMenu.RadioItem>
    </ContextMenu.RadioGroup>
  </ContextMenu.Content>
</ContextMenu.Root>
```

The context menu opens on right-click. Checkbox items toggle independently, while radio items are mutually exclusive within their group.
