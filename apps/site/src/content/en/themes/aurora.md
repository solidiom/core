---
contentSchemaVersion: 1
title: Aurora Theme
description: A vibrant purple and pink gradient palette.
keywords: [aurora, theme, preset, tokens, styling]
locale: en
maturity: beta
product: Aurora
productLayer: theme
status: published
themeSchemaVersion: 1
outputs: ["css", "tailwind"]
---

A vibrant purple and pink gradient palette.

## Overview

Aurora is a preset theme that provides a complete set of design tokens for css, tailwind styling profiles. It includes light and dark mode palettes, typography scales, spacing, and interactive states.

## Palette

Aurora defines a full semantic color palette including surface layers, foreground colors, primary/secondary actions, and semantic states (success, warning, destructive). The palette is designed for WCAG AA contrast compliance in both light and dark modes.

## Typography

The theme inherits the project's font configuration and applies a six-step type scale (xs, sm, base, md, lg, xl) with paired line-heights. Heading and body text follow the Solidiom typeset conventions.

## Tokens

Aurora exposes semantic tokens through CSS custom properties:

- Surface: `--ui-surface`, `--ui-surface-raised`, `--ui-surface-overlay`, `--ui-surface-sunken`
- Foreground: `--ui-foreground`, `--ui-foreground-muted`, `--ui-foreground-subtle`
- Primary: `--ui-primary`, `--ui-primary-hover`, `--ui-primary-foreground`
- States: `--ui-success`, `--ui-warning`, `--ui-destructive`
- Radius: `--ui-radius-sm`, `--ui-radius`, `--ui-radius-lg`, `--ui-radius-full`

## Outputs

Aurora ships in the following output formats:

- **css** — CSS custom properties stylesheet
- **tailwind** — Tailwind CSS configuration mapping

## Installation

```sh
pnpm add @solidiom/themes
```

Import the theme in your project's entry point and apply it through your chosen styling profile. The theme can be used standalone or extended to create a custom theme.
