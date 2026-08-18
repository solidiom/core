---
contentSchemaVersion: 1
title: Basic accordion
description: Accordion component with single and multiple expandable items.
keywords: [accordion, collapsible, expand, collapse, primitive]
locale: es
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
translationSourceHash: "22f65eb65229bc7f083749be6fd1dc005c093f28cfa0de0d1b861151bb95a0b5"
translationStatus: "human-reviewed"
translationReviewedBy: "solidiom-team"
translationReviewedAt: "2026-08-18"
---

El componente Accordion es un wrapper de receta con estilos sobre el primitivo `@solidiom/accordion`. Proporciona secciones expandibles con navegación por teclado y comportamiento animado de apertura/cierre.

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
