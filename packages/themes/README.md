# @solidiom/themes

Theme presets for Solidiom components.

## Overview

This package provides ready-to-use color schemes and design token presets that work across all three styling profiles (CSS, Tailwind, UnoCSS). Each theme defines a complete set of CSS custom properties covering colors, radii, spacing, and typography scales.

## Installation

```sh
pnpm add @solidiom/themes
```

## Available themes

| Theme              | Description                             |
| ------------------ | --------------------------------------- |
| `solidiom-default` | Neutral baseline with balanced contrast |
| `ocean`            | Cool blue palette with teal accents     |
| `forest`           | Natural greens with warm earth tones    |
| `slate`            | Muted grays with subtle blue undertones |
| `aurora`           | Vibrant purples and magentas            |

## Usage

### With CSS recipes

```css
@import "@solidiom/themes/css/ocean.css";
@import "@solidiom/recipes-css/styles";
```

### With Tailwind recipes

```css
@import "@solidiom/themes/tailwind/ocean.css";
@import "@solidiom/recipes-tailwind/styles/theme.css";
```

### Via CLI

```sh
npx solidiom add --theme ocean
```

## Customization

Themes are pure CSS custom property definitions. Override individual tokens in your own stylesheet:

```css
:root {
  --sol-color-primary: oklch(0.6 0.2 250);
  --sol-radius: 8px;
}
```

## Related

- `@solidiom/recipes-css` — Plain CSS recipe components
- `@solidiom/recipes-tailwind` — Tailwind CSS recipe components
- `@solidiom/recipes-unocss` — UnoCSS recipe components
