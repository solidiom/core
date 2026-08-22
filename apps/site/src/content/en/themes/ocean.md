---
contentSchemaVersion: 1
title: Ocean Theme
description: A deep teal and cyan palette inspired by ocean depths.
keywords: [ocean, theme, preset, tokens, styling]
locale: en
maturity: beta
product: Ocean
productLayer: theme
status: published
themeSchemaVersion: 1
outputs: ["css", "tailwind"]
---

A deep teal and cyan palette inspired by ocean depths.

## Overview

Ocean is a preset theme that provides a complete set of design tokens for css, tailwind styling profiles. It includes light and dark mode palettes, typography scales, spacing, and interactive states.

## Palette

Ocean defines a full semantic color palette including surface layers, foreground colors, primary/secondary actions, and semantic states (success, warning, destructive). The palette is designed for WCAG AA contrast compliance in both light and dark modes.

## Typography

The theme inherits the project's font configuration and applies a six-step type scale (xs, sm, base, md, lg, xl) with paired line-heights. Heading and body text follow the Solidiom typeset conventions.

## Tokens

Ocean exposes semantic tokens through CSS custom properties:

- Surface: `--ui-surface`, `--ui-surface-raised`, `--ui-surface-overlay`, `--ui-surface-sunken`
- Foreground: `--ui-foreground`, `--ui-foreground-muted`, `--ui-foreground-subtle`
- Primary: `--ui-primary`, `--ui-primary-hover`, `--ui-primary-foreground`
- States: `--ui-success`, `--ui-warning`, `--ui-destructive`
- Radius: `--ui-radius-sm`, `--ui-radius`, `--ui-radius-lg`, `--ui-radius-full`

## Outputs

Ocean ships in the following output formats:

- **css** — CSS custom properties stylesheet
- **tailwind** — Tailwind CSS configuration mapping

## Installation

```sh
pnpm add @solidiom/themes
```

Import the theme in your project's entry point and apply it through your chosen styling profile. The theme can be used standalone or extended to create a custom theme.
