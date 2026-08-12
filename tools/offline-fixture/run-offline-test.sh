#!/usr/bin/env bash
set -euo pipefail

# Offline installation fixture for Solidiom (CLI-008).
#
# Two modes:
#
#   --prep    Warms tools/offline-fixture/.registry-snapshot/ by running the
#             full matrix once against a Verdaccio WITH an npmjs uplink. This
#             is the only step that touches the network. Run it once per
#             machine/OS, and again when a template's dependencies change.
#
#   (default) Runs the real fixture with NO network: Verdaccio serves a
#             throwaway copy of the snapshot with no uplinks, so a cache miss
#             404s. Each package manager gets its own fresh cache directory,
#             so the managers are genuinely cold. Pass --manager <name> to run
#             one; omit it for all four.
#
# Both modes exercise the create matrix (via tools/smoke-create.ts) and, in
# default mode, the `solidiom add dialog` smoke check plus the per-manager
# registry/cache isolation matrix, all against the same Verdaccio instance.
#
# Other flags: --smoke-json-out <path> for the machine-readable result table,
# --port <n> to avoid colliding with another local Verdaccio.

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
MONOREPO_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
VERDACCIO_PID=""
VERDACCIO_CONFIG=""
STORAGE_DIR=""
TEMP_DIR=""
MATRIX_TEMP_DIR=""

# Canonical snapshot of Verdaccio storage, warmed by --prep. Gitignored: it is
# tens of MB of third-party tarballs, and it is platform-specific (see
# verdaccio-prep-config.yaml's comment on platform-native optional deps), so it
# must be regenerated per OS rather than committed or shared across runners.
SNAPSHOT_DIR="$SCRIPT_DIR/.registry-snapshot"

# ─── Argument parsing ───────────────────────────────────────────────────────

ONLY_MANAGER=""
SMOKE_JSON_OUT=""
PORT="4873"
PREP_MODE=0
while [[ $# -gt 0 ]]; do
  case "$1" in
    --)
      # `pnpm run smoke:create -- --manager bun` forwards a bare separator.
      # Ignore it rather than failing on it.
      shift
      ;;
    --prep)
      PREP_MODE=1
      shift
      ;;
    --manager)
      ONLY_MANAGER="${2:-}"
      shift 2
      ;;
    --manager=*)
      ONLY_MANAGER="${1#--manager=}"
      shift
      ;;
    --smoke-json-out)
      SMOKE_JSON_OUT="${2:-}"
      shift 2
      ;;
    --smoke-json-out=*)
      SMOKE_JSON_OUT="${1#--smoke-json-out=}"
      shift
      ;;
    --port)
      PORT="${2:-}"
      shift 2
      ;;
    --port=*)
      PORT="${1#--port=}"
      shift
      ;;
    *)
      echo "Unknown argument: $1" >&2
      exit 1
      ;;
  esac
done

if ! [[ "$PORT" =~ ^[0-9]+$ ]] || [[ "$PORT" -lt 1024 ]] || [[ "$PORT" -gt 65535 ]]; then
  echo "ERROR: --port must be an unprivileged TCP port between 1024 and 65535." >&2
  exit 1
fi
REGISTRY_URL="http://127.0.0.1:${PORT}"

ALL_MANAGERS=(npm pnpm yarn bun)
if [[ $PREP_MODE -eq 1 ]]; then
  # Prep must exercise every manager regardless of --manager: they do not
  # request the same metadata, and Yarn Classic's insistence on resolving all
  # platform variants of every optional dependency is precisely what makes the
  # snapshot complete enough for the offline runs.
  if [[ -n "$ONLY_MANAGER" ]]; then
    echo "NOTE: --manager is ignored with --prep; the snapshot needs all four managers." >&2
    ONLY_MANAGER=""
  fi
  MANAGERS=("${ALL_MANAGERS[@]}")
elif [[ -n "$ONLY_MANAGER" ]]; then
  case "$ONLY_MANAGER" in
    npm|pnpm|yarn|bun) MANAGERS=("$ONLY_MANAGER") ;;
    *)
      echo "ERROR: unknown --manager '$ONLY_MANAGER' — expected one of: npm, pnpm, yarn, bun" >&2
      exit 1
      ;;
  esac
else
  MANAGERS=("${ALL_MANAGERS[@]}")
