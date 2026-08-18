#!/usr/bin/env bash
# Dispatch the unified GitHub Actions release workflow.
#
# Usage:
#   ./scripts/release.sh                         # packages + site, quick gate
#   ./scripts/release.sh --target packages       # publish packages only
#   ./scripts/release.sh --target site            # deploy site only
#   ./scripts/release.sh --target all --gate full # full release gate
#
# Publishing and deployment happen only in GitHub Actions, where release
# credentials, registry signing, artifacts, and the audit trail are managed.

set -euo pipefail

TARGET="all"
GATE="quick"
REF="$(git branch --show-current)"
WATCH=true

usage() {
  cat <<'EOF'
Usage: ./scripts/release.sh [options]

Options:
  --target <packages|site|all>  Release target (default: all)
  --gate <quick|full>           Gate level for package releases (default: quick)
  --ref <branch>                Branch/ref to dispatch from (default: current branch)
  --no-watch                    Submit the workflow without streaming its result
  --help, -h                    Show this help

The script dispatches .github/workflows/release.yml through the GitHub CLI.
It does not publish packages or deploy the site locally.
EOF
}

fail() {
  echo "Release dispatch aborted: $*" >&2
  exit 1
}

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
    --help|-h)
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
[[ -n "$REF" ]] || fail "Unable to determine a ref; supply --ref <branch>"

command -v gh >/dev/null || fail "GitHub CLI (gh) is required"
gh auth status >/dev/null || fail "Authenticate the GitHub CLI with 'gh auth login'"

echo "Dispatching release workflow"
echo "  target: $TARGET"
echo "  gate:   $GATE"
echo "  ref:    $REF"

gh workflow run release.yml --ref "$REF" -f "target=$TARGET" -f "gate=$GATE"

if [[ "$WATCH" == false ]]; then
  echo "Workflow dispatched. Follow it with: gh run list --workflow release.yml --branch $REF"
  exit 0
fi

# GitHub CLI does not return the run ID on dispatch, so wait briefly for the
# corresponding workflow_dispatch event to appear before following it.
RUN_ID=""
for _ in {1..12}; do
  RUN_ID="$(gh run list \
    --workflow release.yml \
    --branch "$REF" \
    --event workflow_dispatch \
    --limit 1 \
    --json databaseId \
    --jq '.[0].databaseId' 2>/dev/null || true)"
  [[ -n "$RUN_ID" ]] && break
  sleep 2
done

[[ -n "$RUN_ID" ]] || fail "Workflow was dispatched, but its run was not found. Use 'gh run list --workflow release.yml'."

echo "Watching run $RUN_ID"
gh run watch "$RUN_ID" --exit-status
