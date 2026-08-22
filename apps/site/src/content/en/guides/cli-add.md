---
contentSchemaVersion: 1
title: "Add a Primitive"
description: How to install primitives with solidiom add — package mode, source mode, flags, conflicts, and verification.
keywords:
  - add
  - install
  - primitive
  - source mode
  - package mode
  - conflicts
  - verification
locale: en
maturity: beta
order: 3
audience: intermediate
---

# Add a Primitive

`solidiom add` installs a primitive into your project, either as an npm package or as materialized source files.

## Basic Usage

```bash
solidiom add dialog
```

This resolves the dependency graph for `dialog` and outputs the npm install command. In package mode, it prints the command without running it by default.

## Package Mode vs Source Mode

**Package mode** (default): Resolves the capability graph and outputs the appropriate `npm install`, `pnpm add`, or `yarn add` command for all required packages. The CLI detects your package manager automatically.

```bash
solidiom add dialog --mode package
```

**Source mode**: Materializes source files directly into your project at the configured `sourceDir`. It handles import rewriting, runtime deduplication, and lockfile tracking.

```bash
solidiom add dialog --mode source
```

## Flags

| Flag                 | Description                                                                       |
| -------------------- | --------------------------------------------------------------------------------- |
| `--mode`             | Install mode: `package` or `source`                                               |
| `--registry`         | Custom registry URL for package resolution                                        |
| `--no-network`       | Use only cached or local registry data                                            |
| `--deliverable`      | Product-layer deliverable: `primitive`, `component`, `block`, `template`, `theme` |
| `--styling`          | Styling profile: `css`, `tailwind`, `unocss`                                      |
| `--package-manager`  | Override package manager detection (`npm`, `pnpm`, `yarn`, `bun`)                 |
| `--install`          | Run the install command instead of only printing it                               |
| `--allow-unverified` | Proceed with source install even if byte-level verification fails                 |
| `--force`            | Overwrite files modified locally since last source install                        |
| `--diff`             | Print a unified diff of pending source-install changes without writing            |
| `--dry-run`          | Show what would be done without writing                                           |
| `--json`             | Output as JSON                                                                    |

## Deliverable Kinds

The `--deliverable` flag requests a specific product-layer output:

- `primitive` — Core primitive with its adapters and runtime
- `component` — Composited component with styling, installed into `componentDir`
- `block` — Domain-aware block with layout and state, installed into `blockDir`
- `template` — Full project template
- `theme` — Theme package, installed into `themeDir`

## Styling Profiles

Use `--styling` to request a specific styling output:

- `css` — CSS custom properties and utility classes
- `tailwind` — Tailwind CSS utility classes
- `unocss` — UnoCSS utility classes

## Conflict Handling

In source mode, if locally modified files would be overwritten, the install is blocked with remediation hints:

```
Blocked — locally modified files would be overwritten:
  ✗ src/ui/primitives/dialog/Dialog.tsx
```

Options to resolve conflicts:

1. `solidiom add dialog --mode source --diff` — Preview pending changes before applying
2. `solidiom add dialog --mode source --force` — Overwrite locally modified files
3. `solidiom diff --primitive dialog` — Review all changes between installed source and lockfile

## Verification Bypass

By default, source installs require byte-level verification against the registry manifest. If verification fails, you can bypass with `--allow-unverified`. The lockfile records the entry with `provenance: "unverified"` so it can be audited later.

```bash
solidiom add dialog --mode source --allow-unverified
```

## Package Manager Detection

The CLI auto-detects your package manager by looking for lock files (`pnpm-lock.yaml`, `yarn.lock`, `bun.lockb`) or configuration files. Override with `--package-manager`:

```bash
solidiom add dialog --install --package-manager pnpm
```

Pass `--install` to actually run the install command rather than just printing it.
