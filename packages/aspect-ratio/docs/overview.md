---
contentSchemaVersion: 1
title: Aspect Ratio
description: Container that constrains children to a specified aspect ratio.
keywords: [aspect-ratio, layout, ratio, media, responsive]
locale: en
maturity: ga
product: Aspect Ratio
productLayer: primitive
status: draft
package: "@solidiom/aspect-ratio"
primitive: aspect-ratio
section: overview
notApplicable:
  - section: composition
    reason: Self-contained primitive with no compound sub-primitives to compose.
  - section: relationships
    reason: No sibling primitives; used within other compositions but owns no inter-primitive contract.
  - section: migration
    reason: No prior API; this is the first shipped version.
  - section: testing
    reason: Standard testing guidance covers this primitive.
---

Aspect Ratio constrains its children to a fixed width-to-height ratio, keeping media and embeds proportional as their container resizes.

## Usage

Aspect Ratio has a single `Root` part. Pass the content to constrain as children.

```tsx
import * as AspectRatio from "@solidiom/aspect-ratio"

;<AspectRatio.Root ratio={16 / 9}>
  <img src="/cover.jpg" alt="Cover" />
</AspectRatio.Root>
```

## Installation

Install the package with `pnpm add @solidiom/aspect-ratio`. The package requires compatible `solid-js` and `@solidjs/web` peer dependencies.

## Parts

Aspect Ratio exposes a single `Root` part carrying `data-scope="aspect-ratio"` and `data-part="root"`.

## Styling

Style the `Root` via the `data-scope="aspect-ratio"` and `data-part="root"` attributes. The ratio is applied inline; recipes typically only handle overflow and object-fit for media children.

## Keyboard & behavior

This primitive has no keyboard interaction. It renders a container that does not receive focus or respond to key events.

## SSR and hydration

Aspect Ratio is a passive layout element with no interactive state. It renders as static HTML and requires no client-side hydration.
