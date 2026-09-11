#!/usr/bin/env bash
# Run the release pipeline locally, mirroring .github/workflows/release.yml.
#
# The workflow's publish-packages / deploy-site jobs are reproduced here so a
# release can be cut from a developer machine (or a self-hosted box) without
# GitHub Actions. The same release operations are ordered fail-closed locally:
# every requested build and validation finishes before npm or Cloudflare sees a
# publication.
#
#   gate             → build packages + gate:quick|full
#   prepare-packages → rebuild → sign registry → verify release artifacts
#   prepare-site     → build packages+templates → validate → build + search index
#   publish-packages → changeset publish
#   deploy-site      → deploy the already-built site to Cloudflare Pages
#
# Usage:
#   ./scripts/release.sh                              # packages + site, quick gate, beta tag
#   ./scripts/release.sh --target packages            # publish packages only
#   ./scripts/release.sh --target site                # deploy site only
#   ./scripts/release.sh --target all --gate full     # full release gate
#   ./scripts/release.sh --dist-tag latest            # publish under `latest`
#   ./scripts/release.sh --prepare-version            # version, commit, then release locally
#   ./scripts/release.sh --dry-run                    # build/gate/verify, no publish or deploy
#   ./scripts/release.sh --dispatch                   # legacy: trigger release.yml in CI instead
#
# Secrets are read from the shell environment first, then from the project .env
# (NPM_TOKEN, REGISTRY_SIGN_KEY, CLOUDFLARE_ACCOUNT_ID, CLOUDFLARE_API_TOKEN).
# Values are never printed.

set -euo pipefail

ORIGINAL_ARGS=("$@")

# ─── Defaults ────────────────────────────────────────────────────────────────
TARGET="all"
GATE="quick"
DIST_TAG="beta"
DRY_RUN=false
DISPATCH=false
PREPARE_VERSION=false
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
  --prepare-version             From a clean attached Git tree: install with the
                                frozen lockfile, apply pending Changesets, rebuild
                                generated release artifacts, and create the release
                                commit before validating and publishing it
  --dry-run                     Build, gate, and verify without publishing/deploying
                                (cannot be combined with --prepare-version)
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

# Print instructions for creating a valid Cloudflare API token for Pages deploys.
cloudflare_token_help() {
  cat >&2 <<'EOF'

How to generate a valid Cloudflare API token for Pages deploys:
  1. Open https://dash.cloudflare.com/profile/api-tokens → "Create Token".
  2. Use the "Create Custom Token" option and grant this permission:
       Account → Cloudflare Pages → Edit
  3. Under "Account Resources", scope it to the account you deploy to
     (CLOUDFLARE_ACCOUNT_ID). An account-scoped token is expected and fine.
  4. Leave "Client IP Address Filtering" empty for local use. If you set an IP
     filter, add your current public IP — otherwise Cloudflare rejects the token
     with "Cannot use the access token from location" (error 9109).
  5. Create the token and copy the value, then put it in .env as:
       CLOUDFLARE_API_TOKEN="<token>"
  6. Verify it (account-scoped tokens must use the /accounts endpoint, not /user):
       curl -s -H "Authorization: Bearer <TOKEN>" \
         "https://api.cloudflare.com/client/v4/accounts/<ACCOUNT_ID>/tokens/verify"
     A valid token returns "status":"active".
EOF
}

