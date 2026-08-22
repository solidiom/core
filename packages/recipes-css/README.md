# @solidiom/recipes-css

Styled recipe components using plain CSS with semantic `data-attribute` selectors.

## Overview

This package provides pre-styled component wrappers (recipes) that apply CSS styling to Solidiom primitives. Each recipe adds visual design, variant support, and semantic slots while delegating all behavior, state management, and accessibility to the underlying primitive.

## Installation

```sh
pnpm add @solidiom/recipes-css
```

## Usage

Import the styled wrappers exported by the package:

```tsx
import { StyledButton, StyledDialog, StyledTabs } from "@solidiom/recipes-css"
```

Or import individual component styles:

```css
@import "@solidiom/recipes-css/styles/button.css";
@import "@solidiom/recipes-css/styles/dialog.css";
```

## Styling approach

- Uses `data-scope` and `data-part` attribute selectors for component targeting
- Supports `data-state`, `data-orientation`, and other semantic state attributes
- No utility classes — pure CSS with custom properties for theming
- Namespace: `solidiom-{component}` (e.g., `solidiom-button`, `solidiom-dialog`)

## Available components

The CSS profile currently supports 32 Solidiom primitives. Import the full bundle via `@solidiom/recipes-css/styles` or an individual stylesheet via `@solidiom/recipes-css/styles/{component}.css`.

## Theming

Pair with `@solidiom/themes` to apply preset color schemes, or define custom properties directly.

## Related

- `@solidiom/recipes-tailwind` — Tailwind CSS variant
- `@solidiom/recipes-unocss` — UnoCSS variant
- `@solidiom/themes` — Theme presets
