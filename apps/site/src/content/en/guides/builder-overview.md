---
contentSchemaVersion: 1
title: "Theme Builder Overview"
description: Customize Solidiom themes visually — token editor, live preview, export, and share.
keywords:
  - theme
  - builder
  - customize
  - tokens
  - preview
  - export
  - share
locale: en
maturity: beta
order: 9
audience: beginner
---

# Theme Builder Overview

The Solidiom Theme Builder lets you customize color, spacing, and shape tokens visually, preview changes across light and dark modes, export to your styling profile, and share themes via URL.

Access it at **/themes/builder**.

## How It Works

The builder is entirely client-side. All theme state lives in your browser — nothing is sent to a server or stored in a database. When you share a theme, the entire theme definition is encoded into the URL fragment (`#t=...`). Opening that URL reconstructs the theme in the builder.

## Token Editor

The editor groups tokens into categories:

- **Surface** — background, raised, and overlay surfaces
- **Foreground** — primary, secondary, and muted text
- **Border** — division and interactive borders
- **Intent** — success, warning, danger, and info colors
- **Focus** — focus ring color and offset
- **Radius** — corner radius values
- **Shadow** — elevation shadows

Color tokens use native color pickers. All tokens support text input for precise values. Many tokens use `ref()` notation, referencing another token (e.g., `ref("surface")` for a derived value). The editor displays a reference badge when a token is a reference.

### Light/Dark Mode Editing

Switch the editor between light and dark mode to edit each mode independently. The preview panel shows both modes side by side.

### Undo and Reset

The editor maintains a stack of 10 undo steps. You can reset a single token to its default or reset the entire theme.

## Live Preview

The preview panel renders real Solidiom components so you can see how your theme affects:

- Buttons (all variants)
- Form controls (Input, Checkbox, Switch)
- Cards and Badges
- Tabs navigation
- Progress bars
- Alerts (success, warning, error)
- Separators

## Export

Export your theme in four formats:

- **JSON** — Versioned theme definition, compatible with `@solidiom/themes` schema. Use this for programmatic consumption or as a project theme seed.
- **CSS** — `:root` custom properties with `--sol-*` namespace for both light and dark modes. Import directly in your stylesheet.
- **Tailwind v4** — `@theme` block with `--color-*`, `--radius-*`, and `--shadow-*` variables. Add to your Tailwind configuration.
- **UnoCSS** — CSS custom properties, identical to the CSS export.

Each export resolves `ref()` tokens to their final values. You can copy to clipboard or download as a file.

## Share

Generate a shareable URL that encodes your theme. The URL uses base64url encoding with a 50KB size limit. Anyone who opens the URL sees your theme loaded in the builder.

## Privacy

The builder does not send theme values, colors, or user-generated content to any server. Analytics track only categorical events (opened, exported format, shared) without free-form data. See the [Privacy page](/privacy) for details.

## Limitations

- **Beta status** — The builder is a beta feature. APIs and export formats may change.
- **URL size limit** — Share links are limited to 50KB. Most themes are well under this limit.
- **No file import** — The builder loads themes from share URLs only. There is no file upload or paste feature.
- **No persistence** — Themes are not saved. Use export or share to preserve a theme.
- **No accounts** — There is no theme library or collaborative editing.
- **Partial preview** — The preview covers 10 components. Full 21-component preview is planned.

## Version Policy

Themes use a versioned schema (`contentSchemaVersion`). The current schema version is 1. When a new schema version is released:

- Old share links with a newer schema version are rejected with a clear error.
- Exported JSON includes the schema version for forward compatibility.
- The builder supports migrating between schema versions when a migration chain is defined.

For the full technical specification, see the [Theme Contract](/docs/contracts/theme-contract).