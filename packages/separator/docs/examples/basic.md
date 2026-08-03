---
contentSchemaVersion: 1
title: Basic separator
description: Horizontal and vertical separator examples.
keywords: [separator, divider, horizontal, vertical, decorative]
locale: en
maturity: draft
product: Separator
productLayer: primitive
status: draft
package: "@solidiom/separator"
primitive: separator
section: examples
exampleId: separator-basic
source:
  path: packages/separator/src/index.tsx
  export: Root
  language: tsx
runnable: false
---

```tsx
import * as Separator from "@solidiom/separator"

;<section>
  <p>Section content above the divider.</p>
  <Separator.Root />
  <p>Section content below the divider.</p>
</section>
```

## Variants

Use the `orientation` prop for vertical separators in side-by-side layouts.

```tsx
;<div style={{ display: "flex" }}>
  <aside>Sidebar</aside>
  <Separator.Root orientation="vertical" />
  <main>Main content</main>
</div>
```

## Decorative

When the separator is purely visual and carries no structural meaning, set `decorative` to hide it from assistive technologies.

```tsx
;<Separator.Root decorative />
```
