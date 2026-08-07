---
contentSchemaVersion: 1
title: "Source Ownership"
description: "Why Solidiom gives you the source code and what that means for your project."
keywords: [source-ownership, no-lock-in, open-source, customization, article]
locale: es
maturity: draft
product: "Solidiom"
productLayer: article
status: draft
date: "2026-08-07"
translationSourceHash: "6f97d1acfc1fed160738e74c7ef362468bc5e2bdccd5a0211441db9e1e5d7f73"
translationStatus: draft
---

# Source Ownership

When you install a Solidiom primitive or template, you get the source code. Not a compiled bundle. Not a CDN link. The actual TypeScript source files land in your project.

## What Source Ownership Means

1. **You can read it** — no minified mystery code in node_modules
2. **You can modify it** — change behavior, add features, fix bugs
3. **You can audit it** — security review every line before deploying
4. **You can fork it** — take the code and never look back
5. **You can vendor it** — commit to your repo and disconnect from upstream

## How It Works

### Package Mode (default)

```sh
solidiom add button
```

Installs `@solidiom/button` as a workspace dependency. Source is in `node_modules/@solidiom/button/source/` — readable, but managed by your package manager.

### Source Mode

```sh
solidiom add button --source
```

Copies the primitive source directly into your project at `src/solidiom/button/`. You own these files completely. They're committed to your repository.

### Integrity Verification

Both modes verify integrity:

```sh
solidiom verify
```

Compares installed file digests against the signed registry manifest. If files have been tampered with (or intentionally modified in source mode), the CLI reports the differences.

## Why Not Just npm?

Traditional component libraries give you a compiled bundle:

- You can't see the implementation
- You can't fix bugs without waiting for a release
- You can't remove features you don't need
- You can't audit for security without decompiling

Solidiom's `source/` emission gives you the same development experience as code you wrote yourself, with the option to stay connected to upstream improvements.

## Trade-offs

| Benefit | Trade-off |
|---------|-----------|
| Full control | You're responsible for your modifications |
| No lock-in | Upstream updates require manual merge (source mode) |
| Auditable | More files in your project |
| Forkable | Divergence from upstream is permanent (source mode) |

## The Registry Contract

The registry ensures that what you install is what was published:

- Every file has a SHA-256 digest in the manifest
- Manifests are signed with Ed25519 (asymmetric verification)
- The CLI fails closed on digest mismatch
- Offline mode works from a local registry snapshot

You don't have to trust us. You can verify.
