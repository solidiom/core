# @solidiom/unocss-preset

UnoCSS preset providing Solidiom design tokens and component utilities.

## Overview

This preset registers Solidiom's design token system (colors, spacing, radii, typography) as UnoCSS theme values, and adds custom rules/shortcuts for component styling patterns used by `@solidiom/recipes-unocss`.

## Installation

```sh
pnpm add @solidiom/unocss-preset unocss
```

## Usage

```ts
// uno.config.ts
import { defineConfig } from "unocss"
import { presetSolidiom } from "@solidiom/unocss-preset"

export default defineConfig({
  presets: [presetSolidiom()],
})
```

## What it provides

- **Theme tokens** — Maps Solidiom CSS custom properties to UnoCSS theme values (colors, spacing, radii, font sizes)
- **Component shortcuts** — Registers `solidiom-{component}--{variant}` shortcuts matching the recipe class API
- **State variants** — Adds `data-state-*`, `data-disabled`, `data-loading` variant selectors for component state styling

## Configuration

```ts
presetSolidiom({
  // Prefix for generated utility classes (default: "sol")
  prefix: "sol",
})
```

## Related

- `@solidiom/recipes-unocss` — Recipe components using this preset
- `@solidiom/themes` — Theme presets compatible with UnoCSS
