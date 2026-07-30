---
id: offline-install
title: "Enterprise Offline Installation"
doc_type: how-to
audience: "Enterprise platform teams"
tags: [enterprise, offline, installation, registry]
lifecycle: current
---

# Enterprise Offline Installation

This guide walks through setting up Solidiom in an air-gapped (no internet) environment using a private npm registry.

## Prerequisites

- A private npm registry (this guide uses [Verdaccio](https://verdaccio.org/) as reference)
- A machine with network access to `registry.npmjs.org` for the initial mirror step
- `pnpm` installed on both the mirroring machine and the target environment
- The `solidiom` CLI installed or available as a local binary

## Step 1: Mirror @solidiom/\* packages to a private registry

On a machine with internet access, start Verdaccio and proxy the Solidiom packages:

```bash
# Install and start Verdaccio
npx verdaccio --config ./verdaccio-config.yaml &

# Wait for it to be ready
until curl -s http://localhost:4873 > /dev/null; do sleep 1; done

# Pull all @solidiom/* packages through the proxy (this caches them locally)
pnpm add @solidiom/runtime @solidiom/dialog @solidiom/select \
  --registry http://localhost:4873 \
  --ignore-workspace

# Alternatively, publish your monorepo builds directly:
pnpm --filter "@solidiom/*" -r exec pnpm pack
for tarball in packages/*/solidiom-*.tgz; do
  npm publish "$tarball" --registry http://localhost:4873
done
```

Once packages are cached in Verdaccio's `./storage` directory, copy the entire storage folder to your air-gapped environment.

## Step 2: Mirror the static registry catalog to an internal CDN or filesystem

The Solidiom CLI uses a registry catalog (`index.json`) to resolve primitive dependency graphs. Copy this to your internal infrastructure:

```bash
# From the monorepo root (on the connected machine)
cp registry/index.json /path/to/internal-cdn/solidiom/registry/index.json

# Or serve it from the Verdaccio storage directory
cp registry/index.json ./verdaccio-storage/@solidiom/registry/index.json
```

If using a CDN, ensure the file is accessible at a stable URL, e.g.:
`https://internal-cdn.corp.example/solidiom/registry/index.json`

## Step 3: Configure .solidiom/config.json to point to internal registry

In your project on the air-gapped machine, create or update `.solidiom/config.json`:

```json
{
  "registry": "http://localhost:4873",
  "registryPath": "/path/to/local/registry"
}
```

Or use the `SOLIDIOM_REGISTRY_PATH` environment variable:

```bash
export SOLIDIOM_REGISTRY_PATH=/path/to/local/registry
```

This tells the CLI where to find the `index.json` catalog for dependency resolution.

## Step 4: Install primitives in the air-gapped environment

With Verdaccio running locally (using the copied storage) and the registry catalog in place:

```bash
# Start Verdaccio with the pre-populated storage
npx verdaccio --config ./verdaccio-config.yaml &

# Install a primitive using the local registry, no network access required
solidiom add dialog --registry http://localhost:4873 --no-network

# Install multiple primitives
solidiom add select --registry http://localhost:4873 --no-network
solidiom add calendar --registry http://localhost:4873 --no-network
```

The `--no-network` flag ensures the CLI will not attempt any external network requests. All resolution happens against the local registry catalog and the private Verdaccio instance.

## Verification

Confirm the installation works without network access:

```bash
# Disconnect from network (or use network namespace isolation)
# Then verify the primitive was installed correctly:

# Check that plan resolution works
solidiom plan dialog --registry http://localhost:4873 --no-network --json

# Verify installed files exist
ls node_modules/@solidiom/dialog
ls node_modules/@solidiom/runtime

# Run your project's build to confirm imports resolve
pnpm build
```

If `solidiom plan` returns a valid JSON plan and `solidiom add` completes without errors, your offline setup is working correctly.

## Reference implementation

See `tools/offline-fixture/` for a complete working example including:

- `verdaccio-config.yaml` — Verdaccio configuration for local mirroring
- `run-offline-test.sh` — Automated test script that validates the full offline workflow

Run the fixture test to verify your setup:

```bash
./tools/offline-fixture/run-offline-test.sh
```
