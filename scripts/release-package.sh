#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# Single-Package Publish Script
# ─────────────────────────────────────────────────────────────────────────────
#
# Builds, tests, and publishes a single @solidiom/* package without running
# the full CI pipeline. Useful for hotfixes, new packages, and adapter/
# integration releases that don't need the full gate suite.
#
# Usage:
#   ./scripts/release-package.sh @solidiom/astrojs-solid-next
#   ./scripts/release-package.sh @solidiom/button --dry-run
#   ./scripts/release-package.sh @solidiom/runtime --tag latest
#   ./scripts/release-package.sh @solidiom/button --bump patch
#
# Options:
#   --dry-run     Build and test but don't publish
#   --tag <tag>   npm dist-tag (default: beta)
#   --skip-tests  Skip test step (use with caution)
#   --bump <type> Bump version before publishing (patch|minor|major|prerelease)
#   --preid <id>  Prerelease identifier for --bump prerelease (default: beta)
#
# ─────────────────────────────────────────────────────────────────────────────
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$REPO_ROOT"

# ─── Configuration ──────────────────────────────────────────────────────────

DRY_RUN=0
SKIP_TESTS=0
TAG="beta"
BUMP=""
PREID="beta"
PACKAGE=""

# ─── Argument parsing ───────────────────────────────────────────────────────

while [[ $# -gt 0 ]]; do
  case "$1" in
    --dry-run)     DRY_RUN=1;      shift ;;
    --skip-tests)  SKIP_TESTS=1;   shift ;;
    --tag)         TAG="$2";       shift 2 ;;
    --bump)        BUMP="$2";      shift 2 ;;
    --preid)       PREID="$2";     shift 2 ;;
    --help|-h)
      head -20 "$0" | grep "^#" | sed 's/^# \?//'
      exit 0
      ;;
    -*)
      echo "Unknown option: $1" >&2; exit 1 ;;
    *)
      if [[ -z "$PACKAGE" ]]; then
        PACKAGE="$1"
      else
        echo "Unexpected argument: $1 (package already set to $PACKAGE)" >&2; exit 1
      fi
      shift
      ;;
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
warn() { echo -e "  ${YELLOW}⚠${RESET} $1"; }

die() {
  echo -e "\n${RED}${BOLD}PUBLISH ABORTED:${RESET} $1" >&2
  exit 1
}

# ─── Validation ─────────────────────────────────────────────────────────────

if [[ -z "$PACKAGE" ]]; then
  die "No package specified. Usage: $0 @solidiom/<name> [options]"
fi

