#!/usr/bin/env bash
# Run the release pipeline locally, mirroring .github/workflows/release.yml.
#
# The workflow's publish-packages / deploy-site jobs are reproduced here so a
# release can be cut from a developer machine (or a self-hosted box) without
# GitHub Actions. The step order and commands match the workflow exactly:
#
#   gate            → build + gate:quick|full
#   publish-packages→ build → sign registry → verify → changeset publish
#                     → beta artifacts (+verify) → beta signing verify
#   deploy-site     → build packages+templates → validate → build site
#                     → search index → wrangler pages deploy
#
# Usage:
#   ./scripts/release.sh                              # packages + site, quick gate, beta tag
#   ./scripts/release.sh --target packages            # publish packages only
#   ./scripts/release.sh --target site                # deploy site only
#   ./scripts/release.sh --target all --gate full     # full release gate
#   ./scripts/release.sh --dist-tag latest            # publish under `latest`
#   ./scripts/release.sh --dry-run                    # build/gate/verify, no publish or deploy
#   ./scripts/release.sh --dispatch                   # legacy: trigger release.yml in CI instead
#
# Secrets are read from the shell environment first, then from the project .env
# (NPM_TOKEN, REGISTRY_SIGN_KEY, CLOUDFLARE_ACCOUNT_ID, CLOUDFLARE_API_TOKEN).
# Values are never printed.

set -euo pipefail

# ─── Defaults ────────────────────────────────────────────────────────────────
TARGET="all"
GATE="quick"
DIST_TAG="beta"
DRY_RUN=false
DISPATCH=false
REF="$(git branch --show-current 2>/dev/null || echo main)"
WATCH=true

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

# ─── Helpers ─────────────────────────────────────────────────────────────────
usage() {
  cat <<'EOF'
Usage: ./scripts/release.sh [options]

Runs the release pipeline locally (default) or dispatches it in CI.

Options:
  --target <packages|site|all>  Release target (default: all)
  --gate <quick|full>           Gate level before publishing (default: quick)
  --dist-tag <beta|latest>      npm dist-tag to publish under (default: beta)
  --dry-run                     Build, gate, and verify without publishing/deploying
  --dispatch                    Trigger .github/workflows/release.yml in CI instead
                                of running locally (legacy behavior)
  --ref <branch>                Branch/ref to dispatch from (only with --dispatch)
  --no-watch                    With --dispatch, submit without streaming the run
  --help, -h                    Show this help

Convenience aliases: --site-only (=--target site), --no-site (=--target packages),
--quick-gate, --full-gate.

Secrets are sourced from the shell env, then from ./.env:
  NPM_TOKEN               required to publish packages (not in --dry-run)
  REGISTRY_SIGN_KEY       optional; enables Ed25519 registry signing
  CLOUDFLARE_ACCOUNT_ID   required to deploy the site (not in --dry-run)
  CLOUDFLARE_API_TOKEN    required to deploy the site (not in --dry-run)
EOF
}

log() { printf '\n\033[1;36m==>\033[0m %s\n' "$*"; }
step() { printf '\033[1;34m  •\033[0m %s\n' "$*"; }
warn() { printf '\033[1;33mwarning:\033[0m %s\n' "$*" >&2; }
fail() {
  printf '\033[1;31mRelease aborted:\033[0m %s\n' "$*" >&2
  exit 1
}

run() {
  step "$*"
  "$@"
}

# ─── Parse args ──────────────────────────────────────────────────────────────
while [[ $# -gt 0 ]]; do
  case "$1" in
    --target)
      TARGET="${2:-}"
      shift 2
      ;;
    --gate)
      GATE="${2:-}"
      shift 2
      ;;
    --dist-tag)
      DIST_TAG="${2:-}"
      shift 2
      ;;
    --dry-run)
      DRY_RUN=true
      shift
      ;;
    --dispatch)
      DISPATCH=true
      shift
      ;;
    --ref)
      REF="${2:-}"
      shift 2
      ;;
    --no-watch)
      WATCH=false
      shift
      ;;
    --site-only)
      TARGET="site"
      shift
      ;;
    --no-site)
      TARGET="packages"
      shift
      ;;
    --quick-gate)
      GATE="quick"
      shift
      ;;
    --full-gate)
      GATE="full"
      shift
      ;;
    --help | -h)
      usage
      exit 0
      ;;
    *)
      fail "Unknown option: $1"
      ;;
  esac
