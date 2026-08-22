---
contentSchemaVersion: 1
title: Multi Selector
description: Multi-select dropdown with checkbox items and search filtering.
keywords: [multi-select, dropdown, tags, search, filter, roving focus, selection]
locale: en
maturity: ga
product: Multi Selector
productLayer: primitive
status: draft
package: "@solidiom/multi-selector"
primitive: multi-selector
section: overview
notApplicable:
  - section: migration
    reason: No prior API; this is the first shipped version.
  - section: testing
    reason: Standard testing guidance covers this primitive.
---

Multi Selector is a multi-select dropdown with checkbox items and search filtering. It uses `createCollection`, `createRovingFocus`, `createSelection`, `createDisclosureState`, and positioning. Selected values are shown as removable Tags, and the SearchInput filters items.

## Usage

Compose `Root`, `Trigger`, `TagList`, `Tag`, `TagRemove`, `Content`, `Item`, `ItemIndicator`, and `SearchInput`.

```tsx
import * as MultiSelector from "@solidiom/multi-selector"

function TagPicker() {
  return (
    <MultiSelector.Root>
      <MultiSelector.Trigger>
        <MultiSelector.TagList>
          <MultiSelector.Tag>
            Design
            <MultiSelector.TagRemove>×</MultiSelector.TagRemove>
          </MultiSelector.Tag>
        </MultiSelector.TagList>
      </MultiSelector.Trigger>
      <MultiSelector.Content>
        <MultiSelector.SearchInput placeholder="Search…" />
        <MultiSelector.Item>
          Design
          <MultiSelector.ItemIndicator>✓</MultiSelector.ItemIndicator>
        </MultiSelector.Item>
      </MultiSelector.Content>
    </MultiSelector.Root>
  )
}
```

## Installation

Install the package with `pnpm add @solidiom/multi-selector`. The package requires compatible `solid-js` and `@solidjs/web` peer dependencies.

## Parts

multi-selector exposes 9 parts:

- **Root** — `data-part="root"`. Container coordinating selection, collection, and disclosure state.
- **Trigger** — `data-part="trigger"`. Opens the dropdown and hosts the selected tags.
- **TagList** — `data-part="taglist"`. Holds the selected value tags.
- **Tag** — `data-part="tag"`. A single selected value shown as a removable tag.
- **TagRemove** — `data-part="tagremove"`. Removes its associated tag.
- **Content** — `data-part="content"`. Dropdown panel containing the items and search input.
- **Item** — `data-part="item"`. A selectable checkbox item.
- **ItemIndicator** — `data-part="itemindicator"`. Indicates the selected state of an item.
- **SearchInput** — `data-part="searchinput"`. Filters the items.

## Styling

multi-selector carries `data-scope="multi-selector"` and `data-part` attributes on each part for CSS/recipe targeting.

## Keyboard & behavior

| Key        | Behavior                      |
| ---------- | ----------------------------- |
| Arrow keys | Move roving focus over items. |

## Composition

Multi Selector composes within forms and filter surfaces where several values are chosen from a searchable list.

## SSR and hydration

Multi Selector renders its trigger and content markup on the server and activates selection, filtering, roving focus, and disclosure behavior on hydration.
