---
contentSchemaVersion: 1
title: Basic toggle group
description: Toggle group component where one or more toggle buttons can be selected at a time.
keywords: [toggle-group, toggle, button, group, selection, component]
locale: es
maturity: draft
product: ToggleGroup
productLayer: component
status: draft
package: "@solidiom/recipes-css"
recipe: "toggle-group"
section: examples
exampleId: toggle-group-component-basic
source:
  path: apps/site/src/components/ToggleGroupExample.tsx
  export: ToggleGroupExample
  language: tsx
runnable: true
translationSourceHash: "9a9082afd1187811e03eff8e930c1536d2f0dc8fb565ab1f0a4448503e035f02"
translationStatus: draft
---

The Toggle Group component provides a set of toggle buttons where one or more can be selected at a time.

```tsx
import { StyledToggleGroup, ToggleGroup } from "@solidiom/recipes-css"

;<StyledToggleGroup type="single" defaultValue={["bold"]}>
  <ToggleGroup.Item value="normal">Normal</ToggleGroup.Item>
  <ToggleGroup.Item value="bold">Bold</ToggleGroup.Item>
  <ToggleGroup.Item value="italic">Italic</ToggleGroup.Item>
</StyledToggleGroup>
```
