---
contentSchemaVersion: 1
title: "Failure Recovery and Offline Operations"
description: Troubleshoot common failures — policy blocks, verification errors, conflicts, cancelled scaffolds, and offline installation.
keywords:
  - recovery
  - troubleshooting
  - offline
  - air-gapped
  - verdaccio
  - registry mirror
  - lockfile
locale: en
maturity: beta
order: 8
audience: intermediate
---

# Failure Recovery and Offline Operations

This guide covers common failure scenarios and how to recover from them, including offline and air-gapped deployment.

## Blocked by Policy

When `solidiom add` or `solidiom plan` is blocked by `.solidiom/policy.json`, the output lists each violation:

```
Blocked by policy violations:
  @solidiom/dialog@0.0.2-next.0 not allowed by policy (requires ^0.0.1)
```

To resolve:

- Update `allowedPrimitiveVersions` in `.solidiom/policy.json` to allow the resolved version
- Use `solidiom plan --json` to check the exact version before modifying policy

## Failed Verification

If source-install byte-level verification fails:

```
Source install verification failed: digest mismatch
```

Options:

- Re-run with `--allow-unverified` to bypass (the lockfile records the entry as `provenance: "unverified"`)
- Check that your registry catalog is up to date
- Run `solidiom verify --registry` to verify registry integrity

## Install Conflicts

When source-installed files have been locally modified:

```
Blocked — locally modified files would be overwritten:
  ✗ src/ui/primitives/dialog/Dialog.tsx
```

Remediation options:

- `solidiom add dialog --mode source --diff` — Preview what would change
- `solidiom add dialog --mode source --force` — Overwrite local changes
- `solidiom diff dialog` — Review all local modifications before deciding

## Cancelled Create

If `solidiom create` is cancelled via Ctrl+C or the interactive prompt cancel signal, the cleanup journal removes only the directories that `create` made. Pre-existing content is never affected.

If scaffolding completes but the package manager install fails, `create` rolls back all scaffolded files automatically.

For manual cleanup after an interrupted run, remove the destination directory:

```bash
rm -rf my-app
```

## Offline Operations

The Solidiom CLI supports installation in air-gapped environments with no internet access.

### Prerequisites

- A private npm registry (Verdaccio is the reference implementation)
- A machine with network access to `registry.npmjs.org` for the initial mirror step
- `pnpm` installed on both the mirroring machine and the target environment
- The `solidiom` CLI installed or available as a local binary

### Mirroring Packages to Verdaccio

On a machine with internet access, start Verdaccio and proxy the Solidiom packages:

```bash
# Install and start Verdaccio
npx verdaccio --config ./verdaccio-config.yaml &

# Wait for it to be ready
until curl -s http://localhost:4873 > /dev/null; do sleep 1; done

# Pull all @solidiom/* packages through the proxy
pnpm add @solidiom/runtime @solidiom/dialog @solidiom/select \
  --registry http://localhost:4873 \
  --ignore-workspace

# Or publish monorepo builds directly:
pnpm --filter "@solidiom/*" -r exec pnpm pack
for tarball in packages/*/solidiom-*.tgz; do
  npm publish "$tarball" --registry http://localhost:4873
done
```

Once packages are cached in Verdaccio's `./storage` directory, copy the entire storage folder to the air-gapped environment.

### Registry Catalog Mirroring

The Solidiom CLI uses a registry catalog (`index.json`) to resolve primitive dependency graphs. Copy this to internal infrastructure:

```bash
# From the monorepo root
cp registry/index.json /path/to/internal-cdn/solidiom/registry/index.json
```

Or serve it from the Verdaccio storage directory:

```bash
cp registry/index.json ./verdaccio-storage/@solidiom/registry/index.json
```

### Offline Configuration

In the air-gapped project, configure `.solidiom/config.json`:

```json
{
  "registryPath": "/path/to/local/registry"
}
```

Or use the `SOLIDIOM_REGISTRY_PATH` environment variable:

```bash
export SOLIDIOM_REGISTRY_PATH=/path/to/local/registry
```

### Installing Offline

With Verdaccio running and the registry catalog in place:

```bash
# Start Verdaccio with pre-populated storage
npx verdaccio --config ./verdaccio-config.yaml &

# Install primitives with no network access
solidiom add dialog --registry http://localhost:4873 --no-network
solidiom add select --registry http://localhost:4873 --no-network
```

The `--no-network` flag ensures the CLI does not attempt external network requests. All resolution uses the local registry catalog and private Verdaccio instance.

### Verifying Offline Setup

```bash
# Check that plan resolution works
solidiom plan dialog --registry http://localhost:4873 --no-network --json

# Verify installed files
ls node_modules/@solidiom/dialog
ls node_modules/@solidiom/runtime

# Build the project
pnpm build
```

A reference implementation with Verdaccio configuration and automated tests is available at `tools/offline-fixture/`.

## Doctor Output

`solidiom doctor` checks project configuration health:

```bash
solidiom doctor
```

It reports on:

| Check | Status | Meaning |
|-------|--------|---------|
| `config.json valid` | pass/fail | `.solidiom/config.json` exists and parses against the schema |
| `config.json exists` | warn | Config file missing — run `solidiom init` |
| `policy.json valid` | pass/fail | `.solidiom/policy.json` exists and parses against the schema |
| `policy.json exists` | pass | Optional — using defaults |
| `solid-js dependency` | pass/fail | `solid-js` is listed in `package.json` dependencies |
| `lock.json valid` | pass/warn/fail | `.solidiom/lock.json` exists and has a supported version |
| `source-install provenance` | pass/warn | Warning if unverified entries exist in the lockfile |
| `package manager` | pass | Detected package manager and its source |

A `warn` status does not indicate a failure — only `fail` indicates a problem that needs attention.

## Lock File Recovery

`.solidiom/lock.json` tracks source-installed files with their digests, versions, and provenance. Its structure:

```json
{
  "version": 1,
  "installed": {
    "src/ui/primitives/dialog/Dialog.tsx": {
      "path": "src/ui/primitives/dialog/Dialog.tsx",
      "digest": "abc123...",
      "primitive": "dialog",
      "version": "0.0.1-next.0",
      "detached": false,
      "manifestFilesHash": "def456...",
      "verifiedAt": "2025-06-01T00:00:00Z",
      "provenance": "verified"
    }
  }
}
```

If the lock file becomes corrupted or is deleted, re-running `solidiom add` for each source-installed primitive will regenerate it. Use `solidiom diff` to check for any divergence after regeneration.