fi

cleanup() {
  echo "Cleaning up..."
  if [[ -n "$VERDACCIO_PID" ]] && kill -0 "$VERDACCIO_PID" 2>/dev/null; then
    kill "$VERDACCIO_PID" 2>/dev/null || true
    wait "$VERDACCIO_PID" 2>/dev/null || true
  fi
  # Never remove STORAGE_DIR in prep mode — it IS the canonical snapshot this
  # run exists to produce. Only throwaway per-run copies are safe to delete.
  if [[ $PREP_MODE -eq 0 ]] && [[ -n "$STORAGE_DIR" ]] && [[ -d "$STORAGE_DIR" ]]; then
    rm -rf "$STORAGE_DIR"
  fi
  if [[ -n "$VERDACCIO_CONFIG" ]] && [[ -f "$VERDACCIO_CONFIG" ]]; then
    rm -rf "$(dirname "$VERDACCIO_CONFIG")"
  fi
  if [[ -n "$TEMP_DIR" ]] && [[ -d "$TEMP_DIR" ]]; then
    rm -rf "$TEMP_DIR"
  fi
  if [[ -n "$MATRIX_TEMP_DIR" ]] && [[ -d "$MATRIX_TEMP_DIR" ]]; then
    rm -rf "$MATRIX_TEMP_DIR"
  fi
}
trap cleanup EXIT

if [[ $PREP_MODE -eq 1 ]]; then
  echo "=== Solidiom Offline Fixture — SNAPSHOT PREP (network required) ==="
else
  echo "=== Solidiom Offline Installation Test (no network) ==="
fi
echo ""

# Step 1: Check that verdaccio is available
echo "[1/8] Checking verdaccio availability..."
if ! npx verdaccio --help > /dev/null 2>&1; then
  echo "ERROR: verdaccio is not available. Install it with: npm i -g verdaccio"
  exit 1
fi
echo "  verdaccio is available."

# Step 2: Prepare storage and pick the config for this mode.
#
# Prep writes straight into the canonical snapshot so it persists. A test run
# works on a throwaway COPY, so the matrix can publish @solidiom/* over the top
# without ever mutating the snapshot — that keeps repeated runs deterministic
# and lets a run be interrupted safely.
echo "[2/8] Preparing registry storage..."
if [[ $PREP_MODE -eq 1 ]]; then
  mkdir -p "$SNAPSHOT_DIR"
  STORAGE_DIR="$SNAPSHOT_DIR"
  SOURCE_CONFIG="$SCRIPT_DIR/verdaccio-prep-config.yaml"
  echo "  writing snapshot to $SNAPSHOT_DIR (uplink ENABLED)"
else
  if [[ ! -d "$SNAPSHOT_DIR" ]]; then
    echo "ERROR: no registry snapshot at $SNAPSHOT_DIR." >&2
    echo "       The offline matrix cannot run without one. Create it with:" >&2
    echo "         tools/offline-fixture/run-offline-test.sh --prep" >&2
    echo "       (that step requires network access; the matrix itself does not)" >&2
    exit 1
  fi
  STORAGE_DIR=$(mktemp -d)
  cp -R "$SNAPSHOT_DIR/." "$STORAGE_DIR/"
  # Drop @solidiom/* from the copy so smoke-create.ts republishes the CURRENT
  # source rather than colliding with whatever the snapshot happened to capture.
  rm -rf "$STORAGE_DIR/@solidiom"
  SOURCE_CONFIG="$SCRIPT_DIR/verdaccio-config.yaml"
  echo "  copied snapshot to throwaway storage (uplink DISABLED, cache miss = 404)"
fi

