---
contentSchemaVersion: 1
title: Collapsible - Basic usage
description: Basic collapsible example demonstrating core behavior.
keywords: [collapsible, basic, example]
locale: en
maturity: draft
product: Collapsible
productLayer: primitive
status: draft
package: "@solidiom/collapsible"
primitive: collapsible
section: examples
exampleId: collapsible-basic
source:
  path: packages/collapsible/src/index.tsx
  export: Root
  language: tsx
runnable: true
---

```tsx
import * as Collapsible from "@solidiom/collapsible"

;<Collapsible.Root defaultOpen={false} onOpenChange={(open) => console.log(open)}>
  <Collapsible.Trigger>Toggle Details</Collapsible.Trigger>

  <Collapsible.Content>
    <p>This content is revealed when the collapsible is opened.</p>
    <p>It uses aria-expanded and aria-controls for accessibility.</p>
  </Collapsible.Content>
</Collapsible.Root>
```

The Content is only rendered when the collapsible is open. Use the `disabled` prop on Root to prevent toggling.
