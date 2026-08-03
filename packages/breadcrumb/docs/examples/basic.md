---
contentSchemaVersion: 1
title: Basic breadcrumb
description: Standard breadcrumb navigation with multiple levels.
keywords: [breadcrumb, navigation, hierarchy, links, trail]
locale: en
maturity: draft
product: Breadcrumb
productLayer: primitive
status: draft
package: "@solidiom/breadcrumb"
primitive: breadcrumb
section: examples
exampleId: breadcrumb-basic
source:
  path: packages/breadcrumb/src/index.tsx
  export: Root, List, Item, Link, Separator, Ellipsis
  language: tsx
runnable: false
---

```tsx
import * as Breadcrumb from "@solidiom/breadcrumb"

;<Breadcrumb.Root>
  <Breadcrumb.List>
    <Breadcrumb.Item>
      <Breadcrumb.Link href="/">Home</Breadcrumb.Link>
    </Breadcrumb.Item>
    <Breadcrumb.Separator />
    <Breadcrumb.Item>
      <Breadcrumb.Link href="/products">Products</Breadcrumb.Link>
    </Breadcrumb.Item>
    <Breadcrumb.Separator />
    <Breadcrumb.Item>
      <Breadcrumb.Link href="/products/widget" current>
        Widget
      </Breadcrumb.Link>
    </Breadcrumb.Item>
  </Breadcrumb.List>
</Breadcrumb.Root>
```

## With ellipsis

Use `Ellipsis` to indicate skipped levels in a deeply nested breadcrumb trail.

```tsx
;<Breadcrumb.Root>
  <Breadcrumb.List>
    <Breadcrumb.Item>
      <Breadcrumb.Link href="/">Home</Breadcrumb.Link>
    </Breadcrumb.Item>
    <Breadcrumb.Separator />
    <Breadcrumb.Ellipsis />
    <Breadcrumb.Separator />
    <Breadcrumb.Item>
      <Breadcrumb.Link href="/products/widget" current>
        Widget
      </Breadcrumb.Link>
    </Breadcrumb.Item>
  </Breadcrumb.List>
</Breadcrumb.Root>
```

## Custom separator

Provide custom content to `Separator` to change the visual divider between items.

```tsx
;<Breadcrumb.Root>
  <Breadcrumb.List>
    <Breadcrumb.Item>
      <Breadcrumb.Link href="/">Home</Breadcrumb.Link>
    </Breadcrumb.Item>
    <Breadcrumb.Separator>&gt;</Breadcrumb.Separator>
    <Breadcrumb.Item>
      <Breadcrumb.Link href="/docs" current>
        Docs
      </Breadcrumb.Link>
    </Breadcrumb.Item>
  </Breadcrumb.List>
</Breadcrumb.Root>
```