---
contentSchemaVersion: 1
title: Keyboard shortcut display
description: Kbd elements for displaying keyboard key combinations.
keywords: [kbd, keyboard, shortcut, key, combination]
locale: en
maturity: draft
product: Kbd
productLayer: primitive
status: draft
package: "@solidiom/kbd"
primitive: kbd
section: examples
exampleId: kbd-shortcut
source:
  path: packages/kbd/src/index.tsx
  export: Root
  language: tsx
runnable: false
---

```tsx
import * as Kbd from "@solidiom/kbd"

;<p>
  Press <Kbd.Root>Ctrl</Kbd.Root> + <Kbd.Root>K</Kbd.Root> to open the command menu.
</p>
```

## Composition

Each `Kbd.Root` renders an independent `<kbd>` element. For multi-key shortcuts, use separate instances separated by text or operators.