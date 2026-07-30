---
contentSchemaVersion: 1
title: Combobox
description: Autocomplete input with a filterable listbox for selecting from a set of options.
keywords: [autocomplete, combobox, dropdown, listbox]
locale: en
maturity: beta
product: Combobox
productLayer: primitive
status: published
package: "@solidiom/combobox"
primitive: combobox
section: overview
---

Combobox combines a text input with a filterable listbox. As the user types, the list narrows to matching options. Keyboard navigation uses the active-descendant pattern so focus stays in the input while items are highlighted visually.

## Usage

Compose `Root`, `Input`, `Content`, `Item`, and `ItemText`. The input opens the listbox on focus or typing; selecting an item closes it and fills the input.

```tsx
import * as Combobox from "@solidiom/combobox"

;<Combobox.Root>
  <Combobox.Input placeholder="Pick a fruit" />
  <Combobox.Content>
    <Combobox.Item value="apple">
      <Combobox.ItemText>Apple</Combobox.ItemText>
    </Combobox.Item>
    <Combobox.Item value="banana">
      <Combobox.ItemText>Banana</Combobox.ItemText>
    </Combobox.Item>
    <Combobox.Item value="cherry">
      <Combobox.ItemText>Cherry</Combobox.ItemText>
    </Combobox.Item>
  </Combobox.Content>
</Combobox.Root>
```

Use `inputValue` and `onInputValueChange` for controlled filtering. Use `selectedValue` and `onSelectedValueChange` for controlled selection. The uncontrolled variant manages both values internally via `defaultInputValue` and `defaultSelectedValue`.

## Installation

Install the package with `pnpm add @solidiom/combobox`. The package requires compatible `solid-js` and `@solidjs/web` peer dependencies.
