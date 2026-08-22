---
contentSchemaVersion: 1
title: Typography
description: Semantic text primitives for headings, paragraphs, and inline text.
keywords: [typography, heading, text, paragraph, inline code, blockquote, semantic]
locale: en
maturity: ga
product: Typography
productLayer: primitive
status: draft
package: "@solidiom/typography"
primitive: typography
section: overview
notApplicable:
  - section: migration
    reason: No prior API; this is the first shipped version.
  - section: testing
    reason: Standard testing guidance covers this primitive.
---

Typography is a set of semantic text primitives for headings, paragraphs, and inline text. There is no Root part; each primitive is used directly: `Heading` renders a heading element, `Text` a paragraph, `Lead` a lead paragraph, `Small` small text, `Muted` de-emphasized text, `InlineCode` inline code, and `Blockquote` a quotation.

## Usage

Use the parts directly — there is no wrapping `Root`. Import the primitives and compose `Heading`, `Text`, `Lead`, `Small`, `Muted`, `InlineCode`, and `Blockquote` as needed.

```tsx
import * as Typography from "@solidiom/typography"

;<>
  <Typography.Heading>Getting started</Typography.Heading>
  <Typography.Lead>A short introduction to the topic.</Typography.Lead>
  <Typography.Text>
    Body copy with <Typography.InlineCode>inline code</Typography.InlineCode> and{" "}
    <Typography.Muted>de-emphasized</Typography.Muted> text.
  </Typography.Text>
  <Typography.Blockquote>A memorable quotation.</Typography.Blockquote>
  <Typography.Small>Fine print.</Typography.Small>
</>
```

## Installation

Install the package with `pnpm add @solidiom/typography`. The package requires compatible `solid-js` and `@solidjs/web` peer dependencies.

## Parts

typography exposes 7 parts:

- **Heading** — renders a heading element.
- **Text** — renders a paragraph.
- **Lead** — renders a lead paragraph.
- **Small** — renders small text.
- **Muted** — renders de-emphasized text.
- **InlineCode** — renders inline code.
- **Blockquote** — renders a quotation.

## Styling

typography carries `data-scope="typography"` and `data-part` attributes on each part for CSS/recipe targeting.

## Keyboard & behavior

This primitive has no keyboard interaction of its own.

## Composition

Use these text primitives within any layout or content composition to apply consistent semantic typography.

## SSR and hydration

Typography renders static HTML and requires no hydration.
