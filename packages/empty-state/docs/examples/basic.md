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

;<EmptyState.Root>
  <EmptyState.Icon>📭</EmptyState.Icon>
  <EmptyState.Title>No messages</EmptyState.Title>
  <EmptyState.Description>
    You don't have any messages yet. Send one to get started.
  </EmptyState.Description>
  <EmptyState.Action>
    <button>Send a message</button>
  </EmptyState.Action>
</EmptyState.Root>
```

The empty state provides a structured placeholder for void content areas. Each part is purely presentational with no built-in interactivity beyond the action slot.
