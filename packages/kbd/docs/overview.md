---
contentSchemaVersion: 1
title: Kbd
description: Keyboard shortcut display element with semantic markup.
keywords: [kbd, keyboard, shortcut, display, key]
locale: en
maturity: draft
product: Kbd
productLayer: primitive
status: draft
package: "@solidiom/kbd"
primitive: kbd
section: overview
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

## SSR and hydration

Kbd is a passive display element with no interactive state. It renders as static HTML and requires no client-side hydration.
