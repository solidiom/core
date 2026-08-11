---
contentSchemaVersion: 1
title: Listbox - Basic usage
description: Basic listbox example demonstrating core behavior.
keywords: [listbox, basic, example]
locale: en
maturity: draft
product: Listbox
productLayer: primitive
status: draft
package: "@solidiom/listbox"
primitive: listbox
section: examples
exampleId: listbox-basic
source:
  path: packages/listbox/src/index.tsx
  export: Root
  language: tsx
runnable: true
---

```tsx
import * as Listbox from "@solidiom/listbox"

;<Listbox.Root
  aria-label="Select a fruit"
  selectionMode="single"
  defaultValue={["apple"]}
  onValueChange={(values) => console.log(values)}
>
  <Listbox.Item value="apple">Apple</Listbox.Item>
  <Listbox.Item value="banana">Banana</Listbox.Item>
  <Listbox.Item value="cherry">Cherry</Listbox.Item>
  <Listbox.Item value="date" disabled>
    Date
  </Listbox.Item>
  <Listbox.Item value="elderberry">Elderberry</Listbox.Item>
</Listbox.Root>
```

## Multiple selection

```tsx
;<Listbox.Root
  aria-label="Select fruits"
  selectionMode="multiple"
  defaultValue={["apple", "cherry"]}
  onValueChange={(values) => console.log(values)}
>
  <Listbox.Item value="apple">Apple</Listbox.Item>
  <Listbox.Item value="banana">Banana</Listbox.Item>
  <Listbox.Item value="cherry">Cherry</Listbox.Item>
</Listbox.Root>
```

In `single` mode, selecting an item deselects the previous one. In `multiple` mode, items can be toggled independently. The listbox supports keyboard navigation with arrow keys, Home/End, and typeahead.
