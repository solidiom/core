#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# Manual Beta Release Script
# ─────────────────────────────────────────────────────────────────────────────
#
# Runs the full test/gate suite and, on success, publishes:
#   1. All @solidiom/* packages to npm with the `beta` dist-tag
#   2. The documentation site to Cloudflare Pages (production)
#
# This is the manual fallback for the GitHub Actions release workflow.
# Once Solid 2 goes GA, enable the CI workflow and retire this script.
#
# Prerequisites:
#   - .env file with NPM_TOKEN
#   - CLOUDFLARE_API_TOKEN and CLOUDFLARE_ACCOUNT_ID env vars (or in .env)
#   - wrangler installed (npx wrangler)
#   - All dependencies installed (pnpm install)
#
# Usage:
#   ./scripts/release.sh              # full release (tests + npm + cloudflare)
#   ./scripts/release.sh --dry-run    # run tests only, no publish
#   ./scripts/release.sh --skip-tests # skip tests, publish only (use with caution)
#   ./scripts/release.sh --site-only  # build and deploy site only (no npm, no tests)
#
# ─────────────────────────────────────────────────────────────────────────────
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$REPO_ROOT"

# ─── Configuration ──────────────────────────────────────────────────────────

CLOUDFLARE_PROJECT="solidiom-site"
SITE_DIR="apps/site/dist"
DRY_RUN=0
SKIP_TESTS=0
SITE_ONLY=0

# ─── Argument parsing ───────────────────────────────────────────────────────

while [[ $# -gt 0 ]]; do
  case "$1" in
    --dry-run)  DRY_RUN=1;    shift ;;
    --skip-tests) SKIP_TESTS=1; shift ;;
    --site-only) SITE_ONLY=1; SKIP_TESTS=1; shift ;;
    --help|-h)
      head -25 "$0" | grep "^#" | sed 's/^# \?//'
      exit 0
      ;;
    *) echo "Unknown argument: $1" >&2; exit 1 ;;
  esac
done

# ─── Helpers ────────────────────────────────────────────────────────────────

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
BOLD='\033[1m'
RESET='\033[0m'

step() { echo -e "\n${BLUE}${BOLD}[$1]${RESET} $2"; }
pass() { echo -e "  ${GREEN}✓${RESET} $1"; }
fail() { echo -e "  ${RED}✗${RESET} $1" >&2; }
warn() { echo -e "  ${YELLOW}⚠${RESET} $1"; }

die() {
  echo -e "\n${RED}${BOLD}RELEASE ABORTED:${RESET} $1" >&2
  exit 1
}

# ─── Load environment ───────────────────────────────────────────────────────

if [[ -f "$REPO_ROOT/.env" ]]; then
  # Source .env properly, handling quoted values and comments
  set -a
  # shellcheck disable=SC1091
  source "$REPO_ROOT/.env"
  set +a
  pass ".env loaded from $REPO_ROOT/.env"
fi

# ─── Preflight checks ──────────────────────────────────────────────────────

step "0/7" "Preflight checks"

if [[ $SITE_ONLY -eq 0 ]]; then
  if [[ -z "${NPM_TOKEN:-}" ]]; then
    die "NPM_TOKEN not set. Add it to .env or export it."
  fi
  pass "NPM_TOKEN is set"
fi

if [[ $DRY_RUN -eq 0 ]]; then
  if [[ -z "${CLOUDFLARE_API_TOKEN:-}" ]]; then
    warn "CLOUDFLARE_API_TOKEN not set — site deploy will be skipped"
    SKIP_CLOUDFLARE=1
  else
    SKIP_CLOUDFLARE=0
    pass "CLOUDFLARE_API_TOKEN is set"
  fi

  if [[ -z "${CLOUDFLARE_ACCOUNT_ID:-}" ]] && [[ ${SKIP_CLOUDFLARE:-0} -eq 0 ]]; then
    warn "CLOUDFLARE_ACCOUNT_ID not set — site deploy will be skipped"
    SKIP_CLOUDFLARE=1
  else
    [[ ${SKIP_CLOUDFLARE:-0} -eq 0 ]] && pass "CLOUDFLARE_ACCOUNT_ID is set"
  fi
else
  SKIP_CLOUDFLARE=1
fi

