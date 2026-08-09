---
contentSchemaVersion: 1
title: Card
description: Content container with header, body, and footer sections.
keywords: [card, container, header, title, description, content, footer]
locale: en
maturity: ga
product: Card
productLayer: primitive
status: draft
package: "@solidiom/card"
primitive: card
section: overview
notApplicable:
  - section: composition
    reason: Self-contained primitive with no compound sub-primitives to compose.
  - section: relationships
    reason: No sibling primitives; used within other compositions but owns no inter-primitive contract.
  - section: migration
    reason: No prior API; this is the first shipped version.
  - section: testing
    reason: Standard testing guidance covers this primitive. No primitive-specific non-obvious behavior exists.
---

Card renders a content container with composable parts for header, title, description, content body, and footer. It provides a semantic structure for grouping related content and actions.

## Usage

Card provides multiple composable parts. Use the parts you need for your content structure.

```tsx
import * as Card from "@solidiom/card"

;<Card.Root>
  <Card.Header>
    <Card.Title>Card Title</Card.Title>
    <Card.Description>Optional description text.</Card.Description>
  </Card.Header>
  <Card.Content>Main content goes here.</Card.Content>
  <Card.Footer>Footer content or actions.</Card.Footer>
</Card.Root>
```

## Installation

Install the package with `pnpm add @solidiom/card`. The package requires compatible `solid-js` and `@solidjs/web` peer dependencies.

## Parts

| Part          | Element | Props                        | Description                              |
| ------------- | ------- | ---------------------------- | ---------------------------------------- |
| `Root`        | `<div>` | `class`, `style`, `children` | Outer container for the card.            |
| `Header`      | `<div>` | `class`, `style`, `children` | Header section of the card.              |
| `Title`       | `<h3>`  | `class`, `children`          | Title heading within the card header.    |
| `Description` | `<p>`   | `class`, `children`          | Descriptive text within the card header. |
| `Content`     | `<div>` | `class`, `style`, `children` | Main content body of the card.           |
| `Footer`      | `<div>` | `class`, `style`, `children` | Footer section of the card.              |

## Styling

Card carries `data-scope="card"` and `data-part` attributes on each part. Style individual parts using the data attributes for targeting. Parts render as semantic HTML elements; apply your visual recipe using the data attributes for selection.

## Keyboard & behavior

This primitive has no keyboard interaction. It renders static content that does not receive focus or respond to key events.

## SSR and hydration

Card is a passive display element with no interactive state. It renders as static HTML and requires no client-side hydration.
