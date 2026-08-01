---
contentSchemaVersion: 1
title: "Create a Project from a Template"
description: Scaffold a new Solidiom project with solidiom create — templates, flags, safety checks, and cleanup.
keywords:
  - create
  - template
  - scaffold
  - project
  - vite
  - tanstack
locale: en
maturity: beta
order: 4
audience: beginner
---

# Create a Project from a Template

`solidiom create` scaffolds a new Solid application from a template, with dependencies pre-configured and ready for `solidiom add`.

## Basic Usage

```bash
solidiom create my-app
```

This starts an interactive prompt flow to select a template, project name, and styling profile.

## Flags

| Flag | Description |
|------|-------------|
| `--template` | Template to scaffold from |
| `--name` | Project name (also the destination directory) |
| `--package-manager` | Package manager: `npm`, `pnpm`, `yarn`, `bun` |
| `--styling` | Styling profile: `css`, `tailwind`, `unocss` |
| `--no-install` | Skip running the package manager install step |
| `--yes` | Skip all prompts; fail if required flags are missing |
| `--force` | Scaffold into a non-empty destination directory |
| `--json` | Output as JSON |

## Available Templates

| Template | Package | Description |
|----------|---------|-------------|
| `vite-solid-router` | `@solidiom/template-vite-solid-router` | Client-only Solid starter with Vite and Solid Router |
| `tanstack-start-solid` | `@solidiom/template-tanstack-start-solid` | Full-stack starter with TanStack Start and SSR |

### Vite + Solid Router

The fastest path to a working Solidiom project without server-side rendering. Includes two routes, client-side navigation, and a styled Solidiom primitive.

```bash
solidiom create my-app --template vite-solid-router --yes
```

### TanStack Start + Solid

A full-stack template with server-side rendering, suitable for production applications that need SSR.

```bash
solidiom create my-app --template tanstack-start-solid --yes
```

## Interactive vs Non-Interactive

When run interactively, `solidiom create` prompts for template, project name, and styling profile. Pass `--yes` for non-interactive mode, which requires all values from flags:

```bash
solidiom create my-app --template vite-solid-router --styling tailwind --yes
```

Without `--yes` and without a TTY, the command fails if `--template` or `--name` are missing.

## Destination Safety

`solidiom create` refuses to scaffold into:

- A non-empty directory (unless `--force` is passed)
- The user's home directory
- The filesystem root
- The monorepo root
- Any path that escapes the current working directory (path traversal protection)

## Project Name Validation

Project names follow npm naming rules:

- Lowercase only
- May be scoped (`@scope/name`)
- Allowed characters: `[a-z0-9-._~]`
- Must not start with `.` or `_`
- Maximum 214 characters

## Cleanup on Cancellation

If you cancel the interactive prompts or send SIGINT during scaffolding, the cleanup journal removes only the directories that `create` made. Pre-existing directories and files are never touched. If the package manager install fails, all scaffolded files are rolled back.