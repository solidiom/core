---
contentSchemaVersion: 1
title: Basic badge
description: Basic badge usage examples.
keywords: [badge, label, status, indicator, inline]
locale: en
maturity: draft
product: Badge
productLayer: primitive
status: draft
package: "@solidiom/badge"
primitive: badge
section: examples
exampleId: badge-basic
source:
  path: packages/badge/src/index.tsx
  export: Root
  language: tsx
runnable: false
---

```tsx
import * as Badge from "@solidiom/badge"

;<Badge.Root>v1.0</Badge.Root>
```

## In Context

Use badges inline with text to indicate status, version, or labels.

```tsx
;<div>
  <span>Release</span>
  <Badge.Root>v2.0</Badge.Root>
</div>
```

## Multiple Badges

Place multiple badges together to show compound status or tags.

```tsx
;<div style={{ display: "flex", gap: "4px" }}>
  <Badge.Root>new</Badge.Root>
  <Badge.Root>featured</Badge.Root>
</div>
```
