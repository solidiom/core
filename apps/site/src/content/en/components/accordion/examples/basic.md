---
contentSchemaVersion: 1
title: Basic accordion
description: Accordion component with single and multiple expandable items.
keywords: [accordion, collapsible, expand, collapse, primitive]
locale: en
maturity: draft
product: Accordion
productLayer: component
status: draft
package: "@solidiom/recipes-css"
recipe: "accordion"
section: examples
exampleId: accordion-component-basic
source:
  path: apps/site/src/components/AccordionExample.tsx
  export: AccordionExample
  language: tsx
runnable: true
---

The Accordion component is a styled recipe wrapper around the `@solidiom/accordion` primitive. It provides expandable sections with keyboard navigation and animated open/close behavior.

```tsx
import { StyledAccordion, Accordion } from "@solidiom/recipes-css"

;<StyledAccordion type="single" collapsible>
  <Accordion.Item value="item-1">
    <Accordion.Header>
      <Accordion.Trigger>Section 1</Accordion.Trigger>
    </Accordion.Header>
    <Accordion.Content>Content for section 1.</Accordion.Content>
  </Accordion.Item>
  <Accordion.Item value="item-2">
    <Accordion.Header>
      <Accordion.Trigger>Section 2</Accordion.Trigger>
    </Accordion.Header>
    <Accordion.Content>Content for section 2.</Accordion.Content>
  </Accordion.Item>
</StyledAccordion>
```
