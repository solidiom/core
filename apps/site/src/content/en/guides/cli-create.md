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

`solidiom create <name>` scaffolds a new Solid application from a shipped template, with dependencies pre-configured and ready for `solidiom add`.

## Basic Usage

```bash
solidiom create my-app
```

When a TTY is available, the command prompts for the template and styling profile. The project name remains the required positional argument.

## Flags

| Flag                | Description                                      |
| ------------------- | ------------------------------------------------ |
| `--template`        | Template to scaffold from                        |
| `--package-manager` | Package manager: `npm`, `pnpm`, `yarn`, `bun`    |
| `--styling`         | Styling profile: `css`, `tailwind`, `unocss`     |
| `--no-install`      | Skip running the package manager install step    |
| `--yes`             | Skip prompts; requires the name and `--template` |
| `--force`           | Scaffold into a non-empty destination directory  |
| `--json`            | Output as JSON                                   |

## Available Templates

| Template               | Description                                          |
| ---------------------- | ---------------------------------------------------- |
| `vite-solid-router`    | Client-only Solid starter with Vite and Solid Router |
| `tanstack-start-solid` | Solid starter with TanStack Start and SSR            |

### Vite + Solid Router

```bash
solidiom create my-app --template vite-solid-router --yes
```

### TanStack Start + Solid

```bash
solidiom create my-app --template tanstack-start-solid --yes
```

## Interactive vs Non-Interactive

Use `--yes` for non-interactive mode. It does not choose defaults: the required positional name and `--template` must be supplied.

```bash
solidiom create my-app --template vite-solid-router --styling tailwind --yes
```

Without `--yes`, the command can prompt for missing template or styling values when run with a TTY. Without a TTY, required values must already be present.

## Destination Safety

`solidiom create` refuses to scaffold into:

- A non-empty directory (unless `--force` is passed)
- The user's home directory
- The filesystem root
- The monorepo root
- Any path that escapes the current working directory

## Project Name Validation

The positional project name follows the CLI's npm-compatible validation:

- Lowercase only
- May be scoped (`@scope/name`)
- Allowed characters: `[a-z0-9-._~]`
- Must not start with `.` or `_`
- Maximum 214 characters

## Cleanup on Cancellation

If you cancel the interactive prompts or send SIGINT during scaffolding, the cleanup journal removes only directories that `create` made. If package-manager installation fails, the scaffold is rolled back.
