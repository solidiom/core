# @solidiom/recipes-unocss

Styled recipe components using UnoCSS atomic utilities.

## Overview

This package provides pre-styled component wrappers (recipes) that apply UnoCSS styling to Solidiom primitives. Each recipe adds visual design, variant support, and semantic slots while delegating all behavior, state management, and accessibility to the underlying primitive.

## Installation

```sh
pnpm add @solidiom/recipes-unocss unocss @solidiom/unocss-preset
```

## Usage

Import components directly:

```tsx
import { Button, Dialog, Tabs } from "@solidiom/recipes-unocss"
```

Configure UnoCSS with the Solidiom preset:

```ts
// uno.config.ts
import { defineConfig } from "unocss"
import { presetSolidiom } from "@solidiom/unocss-preset"

export default defineConfig({
  presets: [presetSolidiom()],
})
```

## Styling approach

- Uses UnoCSS atomic utility classes
- Integrates with UnoCSS's on-demand generation for minimal CSS output
- Variant classes follow the same `solidiom-{component}--{variant}` convention
- Compatible with UnoCSS shortcuts, rules, and theme configuration

## Available components

All 52 Solidiom primitives have corresponding UnoCSS recipes. Individual component styles can be imported via `@solidiom/recipes-unocss/styles/{component}.css`.

## Related

- `@solidiom/recipes-css` — Plain CSS variant
- `@solidiom/recipes-tailwind` — Tailwind CSS variant
- `@solidiom/unocss-preset` — UnoCSS preset for Solidiom tokens
- `@solidiom/themes` — Theme presets
