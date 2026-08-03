---
contentSchemaVersion: 1
title: Accordion
description: Vertically stacked set of collapsible sections with single or multiple expand modes.
keywords: [accordion, collapsible, sections, expand, collapse]
locale: en
maturity: draft
product: Accordion
productLayer: primitive
status: draft
package: "@solidiom/accordion"
primitive: accordion
section: overview
---

Accordion presents a vertically stacked set of collapsible sections. Users expand one or more items to reveal associated content. Use it to organize large amounts of information into manageable, scannable groups.

## Usage

Compose `Root`, `Item`, `Trigger`, and `Content`. Each `Item` contains a `Trigger` button and a `Content` region. The primitive manages ARIA attributes, keyboard navigation, and expand/collapse state.

```tsx
import * as Accordion from "@solidiom/accordion"

;<Accordion.Root>
  <Accordion.Item value="one">
    <Accordion.Trigger>Section One</Accordion.Trigger>
    <Accordion.Content>Content for the first section.</Accordion.Content>
  </Accordion.Item>
  <Accordion.Item value="two">
    <Accordion.Trigger>Section Two</Accordion.Trigger>
    <Accordion.Content>Content for the second section.</Accordion.Content>
  </Accordion.Item>
</Accordion.Root>
```

By default, Accordion operates in single-expand mode: opening one item closes the others. Use `type="multiple"` to allow several items to stay open simultaneously. In single mode, `collapsible={true}` lets the user close all items.

Use `value` and `onValueChange` for controlled state. The uncontrolled variant manages expanded items internally via `defaultValue`.

## Keyboard interaction

| Key           | Behavior                           |
| ------------- | ---------------------------------- |
| Arrow Down    | Move focus to the next trigger     |
| Arrow Up      | Move focus to the previous trigger |
| Home          | Move focus to the first trigger    |
| End           | Move focus to the last trigger     |
| Enter / Space | Toggle the focused item            |

## Installation

Install the package with `pnpm add @solidiom/accordion`. The package requires compatible `solid-js` and `@solidjs/web` peer dependencies.

## Styling

Accordion ships with CSS, Tailwind, and UnoCSS recipe outputs. The `Root`, `Item`, `Trigger`, and `Content` parts carry `data-scope="accordion"` and `data-part` attributes for targeting. Items expose `data-state="open"` or `data-state="closed"`, and the `Trigger` exposes `data-disabled` when disabled.

## SSR and hydration

Accordion renders as static HTML. Expanded items are determined by `defaultValue` or `value` during server rendering. The primitive hydrates without side effects; keyboard navigation and click handlers activate on the client.

## Composition

Accordion is designed to compose with other primitives. You can nest a `Field` inside an item's content, use `Kbd` within trigger labels to display shortcuts, or place a `Button` inside the content region for secondary actions.
