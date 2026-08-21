#!/usr/bin/env bash
# Unpublish a specific version of every publishable workspace package from npm.
#
#   npm unpublish <pkg>@<version>
#
# ⚠️  DESTRUCTIVE & LARGELY IRREVERSIBLE:
#   - npm only allows unpublish within 72h of publish (else it fails).
#   - You can NEVER republish the same name@version again.
#   - Consumers with that version pinned/locked will break.
#   - Unpublishing the version behind the `latest` tag breaks default installs.
#
# Safe by default: performs a DRY RUN unless you pass --yes.
#
# Usage:
#   ./scripts/unpublish-version.sh 0.1.0                 # dry run (shows what would happen)
#   ./scripts/unpublish-version.sh 0.1.0 --yes           # actually unpublish
#   ./scripts/unpublish-version.sh 0.1.0 --include-ignored  # also target Changesets-ignored pkgs
#
# Auth: reads NPM_TOKEN from the shell env, then ./.env. Never prints the token.

set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

VERSION=""
CONFIRM=false
INCLUDE_IGNORED=false

fail() {
  printf '\033[1;31mAborted:\033[0m %s\n' "$*" >&2
  exit 1
}
log() { printf '\n\033[1;36m==>\033[0m %s\n' "$*"; }
warn() { printf '\033[1;33mwarning:\033[0m %s\n' "$*" >&2; }

while [[ $# -gt 0 ]]; do
  case "$1" in
    --yes) CONFIRM=true; shift ;;
    --include-ignored) INCLUDE_IGNORED=true; shift ;;
    --help | -h)
      sed -n '2,30p' "$0"
      exit 0
      ;;
    -*) fail "Unknown option: $1" ;;
    *)
      [[ -z "$VERSION" ]] || fail "Version already set to '$VERSION'; unexpected arg '$1'"
      VERSION="$1"
      shift
      ;;
  esac
done

[[ -n "$VERSION" ]] || fail "Provide a version, e.g. ./scripts/unpublish-version.sh 0.1.0"
[[ "$VERSION" =~ ^[0-9]+\.[0-9]+\.[0-9]+([-.+].+)?$ ]] || fail "'$VERSION' does not look like a semver version"

# ─── Load NPM_TOKEN (env wins; else from .env) ────────────────────────────────
if [[ -z "${NPM_TOKEN:-}" && -f .env ]]; then
  tmp="$(mktemp)"
  grep -E '^NPM_TOKEN=' .env >"$tmp" || true
  set -a
  # shellcheck disable=SC1090
  source "$tmp"
  set +a
  rm -f "$tmp"
fi
[[ -n "${NPM_TOKEN:-}" ]] || fail "NPM_TOKEN is not set (shell env or .env)"
export NPM_TOKEN

command -v npm >/dev/null || fail "npm is required"
command -v node >/dev/null || fail "node is required"

# ─── Collect publishable package names ────────────────────────────────────────
# Changesets-ignored packages are internal (see .changeset/config.json). Skip
# them by default; --include-ignored overrides.
IGNORED_JSON="$(node -e '
  try {
    const c = require("./.changeset/config.json");
    process.stdout.write(JSON.stringify(c.ignore || []));
  } catch { process.stdout.write("[]"); }
')"

PKGS=()
while IFS= read -r line; do
  [[ -n "$line" ]] && PKGS+=("$line")
done < <(node -e '
  const { readdirSync, readFileSync, existsSync } = require("node:fs");
  const ignored = new Set(JSON.parse(process.argv[1]));
  const includeIgnored = process.argv[2] === "true";
  for (const d of readdirSync("packages", { withFileTypes: true })) {
    if (!d.isDirectory()) continue;
    const p = `packages/${d.name}/package.json`;
    if (!existsSync(p)) continue;
    const pkg = JSON.parse(readFileSync(p, "utf8"));
    if (!pkg.name || pkg.private) continue;
    if (!includeIgnored && ignored.has(pkg.name)) continue;
    console.log(pkg.name);
  }
' "$IGNORED_JSON" "$INCLUDE_IGNORED" | sort)

[[ ${#PKGS[@]} -gt 0 ]] || fail "No publishable packages found under packages/"

# ─── Determine which packages actually have this version on npm ───────────────
log "Scanning npm for packages that have version $VERSION"
TARGETS=()
for pkg in "${PKGS[@]}"; do
  onnpm="$(npm view "${pkg}@${VERSION}" version 2>/dev/null || true)"
  if [[ "$onnpm" == "$VERSION" ]]; then
    # Warn loudly if this version is the current `latest`.
    latest="$(npm view "${pkg}" dist-tags.latest 2>/dev/null || true)"
    if [[ "$latest" == "$VERSION" ]]; then
      TARGETS+=("$pkg (⚠ currently 'latest')")
    else
      TARGETS+=("$pkg")
    fi
  fi
done

if [[ ${#TARGETS[@]} -eq 0 ]]; then
  log "No packages have version $VERSION published — nothing to do."
  exit 0
fi

log "${#TARGETS[@]} package(s) have $VERSION published:"
printf '  - %s\n' "${TARGETS[@]}"

if [[ "$CONFIRM" != true ]]; then
  cat <<EOF

DRY RUN — nothing was unpublished. This is destructive and irreversible:
  • npm blocks unpublish after 72h from publish.
  • name@version can NEVER be republished once removed.
  • pinned/locked consumers will break; any '⚠ currently latest' above will
    break default installs until you re-point the tag.

Re-run with --yes to actually unpublish $VERSION from the ${#TARGETS[@]} package(s) above.
EOF
  exit 0
fi

# ─── Execute ──────────────────────────────────────────────────────────────────
log "Unpublishing $VERSION from ${#TARGETS[@]} package(s)"
ok=0
fails=()
for entry in "${TARGETS[@]}"; do
  pkg="${entry%% *}" # strip any " (⚠ ...)" suffix
  printf '  • npm unpublish %s@%s ... ' "$pkg" "$VERSION"
  if err="$(npm unpublish "${pkg}@${VERSION}" 2>&1)"; then
    printf 'done\n'
    ok=$((ok + 1))
  else
    printf 'FAILED\n'
    fails+=("${pkg}: $(printf '%s' "$err" | tr '\n' ' ')")
  fi
done

log "Unpublished $ok / ${#TARGETS[@]}"
if [[ ${#fails[@]} -gt 0 ]]; then
  warn "${#fails[@]} failure(s):"
  printf '    %s\n' "${fails[@]}" >&2
  exit 1
fi
