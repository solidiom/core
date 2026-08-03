---
contentSchemaVersion: 1
title: Basic card
description: Simple card with header, content, and footer.
keywords: [card, container, header, title, content, footer]
locale: en
maturity: draft
product: Card
productLayer: primitive
status: draft
package: "@solidiom/card"
primitive: card
section: examples
exampleId: card-basic
source:
  path: packages/card/src/index.tsx
  export: Root
  language: tsx
runnable: false
---

```tsx
import * as Card from "@solidiom/card"

;<Card.Root>
  <Card.Header>
    <Card.Title>Welcome</Card.Title>
    <Card.Description>A simple card with all standard parts.</Card.Description>
  </Card.Header>
  <Card.Content>This is the main content area of the card.</Card.Content>
  <Card.Footer>Footer section</Card.Footer>
</Card.Root>
```

## Minimal

Use only the parts you need. A card with just content is perfectly valid.

```tsx
;<Card.Root>
  <Card.Content>Content only card.</Card.Content>
</Card.Root>
```

## Header Only

Use the header parts without a content or footer section.

```tsx
;<Card.Root>
  <Card.Header>
    <Card.Title>Card Title</Card.Title>
  </Card.Header>
</Card.Root>
```