---
contentSchemaVersion: 1
title: Estado vacío básico
description: Componente de estado vacío con ícono, título, descripción y acción.
keywords: [empty-state, placeholder, feedback, no-results]
locale: es
maturity: draft
product: Empty State
productLayer: component
status: draft
package: "@solidiom/recipes-css"
recipe: "empty-state"
section: examples
exampleId: empty-state-component-basic
source:
  path: apps/site/src/components/EmptyStateExample.tsx
  export: EmptyStateExample
  language: tsx
runnable: true
translationSourceHash: "b4b8116e5645d9f6d0edd8d69fa7f6b4b2f325561dc42ba9549f6e1f0c90861c"
translationStatus: draft
---

El componente Empty State proporciona un marcador de posición significativo cuando no hay contenido que mostrar.

```tsx
import { StyledEmptyState, EmptyState } from "@solidiom/recipes-css"

;<StyledEmptyState>
  <EmptyState.Icon>🔍</EmptyState.Icon>
  <EmptyState.Title>No results found</EmptyState.Title>
  <EmptyState.Description>Try adjusting your search.</EmptyState.Description>
  <EmptyState.Action>
    <button type="button">Clear filters</button>
  </EmptyState.Action>
</StyledEmptyState>
```
