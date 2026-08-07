/**
 * Embedded Ed25519 public keys for registry index signature verification (REG-008).
 *
 * Each entry is a base64-encoded, raw (32-byte) Ed25519 public key. During key
 * rotation, both the old and new public keys are present so signatures from
 * either key are accepted.
 *
 * To update after key rotation:
 *   1. Generate new keypair with scripts/setup-registry-signing.sh
 *   2. Append the new base64 public key to this array
 *   3. After one release cycle, remove the old entry
 */

// Placeholder — replaced by setup-registry-signing.sh after first key generation.
// The script outputs the base64 public key for embedding here.
export const REGISTRY_PUBLIC_KEYS: string[] = [
  // Key ID 89cb830913754674 — provisioned 2026-08-07
  "T9BKxYo4DXXHHw15qe7xCo6pVEMyJ2s++OI1zNn/fes=",
]
