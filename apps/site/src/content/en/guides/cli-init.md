---
contentSchemaVersion: 1
title: "Initialize a Project"
description: How to set up a new project with solidiom init, including config and policy defaults.
keywords:
  - init
  - configuration
  - setup
  - config.json
  - policy.json
locale: en
maturity: beta
order: 2
audience: beginner
---

# Initialize a Project

`solidiom init` creates the `.solidiom/config.json` file that tells the CLI how to install and manage primitives in your project.

## Usage

```bash
solidiom init
```

If a config file already exists, the command reports that config is present and exits. Pass `--force` to overwrite.

## Flags

- `--force` — Overwrite an existing config file
- `--json` — Output the result as JSON

## Default Configuration

Running `solidiom init` with no arguments produces `.solidiom/config.json` with these defaults:

```json
{
  "positioningAdapter": "@solidiom/adapter-positioning-floating-ui",
  "sourceDir": "src/ui/primitives",
  "runtimeDir": "src/ui/_runtime",
  "componentDir": "src/ui/components",
  "blockDir": "src/ui/blocks",
  "themeDir": "src/ui/themes",
  "defaultMode": "package"
}
```

## Config File Settings

| Setting              | Type                            | Default                                     | Description                                      |
| -------------------- | ------------------------------- | ------------------------------------------- | ------------------------------------------------ |
| `sourceDir`          | string                          | `src/ui/primitives`                         | Target directory for source-installed primitives |
| `runtimeDir`         | string                          | `src/ui/_runtime`                           | Runtime target directory for source installs     |
| `componentDir`       | string                          | `src/ui/components`                         | Target directory for component deliverables      |
| `blockDir`           | string                          | `src/ui/blocks`                             | Target directory for block deliverables          |
| `themeDir`           | string                          | `src/ui/themes`                             | Target directory for theme deliverables          |
| `stylingProfile`     | `css` \| `tailwind` \| `unocss` | (none)                                      | Project-wide styling profile                     |
| `defaultMode`        | `package` \| `source`           | `package`                                   | Default install mode for `solidiom add`          |
| `positioningAdapter` | string                          | `@solidiom/adapter-positioning-floating-ui` | Positioning adapter package                      |

## Policy File

`.solidiom/policy.json` is optional. If it exists, it controls verification and version constraints with these defaults:

```json
{
  "signatureMode": "none",
  "trustedIdentities": [],
  "allowedPrimitiveVersions": {},
  "registrySignatureRequired": false,
  "registryPublicKeys": [],
  "requireVerifiedSource": true
}
```

| Setting                     | Type                                   | Default | Description                                         |
| --------------------------- | -------------------------------------- | ------- | --------------------------------------------------- |
| `signatureMode`             | `sigstore` \| `trusted-keys` \| `none` | `none`  | Artifact signature verification mode                |
| `trustedIdentities`         | string[]                               | `[]`    | Identities allowed for sigstore verification        |
| `allowedPrimitiveVersions`  | record                                 | `{}`    | Version constraints per package name                |
| `registrySignatureRequired` | boolean                                | `false` | Require signed registry index                       |
| `registryPublicKeys`        | string[]                               | `[]`    | Ed25519 public keys (base64) for registry verification |
| `requireVerifiedSource`     | boolean                                | `true`  | Require byte-level verification for source installs |

## Next Steps

After initialization, use `solidiom add <primitive>` to install your first primitive.
