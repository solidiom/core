---
contentSchemaVersion: 1
title: "Registry and Signed-Source Ownership"
description: How the Solidiom registry works — integrity, signatures, source verification, and the lockfile audit trail.
keywords:
  - registry
  - integrity
  - signature
  - source
  - ownership
  - verification
  - lockfile
  - provenance
locale: en
maturity: beta
order: 11
audience: intermediate
---

# Registry and Signed-Source Ownership

The Solidiom registry is the source of truth for every primitive, component, block, and template. It drives the catalog on this site and powers the CLI's verified source installs.

## What the Registry Is

The registry is a set of versioned JSON files:

- **`index.json`** — Top-level catalog with schema version, integrity block, and lists of primitives, adapters, components, blocks, and templates.
- **`&lt;name&gt;.json`** — Per-deliverable manifest with metadata, deliverables, dependencies, and file-level integrity digests.

The index carries an HMAC-SHA256 signature (`integrity.manifestSignature`) computed over the concatenated hash of all manifest `filesHash` values. This creates a chain of trust from the index to every file in every deliverable.

## Integrity Model

Each manifest records three levels of integrity data:

1. **Per-file digests** — SHA-256 hash of each source file in the deliverable's `source/` directory.
2. **Manifest hash** — SHA-256 of the sorted, concatenated per-file digests (`integrity.filesHash`). A single value that represents the complete source tree.
3. **Index signature** — HMAC-SHA256 over the index's `entriesHash`, verified against a trusted key or sigstore identity.

When you run `solidiom verify --registry`, the CLI performs a three-step fail-closed check:

1. Validates the schema version of `index.json`.
2. Recomputes each manifest's `filesHash` from its `fileDigests`.
3. Verifies the HMAC signature against your policy's trusted keys.

## Package Mode vs. Source Mode

The CLI supports two installation modes:

### Package Mode

`solidiom add dialog --mode package` installs the primitive from npm as a dependency. You import from `@solidiom/dialog`. Updates come through your package manager.

### Source Mode

`solidiom add dialog --mode source` copies the primitive's source files directly into your project. You own the bytes. This gives you:

- Full visibility into every line of code
- Ability to fork, modify, or audit without pulling a pre-built artifact
- Byte-level verification against the registry's published digests

## The Verification Chain

Source installs follow a strict verification chain:

1. **Registry verification** — The CLI verifies the registry index and the deliverable's manifest signature. If either fails, the install stops.
2. **Byte-level verification** — Each source file is hashed with SHA-256 and compared against the manifest's `fileDigests`. A mismatch blocks the install.
3. **Conflict detection** — If a file already exists in your project and differs from the registry version, the install blocks by default. Use `solidiom diff` to see what changed, or `--force` to overwrite.
4. **Rollback journal** — All writes are wrapped in a journal. If the install fails mid-way, every file is restored to its pre-install state.

## The Lockfile

After a successful install, `.solidiom/lock.json` records:

| Field               | Purpose                                       |
| ------------------- | --------------------------------------------- |
| `path`              | Relative path of the installed file           |
| `digest`            | SHA-256 of the source content at install time |
| `primitive`         | Source primitive name                         |
| `version`           | Version from the registry at install time     |
| `manifestFilesHash` | Registry integrity at install time            |
| `signatureKeyId`    | Which key verified the registry               |
| `verifiedAt`        | ISO-8601 verification timestamp               |
| `provenance`        | `"verified"` or `"unverified"`                |

The `provenance` field is the audit trail. A value of `"unverified"` means `--allow-unverified` was used. In CI, `assert-no-unverified` fails the build if any lockfile entry has unverified provenance.

## Fail-Closed Behavior

The default policy is secure by default:

- `requireVerifiedSource: true` — Source installs require byte-level verification
- `signatureMode: "none"` — Registry signature verification is optional by default (set to `"sigstore"` or `"trusted-keys"` for full chain-of-trust)
- `registrySignatureRequired: false` — Index signature is not enforced unless you opt in

When verification fails, the CLI explains which check failed, what was expected, and what was found. It does not silently degrade.

## Verification Modes

### Sigstore (Keyless)

Uses `@sigstore/verify` with TUF root trust. Verifies certificate chain, transparency log inclusion, and identity against `trustedIdentities` in your policy.

### Trusted Keys

Uses explicit signing keys from `.solidiom/trusted-keys.json`. Supports ed25519 and RSA, with active and retired key management.

### None

Verification is disabled. Source files are still hashed and compared against the manifest, but the registry index signature is not checked.

## Related Guides

- [CLI Overview](/guides/cli-overview) — Commands, flags, and configuration
- [Verify Artifacts and Registry](/guides/cli-verify) — `solidiom verify` in detail
- [Add a Primitive](/guides/cli-add) — Package and source mode
