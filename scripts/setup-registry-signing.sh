#!/usr/bin/env bash
#
# scripts/setup-registry-signing.sh
#
# Provisions the REGISTRY_SIGN_KEY GitHub Actions secret for asymmetric
# registry index signing (Ed25519, REG-008).
#
# Usage:
#   ./scripts/setup-registry-signing.sh                          # auto-generate key
#   ./scripts/setup-registry-signing.sh "my-hex-private-key"      # bring-your-own
#   ./scripts/setup-registry-signing.sh --repo owner/repo        # target another repo
#
# The secret stores the Ed25519 private key as raw bytes in hex (64 hex chars).
# The public key is printed for embedding in the CLI package.
#
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

# ─── Hex helpers ─────────────────────────────────────────────────────────────
#
# Only POSIX tools are used: `xxd` ships with vim-common and is absent from
# minimal images, and OpenSSL 3.x dropped the `-rawout` pkey option, so the
# previous extraction produced an empty key.

# raw bytes -> lowercase hex, no whitespace
bin2hex() {
  od -An -v -tx1 | tr -d ' \n'
}

# lowercase/uppercase hex on argv -> raw bytes on stdout. Key material only ever
# reaches this (max 96 hex chars), so sed's `\xHH` escapes stay well inside
# xargs' single-argument limit.
hex2bin() {
  printf '%s' "$1" | sed 's/../\\x&/g' | xargs -0 printf
}

# ─── Defaults ────────────────────────────────────────────────────────────────

detect_repo() {
  local remote
  remote="$(git -C "$REPO_ROOT" remote get-url origin 2>/dev/null || true)"

  if [[ "$remote" =~ github\.com[:/](.+)\.git ]]; then
    echo "${BASH_REMATCH[1]}"
    return
  fi

  if [[ -n "${GITHUB_REPO:-}" ]]; then
    echo "$GITHUB_REPO"
    return
  fi

  echo ""
}

DEFAULT_REPO="$(detect_repo)"

# ─── Arguments ────────────────────────────────────────────────────────────────

SIGNING_KEY=""
TARGET_REPO="${DEFAULT_REPO}"

for arg in "$@"; do
  case "$arg" in
    --repo=*)
      TARGET_REPO="${arg#--repo=}"
      ;;
    --repo)
      ;;
    *)
      if [[ -z "$SIGNING_KEY" ]]; then
        SIGNING_KEY="$arg"
      fi
      ;;
  esac
done

prev_was_repo=false
for arg in "$@"; do
  if $prev_was_repo; then
    TARGET_REPO="$arg"
    prev_was_repo=false
    continue
  fi
  if [[ "$arg" == "--repo" ]]; then
    prev_was_repo=true
  fi
done

# ─── Validation ──────────────────────────────────────────────────────────────

if [[ -z "$TARGET_REPO" ]]; then
  echo "Error: Cannot detect GitHub repo. Set GITHUB_REPO or use --repo owner/repo."
  exit 1
fi

if [[ -z "$SIGNING_KEY" ]]; then
  echo "Generating Ed25519 keypair..."
  SIGNING_KEY="$(
    openssl genpkey -algorithm Ed25519 2>/dev/null | openssl pkey -outform DER 2>/dev/null |
      bin2hex | tail -c 64
  )"
fi

