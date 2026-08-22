---
contentSchemaVersion: 1
title: Basic toggle group
description: Toggle group component where one or more toggle buttons can be selected at a time.
keywords: [toggle-group, toggle, button, group, selection, component]
locale: en
maturity: draft
product: ToggleGroup
productLayer: component
status: draft
package: "@solidiom/toggle-group"
section: examples
exampleId: toggle-group-component-basic
source:
  path: apps/site/src/components/ToggleGroupExample.tsx
  export: ToggleGroupExample
  language: tsx
runnable: true
---

The Toggle Group component provides a set of toggle buttons where one or more can be selected at a time.

```tsx
import * as ToggleGroup from "@solidiom/toggle-group"

;<ToggleGroup.Root type="single" defaultValue={["bold"]}>
  <ToggleGroup.Item value="normal">Normal</ToggleGroup.Item>
  <ToggleGroup.Item value="bold">Bold</ToggleGroup.Item>
  <ToggleGroup.Item value="italic">Italic</ToggleGroup.Item>
</ToggleGroup.Root>
```