# NOTE on Verdaccio's own outbound network.
#
# Removing `uplinks:` stops Verdaccio proxying package METADATA, but packuments
# cached during prep record absolute `dist.tarball` URLs pointing at
# registry.npmjs.org, and Verdaccio will fetch a tarball from that URL when it
# holds the metadata but not the file. This was observed happening for
# solid-js@2.0.0-experimental.16, so "no uplinks" alone did not mean "no
# network".
#
# The root cause was a resolution problem, not a Verdaccio problem: the
# per-manager matrix projects below were bare manifests with no version pinning,
# so npm resolved the `@solidiom/*` peer range `solid-js@^2.0.0-beta.23` onto a
# different prerelease line (`2.0.0-experimental.*`) whose tarballs the snapshot
# never captured. Those manifests now carry the same `overrides`/`resolutions`
# pinning that materialize.ts emits into real generated projects, so every
# resolved version is one the snapshot actually holds.
#
# Forcing outbound HTTP through a closed port was tried here and rejected: it
# also prevented Verdaccio from completing its own startup, so the fixture could
# never become ready. The per-manager isolation in `run_manager_smoke` (and
# smoke-create.ts's `baseIsolationEnv`) still applies that block to the package
# manager child processes, where it is safe and where the real fallthrough risk
# lives. The `npmjs_refs` count in the fixture's own verification is what guards
# this end of it.

# The committed config remains the single source of policy; only its storage
# path is made invocation-specific.
VERDACCIO_CONFIG="$(mktemp -d)/verdaccio-config.yaml"
sed "s|^storage: .*|storage: ${STORAGE_DIR}|" "$SOURCE_CONFIG" > "$VERDACCIO_CONFIG"

# Step 3: Start verdaccio
#
# In prep mode the storage IS the persistent snapshot (not a throwaway copy), so
# stale @solidiom/* packages from previous runs would collide with republish and
# leave stale integrity hashes in Verdaccio's in-memory packument cache. Remove
# them BEFORE Verdaccio starts so it never sees the old metadata.
if [[ $PREP_MODE -eq 1 ]] && [[ -d "$STORAGE_DIR/@solidiom" ]]; then
  echo "  removing stale @solidiom/* packages from snapshot..."
  rm -rf "$STORAGE_DIR/@solidiom"
fi

echo "[3/8] Starting verdaccio..."
npx verdaccio --config "$VERDACCIO_CONFIG" --listen "127.0.0.1:${PORT}" &
VERDACCIO_PID=$!
echo "  verdaccio started (PID: $VERDACCIO_PID)"

# Step 4: Wait for verdaccio to be ready
echo "[4/8] Waiting for verdaccio to be ready..."
RETRIES=30
until curl -s "$REGISTRY_URL" > /dev/null 2>&1; do
  RETRIES=$((RETRIES - 1))
  if [[ $RETRIES -le 0 ]]; then
    echo "ERROR: verdaccio did not start within 30 seconds."
    exit 1
  fi
  sleep 1
done
echo "  verdaccio is ready at $REGISTRY_URL"

# Step 5: Run the create/install/typecheck/build/test matrix.
#
# smoke-create.ts publishes the workspace @solidiom/* packages itself before the
# first combination, so both this harness and `solidiom add` below resolve them
# from the same registry instance.
echo "[5/8] Running create smoke harness (${MANAGERS[*]})..."
SMOKE_ARGS=(--registry "$REGISTRY_URL")
if [[ -n "$ONLY_MANAGER" ]]; then
  SMOKE_ARGS+=(--manager "$ONLY_MANAGER")
fi
if [[ -n "$SMOKE_JSON_OUT" ]]; then
  mkdir -p "$(dirname "$SMOKE_JSON_OUT")"
  SMOKE_ARGS+=(--json-out "$SMOKE_JSON_OUT")
fi
(cd "$MONOREPO_ROOT" && pnpm exec tsx tools/smoke-create.ts "${SMOKE_ARGS[@]}") || {
  echo "ERROR: create smoke harness failed." >&2
  exit 1
}

if [[ $PREP_MODE -eq 1 ]]; then
  echo ""
  echo "=== Snapshot prep COMPLETE ==="
  echo "  snapshot: $SNAPSHOT_DIR"
  echo "  size:     $(du -sh "$SNAPSHOT_DIR" | cut -f1)"
  echo "  packages: $(find "$SNAPSHOT_DIR" -name 'package.json' -maxdepth 3 | wc -l | tr -d ' ')"
  echo ""
  echo "The offline matrix can now run with no network:"
  echo "  tools/offline-fixture/run-offline-test.sh --manager <npm|pnpm|yarn|bun>"
  exit 0
fi

# Step 6: Run solidiom add in a temp directory
echo "[6/8] Running solidiom add in isolated environment..."
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

