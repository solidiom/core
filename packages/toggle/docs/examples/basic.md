---
contentSchemaVersion: 1
title: Toggle - Basic usage
description: Basic toggle example demonstrating core behavior.
keywords: [toggle, basic, example]
locale: en
maturity: draft
product: Toggle
productLayer: primitive
status: draft
package: "@solidiom/toggle"
primitive: toggle
section: examples
exampleId: toggle-basic
source:
  path: packages/toggle/src/index.tsx
  export: Root
  language: tsx
runnable: true
---

```tsx
import * as Toggle from "@solidiom/toggle"

;<Toggle.Root
  defaultPressed={false}
  onPressedChange={(pressed) => console.log(pressed)}
>
  Bold
</Toggle.Root>

;<Toggle.Root defaultPressed={true}>
  Italic
</Toggle.Root>

;<Toggle.Root disabled>
  Strikethrough
</Toggle.Root>
```

The toggle is a two-state button with `aria-pressed`. Use `pressed` for controlled mode or `defaultPressed` for uncontrolled. The Root emits `data-state` of "on" or "off" for styling.