# Fail-fast verification of CLOUDFLARE_API_TOKEN BEFORE the (slow) site build,
# so a token that is revoked, IP-restricted, or missing the Pages permission is
# caught immediately with actionable guidance instead of failing at the final
# `wrangler pages deploy` step after a long build.
#
# We probe the SAME endpoint wrangler uses to deploy — the account's Pages
# projects API — rather than /tokens/verify. A token can verify as "active"
# yet still lack Pages:Edit or be blocked by an IP allowlist; only the real
# Pages endpoint exercises both. Common Cloudflare error codes:
#   10000 → token is missing the "Account → Cloudflare Pages → Edit" permission
#           (or is scoped to a different account).
#   9109  → token has an IP allowlist and the current public IP is not in it.
preflight_cloudflare_token() {
  command -v curl >/dev/null || {
    warn "curl not found — skipping Cloudflare token pre-flight (wrangler will still validate at deploy)."
    return 0
  }

  step "Verifying CLOUDFLARE_API_TOKEN against the Pages API"

  local resp
  resp="$(curl -sS --max-time 15 \
    -H "Authorization: Bearer ${CLOUDFLARE_API_TOKEN}" \
    "https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/pages/projects?per_page=1" 2>/dev/null || true)"

  if [[ -z "$resp" ]]; then
    warn "Could not reach the Cloudflare API to verify the token (network issue?)."
    warn "Proceeding; wrangler will validate the token at deploy time."
    return 0
  fi

  if printf '%s' "$resp" | grep -Eq '"success"[[:space:]]*:[[:space:]]*true'; then
    step "Cloudflare token can access Pages for this account."
    return 0
  fi

  # Extract the first Cloudflare error code/message for diagnosis. The `|| true`
  # on each assignment is essential: under `set -e`, a command substitution
  # whose final pipe element (grep) matches nothing exits non-zero and would
  # otherwise kill the script silently.
  local code msg
  code="$(printf '%s' "$resp" | grep -Eo '"code"[[:space:]]*:[[:space:]]*[0-9]+' | head -1 | grep -Eo '[0-9]+' || true)"
  msg="$(printf '%s' "$resp" | grep -Eo '"message"[[:space:]]*:[[:space:]]*"[^"]*"' | head -1 | sed -E 's/.*"message"[[:space:]]*:[[:space:]]*"//; s/"$//' || true)"

  case "$code" in
    9109)
      warn "Cloudflare rejected the token due to an IP restriction (code 9109): ${msg:-location not allowed}."
      warn "The token is otherwise valid, but your current public IP is not in its allowlist."
      warn "Fix: edit the token and either clear the IP filter or add your current IP."
      cloudflare_token_help
      fail "CLOUDFLARE_API_TOKEN is IP-restricted and your current IP is not allowed."
      ;;
    10000)
      warn "Cloudflare returned an authentication error (code 10000): ${msg:-Authentication error}."
      warn "The token is likely missing the 'Account → Cloudflare Pages → Edit' permission,"
      warn "or is scoped to a different account than CLOUDFLARE_ACCOUNT_ID (${CLOUDFLARE_ACCOUNT_ID})."
      cloudflare_token_help
      fail "CLOUDFLARE_API_TOKEN cannot access Pages — see guidance above."
      ;;
    1000)
      warn "Cloudflare reports the token is invalid (code 1000): ${msg:-Invalid API Token}."
      warn "It may be revoked or expired."
      cloudflare_token_help
      fail "CLOUDFLARE_API_TOKEN is invalid — see guidance above."
      ;;
    *)
      warn "Cloudflare did not accept the token (code ${code:-unknown}): ${msg:-verification failed}."
      cloudflare_token_help
      fail "CLOUDFLARE_API_TOKEN failed Pages verification — see guidance above."
      ;;
  esac
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
    --prepare-version)
      PREPARE_VERSION=true
      shift
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

if [[ "$PREPARE_VERSION" == true ]]; then
  [[ "$DISPATCH" == false ]] || fail "--prepare-version is local-only and cannot be combined with --dispatch"
  [[ "$DRY_RUN" == false ]] || fail "--prepare-version creates a release commit and cannot be combined with --dry-run"
  [[ "$TARGET" != "site" ]] || fail "--prepare-version requires a package target (packages or all)"
fi

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
# exports every var defined while sourcing. We source via a temp file rather
# than `source <(...)`: process substitution can race with `source` and drop
# the final line (e.g. a trailing REGISTRY_SIGN_KEY), silently losing a secret.
if [[ -f .env ]]; then
  step "Loading secrets from .env"
  _env_tmp="$(mktemp)"
  grep -E '^[A-Z_][A-Z0-9_]*=' .env >"$_env_tmp" || true
  set -a
  # shellcheck disable=SC1090
  source "$_env_tmp"
  set +a
  rm -f "$_env_tmp"
  unset _env_tmp
fi

command -v node >/dev/null || fail "Node.js is required"

