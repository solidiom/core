---
contentSchemaVersion: 1
title: Basic breadcrumb
description: Breadcrumb component with navigation hierarchy examples.
keywords: [breadcrumb, navigation, hierarchy, component]
locale: en
maturity: draft
product: Breadcrumb
productLayer: component
status: draft
package: "@solidiom/recipes-css"
recipe: "breadcrumb"
section: examples
exampleId: breadcrumb-component-basic
source:
  path: apps/site/src/components/BreadcrumbExample.tsx
  export: BreadcrumbExample
  language: tsx
runnable: true
---

The Breadcrumb component is a styled recipe wrapper around the `@solidiom/breadcrumb` primitive. It provides a hierarchical navigation trail with accessible structure, using semantic nav and list elements.

```tsx
import { StyledBreadcrumb } from "@solidiom/recipes-css"
import * as Breadcrumb from "@solidiom/breadcrumb"

;<StyledBreadcrumb>
  <Breadcrumb.List>
    <Breadcrumb.Item>
      <Breadcrumb.Link href="/">Home</Breadcrumb.Link>
    </Breadcrumb.Item>
    <Breadcrumb.Separator />
    <Breadcrumb.Item>
      <Breadcrumb.Link href="/docs">Docs</Breadcrumb.Link>
    </Breadcrumb.Item>
    <Breadcrumb.Separator />
    <Breadcrumb.Item>
      <Breadcrumb.Link href="/docs/breadcrumb" current>
        Breadcrumb
      </Breadcrumb.Link>
    </Breadcrumb.Item>
  </Breadcrumb.List>
</StyledBreadcrumb>
```

## With ellipsis

Use the Ellipsis part to indicate skipped navigation levels.

```tsx
import { StyledBreadcrumb } from "@solidiom/recipes-css"
import * as Breadcrumb from "@solidiom/breadcrumb"

;<StyledBreadcrumb>
  <Breadcrumb.List>
    <Breadcrumb.Item>
      <Breadcrumb.Link href="/">Home</Breadcrumb.Link>
    </Breadcrumb.Item>
    <Breadcrumb.Separator />
    <Breadcrumb.Ellipsis />
    <Breadcrumb.Separator />
    <Breadcrumb.Item>
      <Breadcrumb.Link href="/docs/breadcrumb" current>
        Breadcrumb
      </Breadcrumb.Link>
    </Breadcrumb.Item>
  </Breadcrumb.List>
</StyledBreadcrumb>
```
