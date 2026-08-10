---
contentSchemaVersion: 1
title: Input - Basic usage
description: Basic input example demonstrating core behavior.
keywords: [input, basic, example]
locale: en
maturity: draft
product: Input
productLayer: primitive
status: draft
package: "@solidiom/input"
primitive: input
section: examples
exampleId: input-basic
source:
  path: packages/input/src/index.tsx
  export: Root
  language: tsx
runnable: false
runnableReason: "No keyboard interaction declared in the accessibility contract."
---

```tsx
import * as Input from "@solidiom/input"

;<div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
  <Input.Root type="text" placeholder="Enter your name" />
  <Input.Root type="email" placeholder="you@example.com" required />
  <Input.Root type="password" placeholder="••••••••" />
  <Input.Root type="text" disabled placeholder="Cannot edit" />
  <Input.Root type="text" invalid placeholder="Has error" aria-invalid="true" />
</div>
```

The input supports all standard HTML input types. Use the `invalid` prop to mark a field with validation errors, which sets `aria-invalid="true"`. Compose with `@solidiom/field` for automatic label/description/error wiring.