done

[[ "$TARGET" =~ ^(packages|site|all)$ ]] || fail "--target must be packages, site, or all"
[[ "$GATE" =~ ^(quick|full)$ ]] || fail "--gate must be quick or full"
[[ "$DIST_TAG" =~ ^(beta|latest)$ ]] || fail "--dist-tag must be beta or latest"

# ─── Dispatch path (legacy CI trigger) ───────────────────────────────────────
if [[ "$DISPATCH" == true ]]; then
  [[ -n "$REF" ]] || fail "Unable to determine a ref; supply --ref <branch>"
  command -v gh >/dev/null || fail "GitHub CLI (gh) is required for --dispatch"
  gh auth status >/dev/null || fail "Authenticate the GitHub CLI with 'gh auth login'"

  log "Dispatching release workflow in CI"
  step "target: $TARGET  gate: $GATE  dist-tag: $DIST_TAG  ref: $REF"
  gh workflow run release.yml --ref "$REF" \
    -f "target=$TARGET" -f "gate=$GATE" -f "dist_tag=$DIST_TAG"

  if [[ "$WATCH" == false ]]; then
    echo "Dispatched. Follow with: gh run list --workflow release.yml --branch $REF"
    exit 0
  fi

  RUN_ID=""
  for _ in {1..12}; do
    RUN_ID="$(gh run list --workflow release.yml --branch "$REF" \
      --event workflow_dispatch --limit 1 \
      --json databaseId --jq '.[0].databaseId' 2>/dev/null || true)"
    [[ -n "$RUN_ID" ]] && break
    sleep 2
  done
  [[ -n "$RUN_ID" ]] || fail "Dispatched, but the run was not found. Use 'gh run list --workflow release.yml'."
  log "Watching run $RUN_ID"
  gh run watch "$RUN_ID" --exit-status
  exit 0
fi

# ─── Local execution ─────────────────────────────────────────────────────────

# Load secrets from .env if not already present in the environment. `set -a`
# exports every var defined while sourcing; existing shell vars win because we
# only fill blanks below.
if [[ -f .env ]]; then
  step "Loading secrets from .env"
  # shellcheck disable=SC1091
  set -a
  # Only source assignment lines; ignore anything else defensively.
  source <(grep -E '^[A-Z_][A-Z0-9_]*=' .env || true)
  set +a
fi

command -v pnpm >/dev/null || fail "pnpm is required"

DO_PACKAGES=false
DO_SITE=false
case "$TARGET" in
  packages) DO_PACKAGES=true ;;
  site) DO_SITE=true ;;
  all)
    DO_PACKAGES=true
    DO_SITE=true
    ;;
esac

log "Local release pipeline"
step "target: $TARGET   gate: $GATE   dist-tag: $DIST_TAG   dry-run: $DRY_RUN"

# Pre-flight credential checks (skipped for dry runs, which never publish/deploy).
if [[ "$DRY_RUN" == false ]]; then
  if [[ "$DO_PACKAGES" == true ]]; then
    [[ -n "${NPM_TOKEN:-}" ]] || fail "NPM_TOKEN is not set (shell env or .env) — needed to publish packages"
    export NODE_AUTH_TOKEN="${NPM_TOKEN}"
  fi
  if [[ "$DO_SITE" == true ]]; then
    [[ -n "${CLOUDFLARE_ACCOUNT_ID:-}" ]] || fail "CLOUDFLARE_ACCOUNT_ID is not set — needed to deploy the site"
    [[ -n "${CLOUDFLARE_API_TOKEN:-}" ]] || fail "CLOUDFLARE_API_TOKEN is not set — needed to deploy the site"
  fi
fi