if [[ $SITE_ONLY -eq 0 ]]; then
  # Verify npm token is valid
  echo "//registry.npmjs.org/:_authToken=${NPM_TOKEN}" > /tmp/.npmrc-release-check
  NPM_USER=$(npm whoami --registry https://registry.npmjs.org/ --userconfig /tmp/.npmrc-release-check 2>/dev/null || true)
  rm -f /tmp/.npmrc-release-check

  if [[ -z "$NPM_USER" ]]; then
    die "NPM_TOKEN is invalid (npm whoami failed)"
  fi
  pass "npm authenticated as: $NPM_USER"
fi

# Check working tree is clean
if [[ -n "$(git status --porcelain)" ]]; then
  die "Working tree is not clean. Commit or stash changes first."
fi
pass "Working tree is clean"

# Check we're on main
BRANCH=$(git branch --show-current)
if [[ "$BRANCH" != "main" ]]; then
  warn "Not on main (on: $BRANCH) — publishing from a non-main branch"
fi
pass "On branch: $BRANCH"

echo ""
echo -e "${BOLD}Release plan:${RESET}"
if [[ $SITE_ONLY -eq 1 ]]; then
  echo "  npm publish:  SKIPPED (--site-only)"
else
  echo "  npm publish:  @solidiom/* packages with --tag beta"
fi
echo "  site deploy:  $CLOUDFLARE_PROJECT to Cloudflare Pages"
echo "  dry-run:      $( [[ $DRY_RUN -eq 1 ]] && echo 'YES (no publish)' || echo 'no' )"
echo "  site-only:    $( [[ $SITE_ONLY -eq 1 ]] && echo 'YES' || echo 'no' )"
echo ""

if [[ $DRY_RUN -eq 0 ]]; then
  read -r -p "Proceed? [y/N] " confirm
  if [[ ! "$confirm" =~ ^[Yy]$ ]]; then
    echo "Aborted."
    exit 0
  fi
fi

# ─── Step 1: Install ───────────────────────────────────────────────────────

step "1/7" "Installing dependencies"
pnpm install --frozen-lockfile
pass "Dependencies installed"

# ─── Step 2: Tests & Gates ─────────────────────────────────────────────────

if [[ $SKIP_TESTS -eq 0 ]]; then
  step "2/7" "Running tests and gates"

  echo "  Running format check..."
  pnpm run format:check || die "Format check failed"
  pass "Format"

  echo "  Running typecheck..."
  pnpm typecheck || die "Typecheck failed"
  pass "Typecheck"

  echo "  Running build..."
  pnpm nx run-many -t build --exclude=@solidiom/site || die "Build failed"
  pass "Build"

  echo "  Installing Playwright browsers..."
  pnpm exec playwright install chromium > /dev/null 2>&1
  pass "Playwright chromium installed"

  echo "  Running unit tests..."
  pnpm test || die "Unit tests failed"
  pass "Unit tests"

  echo "  Running tools tests..."
  pnpm run test:tools || die "Tools tests failed"
  pass "Tools tests"

  echo "  Running browser tests..."
  pnpm exec vitest run --config vitest.browser.config.ts < /dev/null || die "Browser tests failed"
  pass "Browser tests"

  echo "  Running Phase 3 gate..."
  pnpm run gate:phase3 || die "Phase 3 gate failed"
  pass "Phase 3 gate (includes Phase 0, 1, 2)"

else
  step "2/7" "Skipping tests (--skip-tests)"
  warn "Tests skipped — make sure they pass before publishing!"
fi

# ─── Step 3: Build registry ────────────────────────────────────────────────

if [[ $SITE_ONLY -eq 0 ]]; then
  step "3/7" "Building and verifying registry"
  pnpm exec tsx tools/registry-build.ts || die "Registry build failed"
  node packages/cli/dist/bin.js verify --registry || die "Registry verification failed"
  pass "Registry built and verified (unsigned — signing is CI-only)"
else
  step "3/7" "Skipping registry build (--site-only)"
fi

# ─── Step 4: Version packages ──────────────────────────────────────────────

if [[ $SITE_ONLY -eq 0 ]]; then
  step "4/7" "Applying changeset versions"

  PENDING=$(pnpm changeset status 2>&1 | grep -c "found [0-9]" || true)
  if [[ "$PENDING" == "0" ]] && ! ls .changeset/*.md 2>/dev/null | grep -qv "README.md"; then
    warn "No pending changesets — versions will not be bumped"
  else
    pnpm changeset version || die "Changeset version failed"
    pass "Versions bumped and changelogs generated"

    # Rebuild with final version strings
    echo "  Rebuilding with final versions..."
    pnpm nx run-many -t build --exclude=@solidiom/site || die "Rebuild failed"
    pass "Rebuilt with versioned packages"
  fi
else
  step "4/7" "Skipping versioning (--site-only)"
fi

# ─── Step 5: Publish to npm ────────────────────────────────────────────────

if [[ $SITE_ONLY -eq 0 ]]; then
  step "5/7" "Publishing to npm"

  if [[ $DRY_RUN -eq 1 ]]; then
    warn "DRY RUN — skipping npm publish"
    echo "  Would publish with: pnpm changeset publish --tag beta"
  else
    # Configure npm auth
    echo "//registry.npmjs.org/:_authToken=${NPM_TOKEN}" >> "$REPO_ROOT/.npmrc"
    trap 'sed -i "" "/registry.npmjs.org/d" "$REPO_ROOT/.npmrc" 2>/dev/null || true' EXIT

    pnpm changeset publish --tag beta || die "npm publish failed"
    pass "Published to npm with beta tag"

    # Clean up auth token from .npmrc
    sed -i "" "/registry.npmjs.org/d" "$REPO_ROOT/.npmrc" 2>/dev/null || true
  fi
else
  step "5/7" "Skipping npm publish (--site-only)"
fi

# ─── Step 6: Build and deploy site ─────────────────────────────────────────

step "6/7" "Building and deploying site"

echo "  Building templates..."
pnpm --filter '@solidiom/template-*' build || die "Template build failed"
pass "Templates built"

echo "  Building site..."
# Use build:deploy which skips i18n:validate — translation quality is a GA
# gate, not a beta gate. The full `build` command enforces human-reviewed
# translations which aren't expected until the stable release.
pnpm --filter @solidiom/site run build:deploy || die "Site build failed"
pnpm --filter @solidiom/site search-index || die "Search index failed"
pass "Site built with Pagefind index"

if [[ $DRY_RUN -eq 1 ]]; then
  warn "DRY RUN — skipping Cloudflare deploy"
elif [[ ${SKIP_CLOUDFLARE:-0} -eq 1 ]]; then
  warn "Cloudflare deploy skipped (missing credentials)"
else
  echo "  Deploying to Cloudflare Pages..."
  npx wrangler pages deploy "$SITE_DIR" \
    --project-name="$CLOUDFLARE_PROJECT" \
    --branch=main \
    --commit-dirty=true \
    2>&1 || die "Cloudflare deploy failed"
  pass "Site deployed to Cloudflare Pages"
fi

# ─── Step 7: Generate artifacts and commit ─────────────────────────────────

if [[ $SITE_ONLY -eq 0 ]]; then
  step "7/7" "Generating release artifacts"

  pnpm exec tsx tools/generate-beta-artifacts.ts --verify || die "Beta artifacts failed"
  pass "Beta artifacts generated and verified"

  if [[ $DRY_RUN -eq 0 ]]; then
    # Commit version bumps and artifacts
    git add -A
    if git diff --cached --quiet; then
      warn "No changes to commit"
    else
      git commit -m "chore(release): publish beta packages

Packages published to npm with --tag beta.
Site deployed to Cloudflare Pages."
      pass "Release changes committed"
    fi
  fi
else
  step "7/7" "Skipping artifacts (--site-only)"
fi

# ─── Done ───────────────────────────────────────────────────────────────────

echo ""
echo -e "${GREEN}${BOLD}═══════════════════════════════════════════════════${RESET}"
if [[ $DRY_RUN -eq 1 ]]; then
  echo -e "${GREEN}${BOLD}  Beta Release Dry Run COMPLETE${RESET}"
  echo ""
  echo "  All checks passed. Run without --dry-run to publish."
elif [[ $SITE_ONLY -eq 1 ]]; then
  echo -e "${GREEN}${BOLD}  Site Deploy COMPLETE${RESET}"
  echo ""
  [[ ${SKIP_CLOUDFLARE:-0} -eq 0 ]] && echo "  site:  deployed to Cloudflare Pages"
  [[ ${SKIP_CLOUDFLARE:-0} -eq 1 ]] && echo "  site:  built (deploy skipped — missing credentials)"
else
  echo -e "${GREEN}${BOLD}  Beta Release COMPLETE${RESET}"
  echo ""
  echo "  npm:   @solidiom/* published with beta tag"
  [[ ${SKIP_CLOUDFLARE:-0} -eq 0 ]] && echo "  site:  deployed to Cloudflare Pages"
  echo ""
  echo "  Next steps:"
  echo "    1. git push"
  echo "    2. Verify: npm info @solidiom/runtime dist-tags"
  echo "    3. Configure trusted publishing on npmjs.com for each package"
fi
echo -e "${GREEN}${BOLD}═══════════════════════════════════════════════════${RESET}"