EXPECTED_PNPM_VERSION="$(node -p 'JSON.parse(require("fs").readFileSync("package.json", "utf8")).packageManager.match(/^pnpm@([^+]+)/)[1]')"
CURRENT_PNPM_VERSION="$(pnpm --version 2>/dev/null || true)"
if [[ "$CURRENT_PNPM_VERSION" != "$EXPECTED_PNPM_VERSION" ]]; then
  if command -v mise >/dev/null && [[ "${SOLIDIOM_RELEASE_PNPM_REEXEC:-}" != "1" ]]; then
    step "Re-running with repository-pinned pnpm@$EXPECTED_PNPM_VERSION via mise"
    exec env SOLIDIOM_RELEASE_PNPM_REEXEC=1 \
      mise exec "pnpm@$EXPECTED_PNPM_VERSION" -- \
      bash "$ROOT/scripts/release.sh" "${ORIGINAL_ARGS[@]}"
  fi
  fail "pnpm@$EXPECTED_PNPM_VERSION is required (found ${CURRENT_PNPM_VERSION:-none}); run through 'mise exec pnpm@$EXPECTED_PNPM_VERSION -- ...'"
fi

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
step "target: $TARGET   gate: $GATE   dist-tag: $DIST_TAG   dry-run: $DRY_RUN   prepare-version: $PREPARE_VERSION"

# Validate credentials before --prepare-version mutates or commits anything.
# Dry runs never publish or deploy, so they do not require credentials.
if [[ "$DRY_RUN" == false ]]; then
  if [[ "$DO_PACKAGES" == true ]]; then
    [[ -n "${NPM_TOKEN:-}" ]] || fail "NPM_TOKEN is not set (shell env or .env) — needed to publish packages"
    export NODE_AUTH_TOKEN="${NPM_TOKEN}"
    if [[ "$PREPARE_VERSION" == true ]]; then
      [[ -n "${REGISTRY_SIGN_KEY:-}" ]] || fail "REGISTRY_SIGN_KEY is required with --prepare-version so the committed registry is signed"
    fi
  fi
  if [[ "$DO_SITE" == true ]]; then
    [[ -n "${CLOUDFLARE_ACCOUNT_ID:-}" ]] || fail "CLOUDFLARE_ACCOUNT_ID is not set — needed to deploy the site"
    if [[ -z "${CLOUDFLARE_API_TOKEN:-}" ]]; then
      cloudflare_token_help
      fail "CLOUDFLARE_API_TOKEN is not set — needed to deploy the site (see guidance above)"
    fi
    # Verify the token now, before versioning or the slow site build, so a bad
    # token cannot leave behind a release commit that cannot be deployed.
    preflight_cloudflare_token
  fi
fi

CANDIDATES_PREFLIGHTED=false

