---
contentSchemaVersion: 1
title: Forest Theme
description: An earthy green palette with warm undertones.
keywords: [forest, theme, preset, tokens, styling]
locale: en
maturity: beta
product: Forest
productLayer: theme
status: published
themeSchemaVersion: 1
outputs: ["css", "tailwind"]
---

An earthy green palette with warm undertones.

## Overview

Forest is a preset theme that provides a complete set of design tokens for css, tailwind styling profiles. It includes light and dark mode palettes, typography scales, spacing, and interactive states.

## Palette

Forest defines a full semantic color palette including surface layers, foreground colors, primary/secondary actions, and semantic states (success, warning, destructive). The palette is designed for WCAG AA contrast compliance in both light and dark modes.

## Typography

The theme inherits the project's font configuration and applies a six-step type scale (xs, sm, base, md, lg, xl) with paired line-heights. Heading and body text follow the Solidiom typeset conventions.

## Tokens

Forest exposes semantic tokens through CSS custom properties:

- Surface: `--sol-surface`, `--sol-surface-raised`, `--sol-surface-overlay`, `--sol-surface-sunken`
- Foreground: `--sol-foreground`, `--sol-foreground-muted`, `--sol-foreground-subtle`
- Primary: `--sol-primary`, `--sol-primary-hover`, `--sol-primary-foreground`
- States: `--sol-success`, `--sol-warning`, `--sol-destructive`
- Radius: `--sol-radius-sm`, `--sol-radius`, `--sol-radius-lg`, `--sol-radius-full`

## Outputs

Forest ships in the following output formats:

- **css** — CSS custom properties stylesheet
- **tailwind** — Tailwind CSS configuration mapping

## Installation

```sh
pnpm add @solidiom/themes
```

Import the theme in your project's entry point and apply it through your chosen styling profile. The theme can be used standalone or extended to create a custom theme.
