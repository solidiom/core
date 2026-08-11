# @solidiom/recipes-tailwind

Styled recipe components using Tailwind CSS utility classes.

## Overview

This package provides pre-styled component wrappers (recipes) that apply Tailwind CSS styling to Solidiom primitives. Each recipe adds visual design, variant support, and semantic slots while delegating all behavior, state management, and accessibility to the underlying primitive.

## Installation

```sh
pnpm add @solidiom/recipes-tailwind tailwindcss @tailwindcss/vite
```

## Usage

Import components directly:

```tsx
import { Button, Dialog, Tabs } from "@solidiom/recipes-tailwind"
```

Import the theme CSS in your application entry:

```css
@import "tailwindcss";
@import "@solidiom/recipes-tailwind/styles/theme.css";
```

## Styling approach

- Uses Tailwind CSS utility classes for all styling
- Variant classes follow the `solidiom-{component}--{variant}` convention
- Size classes use `solidiom-{component}--{size}` (sm, md, lg)
- Fully compatible with Tailwind's dark mode, responsive utilities, and `@apply`

## Available components

All 52 Solidiom primitives have corresponding Tailwind recipes. Individual component styles can be imported via `@solidiom/recipes-tailwind/styles/{component}.css`.

## Theming

The `styles/theme.css` export provides design tokens as CSS custom properties. Pair with `@solidiom/themes` for preset color schemes or customize tokens directly.

## Related

- `@solidiom/recipes-css` — Plain CSS variant
- `@solidiom/recipes-unocss` — UnoCSS variant
- `@solidiom/themes` — Theme presets
