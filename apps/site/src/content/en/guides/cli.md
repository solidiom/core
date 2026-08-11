---
contentSchemaVersion: 1
title: "CLI Reference"
description: "Complete reference for the solidiom command-line interface."
keywords: [cli, commands, create, add, plan, inspect, guide]
locale: en
maturity: beta
product: "Solidiom"
productLayer: guide
status: draft
---

# CLI Reference

The `solidiom` CLI manages projects, installs components, and verifies your workspace.

## Installation

```sh
npm install -g solidiom
```

Or use npx for one-off commands:

```sh
npx solidiom <command>
```

## Commands

### `solidiom create`

Create a new project from a template.

```sh
solidiom create my-app --template saas-dashboard
solidiom create my-app --template ai-chat --styling tailwind
solidiom create my-app --yes  # skip prompts
```

**Options:**
- `--template <name>` — template to use (29 available)
- `--styling <profile>` — css, tailwind, or unocss
- `--package-manager <pm>` — npm, pnpm, yarn, or bun
- `--yes` — skip all prompts, use defaults

### `solidiom add`

Add a primitive or component to your project.

```sh
solidiom add button
solidiom add dialog --styling tailwind
solidiom add --theme ocean
```

**Options:**
- `--styling <profile>` — override project styling profile
- `--theme <name>` — install a theme preset
- `--source` — install source files instead of package dependency

### `solidiom plan`

Preview what `add` would install without making changes.

```sh
solidiom plan button
solidiom plan dialog --styling css
```

### `solidiom inspect`

Show detailed information about a primitive or component.

```sh
solidiom inspect button
solidiom inspect dialog --json
```

### `solidiom verify`

Verify workspace integrity against the registry.

```sh
solidiom verify
solidiom verify --fix  # auto-fix recoverable issues
```

### `solidiom diff`

Show differences between installed and registry versions.

```sh
solidiom diff
solidiom diff button
```

## Configuration

Project configuration lives in `.solidiom/config.json`:

```json
{
  "stylingProfile": "tailwind",
  "theme": "ocean",
  "registry": "https://registry.solidiom.org"
}
```

## Package Manager Support

All commands work with npm, pnpm, Yarn, and Bun. The CLI detects your package manager from lockfiles automatically.

## Offline Mode

The CLI supports offline operation via the local registry snapshot. Use `--offline` to force local resolution without network requests.
