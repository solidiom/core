---
contentSchemaVersion: 1
title: "Verificar artefactos y registro"
description: "Cómo verificar la integridad de artefactos y del catálogo del registro con solidiom verify, incluyendo modos sigstore, trusted-keys, y verificación del registro."
keywords:
  [verify, verificar, firmas, integridad, sigstore, trusted-keys, registro, seguridad, policy]
locale: es
maturity: beta
order: 6
audience: advanced
translationSourceHash: "de05b75ec0583d42e914173c61d2cab2854e5b97f2edb2f7237ea9b2f1100d3f"
translationStatus: "human-reviewed"
translationReviewedBy: "solidiom-team"
translationReviewedAt: "2026-08-18"
---

# Verificar artefactos y registro

El comando `solidiom verify` proporciona tres mecanismos de verificación: firmas de artefactos individuales con sigstore, verificación con claves confiables, e integridad del catálogo del registro.

## Modos de verificación

El modo de verificación se controla mediante `.solidiom/policy.json`:

```json
{
  "signatureMode": "sigstore"
}
```

Los modos disponibles son:

- `none` — verificación deshabilitada (valor predeterminado)
- `sigstore` — verificación sin claves usando Sigstore
- `trusted-keys` — verificación con claves ed25519/RSA explícitas

## Verificar un artefacto

```bash
solidiom verify ./dist/dialog.tgz
```

El comando consulta `.solidiom/policy.json` para determinar el modo de verificación, aplica el método correspondiente, y reporta el resultado.

### Modos sin claves (sigstore)

En el modo `sigstore`, la CLI usa `@sigstore/verify` y `@sigstore/tuf` para verificación sin claves:

1. Busca un bundle Sigstore junto al artefacto (`<artefacto>.sigstore.json`)
2. Obtiene la raíz de confianza de TUF (o usa la caché con `--no-network`)
3. Verifica la cadena de certificados, inclusión en tlog, e identidad contra `policy.trustedIdentities`

```bash
solidiom verify ./dist/dialog.tgz --no-network
```

### Claves confiables (trusted-keys)

En el modo `trusted-keys`, la CLI lee `.solidiom/trusted-keys.json` y verifica la firma del artefacto contra cada clave activa:

```json
[
  {
    "id": "key-1",
    "algorithm": "ed25519",
    "publicKey": "-----BEGIN PUBLIC KEY-----\n...",
    "status": "active",
    "addedAt": "2025-01-01T00:00:00Z"
  }
]
```

Los algoritmos soportados son `ed25519`, `rsa-sha256`, y `rsa-sha512`.

Las claves con `status: "retired"` se aceptan para artefactos firmados antes de su fecha `retiredAt`.

## Verificar el registro

La bandera `--registry` activa la verificación de integridad del catálogo:

```bash
solidiom verify --registry
```

Este modo verifica:

1. Que `registry/index.json` se ajuste al esquema soportado
2. Que cada manifiesto por primitivo exista, sea válido, y su `filesHash` coincida con la recomputación de sus `fileDigests`
3. Si la política lo requiere, que la firma del índice del registro se verifique contra las claves de confianza

### Firma del registro

Si `policy.registrySignatureRequired` es `true`, el índice del registro debe携带 una firma Ed25519 válida:

```json
{
  "registrySignatureRequired": true,
  "registryPublicKeys": ["clave-publica-ed25519-base64"]
}
```

La CLI verifica contra claves públicas embebidas en el paquete CLI, `REGISTRY_VERIFY_KEY` (clave pública Ed25519 en base64), y `policy.registryPublicKeys`.

```bash
export REGISTRY_VERIFY_KEY=clave-publica-ed25519-base64
solidiom verify --registry
```

## Salida

### Verificación exitosa

```bash
solidiom verify ./dist/dialog.tgz
# Verified (sigstore): Sigstore bundle verified

solidiom verify --registry
# Registry verified: 12 manifest(s) checked
```

### Verificación fallida

```bash
solidiom verify ./dist/dialog.tgz
# Verification failed (sigstore): No Sigstore bundle found alongside artifact

solidiom verify --registry
# Registry verification failed:
#   dialog: filesHash mismatch
```

## Salida JSON

```bash
solidiom verify ./dist/dialog.tgz --json
solidiom verify --registry --json
```

## Opciones

| Bandera        | Descripción                                                             |
| -------------- | ----------------------------------------------------------------------- |
| `--no-network` | Saltar obtención de TUF; usar raíz de confianza en caché                |
| `--registry`   | Verificar integridad del catálogo del registro en lugar de un artefacto |
| `--json`       | Salida en formato JSON                                                  |

## Códigos de salida

- `0` — verificación exitosa
- `1` — verificación fallida o violaciones
