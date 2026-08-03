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
notApplicable:
  - section: relationships
    reason: Combobox has no sibling primitives. It composes internally with its listbox and input parts but owns no inter-primitive contract.
  - section: migration
    reason: No prior API; this is the first shipped version.
  - section: testing
    reason: Standard testing guidance covers this primitive. Keyboard behavior is documented in the Keyboard section.
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

## Parts

Combobox exposes five parts:

- **Root** — the container that manages open state, selection, input value, and keyboard navigation.
- **Input** — the text input that triggers filtering. Carries `role="combobox"`, `aria-expanded`, `aria-autocomplete`, and `aria-activedescendant`.
- **Content** — the listbox popup containing items. Carries `role="listbox"`.
- **Item** — an option in the listbox. Carries `role="option"` and `aria-selected`.
- **ItemText** — the visible label of an item.

## Styling

Combobox ships with CSS, Tailwind, and UnoCSS recipe outputs. Parts carry `data-scope="combobox"` and `data-part` attributes. Items expose `data-highlighted` when active via keyboard, and `data-state="checked"` when selected.

## Keyboard & behavior

| Key       | Behavior                                                        |
| --------- | --------------------------------------------------------------- |
| ArrowDown | Opens the listbox if closed; moves highlight to the next item.  |
| ArrowUp   | Moves highlight to the previous item.                           |
| Home      | Moves highlight to the first item.                              |
| End       | Moves highlight to the last item.                               |
| Enter     | Selects the highlighted item and closes the listbox.            |
| Escape    | Closes the listbox without selecting; clears input if repeated. |

Focus remains in the input at all times. The `aria-activedescendant` pattern conveys the highlighted item to assistive technology.

## Composition

Combobox is designed to compose with other primitives. Use a `Field` wrapping Root to connect label and error messaging, or place a `Spinner` inside Content to indicate loading results.

## SSR and hydration

Combobox renders the input as static HTML. The listbox content is not present in the initial DOM (it renders on open). Hydration attaches keyboard handlers and positions the popup. No layout shift occurs because the listbox uses absolute/fixed positioning.
