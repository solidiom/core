---
contentSchemaVersion: 1
title: "Verify Artifacts and Registry"
description: Verify artifact signatures and registry catalog integrity with solidiom verify.
keywords:
  - verify
  - signature
  - sigstore
  - trusted-keys
  - registry
  - integrity
locale: en
maturity: beta
order: 6
audience: advanced
---

# Verify Artifacts and Registry

`solidiom verify` checks the cryptographic signatures of artifacts and the integrity of the registry catalog.

## Artifact Verification

```bash
solidiom verify ./dist/dialog.tgz
```

Without arguments, `solidiom verify` looks for an artifact path. It reads `.solidiom/policy.json` to determine the verification mode, then runs the appropriate check.

## Registry Verification

```bash
solidiom verify --registry
```

This verifies the entire registry catalog: schema validity, manifest integrity, and (if required by policy) signature.

## Flags

| Flag           | Description                                              |
| -------------- | -------------------------------------------------------- |
| `--registry`   | Verify registry catalog integrity instead of an artifact |
| `--no-network` | Skip TUF network fetch; use cached trust root            |
| `--json`       | Output result as JSON                                    |

## Verification Modes

The mode is determined by `signatureMode` in `.solidiom/policy.json`.

### Sigstore (Keyless)

```json
{ "signatureMode": "sigstore", "trustedIdentities": ["builder@solidiom.io"] }
```

Uses `@sigstore/verify` and `@sigstore/tuf` for keyless verification:

- Fetches the TUF trusted root (or uses cached bundle with `--no-network`)
- Parses a Sigstore bundle from `<artifact>.sigstore.json`
- Verifies certificate chain, tlog inclusion, and identity against `trustedIdentities`

### Trusted Keys

```json
{ "signatureMode": "trusted-keys" }
```

Uses explicit ed25519 or RSA key verification with Node.js crypto:

- Reads `.solidiom/trusted-keys.json`
- Reads `<artifact>.sig` (base64-encoded raw signature)
- Verifies via `crypto.verify()` against each active key
- Retired keys are accepted for historical artifacts signed before their `retiredAt` date

### None

```json
{ "signatureMode": "none" }
```

Verification is skipped. This is the default.

## Trusted Keys Format

`.solidiom/trusted-keys.json` is an array of key entries:

```json
[
  {
    "id": "solidiom-release-key",
    "algorithm": "ed25519",
    "publicKey": "-----BEGIN PUBLIC KEY-----\n...",
    "status": "active",
    "addedAt": "2025-01-01T00:00:00Z"
  }
]
```

| Field       | Type                                      | Description                                        |
| ----------- | ----------------------------------------- | -------------------------------------------------- |
| `id`        | string                                    | Key identifier                                     |
| `algorithm` | `ed25519` \| `rsa-sha256` \| `rsa-sha512` | Signature algorithm                                |
| `publicKey` | string                                    | PEM-encoded public key                             |
| `status`    | `active` \| `retired`                     | Key lifecycle status                               |
| `addedAt`   | string                                    | ISO-8601 timestamp when key was added              |
| `retiredAt` | string                                    | ISO-8601 timestamp when key was retired (optional) |

## Registry Catalog Verification

`solidiom verify --registry` performs fail-closed verification:

1. **Schema check** — `registry/index.json` must parse against a supported schema version
2. **Manifest integrity** — Each per-primitive manifest's `filesHash` must match a fresh SHA-256 recomputation of its `fileDigests`
3. **Signature verification** — If `policy.registrySignatureRequired` is true, the index must carry a valid HMAC-SHA256 signature

Verification keys are gathered from:

- `REGISTRY_VERIFY_KEY` environment variable
- `policy.registryTrustedKeys` array (tried in order)

## Output

On success:

```
Registry verified: 19 manifest(s) checked
```

On failure:

```
Registry verification failed:
  ✗ dialog: filesHash mismatch
  ✗ registry index is not signed but signing is required by policy
```
