---
contentSchemaVersion: 1
title: Textarea - Basic usage
description: Basic textarea example demonstrating core behavior.
keywords: [textarea, basic, example]
locale: en
maturity: draft
product: Textarea
productLayer: primitive
status: draft
package: "@solidiom/textarea"
primitive: textarea
section: examples
exampleId: textarea-basic
source:
  path: packages/textarea/src/index.tsx
  export: Root
  language: tsx
runnable: false
runnableReason: "No keyboard interaction declared in the accessibility contract."
---

```tsx
import * as Textarea from "@solidiom/textarea"

;<Textarea.Root defaultValue="Textarea content" aria-label="Message" />
```
