---
contentSchemaVersion: 1
title: Visually Hidden
description: Hides content visually while keeping it accessible to screen readers.
keywords: [visually-hidden, screen-reader, accessibility, label, heading, assistive-technology]
locale: en
maturity: draft
product: Visually Hidden
productLayer: primitive
status: draft
package: "@solidiom/visually-hidden"
primitive: visually-hidden
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

Visually Hidden hides content visually while keeping it accessible to screen readers. It uses the standard clip/overflow technique to remove content from the visual layout without removing it from the accessibility tree.

## Usage

Visually Hidden has a single `Root` part. Wrap any content that should be hidden visually but remain available to assistive technologies.

```tsx
import * as VisuallyHidden from "@solidiom/visually-hidden"

;<VisuallyHidden.Root>
  <label>Search</label>
</VisuallyHidden.Root>
```

## Installation

Install the package with `pnpm add @solidiom/visually-hidden`. The package requires compatible `solid-js` and `@solidjs/web` peer dependencies.

## Props

| Prop       | Type          | Default | Description                                 |
| ---------- | ------------- | ------- | ------------------------------------------- |
| `children` | `JSX.Element` | —       | Content to hide visually.                   |
| `class`    | `string`      | —       | Additional CSS class for styling overrides. |

## Styling

Visually Hidden carries `data-scope="visually-hidden"` and `data-part="root"` attributes. It renders as a `<span>` element with inline styles for the clipping technique. The styles use `position: absolute`, `clip: rect(0, 0, 0, 0)`, `white-space: nowrap`, `width: 1px`, `height: 1px`, and `overflow: hidden` to ensure the content is completely invisible while remaining in the document flow for assistive technologies.

## Keyboard & behavior

This primitive has no keyboard interaction. It renders static content that does not receive focus or respond to key events.

## SSR and hydration

Visually Hidden is a passive display element with no interactive state. It renders as static HTML and requires no client-side hydration.
