---
contentSchemaVersion: 1
title: "Solidiom CLI Overview"
description: Introduction to the Solidiom CLI — installation, commands, configuration, and common flags.
keywords:
  - cli
  - installation
  - commands
  - configuration
  - overview
locale: en
maturity: beta
order: 1
audience: beginner
---

# Solidiom CLI Overview

The Solidiom CLI is the primary tool for installing, managing, and verifying Solidiom primitives in your project. It handles dependency resolution, source installs, template scaffolding, artifact verification, and compliance reporting.

## Installation

Install the CLI globally:

```bash
npm install -g @solidiom/cli
```

Or run it directly with npx:

```bash
npx @solidiom/cli --help
```

## Commands

| Command | Description |
|---------|-------------|
| `solidiom init` | Initialize `.solidiom/config.json` in the current project |
| `solidiom plan <primitive>` | Resolve the capability graph for a primitive |
| `solidiom add <primitive>` | Add a primitive in package or source mode |
| `solidiom create <name>` | Scaffold a new project from a template |
| `solidiom inspect <subcommand> [primitive]` | Inspect installed primitives (source, manifest, explain, files, provenance) |
| `solidiom diff` | Show changes between installed source and lockfile digests |
| `solidiom detach <primitive>` | Detach a source-installed primitive from upstream updates |
| `solidiom update <primitive>` | Update source-installed primitives to latest upstream |
| `solidiom doctor` | Check project configuration health |
| `solidiom verify [artifact]` | Verify artifact or registry signatures |
| `solidiom audit` | Generate CycloneDX 1.5 SBOM and license inventory |

## Common Flags

Many commands share these flags:

- `--json` — Output results as JSON instead of human-readable text
- `--no-network` — Use only cached or local registry data; skip network fetches
- `--registry` — Specify a custom registry URL or path for package resolution

## Configuration

### `.solidiom/config.json`

Created by `solidiom init`, this file controls install behavior:

- `sourceDir` — Target directory for source installs (default: `src/ui/primitives`)
- `runtimeDir` — Runtime target directory (default: `src/ui/_runtime`)
- `componentDir` — Target for component deliverables (default: `src/ui/components`)
- `blockDir` — Target for block deliverables (default: `src/ui/blocks`)
- `themeDir` — Target for theme deliverables (default: `src/ui/themes`)
- `stylingProfile` — Styling profile for the project (`css`, `tailwind`, `unocss`)
- `defaultMode` — Default install mode: `package` or `source`
- `positioningAdapter` — Positioning adapter package (default: `@solidiom/adapter-positioning-floating-ui`)

### `.solidiom/policy.json`

Optional policy file that controls security and compliance:

- `signatureMode` — Verification mode: `sigstore`, `trusted-keys`, or `none` (default)
- `trustedIdentities` — Allowed identities for sigstore verification
- `allowedPrimitiveVersions` — Version constraints per primitive package
- `requireVerifiedSource` — Require byte-level verification for source installs (default: `true`)
- `registrySignatureRequired` — Require signed registry index (default: `false`)
- `registryTrustedKeys` — HMAC keys for registry index verification
- `sourceInstallTrustedKeys` — HMAC keys for source-install byte-level integrity