---
contentSchemaVersion: 1
title: "Collapsible – Basic Example"
description: "A basic example of the Collapsible component that toggles content visibility."
keywords: ["collapsible", "accordion", "toggle", "expand", "collapse"]
locale: en
maturity: draft
product: Collapsible
productLayer: component
status: draft
package: "@solidiom/recipes-css"
recipe: "collapsible"
section: examples
exampleId: collapsible-component-basic
source:
  path: apps/site/src/components/CollapsibleExample.tsx
  export: CollapsibleExample
  language: tsx
runnable: true
---

The Collapsible component manages a section of content that can be toggled between visible and hidden states.

```tsx
import { StyledCollapsible, Collapsible } from "@solidiom/recipes-css"

;<Collapsible.Root>
  <Collapsible.Trigger>Show details</Collapsible.Trigger>
  <Collapsible.Content>Collapsible content here.</Collapsible.Content>
</Collapsible.Root>
```
