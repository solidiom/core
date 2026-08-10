---
contentSchemaVersion: 1
title: Toggle Group - Basic usage
description: Basic toggle group example demonstrating core behavior.
keywords: [toggle-group, basic, example]
locale: en
maturity: draft
product: Toggle Group
productLayer: primitive
status: draft
package: "@solidiom/toggle-group"
primitive: toggle-group
section: examples
exampleId: toggle-group-basic
source:
  path: packages/toggle-group/src/index.tsx
  export: Root
  language: tsx
runnable: true
---

```tsx
import * as ToggleGroup from "@solidiom/toggle-group"

;<ToggleGroup.Root
  type="single"
  defaultValue={["bold"]}
  onValueChange={(values) => console.log(values)}
>
  <ToggleGroup.Item value="bold">B</ToggleGroup.Item>
  <ToggleGroup.Item value="italic">I</ToggleGroup.Item>
  <ToggleGroup.Item value="underline">U</ToggleGroup.Item>
</ToggleGroup.Root>
```

## Multiple selection

```tsx
;<ToggleGroup.Root
  type="multiple"
  defaultValue={["bold", "italic"]}
  onValueChange={(values) => console.log(values)}
>
  <ToggleGroup.Item value="bold">B</ToggleGroup.Item>
  <ToggleGroup.Item value="italic">I</ToggleGroup.Item>
  <ToggleGroup.Item value="underline">U</ToggleGroup.Item>
</ToggleGroup.Root>
```

In `single` mode, only one item can be active at a time. In `multiple` mode, items toggle independently. Use the `orientation` prop for vertical layout.
