---
contentSchemaVersion: 1
title: "CLI Reference"
description: "Reference for the solidiom command-line interface."
keywords: [cli, commands, create, add, plan, inspect, guide]
locale: en
maturity: beta
product: "Solidiom"
productLayer: guide
status: draft
---

# CLI Reference

The `solidiom` CLI initializes projects, resolves and installs deliverables, scaffolds templates, inspects source installs, and verifies artifacts or the registry catalog.

## Installation

The published package is `@solidiom/cli`:

```sh
npm install -g @solidiom/cli
```

Or run it without a global install:

```sh
npx @solidiom/cli --help
```

The executable installed by the package is named `solidiom`.

## Commands

### `solidiom init`

Create or initialize `.solidiom/config.json` in the current project.

### `solidiom plan <primitive>`

Resolve a deliverable and show the planned packages/files without installing or writing them.

```sh
solidiom plan button
solidiom plan dialog --styling css --no-network
```

### `solidiom add <primitive>`

Add a primitive or another supported deliverable. Package mode is the default and prints the package-manager command; use `--install` to run it. Use `--mode source` to materialize source files.

```sh
solidiom add button
solidiom add dialog --styling tailwind --install
solidiom add dialog --mode source
```

Relevant options include `--mode`, `--registry`, `--no-network`, `--deliverable`, `--styling`, `--package-manager`, `--install`, `--allow-unverified`, `--force`, `--diff`, `--dry-run`, and `--json`.

### `solidiom create <name>`

Scaffold one of the shipped templates. The project name is a required positional argument. Non-interactive runs also require `--template`.

```sh
solidiom create my-app --template vite-solid-router --yes
solidiom create my-app --template tanstack-start-solid --styling tailwind --yes
```

### `solidiom inspect <subcommand> [primitive]`

Inspect installed source, manifests, files, explanations, or provenance. Run `solidiom inspect --help` for the available subcommands.

### `solidiom diff [--primitive <name>]`

Show changes between source-installed files and their lockfile digests.

```sh
solidiom diff
solidiom diff --primitive dialog
```

### `solidiom detach <primitive>`

Detach a source-installed primitive from upstream updates.

### `solidiom update <primitive>`

Update a source-installed primitive from upstream.

### `solidiom doctor`

Check project configuration and source-install health.

### `solidiom verify`

Verify an artifact against the configured policy. An artifact path is required unless `--registry` is used.

```sh
solidiom verify ./dist/dialog.tgz --no-network
solidiom verify --registry
```

Use `--json` for machine-readable output. There is no `--fix` option.

### `solidiom audit`

Generate the CLI's CycloneDX SBOM and license inventory.

## Configuration

Project configuration lives in `.solidiom/config.json`. Supported fields are:

- `positioningAdapter`
- `sourceDir`
- `runtimeDir`
- `componentDir`
- `blockDir`
- `themeDir`
- `defaultMode` (`package` or `source`)
- `stylingProfile` (`css`, `tailwind`, or `unocss`)

Signature and registry-verification settings live separately in `.solidiom/policy.json`.

## Offline operation

Use `--no-network` with commands that resolve registry data when network access must be disabled. `--registry` selects the registry source; it does not define a project configuration field.