prepare_local_version() {
  log "Prepare and commit package versions"

  git rev-parse --is-inside-work-tree >/dev/null 2>&1 || fail "--prepare-version must run inside a Git worktree"

  local branch
  branch="$(git symbolic-ref --quiet --short HEAD 2>/dev/null || true)"
  [[ -n "$branch" ]] || fail "--prepare-version requires an attached Git branch, not a detached HEAD"
  [[ -z "$(git status --porcelain --untracked-files=normal)" ]] || \
    fail "--prepare-version requires a clean Git tree; commit or stash existing changes first"
  step "Preparing versions on branch $branch"

  local pending_count=0 changeset
  for changeset in .changeset/*.md; do
    [[ "$changeset" == ".changeset/README.md" ]] && continue
    pending_count=$((pending_count + 1))
  done
  [[ "$pending_count" -gt 0 ]] || fail "No pending Changesets found; create or commit a Changeset before preparing a release"
  step "Found $pending_count pending Changeset(s)"

  run pnpm install --frozen-lockfile
  run pnpm changeset status
  run pnpm changeset version

  # Match the generated release state produced by version.yml before committing.
  run pnpm nx run-many -t build --exclude=@solidiom/site
  run pnpm exec tsx tools/registry-build.ts
  run node packages/cli/dist/bin.js verify --registry
  run pnpm run source:emit

  # Verify the newly calculated versions are publishable before recording the
  # release commit. The publish step has a second no-op guard for race safety.
  log "Prepared package candidate preflight"
  run node tools/release-candidates.mjs
  CANDIDATES_PREFLIGHTED=true

  # The tree was clean at entry, so these scoped paths contain only deterministic
  # Changesets/version artifacts. Never use `git add .` in release automation.
  run git add -- .changeset packages pnpm-lock.yaml registry
  git diff --cached --quiet && fail "Version preparation produced no staged release changes"

  if ! git diff --quiet || [[ -n "$(git ls-files --others --exclude-standard)" ]]; then
    fail "Version preparation produced changes outside the scoped release paths; review the tree before committing"
  fi

  run git commit -m "chore(release): version packages"
  [[ -z "$(git status --porcelain --untracked-files=normal)" ]] || \
    fail "The release commit completed but the Git tree is not clean"
  step "Release versions committed at $(git rev-parse --short=12 HEAD)"
}

if [[ "$PREPARE_VERSION" == true ]]; then
  prepare_local_version
fi

if [[ "$DRY_RUN" == false && "$DO_PACKAGES" == true && "$CANDIDATES_PREFLIGHTED" == false ]]; then
  log "Package publication preflight"
  run node tools/release-candidates.mjs
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

# ─── Prepare package publication artifacts ───────────────────────────────────
# Complete every package build and deterministic release-artifact validation
# before the first irreversible operation (`changeset publish`).
if [[ "$DO_PACKAGES" == true ]]; then
  log "Prepare package publication artifacts"

  # Rebuild to guarantee dist/ matches the committed tree (the workflow builds
  # again in the publish job on a clean checkout).
  run pnpm nx run-many -t build --exclude=@solidiom/site

  # REG-008: sign the registry index. Signing is optional outside the integrated
  # versioning path, but an unsigned index is called out explicitly.
  if [[ -z "${REGISTRY_SIGN_KEY:-}" ]]; then
    warn "REGISTRY_SIGN_KEY is not set — the registry index will be built UNSIGNED."
    warn "Set it in .env or the environment to produce a signed release."
  fi
  run pnpm exec tsx tools/registry-build.ts
  run node packages/cli/dist/bin.js verify --registry

  # Generate and verify all audit-trail artifacts before npm publication. A
  # failure here must not leave a partially published release.
  run env "SOLIDIOM_RELEASE_ID=${SOLIDIOM_RELEASE_ID:-local-$(git rev-parse --short=12 HEAD)}" \
    pnpm exec tsx tools/generate-beta-artifacts.ts --verify

  if [[ -n "${REGISTRY_SIGN_KEY:-}" ]]; then
    run pnpm exec tsx tools/verify-beta-signing.ts
  else
    step "pnpm exec tsx tools/verify-beta-signing.ts (unsigned — non-fatal)"
    if ! pnpm exec tsx tools/verify-beta-signing.ts; then
      warn "Beta signing verification reported failures (expected: REGISTRY_SIGN_KEY unset, release is UNSIGNED)."
    fi
  fi
fi

# ─── Prepare site deployment artifact ────────────────────────────────────────
# For combined releases this entire site build runs before npm publication, so
# a broken website can never be discovered after packages are already public.
if [[ "$DO_SITE" == true ]]; then
  log "Build and validate site before publication"

  run pnpm nx run-many -t build --exclude=@solidiom/site
  run pnpm --filter '@solidiom/template-*' build

  step "Validate site structure"
  run pnpm --filter @solidiom/site run boundaries
  run pnpm --filter @solidiom/site run route-parity
  run pnpm --filter @solidiom/site run build:deploy
  run pnpm --filter @solidiom/site search-index
fi

# ─── Publish packages ─────────────────────────────────────────────────────────
# Every requested package and site build/validation has succeeded before this
# point. From here onward the operations may be externally visible.
if [[ "$DO_PACKAGES" == true ]]; then
  log "Publish packages"

  # Publish exactly the versions committed at the current tree. Versioning has
  # either already happened through the Version PR/manual flow or was performed
  # and committed above by --prepare-version. The publish phase itself remains
  # Git read-only.
  if [[ "$DRY_RUN" == true ]]; then
    log "[dry-run] skipping 'changeset publish --tag $DIST_TAG' (would publish now)"
    step "changeset has no dry-run mode; run without --dry-run to publish to npm."
  else
    step "pnpm changeset publish --tag $DIST_TAG"
    _publish_log="$(mktemp)"
    if ! pnpm changeset publish --tag "$DIST_TAG" 2>&1 | tee "$_publish_log"; then
      rm -f "$_publish_log"
      fail "changeset publish failed"
    fi
    if grep -Fq "No unpublished projects to publish." "$_publish_log"; then
      rm -f "$_publish_log"
      fail "changeset publish completed without publishing a package"
    fi
    rm -f "$_publish_log"
    unset _publish_log
  fi
fi

# ─── Deploy prebuilt site ─────────────────────────────────────────────────────
if [[ "$DO_SITE" == true ]]; then
  log "Deploy prebuilt site"

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
