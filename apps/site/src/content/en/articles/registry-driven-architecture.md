---
contentSchemaVersion: 1
title: "Registry-Driven Architecture"
description: "How Solidiom's signed registry serves as the single source of truth for primitives, components, blocks, and themes."
keywords: [registry, architecture, integrity, provenance, signing, article]
locale: en
maturity: draft
product: "Solidiom"
productLayer: article
status: draft
date: "2026-08-07"
---

# Registry-Driven Architecture

Solidiom is built around one idea: a verifiable registry is the foundation of a component ecosystem. Everything you install, preview, or compose on solidiom.org traces back to a signed entry in `registry/index.json`.

## The Registry as Source of Truth

The registry is not a metadata sidecar. It is the authoritative catalog:

- Every primitive, component, block, template, and theme has exactly one canonical identity
- Each identity declares its deliverables, dependencies, maturity, version, and install path
- Website routes are generated from registry entries — if it's not in the registry, it has no page
- CLI install commands derive from registry metadata — `solidiom add accordion` reads the registry, not a hardcoded list

## What Each Entry Contains

```json
{
  "name": "accordion",
  "version": "0.0.1-next.0",
  "package": "@solidiom/accordion",
  "status": "stable",
  "deliverables": ["primitive"],
  "documentationLocales": { "en": "stable", "es": "stable" },
  "stylingOutputs": ["css", "tailwind", "unocss"],
  "integrity": { "files": { "source/index.ts": "sha256-..." } },
  "provenance": { "repository": "...", "directory": "packages/accordion" }
}
```

The fields are not decorative. They drive:

- **Installability** — the CLI reads `package`, `version`, and `deliverables` to know what to fetch
- **Catalog rendering** — the website reads `label`, `description`, and `category` for directory views
- **Quality gates** — `documentationLocales` and `status` determine whether a GA criterion is met
- **Supply-chain security** — `integrity` and `provenance` enable verification

## Integrity and Signing

The registry index carries an integrity hash of all entries, and each entry carries per-file SHA-256 digests. The index is signed with Ed25519 asymmetric signatures.

The verification flow is:

1. CLI downloads `registry/index.json`
2. Verifies the Ed25519 signature against the published public key
3. Verifies the entries-level hash matches the `integrity.entriesHash` field
4. For each installed package, verifies per-file digests

If any check fails, the CLI aborts. This is fail-closed: better to install nothing than to install tampered code.

## Why This Matters

Most component libraries have a disconnect between their documentation, their package registry, and their website. Solidiom eliminates that gap:

- **One identity** — no guessing whether `@solidiom/accordion` and the "Accordion" page are the same thing
- **Mechanical verification** — GA quality is checkable by script, not opinion
- **Offline-capable** — a local registry snapshot works for install and verification
- **Auditable** — the registry is a JSON file. You can read it, diff it, and audit its changes

## Relationship to npm

The registry is not a replacement for npm. It is the layer above npm that:

- Declares which npm packages belong to the Solidiom ecosystem
- Specifies their maturity, dependencies, and compatibility
- Signs the metadata so consumers can verify provenance
- Drives the website catalog and CLI commands

npm handles distribution. The registry handles identity.