# Ed25519 private key is 32 bytes = 64 hex chars
if [[ ${#SIGNING_KEY} -ne 64 ]]; then
  echo "Error: Ed25519 private key must be exactly 64 hex chars (32 bytes). Got ${#SIGNING_KEY}."
  exit 1
fi

if ! [[ "$SIGNING_KEY" =~ ^[0-9a-fA-F]+$ ]]; then
  echo "Error: Private key must be hexadecimal."
  exit 1
fi
SIGNING_KEY="$(printf '%s' "$SIGNING_KEY" | tr 'A-F' 'a-f')"

# The same PKCS#8 header tools/registry-build.ts prepends to the raw 32-byte
# key, so the public key and key ID printed here are exactly what the signer and
# the CLI trust store will agree on. Wrapping with it also proves openssl can
# load the key before anything is written to GitHub or printed.
PKCS8_HEADER="302e020100300506032b657004220420"

if ! hex2bin "${PKCS8_HEADER}${SIGNING_KEY}" | openssl pkey -inform DER -noout 2>/dev/null; then
  echo "Error: The hex is well-formed but not a usable Ed25519 private key."
  exit 1
fi

# ─── Pre-flight ──────────────────────────────────────────────────────────────

if ! command -v gh &>/dev/null; then
  echo "Error: gh CLI not found. Install with: mise install"
  exit 1
fi

if ! gh auth status &>/dev/null; then
  if [[ -f "$REPO_ROOT/.env" ]]; then
    GTOKEN="$(sed -n 's/^GITHUB_TOKEN\s*=\s*//p' "$REPO_ROOT/.env" | head -1 || true)"
    if [[ -n "${GTOKEN:-}" ]]; then
      export GITHUB_TOKEN="$GTOKEN"
    fi
  fi

  if [[ -z "${GITHUB_TOKEN:-}" ]]; then
    echo "Error: Not authenticated with GitHub and no GITHUB_TOKEN in .env."
    echo "Set GITHUB_TOKEN in .env or run: gh auth login"
    exit 1
  fi

  echo "Using GITHUB_TOKEN from .env for gh auth..."
fi

if ! gh repo view "$TARGET_REPO" &>/dev/null; then
  echo "Error: Cannot access repo '$TARGET_REPO'. Check GITHUB_TOKEN permissions and repo name."
  exit 1
fi

# ─── Derive public key for display ────────────────────────────────────────────

# Reconstruct the PKCS#8 DER the signer uses (PKCS8_HEADER, defined with the
# validation checks, plus the raw 32-byte key), then derive the raw public key.
PUBLIC_KEY_HEX="$(
  hex2bin "${PKCS8_HEADER}${SIGNING_KEY}" | openssl pkey -inform DER -pubout -outform DER 2>/dev/null |
    bin2hex | tail -c 64
)"
if [[ -z "$PUBLIC_KEY_HEX" ]]; then
  echo "Error: Could not derive the public key from the supplied private key."
  exit 1
fi
PUBLIC_KEY_B64="$(hex2bin "$PUBLIC_KEY_HEX" | base64)"

# Signature key ID: first 16 hex chars of SHA-256 of the raw public key bytes,
# matching indexV4.integrity.signatureKeyId in tools/registry-build.ts.
SIGNATURE_KEY_ID="$(hex2bin "$PUBLIC_KEY_HEX" | openssl dgst -sha256 -hex 2>/dev/null |
  awk '{print $NF}' | cut -c1-16)"
if [[ ! "$SIGNATURE_KEY_ID" =~ ^[0-9a-f]{16}$ ]]; then
  echo "Error: Could not compute the signature key ID (openssl dgst failed)."
  exit 1
fi

# ─── Provision secret ────────────────────────────────────────────────────────

echo ""
echo "Repository  : $TARGET_REPO"
echo "Algorithm   : Ed25519"
echo "Key ID      : $SIGNATURE_KEY_ID"
echo "Public key  : $PUBLIC_KEY_B64"
echo ""

echo "Provisioning REGISTRY_SIGN_KEY as a GitHub Actions secret..."

gh secret set REGISTRY_SIGN_KEY \
  --repo "$TARGET_REPO" \
  --body "$SIGNING_KEY"

echo ""
echo "Secret provisioned successfully."
echo ""

# ─── Verify ──────────────────────────────────────────────────────────────────

if gh secret list --repo "$TARGET_REPO" 2>/dev/null | grep -q "REGISTRY_SIGN_KEY"; then
  echo "Verified: REGISTRY_SIGN_KEY appears in secret list."
else
  echo "Note: Could not verify secret listing (gh version may not support it)."
fi

# ─── Post-setup checklist ────────────────────────────────────────────────────

echo ""
echo "=== Next steps ==="
echo ""
echo "1. Append the public key to the CLI trust store (keep existing entries so"
echo "   already-signed indexes still verify during rotation):"
echo "   packages/cli/src/registry-public-keys.ts and packages/cli/source/registry-public-keys.ts"
echo "     // Key ID $SIGNATURE_KEY_ID — provisioned $(date -u +%Y-%m-%d)."
echo "     \"$PUBLIC_KEY_B64\","
echo "   and add the matching entry to .solidiom/trusted-keys.json (mark the"
echo "   previous active key \"retired\" only after one release cycle)."
echo ""
echo "2. The next CI run will sign registry/index.json with Ed25519."
echo ""
echo "3. To sign the current local registry index:"
echo "   REGISTRY_SIGN_KEY=\"$SIGNING_KEY\" pnpm run registry:build"
echo ""
echo "4. To verify a signed registry index locally:"
echo "   pnpm --filter @solidiom/cli verify --registry"
echo ""
echo "5. Key rotation (when needed):"
echo "   ./scripts/setup-registry-signing.sh <new-hex-key> --repo $TARGET_REPO"
echo "   Then embed both old and new public keys for dual-key verification."
echo ""
echo "=== REG-008: COMPLETE ==="
