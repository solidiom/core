# @solidiom/recipes-unocss

Styled recipe components using UnoCSS atomic utilities.

## Overview

This package provides pre-styled component wrappers (recipes) that apply UnoCSS styling to Solidiom primitives. Each recipe adds visual design, variant support, and semantic slots while delegating all behavior, state management, and accessibility to the underlying primitive.

## Installation

```sh
pnpm add @solidiom/recipes-unocss unocss @solidiom/unocss-preset
```

## Usage

Import the styled wrappers exported by the package:

```tsx
import { StyledButton, StyledDialog, StyledTabs } from "@solidiom/recipes-unocss"
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

The package's current profile inventory is the `supportedPrimitives` export in each recipe package. The UnoCSS profile currently lists 32 supported primitives. Individual component styles can be imported via `@solidiom/recipes-unocss/styles/{component}.css`.

## Related

- `@solidiom/recipes-css` — Plain CSS variant
- `@solidiom/recipes-tailwind` — Tailwind CSS variant
- `@solidiom/unocss-preset` — UnoCSS preset for Solidiom tokens
- `@solidiom/themes` — Theme presets
