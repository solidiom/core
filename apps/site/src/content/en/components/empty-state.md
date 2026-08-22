---
contentSchemaVersion: 1
title: Empty State
description: Styled empty state component — the recipe wrapper for the css, tailwind, unocss profile(s) using the empty-state primitive.
keywords: [empty-state, placeholder, no-data, component, css, tailwind, unocss]
locale: en
maturity: beta
product: Empty State
productLayer: component
status: published
package: "@solidiom/empty-state"
---

Styled empty state component — the recipe wrapper for the css, tailwind, unocss profile(s) using the empty-state primitive.

## Usage

The Empty State component is a styled recipe wrapper around the `@solidiom/empty-state` primitive. It adds composition, semantic styling slots, and variant support while delegating all state management and keyboard behavior to the underlying primitive.

```tsx
import * as EmptyState from "@solidiom/empty-state"

;<EmptyState.Root>
  <EmptyState.Icon />
  <EmptyState.Title>No results found</EmptyState.Title>
  <EmptyState.Description>Try adjusting your search or filters.</EmptyState.Description>
  <EmptyState.Action>Clear filters</EmptyState.Action>
</EmptyState.Root>
```

## Installation

```sh
pnpm add @solidiom/empty-state
```

Install the recipe package for your chosen styling profile. The component requires the corresponding `@solidiom/empty-state` primitive as a peer dependency.

## Anatomy

The Empty State component wraps the `@solidiom/empty-state` primitive. It exposes the primitive's parts through a recipe-applied composition layer:

- **Root** — the wrapper element that provides the empty state container.
- **Icon** — an optional icon or illustration.
- **Title** — the heading describing the empty state.
- **Description** — additional context or guidance.
- **Action** — a call-to-action button to resolve the empty state.

## Variants & states

Empty State inherits its variant and state support from `@solidiom/empty-state`. Consult the primitive's documentation for the full list of supported variants, compound variants, and interactive states.

## Styling

Empty State is available in css, tailwind, unocss profiles. Each profile applies the same semantic slots and variant classes, allowing you to swap profiles without changing component usage.

Recipe classes follow the `solidiom-empty-state` namespace for CSS profiling and targeting.

## SSR and hydration

Empty State renders as semantic HTML during server rendering. Interactive behavior activates on hydration without layout shift. The recipe layer adds no JavaScript dependencies beyond the underlying primitive.

## Accessibility

Empty State delegates accessibility to `@solidiom/empty-state`. See the [Empty State primitive accessibility contract](/primitives/empty-state/accessibility/) for the full keyboard, focus, and ARIA contract. The recipe wrapper does not introduce new semantics or interact with the accessibility tree beyond styling.
