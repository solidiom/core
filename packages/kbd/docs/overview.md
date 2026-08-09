---
contentSchemaVersion: 1
title: Kbd
description: Keyboard shortcut display element with semantic markup.
keywords: [kbd, keyboard, shortcut, display, key]
locale: en
maturity: ga
product: Kbd
productLayer: primitive
status: draft
package: "@solidiom/kbd"
primitive: kbd
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

Kbd renders a semantic `<kbd>` element for displaying keyboard shortcuts and key combinations. Use it to document keyboard interactions within instructions, help text, or interface labels.

## Usage

Kbd has a single `Root` part. Pass the key name or combination as children.

```tsx
import * as Kbd from "@solidiom/kbd"

;<p>
  Press <Kbd.Root>Ctrl</Kbd.Root> + <Kbd.Root>S</Kbd.Root> to save.
</p>
```

## Installation

Install the package with `pnpm add @solidiom/kbd`. The package requires compatible `solid-js` and `@solidjs/web` peer dependencies.

## Styling

Kbd carries `data-scope="kbd"` and `data-part="root"` attributes. Style it with a monospace font, a subtle background, and a border to distinguish it from surrounding text. The element inherits browser default `<kbd>` styling; override with your recipe for a consistent appearance.

## Parts

Kbd exposes a single `Root` part. It renders an inline `<kbd>` element with `data-scope="kbd"` and `data-part="root"` attributes.

## Keyboard & behavior

This primitive has no keyboard interaction. It renders static content that does not receive focus or respond to key events.

## SSR and hydration

Kbd is a passive display element with no interactive state. It renders as static HTML and requires no client-side hydration.
