---
contentSchemaVersion: 1
title: "Theming"
description: "Customize colors, typography, and spacing with theme presets or the visual builder."
keywords: [theming, themes, customization, presets, tokens, guide]
locale: en
maturity: beta
product: "Solidiom"
productLayer: guide
status: draft
---

# Theming

Solidiom's theme system uses CSS custom properties to control colors, typography, spacing, and interactive states across all components.

## Theme Presets

Five themes ship in `@solidiom/themes`:

| Preset           | Description             | Modes        |
| ---------------- | ----------------------- | ------------ |
| Solidiom Default | Neutral baseline        | Light + Dark |
| Ocean            | Deep teal and cyan      | Light + Dark |
| Forest           | Earthy greens           | Light + Dark |
| Slate            | Neutral grays           | Light + Dark |
| Aurora           | Vibrant purple and pink | Light + Dark |

### Install a Preset

Install the theme package and import a CSS or Tailwind entrypoint:

```sh
pnpm add @solidiom/themes
```

```css
@import "@solidiom/themes/css/ocean.css";
```

## Theme Builder

The visual [Theme Builder](/themes/builder/) lets you:

- Adjust colors, typography, radius, and spacing in real time
- Preview all 32 components in light and dark modes
- Export as CSS variables, Tailwind config, or a shareable link
- Import existing themes for modification

## Custom Themes

Create a custom theme by defining CSS custom properties:

```css
:root {
  --ui-primary: oklch(0.6 0.2 250);
  --ui-surface: oklch(0.98 0.005 250);
  --ui-fg: oklch(0.15 0.02 250);
  --ui-radius: 0.5rem;
}

:root[data-theme="dark"] {
  --ui-primary: oklch(0.7 0.18 250);
  --ui-surface: oklch(0.15 0.02 250);
  --ui-fg: oklch(0.92 0.01 250);
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
