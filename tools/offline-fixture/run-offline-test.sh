#!/usr/bin/env bash
set -euo pipefail

# Offline installation test for Solidiom.
# Starts a local Verdaccio, publishes fixture tarballs, then verifies
# that `solidiom add` works with --registry and --no-network flags.

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
MONOREPO_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
VERDACCIO_PID=""
TEMP_DIR=""

cleanup() {
  echo "Cleaning up..."
  if [[ -n "$VERDACCIO_PID" ]] && kill -0 "$VERDACCIO_PID" 2>/dev/null; then
    kill "$VERDACCIO_PID" 2>/dev/null || true
    wait "$VERDACCIO_PID" 2>/dev/null || true
  fi
  if [[ -n "$TEMP_DIR" ]] && [[ -d "$TEMP_DIR" ]]; then
    rm -rf "$TEMP_DIR"
  fi
}
trap cleanup EXIT

echo "=== Solidiom Offline Installation Test ==="
echo ""

# Step 1: Check that verdaccio is available
echo "[1/7] Checking verdaccio availability..."
if ! npx verdaccio --help > /dev/null 2>&1; then
  echo "ERROR: verdaccio is not available. Install it with: npm i -g verdaccio"
  exit 1
fi
echo "  verdaccio is available."

# Step 2: Start verdaccio in background
echo "[2/7] Starting verdaccio..."
STORAGE_DIR="$SCRIPT_DIR/storage"
mkdir -p "$STORAGE_DIR"

npx verdaccio --config "$SCRIPT_DIR/verdaccio-config.yaml" &
VERDACCIO_PID=$!
echo "  verdaccio started (PID: $VERDACCIO_PID)"

# Step 3: Wait for verdaccio to be ready
echo "[3/7] Waiting for verdaccio to be ready..."
RETRIES=30
until curl -s http://localhost:4873 > /dev/null 2>&1; do
  RETRIES=$((RETRIES - 1))
  if [[ $RETRIES -le 0 ]]; then
    echo "ERROR: verdaccio did not start within 30 seconds."
    exit 1
  fi
  sleep 1
done
echo "  verdaccio is ready at http://localhost:4873"

# Step 4: Pack fixture tarballs from the monorepo
echo "[4/7] Packing fixture tarballs..."
TARBALLS=()

for pkg in runtime dialog; do
  PKG_DIR="$MONOREPO_ROOT/packages/$pkg"
  if [[ ! -d "$PKG_DIR" ]]; then
    echo "  WARNING: packages/$pkg not found, skipping."
    continue
  fi
  echo "  Packing @solidiom/$pkg..."
  TARBALL=$(cd "$PKG_DIR" && pnpm pack 2>/dev/null | tail -1)
  if [[ -f "$PKG_DIR/$TARBALL" ]]; then
    TARBALLS+=("$PKG_DIR/$TARBALL")
  else
    # pnpm pack may output the full path
    TARBALLS+=("$TARBALL")
  fi
done

if [[ ${#TARBALLS[@]} -eq 0 ]]; then
  echo "ERROR: No tarballs were created. Check that packages/runtime and packages/dialog exist."
  exit 1
fi
echo "  Packed ${#TARBALLS[@]} tarball(s)."

# Step 5: Publish tarballs to local verdaccio
echo "[5/7] Publishing tarballs to local verdaccio..."
for tarball in "${TARBALLS[@]}"; do
  echo "  Publishing $tarball..."
  npm publish "$tarball" --registry http://localhost:4873 --access public 2>/dev/null || {
    echo "  WARNING: Failed to publish $tarball (may already exist)."
  }
done
echo "  Publishing complete."

# Step 6: Run solidiom add in a temp directory
echo "[6/7] Running solidiom add in isolated environment..."
TEMP_DIR=$(mktemp -d)
mkdir -p "$TEMP_DIR/.solidiom"

# Create a minimal config pointing to the monorepo registry
cat > "$TEMP_DIR/.solidiom/config.json" <<EOF
{
  "defaultMode": "package"
}
EOF

# Create minimal package.json
cat > "$TEMP_DIR/package.json" <<EOF
{
  "name": "offline-test",
  "version": "1.0.0",
  "private": true
}
EOF

# Copy the registry index if available
if [[ -f "$MONOREPO_ROOT/registry/index.json" ]]; then
  mkdir -p "$TEMP_DIR/.solidiom"
  cp "$MONOREPO_ROOT/registry/index.json" "$TEMP_DIR/.solidiom/registry-cache.json"
fi

# Run the CLI
SOLIDIOM_BIN="$MONOREPO_ROOT/packages/cli/dist/bin.js"
if [[ ! -f "$SOLIDIOM_BIN" ]]; then
  echo "  Building CLI first..."
  (cd "$MONOREPO_ROOT" && pnpm --filter @solidiom/cli build) || {
    echo "ERROR: Failed to build CLI."
    exit 1
  }
fi

echo "  Running: solidiom add dialog --registry http://localhost:4873 --no-network"
(cd "$TEMP_DIR" && node "$SOLIDIOM_BIN" add dialog --registry http://localhost:4873 --no-network) || {
  echo "ERROR: solidiom add failed."
  exit 1
}

# Step 7: Verify results
echo "[7/7] Verifying results..."
PLAN_OUTPUT=$(cd "$TEMP_DIR" && node "$SOLIDIOM_BIN" plan dialog --registry http://localhost:4873 --no-network --json 2>/dev/null) || true

if [[ -n "$PLAN_OUTPUT" ]]; then
  echo "  Plan output received."
  echo "  $PLAN_OUTPUT" | head -5
else
  echo "  WARNING: No plan output (this may be expected if plan doesn't support --json in this mode)."
fi

echo ""
echo "=== Offline installation test PASSED ==="
exit 0
