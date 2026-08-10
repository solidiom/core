---
contentSchemaVersion: 1
title: Basic empty state
description: Empty state component with icon, title, description, and action.
keywords: [empty-state, placeholder, feedback, no-results]
locale: en
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
---

The Empty State component provides a meaningful placeholder when there is no content to display.

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