# Resolve the package directory
PKG_DIR=$(pnpm nx show project "$PACKAGE" --json 2>/dev/null | node -e "
  const d = require('fs').readFileSync('/dev/stdin','utf8');
  try { console.log(JSON.parse(d).root); } catch { process.exit(1); }
" 2>/dev/null) || die "Package '$PACKAGE' not found in workspace"

if [[ ! -f "$REPO_ROOT/$PKG_DIR/package.json" ]]; then
  die "Package directory '$PKG_DIR' does not contain a package.json"
fi

# Check if package is private
IS_PRIVATE=$(node -e "const p=require('./$PKG_DIR/package.json'); console.log(!!p.private)")
if [[ "$IS_PRIVATE" == "true" ]]; then
  die "'$PACKAGE' is marked private and cannot be published"
fi

echo -e "${BOLD}Single-Package Publish${RESET}"
echo ""
echo "  package:    $PACKAGE"
echo "  directory:  $PKG_DIR"
echo "  tag:        $TAG"
echo "  bump:       ${BUMP:-none}"
echo "  dry-run:    $( [[ $DRY_RUN -eq 1 ]] && echo 'yes' || echo 'no' )"
echo ""

# ─── Step 1: Preflight ─────────────────────────────────────────────────────

step "1/5" "Preflight checks"

if [[ $DRY_RUN -eq 0 ]]; then
  # Load .env if present
  if [[ -f "$REPO_ROOT/.env" ]]; then
    set -a; source "$REPO_ROOT/.env"; set +a
    pass ".env loaded"
  fi

  if [[ -z "${NPM_TOKEN:-}" ]]; then
    die "NPM_TOKEN not set. Add it to .env or export it."
  fi

  # Verify npm token
  echo "//registry.npmjs.org/:_authToken=${NPM_TOKEN}" > /tmp/.npmrc-pkg-check
  NPM_USER=$(npm whoami --registry https://registry.npmjs.org/ --userconfig /tmp/.npmrc-pkg-check 2>/dev/null || true)
  rm -f /tmp/.npmrc-pkg-check
  if [[ -z "$NPM_USER" ]]; then
    die "NPM_TOKEN is invalid (npm whoami failed)"
  fi
  pass "npm authenticated as: $NPM_USER"
fi

# Check for linked packages that would need co-publishing
LINKED=$(node -e "
  const cfg = require('./.changeset/config.json');
  const linked = (cfg.linked || []).flat();
  if (linked.includes('$PACKAGE')) {
    const group = (cfg.linked || []).find(g => g.includes('$PACKAGE')) || [];
    const others = group.filter(p => p !== '$PACKAGE');
    if (others.length > 0) console.log(others.join(', '));
  }
")
if [[ -n "$LINKED" ]]; then
  warn "This package is linked with: $LINKED"
  warn "Linked packages should normally be published together (use full release)"
  if [[ $DRY_RUN -eq 0 ]]; then
    read -r -p "  Continue anyway? [y/N] " confirm
    if [[ ! "$confirm" =~ ^[Yy]$ ]]; then
      echo "Aborted."
      exit 0
    fi
  fi
fi

pass "Preflight complete"

# ─── Step 2: Build ─────────────────────────────────────────────────────────

step "2/5" "Building $PACKAGE (+ dependency graph)"
pnpm nx build "$PACKAGE" || die "Build failed"
pass "Build succeeded"

# ─── Step 3: Typecheck ─────────────────────────────────────────────────────

step "3/5" "Type-checking $PACKAGE"
pnpm nx typecheck "$PACKAGE" || die "Typecheck failed"
pass "Typecheck passed"

# ─── Step 4: Test ──────────────────────────────────────────────────────────

if [[ $SKIP_TESTS -eq 0 ]]; then
  step "4/5" "Testing $PACKAGE"
  pnpm nx test "$PACKAGE" || die "Tests failed"
  pass "Tests passed"
else
  step "4/5" "Skipping tests (--skip-tests)"
  warn "Tests skipped — make sure they pass before publishing!"
fi

# ─── Step 5: Publish ───────────────────────────────────────────────────────

step "5/5" "Publishing $PACKAGE"

if [[ -n "$BUMP" ]]; then
  echo "  Bumping version ($BUMP)..."
  if [[ "$BUMP" == "prerelease" ]]; then
    cd "$REPO_ROOT/$PKG_DIR"
    npm version prerelease --preid="$PREID" --no-git-tag-version || die "Version bump failed"
    cd "$REPO_ROOT"
  else
    cd "$REPO_ROOT/$PKG_DIR"
    npm version "$BUMP" --no-git-tag-version || die "Version bump failed"
    cd "$REPO_ROOT"
  fi
  NEW_VERSION=$(node -e "console.log(require('./$PKG_DIR/package.json').version)")
  pass "Version bumped to $NEW_VERSION"

  # Rebuild with new version
  echo "  Rebuilding with new version..."
  pnpm nx build "$PACKAGE" || die "Rebuild failed"
  pass "Rebuilt with version $NEW_VERSION"
fi

CURRENT_VERSION=$(node -e "console.log(require('./$PKG_DIR/package.json').version)")

if [[ $DRY_RUN -eq 1 ]]; then
  warn "DRY RUN — would publish $PACKAGE@$CURRENT_VERSION with --tag $TAG"
  echo ""
  echo "  Command: pnpm --filter $PACKAGE publish --tag $TAG --access public --no-git-checks"
else
  # Configure npm auth
  echo "//registry.npmjs.org/:_authToken=${NPM_TOKEN}" >> "$REPO_ROOT/.npmrc"
  trap 'sed -i "" "/registry.npmjs.org/d" "$REPO_ROOT/.npmrc" 2>/dev/null || true' EXIT

  pnpm --filter "$PACKAGE" publish --tag "$TAG" --access public --no-git-checks || die "Publish failed"

  # Clean up auth token
  sed -i "" "/registry.npmjs.org/d" "$REPO_ROOT/.npmrc" 2>/dev/null || true

  pass "Published $PACKAGE@$CURRENT_VERSION with tag '$TAG'"
fi

# ─── Done ───────────────────────────────────────────────────────────────────

echo ""
echo -e "${GREEN}${BOLD}═══════════════════════════════════════════════════${RESET}"
if [[ $DRY_RUN -eq 1 ]]; then
  echo -e "${GREEN}${BOLD}  Dry Run Complete${RESET}"
  echo ""
  echo "  $PACKAGE@$CURRENT_VERSION ready to publish"
  echo "  Run without --dry-run to publish."
else
  echo -e "${GREEN}${BOLD}  Package Published${RESET}"
  echo ""
  echo "  $PACKAGE@$CURRENT_VERSION → npm ($TAG)"
  echo ""
  echo "  Verify: npm info $PACKAGE dist-tags"
  if [[ -n "$BUMP" ]]; then
    echo ""
    echo "  Don't forget to commit the version bump:"
    echo "    git add $PKG_DIR/package.json && git commit -m \"chore(release): $PACKAGE@$CURRENT_VERSION\""
  fi
fi
echo -e "${GREEN}${BOLD}═══════════════════════════════════════════════════${RESET}"
