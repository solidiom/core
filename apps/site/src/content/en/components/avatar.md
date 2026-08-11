---
contentSchemaVersion: 1
title: Avatar
description: Styled avatar component — the recipe wrapper for the css, tailwind, unocss profile(s) using the avatar primitive.
keywords: [avatar, image, user, component, css, tailwind, unocss]
locale: en
maturity: beta
product: Avatar
productLayer: component
status: published
package: "@solidiom/recipes-css"
recipe: "avatar"
stylingOutputs: ["css", "tailwind", "unocss"]
---

Styled avatar component — the recipe wrapper for the css, tailwind, unocss profile(s) using the avatar primitive.

## Usage

The Avatar component is a styled recipe wrapper around the `@solidiom/avatar` primitive. It adds composition, semantic styling slots, and variant support while delegating all state management and keyboard behavior to the underlying primitive.

```tsx
import { StyledAvatar } from "@solidiom/recipes-css"

;<StyledAvatar src="/user.jpg" alt="User" fallback="U" />
```

## Installation

```sh
pnpm add @solidiom/recipes-css @solidiom/recipes-tailwind @solidiom/recipes-unocss
```

Install the recipe package for your chosen styling profile. The component requires the corresponding `@solidiom/avatar` primitive as a peer dependency.

## Anatomy

The Avatar component wraps the `@solidiom/avatar` primitive. It exposes the primitive's parts through a recipe-applied composition layer:

- **Root** — the wrapper element that applies recipe styles and delegates to the primitive.
- **Image** — the image element displayed when loading succeeds.
- **Fallback** — shown while the image loads or if the image fails to load.

## Variants & states

Avatar inherits its variant and state support from `@solidiom/avatar`. Consult the primitive's documentation for the full list of supported variants, compound variants, and interactive states.

## Styling

Avatar is available in css, tailwind, unocss profiles. Each profile applies the same semantic slots and variant classes, allowing you to swap profiles without changing component usage.

Recipe classes follow the `solidiom-avatar` namespace for CSS profiling and targeting.

## SSR and hydration

Avatar renders as semantic HTML during server rendering. Interactive behavior activates on hydration without layout shift. The recipe layer adds no JavaScript dependencies beyond the underlying primitive.

## Accessibility

Avatar delegates accessibility to `@solidiom/avatar`. See the [Avatar primitive accessibility contract](/primitives/avatar/accessibility/) for the full keyboard, focus, and ARIA contract. The recipe wrapper does not introduce new semantics or interact with the accessibility tree beyond styling.