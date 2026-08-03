---
contentSchemaVersion: 1
title: Basic visually hidden
description: Screen-reader-only label example.
keywords: [visually-hidden, screen-reader, label, accessibility, icon]
locale: en
maturity: draft
product: Visually Hidden
productLayer: primitive
status: draft
package: "@solidiom/visually-hidden"
primitive: visually-hidden
section: examples
exampleId: visually-hidden-basic
source:
  path: packages/visually-hidden/src/index.tsx
  export: Root
  language: tsx
runnable: false
---

```tsx
import * as VisuallyHidden from "@solidiom/visually-hidden"

;<button>
  <VisuallyHidden.Root>Close dialog</VisuallyHidden.Root>
  <span aria-hidden="true">&times;</span>
</button>
```

## Hidden heading

Use Visually Hidden to provide headings for screen readers that provide structure without visual clutter.

```tsx
;<article>
  <VisuallyHidden.Root>
    <h2>Related Articles</h2>
  </VisuallyHidden.Root>
  <ul>
    <li>Article one</li>
    <li>Article two</li>
  </ul>
</article>
```

## Form field instructions

Hide verbose form field instructions visually while keeping them accessible to screen readers.

```tsx
;<label>
  <VisuallyHidden.Root>Enter your email address</VisuallyHidden.Root>
  <input type="email" placeholder="Email" />
</label>
```
