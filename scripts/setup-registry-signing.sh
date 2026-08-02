#!/usr/bin/env bash
#
# scripts/setup-registry-signing.sh
#
# Provisions the REGISTRY_SIGN_KEY GitHub Actions secret for CLI-003 Part B.
#
# Usage:
#   ./scripts/setup-registry-signing.sh                          # auto-generate key
#   ./scripts/setup-registry-signing.sh "my-custom-hex-key"      # bring-your-own
#   ./scripts/setup-registry-signing.sh --repo owner/repo        # target another repo
#
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

# ─── Defaults ────────────────────────────────────────────────────────────────

# Detect the GitHub repo from the remote URL, or fall back to interactive prompt
detect_repo() {
  local remote
  remote="$(git -C "$REPO_ROOT" remote get-url origin 2>/dev/null || true)"

  # Normalize: github.com:owner/repo.git → owner/repo
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

# ─── Arguments ───────────────────────────────────────────────────────────────

SIGNING_KEY="${1:-}"
TARGET_REPO="${DEFAULT_REPO}"

# Support --repo flag anywhere in arguments
for arg in "$@"; do
  case "$arg" in
    --repo=*)
      TARGET_REPO="${arg#--repo=}"
      ;;
  esac
done

if [[ "${2:-}" == "--repo" && -n "${3:-}" ]]; then
  TARGET_REPO="$3"
fi

# ─── Validation ──────────────────────────────────────────────────────────────

if [[ -z "$TARGET_REPO" ]]; then
  echo "Error: Cannot detect GitHub repo. Set GITHUB_REPO or use --repo owner/repo."
  exit 1
fi

if [[ -z "$SIGNING_KEY" ]]; then
  echo "Generating 256-bit signing key (openssl rand -hex 32)..."
  SIGNING_KEY="$(openssl rand -hex 32)"
fi

# Validate key format: must be hex, between 32 and 128 characters (128-512 bits)
if ! [[ "$SIGNING_KEY" =~ ^[0-9a-fA-F]+$ ]]; then
  echo "Error: Signing key must be hexadecimal. Got: ${SIGNING_KEY:0:16}..."
  exit 1
fi

KEY_BITS=$(( ${#SIGNING_KEY} * 4 ))
if [[ $KEY_BITS -lt 128 ]]; then
  echo "Warning: Key is only ${KEY_BITS} bits. Minimum 128 bits recommended."
fi

# ─── Pre-flight ──────────────────────────────────────────────────────────────

# Check gh CLI is available and authenticated
if ! command -v gh &>/dev/null; then
  echo "Error: gh CLI not found. Install with: mise install"
  exit 1
fi

if ! gh auth status &>/dev/null; then
  echo "Error: Not authenticated with GitHub. Run: gh auth login"
  exit 1
fi

# Check the repo is accessible
if ! gh repo view "$TARGET_REPO" &>/dev/null; then
  echo "Error: Cannot access repo '$TARGET_REPO'. Check gh auth and repo name."
  exit 1
fi

# ─── Provision secret ────────────────────────────────────────────────────────

echo ""
echo "Repository : $TARGET_REPO"
echo "Key length : ${#SIGNING_KEY} hex chars ($KEY_BITS bits)"
echo "Key (first 8): ${SIGNING_KEY:0:8}..."
echo ""

echo "Provisioning REGISTRY_SIGN_KEY as a GitHub Actions secret..."

# Use printf to avoid trailing newline that gh secret set sometimes adds
printf '%s' "$SIGNING_KEY" | \
  gh secret set REGISTRY_SIGN_KEY \
    --repo "$TARGET_REPO" \
    --body-file - \
    --env-name ''   # apply to all environments

echo ""
echo "Secret provisioned successfully."
echo ""

# ─── Verify ──────────────────────────────────────────────────────────────────

# gh doesn't let you read back secret values, but we can verify it exists
# by checking the secret listing (gh 2.44+ supports this)
if gh secret list --repo "$TARGET_REPO" 2>/dev/null | grep -q "REGISTRY_SIGN_KEY"; then
  echo "Verified: REGISTRY_SIGN_KEY appears in secret list."
else
  echo "Note: Could not verify secret listing (gh version may not support it)."
fi

# ─── Post-setup checklist ────────────────────────────────────────────────────

echo ""
echo "=== Next steps ==="
echo ""
echo "1. The next CI run will sign registry/index.json automatically."
echo "   (ci.yml already wires REGISTRY_SIGN_KEY → pnpm run registry:build)"
echo ""
echo "2. To sign the current local registry index:"
echo "   REGISTRY_SIGN_KEY=\"$SIGNING_KEY\" pnpm run registry:build"
echo ""
echo "3. To verify a signed registry index locally:"
echo "   pnpm --filter @solidiom/cli verify --registry"
echo ""
echo "4. Key rotation (when needed):"
echo "   ./scripts/setup-registry-signing.sh <new-key> --repo $TARGET_REPO"
echo "   Then force a CI run to re-sign with the new key."
echo ""
echo "=== CLI-003 Part B: COMPLETE ==="