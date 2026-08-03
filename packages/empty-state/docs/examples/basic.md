---
contentSchemaVersion: 1
title: Empty State - Basic usage
description: Basic empty state example demonstrating core behavior.
keywords: [empty-state, basic, example]
locale: en
maturity: draft
product: Empty State
productLayer: primitive
status: draft
package: "@solidiom/empty-state"
primitive: empty-state
section: examples
exampleId: empty-state-basic
source:
  path: packages/empty-state/src/index.tsx
  export: Root
  language: tsx
runnable: false
runnableReason: "No keyboard interaction declared in the accessibility contract."
---

```tsx
import * as EmptyState from "@solidiom/empty-state"

;<EmptyState.Root>Empty State content</EmptyState.Root>
```
