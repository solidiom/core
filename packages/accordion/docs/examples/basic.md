---
contentSchemaVersion: 1
title: Accordion - Basic usage
description: Accordion with collapsible items, accordion-level behavior, and initial state control.
keywords: [accordion, basic, collapsible, single, multiple]
locale: en
maturity: draft
product: Accordion
productLayer: primitive
status: draft
package: "@solidiom/accordion"
primitive: accordion
section: examples
exampleId: accordion-basic
source:
  path: packages/accordion/src/accordion.tsx
  export: Root
  language: tsx
runnable: false
---

```tsx
import * as Accordion from "@solidiom/accordion"

;<Accordion.Root type="single" collapsible defaultValue="item-1">
  <Accordion.Item value="item-1">
    <Accordion.Trigger>What is Solidiom?</Accordion.Trigger>
    <Accordion.Content>
      A component kit for SolidJS built on semantic HTML, accessible by default.
    </Accordion.Content>
  </Accordion.Item>
  <Accordion.Item value="item-2">
    <Accordion.Trigger>Is it accessible?</Accordion.Trigger>
    <Accordion.Content>
      Yes, it follows the WAI-ARIA Authoring Practices for accordion patterns.
    </Accordion.Content>
  </Accordion.Item>
</Accordion.Root>
```

## Accordion-level options

The `type` prop controls whether items are independent (`multiple`) or mutually exclusive (`single`). With `collapsible`, all items can be closed simultaneously.