echo "  Running: solidiom add dialog --registry $REGISTRY_URL --no-network"
(cd "$TEMP_DIR" && node "$SOLIDIOM_BIN" add dialog --registry $REGISTRY_URL --no-network) || {
  echo "ERROR: solidiom add failed."
  exit 1
}

# Step 7: Verify results
echo "[7/8] Verifying results..."
PLAN_OUTPUT=$(cd "$TEMP_DIR" && node "$SOLIDIOM_BIN" plan dialog --registry $REGISTRY_URL --no-network --json 2>/dev/null) || true

if [[ -n "$PLAN_OUTPUT" ]]; then
  echo "  Plan output received."
  echo "  $PLAN_OUTPUT" | head -5
else
  echo "  WARNING: No plan output (this may be expected if plan doesn't support --json in this mode)."
fi

# Step 8: Per-manager registry/cache isolation matrix.
#
# Reuses the single Verdaccio instance started in step 2 — no second server
# is spun up per manager. Each manager gets its OWN temp registry-override
# config file and its OWN cache directory under MATRIX_TEMP_DIR, so a run
# with one manager can never fall through to another manager's cache (a
# "poisoned cache" from a prior manager silently masking a real resolution
# failure) and can never fall through to the real npm registry.
#
# Per-manager approach (see verdaccio-config.yaml's header comment for why
# the existing uplinks.npmjs proxy does not by itself guarantee this):
#   npm   - temp .npmrc with `registry=` + `cache=`, plus npm_config_registry
#           / npm_config_cache env vars as belt-and-suspenders (env wins over
#           .npmrc, so either alone would suffice, but both makes the
#           isolation robust to which mechanism a given npm version honors).
#   pnpm  - same temp .npmrc (pnpm reads npm-style .npmrc) plus explicit
#           --registry/--store-dir/--virtual-store-dir flags, since pnpm's
#           own docs treat the CLI flags as the authoritative override.
#   yarn  - yarn Classic (1.x) does NOT read .npmrc for its registry; it
#           needs its own `.yarnrc` with `registry "<url>"` plus
#           `--cache-folder`. Corepack's guard (see below) also requires the
#           isolated dir to declare its own `packageManager` field.
#   bun   - temp `bunfig.toml` with `[install] registry = "<url>"` plus
#           `--cache-dir`.
echo "[8/8] Running per-manager registry/cache isolation matrix (${MANAGERS[*]})..."

MATRIX_TEMP_DIR=$(mktemp -d)
REGISTRY_URL="$REGISTRY_URL"

run_manager_smoke() {
  local manager="$1"
  local work_dir="$MATRIX_TEMP_DIR/$manager"
  local cache_dir="$MATRIX_TEMP_DIR/$manager-cache"
  mkdir -p "$work_dir" "$cache_dir"

  echo "  --- manager: $manager ---"

  # Applied to every manager below, for the same reason tools/smoke-create.ts's
  # baseIsolationEnv exists: a per-manager config FILE alone is not sufficient.
  # `pnpm run` injects npm_config_registry=https://registry.npmjs.org/ into the
  # script environment, and Bun prefers that over its own bunfig.toml — so
  # without these, whether this fixture is actually offline depends on how it
  # was launched. The proxy variables point at a closed port with 127.0.0.1
  # exempted, so the local registry works but any external host fails loudly.
  export npm_config_registry="$REGISTRY_URL"
  export NPM_CONFIG_REGISTRY="$REGISTRY_URL"
  export HTTP_PROXY="http://127.0.0.1:1"
  export HTTPS_PROXY="http://127.0.0.1:1"
  export http_proxy="http://127.0.0.1:1"
  export https_proxy="http://127.0.0.1:1"
  export NO_PROXY="127.0.0.1,localhost"
  export no_proxy="127.0.0.1,localhost"

  case "$manager" in
    npm)
      cat > "$work_dir/package.json" <<EOF
{
  "name": "offline-matrix-npm",
  "version": "1.0.0",
  "private": true,
  "overrides": {
    "solid-js": "2.0.0-beta.24",
    "@solidjs/web": "2.0.0-beta.24"
  },
  "resolutions": {
    "solid-js": "2.0.0-beta.24",
    "@solidjs/web": "2.0.0-beta.24"
  }
}
EOF
      cat > "$work_dir/.npmrc" <<EOF
