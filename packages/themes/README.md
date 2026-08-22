# @solidiom/themes

Theme presets for Solidiom recipes.

## Overview

This package provides five ready-to-use themes: `solidiom-default`, `ocean`, `forest`, `slate`, and `aurora`. Each theme ships CSS custom-property values for the CSS and Tailwind recipe profiles, including light and dark modes, colors, radii, shadows, and type-scale tokens.

The package does not export an UnoCSS-specific theme entrypoint. UnoCSS recipes use the same `--ui-*` custom-property namespace, so a CSS theme stylesheet can provide the shared token values when that integration is appropriate.

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
@import "@solidiom/recipes-tailwind/styles";
```

There is no `solidiom theme` CLI command. Install a theme package and import the stylesheet explicitly.

## Customization

Themes define `--ui-*` custom properties. Override individual tokens in your own stylesheet:

```css
:root {
  --ui-primary: oklch(0.6 0.2 250);
  --ui-radius: 8px;
}
```

## Related

- `@solidiom/recipes-css` — Plain CSS recipe components
- `@solidiom/recipes-tailwind` — Tailwind CSS recipe components
- `@solidiom/recipes-unocss` — UnoCSS recipe components
