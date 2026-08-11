---
contentSchemaVersion: 1
title: "Theming"
description: "Customize colors, typography, and spacing with theme presets or the visual builder."
keywords: [theming, themes, customization, presets, tokens, guide]
locale: es
maturity: beta
product: "Solidiom"
productLayer: guide
status: draft
translationSourceHash: "9bc1814210828ab480018f328c099bfd4a0948b589913d79bf6285a9de54f68e"
translationStatus: draft
---

# Theming

Solidiom's theme system uses CSS custom properties to control colors, typography, spacing, and interactive states across all components.

## Theme Presets

Four presets ship out of the box:

| Preset | Description | Modes |
|--------|-------------|-------|
| Ocean | Deep teal and cyan | Light + Dark |
| Forest | Earthy greens | Light + Dark |
| Slate | Neutral grays | Light + Dark |
| Aurora | Vibrant purple and pink | Light + Dark |

### Install a Preset

```sh
npx solidiom add --theme ocean
```

Or import directly:

```css
@import "@solidiom/themes/css/ocean.css";
```

```css
/* Tailwind profile */
@import "@solidiom/themes/tailwind/ocean.css";
```

## Theme Builder

The visual [Theme Builder](/themes/builder/) lets you:

- Adjust colors, typography, radius, and spacing in real time
- Preview all 30 components in light and dark modes
- Export as CSS variables, Tailwind config, or a shareable link
- Import existing themes for modification

## Custom Themes

Create a custom theme by defining CSS custom properties:

```css
:root {
  --sol-color-primary: oklch(0.6 0.2 250);
  --sol-color-surface: oklch(0.98 0.005 250);
  --sol-color-text: oklch(0.15 0.02 250);
  --sol-radius-md: 0.5rem;
  --sol-font-sans: "Inter", system-ui, sans-serif;
}

[data-theme="dark"] {
  --sol-color-primary: oklch(0.7 0.18 250);
  --sol-color-surface: oklch(0.15 0.02 250);
  --sol-color-text: oklch(0.92 0.01 250);
}
```

## Contrast Requirements

All theme tokens must meet WCAG 2.2 AA contrast minimums:

- Body text: 4.5:1
- UI components: 3:1
- Focus indicators: 3:1

The preset audit (`pnpm run audit:preset-themes`) validates these ratios automatically.

## Dark Mode

Themes support light and dark modes via the `data-theme` attribute or `prefers-color-scheme` media query. All presets include both modes.
