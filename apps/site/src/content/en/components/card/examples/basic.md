---
contentSchemaVersion: 1
title: Basic card
description: Card component with header, title, description, content, and footer.
keywords: [card, container, layout, header, footer, styled]
locale: en
maturity: draft
product: Card
productLayer: component
status: draft
package: "@solidiom/recipes-css"
recipe: "card"
section: examples
exampleId: card-component-basic
runnable: true
source:
  path: apps/site/src/components/CardExample.tsx
  export: CardExample
  language: tsx
---

The Card component provides a styled wrapper around content containers with header, body content, and footer composition.

```tsx
import { StyledCard } from "@solidiom/recipes-css"
import * as Card from "@solidiom/card"

;<StyledCard>
  <Card.Header>
    <Card.Title>Get Started</Card.Title>
    <Card.Description>Everything you need to know to get up and running.</Card.Description>
  </Card.Header>
  <Card.Content>Start building your project today.</Card.Content>
  <Card.Footer>Footer action or metadata goes here.</Card.Footer>
</StyledCard>
```

## Minimal card

A card with only content and no header or footer.

```tsx
;<StyledCard>
  <Card.Content>Simple card content without header or footer.</Card.Content>
</StyledCard>
```

## Card with header only

```tsx
;<StyledCard>
  <Card.Header>
    <Card.Title>Card Title</Card.Title>
    <Card.Description>A brief description of the card content.</Card.Description>
  </Card.Header>
  <Card.Content>The main body of the card goes here.</Card.Content>
</StyledCard>
```
