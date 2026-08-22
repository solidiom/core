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
translationSourceHash: "110e2de3e7aa7624a6595867f7ae63479770c410cbf61ad675e2592def77474b"
translationStatus: "human-reviewed"
translationReviewedBy: "solidiom-team"
translationReviewedAt: "2026-08-18"
---

El componente Badge es un wrapper de receta con estilos sobre el primitivo `@solidiom/badge`. Proporciona un indicador visual para estado, conteo o categorización con soporte de variantes.

```tsx
import { StyledBadge } from "@solidiom/recipes-css"

;<StyledBadge variant="default">Default</StyledBadge>
```

## Variantes

Los badges soportan las variantes default, secondary, destructive y outline.

```tsx
import { StyledBadge } from "@solidiom/recipes-css"

;<div>
  <StyledBadge variant="default">Default</StyledBadge>
  <StyledBadge variant="secondary">Secondary</StyledBadge>
  <StyledBadge variant="destructive">Destructive</StyledBadge>
  <StyledBadge variant="outline">Outline</StyledBadge>
</div>
```
