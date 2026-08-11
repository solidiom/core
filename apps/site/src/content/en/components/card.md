---
contentSchemaVersion: 1
title: Card
description: Container component with header, title, description, content, and footer areas.
keywords: [card, container, layout, header, footer, content]
locale: en
maturity: beta
product: Card
productLayer: component
status: published
package: "@solidiom/recipes-css"
recipe: "card"
stylingOutputs: ["css", "tailwind", "unocss"]
---

Container component with header, title, description, content, and footer areas.

## Usage

The Card component is a styled recipe wrapper around the `@solidiom/card` primitive. It provides a composition layer for content containers with semantic styling for header, title, description, body content, and footer sections.

```tsx
import { StyledCard, Card } from "@solidiom/recipes-css"

;<StyledCard>
  <Card.Header>
    <Card.Title>Card Title</Card.Title>
    <Card.Description>Card description text goes here.</Card.Description>
  </Card.Header>
  <Card.Content>Main content area.</Card.Content>
  <Card.Footer>Footer content.</Card.Footer>
</StyledCard>
```

## Installation

```sh
pnpm add @solidiom/recipes-css @solidiom/recipes-tailwind @solidiom/recipes-unocss
```

Install the recipe package for your chosen styling profile. The component requires the corresponding `@solidiom/card` primitive as a peer dependency.

## Anatomy

The Card component wraps the `@solidiom/card` primitive. It exposes six parts through a recipe-applied composition layer:

- **Root** — container with border, border-radius, and background styling.
- **Header** — flex column container for title and description grouping.
- **Title** — heading element with large font size and semibold weight.
- **Description** — paragraph element with small font size and muted color.
- **Content** — main content area with no base styling, for consumer flexibility.
- **Footer** — flex row container with vertical alignment for action buttons or metadata.

## Variants & states

Card does not use variants or states. It is a purely structural container component. All styling is driven by the recipe's base styles applied to each part.

## Styling

Card is available in css, tailwind, unocss profiles. Each profile applies the same semantic parts and structure, allowing you to swap profiles without changing component usage.

Recipe classes follow the `solidiom-card` namespace for CSS profiling and targeting.

## SSR and hydration

Card renders as semantic HTML `<div>`, `<h3>`, and `<p>` elements during server rendering. No JavaScript is required for rendering; the recipe layer adds no interactive behavior beyond the underlying primitive.

## Accessibility

Card delegates accessibility to `@solidiom/card`. The primitive renders semantic HTML elements with appropriate roles. The wrapper adds no behavioral changes that affect accessibility. See the [Card primitive accessibility contract](/primitives/card/accessibility/) for the full keyboard, focus, and ARIA contract.