# ─── Gate (mirrors release.yml `gate` job) ────────────────────────────────────
# The workflow runs the gate before any package publish. Site-only releases skip
# it there, so we mirror that.
if [[ "$DO_PACKAGES" == true ]]; then
  log "Gate — build + gate:$GATE"
  run pnpm nx run-many -t build --exclude=@solidiom/site
  if [[ "$GATE" == "full" ]]; then
    run pnpm run gate:full
  else
    run pnpm run gate:quick
  fi
fi

# ─── Publish packages (mirrors release.yml `publish-packages` job) ────────────
if [[ "$DO_PACKAGES" == true ]]; then
  log "Publish packages"

  # Rebuild to guarantee dist/ matches the committed tree (the workflow builds
  # again in the publish job on a clean checkout).
  run pnpm nx run-many -t build --exclude=@solidiom/site

  # REG-008: sign the registry index. Signing is optional — the tool no-ops
  # without REGISTRY_SIGN_KEY — but an unsigned index means the beta signing
  # verification below will report "no signature".
  if [[ -z "${REGISTRY_SIGN_KEY:-}" ]]; then
    warn "REGISTRY_SIGN_KEY is not set — the registry index will be built UNSIGNED."
    warn "Set it in .env or the environment to produce a signed release."
  fi
  run pnpm exec tsx tools/registry-build.ts

  run node packages/cli/dist/bin.js verify --registry

  # Publish exactly the versions committed at the current tree. Versioning is
  # expected to have already happened (via `changeset version` / the Version PR).
  # Note: `changeset publish` has no dry-run mode, so on --dry-run we skip only
  # the publish itself; everything else still runs to exercise the pipeline.
  if [[ "$DRY_RUN" == true ]]; then
    log "[dry-run] skipping 'changeset publish --tag $DIST_TAG' (would publish now)"
    step "changeset has no dry-run mode; run without --dry-run to publish to npm."
  else
    run pnpm changeset publish --tag "$DIST_TAG"
  fi

  # Audit-trail artifacts (not consumed by the CLI, and independent of the npm
  # publish — they snapshot committed versions and hash registry/index.json).
  # --verify fails if the generated artifacts don't round-trip.
  run pnpm exec tsx tools/generate-beta-artifacts.ts --verify

  # Beta signing verification. When REGISTRY_SIGN_KEY is set (the CI case, and
  # any real signed release), a failure here is fatal. When the key is absent
  # the index was built unsigned on purpose, so verify-beta-signing.ts is
  # expected to fail its signature checks — surface it as a warning instead of
  # aborting, since we already warned that the release is unsigned.
  if [[ -n "${REGISTRY_SIGN_KEY:-}" ]]; then
    run pnpm exec tsx tools/verify-beta-signing.ts
  else
    step "pnpm exec tsx tools/verify-beta-signing.ts (unsigned — non-fatal)"
    if ! pnpm exec tsx tools/verify-beta-signing.ts; then
      warn "Beta signing verification reported failures (expected: REGISTRY_SIGN_KEY unset, release is UNSIGNED)."
    fi
  fi
fi

# ─── Deploy site (mirrors release.yml `deploy-site` job) ──────────────────────
if [[ "$DO_SITE" == true ]]; then
  log "Deploy site"

  run pnpm nx run-many -t build --exclude=@solidiom/site
  run pnpm --filter '@solidiom/template-*' build

  step "Validate site structure"
  run pnpm --filter @solidiom/site run boundaries
  run pnpm --filter @solidiom/site run route-parity

  run pnpm --filter @solidiom/site run build:deploy
  run pnpm --filter @solidiom/site search-index

  if [[ "$DRY_RUN" == true ]]; then
    log "[dry-run] skipping 'wrangler pages deploy' — site built at apps/site/dist"
  else
    export CLOUDFLARE_ACCOUNT_ID CLOUDFLARE_API_TOKEN
    run npx wrangler pages deploy apps/site/dist \
      --project-name=solidiom-site \
      --branch=main \
      --commit-dirty=true
  fi
fi

log "Release pipeline complete"
if [[ "$DRY_RUN" == true ]]; then
  echo "Dry run finished — nothing was published or deployed."
fi
