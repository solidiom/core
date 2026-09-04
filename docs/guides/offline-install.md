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

## Step 2: Mirror the static registry catalog to the air-gapped filesystem

The Solidiom CLI resolves primitive dependency graphs from a registry catalog (`index.json`) that it reads from the **local filesystem** — it does not fetch the catalog over HTTP. Copy the catalog to a directory on the air-gapped machine that the CLI can resolve (see Step 3):

```bash
# From the monorepo root (on the connected machine), copy the catalog directory
# to a location you will point SOLIDIOM_REGISTRY_PATH at:
cp registry/index.json /path/to/local/registry/index.json

# Or place it where the CLI auto-discovers it inside a project, at
# .solidiom/registry-cache.json (the lowest-priority resolution candidate):
cp registry/index.json <project>/.solidiom/registry-cache.json
```

If you also stage the catalog on an internal CDN for other tooling, note that the CLI itself only reads a local path — a CDN URL is not one of its resolution candidates.

## Step 3: Point the CLI at the internal registry catalog

The Solidiom CLI resolves the primitive dependency graph from a **registry catalog directory** — a folder containing `index.json` (and the per-primitive `*.json` manifests). This is separate from the npm registry (Verdaccio) that serves the package tarballs. Point the CLI at your mirrored catalog directory with the `SOLIDIOM_REGISTRY_PATH` environment variable:

```bash
# Directory that CONTAINS index.json (not the file itself)
export SOLIDIOM_REGISTRY_PATH=/path/to/local/registry
```

Alternatively, pass the same directory per-invocation with the `--registry` flag (see Step 4). The CLI's catalog-resolution order is: `--registry <dir>`, then `SOLIDIOM_REGISTRY_PATH`, then the monorepo-relative `registry/index.json`, then `node_modules/@solidiom/registry/index.json`, then `.solidiom/registry-cache.json`.

> **Note:** `.solidiom/config.json` does **not** carry registry location. Its schema covers install targets and styling profile (`sourceDir`, `runtimeDir`, `componentDir`, `blockDir`, `themeDir`, `positioningAdapter`, `defaultMode`, `stylingProfile`). Use `SOLIDIOM_REGISTRY_PATH` or `--registry` for the catalog location, and your package manager's `.npmrc` / `--registry` for the npm registry that serves tarballs.

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

The `--no-network` flag ensures the CLI will not attempt any external network requests. Primitive-graph resolution happens against the local catalog (from `SOLIDIOM_REGISTRY_PATH`, or a `registry/index.json` copied to `.solidiom/registry-cache.json` as in Step 2), and the package tarballs are installed from the private Verdaccio instance. The `--registry` value is forwarded to package resolution; ensure the catalog is also reachable via one of the resolution paths in Step 3 (the reference fixture in `tools/offline-fixture/` copies `registry/index.json` to `.solidiom/registry-cache.json` to guarantee this).

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
