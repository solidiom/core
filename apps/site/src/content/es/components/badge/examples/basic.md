---
contentSchemaVersion: 1
title: Basic badge
description: Badge component with variant examples.
keywords: [badge, label, tag, status, primitive]
locale: es
maturity: draft
product: Badge
productLayer: component
status: draft
package: "@solidiom/recipes-css"
recipe: "badge"
section: examples
exampleId: badge-component-basic
source:
  path: apps/site/src/components/BadgeExample.tsx
  export: BadgeExample
  language: tsx
runnable: true
translationSourceHash: "db48f11571369a4b1685c0d33aab6b44b248d879e0bdb57916cbd6b8565752af"
translationStatus: draft
---

The Badge component is a styled recipe wrapper around the `@solidiom/badge` primitive. It provides a visual indicator for status, count, or categorization with variant support.

```tsx
import { StyledBadge, Badge } from "@solidiom/recipes-css"

;<StyledBadge variant="default">Default</StyledBadge>
```

## Variants

Badges support default, secondary, destructive, and outline variants.

```tsx
import { StyledBadge, Badge } from "@solidiom/recipes-css"

;<div>
  <StyledBadge variant="default">Default</StyledBadge>
  <StyledBadge variant="secondary">Secondary</StyledBadge>
  <StyledBadge variant="destructive">Destructive</StyledBadge>
  <StyledBadge variant="outline">Outline</StyledBadge>
</div>
```