registry=$REGISTRY_URL
cache=$cache_dir
EOF
      (
        cd "$work_dir" && \
        npm_config_registry="$REGISTRY_URL" npm_config_cache="$cache_dir" \
        node "$SOLIDIOM_BIN" add dialog --registry "$REGISTRY_URL" --no-network --install --package-manager npm
      ) || { echo "  ERROR: npm matrix leg failed."; return 1; }
      ;;

    pnpm)
      cat > "$work_dir/package.json" <<EOF
{
  "name": "offline-matrix-pnpm",
  "version": "1.0.0",
  "private": true,
  "overrides": {
    "solid-js": "2.0.0-beta.24",
    "@solidjs/web": "2.0.0-beta.24"
  },
  "resolutions": {
    "solid-js": "2.0.0-beta.24",
    "@solidjs/web": "2.0.0-beta.24"
  }
}
EOF
      cat > "$work_dir/.npmrc" <<EOF
registry=$REGISTRY_URL
store-dir=$cache_dir/store
virtual-store-dir=$work_dir/node_modules/.pnpm
EOF
      (
        cd "$work_dir" && \
        npm_config_registry="$REGISTRY_URL" \
        node "$SOLIDIOM_BIN" add dialog --registry "$REGISTRY_URL" --no-network --install --package-manager pnpm
      ) || { echo "  ERROR: pnpm matrix leg failed."; return 1; }
      ;;

    yarn)
      # Corepack refuses to run a manager outside the scope it thinks the
      # nearest package.json declares. Giving this isolated temp dir its
      # OWN package.json with its own "packageManager" field (rather than
      # inheriting the monorepo root's) satisfies that guard without
      # touching the monorepo's own packageManager declaration.
      cat > "$work_dir/package.json" <<EOF
{
  "name": "offline-matrix-yarn",
  "version": "1.0.0",
  "private": true,
  "packageManager": "yarn@1.22.22",
  "overrides": {
    "solid-js": "2.0.0-beta.24",
    "@solidjs/web": "2.0.0-beta.24"
  },
  "resolutions": {
    "solid-js": "2.0.0-beta.24",
    "@solidjs/web": "2.0.0-beta.24"
  }
}
EOF
      cat > "$work_dir/.yarnrc" <<EOF
registry "$REGISTRY_URL"
cache-folder "$cache_dir"
EOF
      (
        cd "$work_dir" && \
        YARN_REGISTRY="$REGISTRY_URL" YARN_CACHE_FOLDER="$cache_dir" \
        node "$SOLIDIOM_BIN" add dialog --registry "$REGISTRY_URL" --no-network --install --package-manager yarn
      ) || { echo "  ERROR: yarn matrix leg failed."; return 1; }
      ;;

    bun)
      cat > "$work_dir/package.json" <<EOF
{
  "name": "offline-matrix-bun",
  "version": "1.0.0",
  "private": true,
  "overrides": {
    "solid-js": "2.0.0-beta.24",
    "@solidjs/web": "2.0.0-beta.24"
  },
  "resolutions": {
    "solid-js": "2.0.0-beta.24",
    "@solidjs/web": "2.0.0-beta.24"
  }
}
EOF
      cat > "$work_dir/bunfig.toml" <<EOF
[install]
registry = "$REGISTRY_URL"
cache-dir = "$cache_dir"
EOF
      (
        cd "$work_dir" && \
        BUN_CONFIG_REGISTRY="$REGISTRY_URL" \
        node "$SOLIDIOM_BIN" add dialog --registry "$REGISTRY_URL" --no-network --install --package-manager bun
      ) || { echo "  ERROR: bun matrix leg failed."; return 1; }
      ;;

    *)
      echo "  ERROR: unrecognized manager '$manager'" >&2
      return 1
      ;;
  esac

  echo "  $manager leg OK."
  return 0
}

MATRIX_FAILURES=0
for m in "${MANAGERS[@]}"; do
  if ! run_manager_smoke "$m"; then
    MATRIX_FAILURES=$((MATRIX_FAILURES + 1))
  fi
done

if [[ $MATRIX_FAILURES -gt 0 ]]; then
  echo "ERROR: $MATRIX_FAILURES manager(s) failed the isolation matrix."
  exit 1
fi

echo ""
echo "=== Offline installation test PASSED ==="
exit 0
