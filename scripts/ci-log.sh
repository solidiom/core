#!/usr/bin/env bash
# Shared CI logging wrapper.
#
# Runs a command while capturing its full output to test-results/<name>.log,
# preserving the command's real exit code (not tee's), and printing a boxed
# failure summary that greps common error markers and points at the log.
#
# Usage:
#   scripts/ci-log.sh <log-name> -- <command> [args...]
#
# Example:
#   scripts/ci-log.sh typecheck -- pnpm typecheck
#
# This mirrors the logging pattern established by the ci:site-e2e task so every
# CI task leaves an inspectable artifact behind — especially useful when a run
# fails in a different spot each time.

set -uo pipefail

fail() {
  echo "ci-log.sh: $*" >&2
  exit 2
}

LOG_NAME="${1:-}"
[ -n "$LOG_NAME" ] || fail "missing <log-name> (usage: ci-log.sh <name> -- <command...>)"
shift

[ "${1:-}" = "--" ] || fail "expected '--' separator before the command (usage: ci-log.sh <name> -- <command...>)"
shift

[ "$#" -gt 0 ] || fail "missing command to run after '--'"

# Sanitize the log name to a safe filename (strip path separators / odd chars).
SAFE_NAME="$(printf '%s' "$LOG_NAME" | tr -c 'A-Za-z0-9._-' '-')"
LOG_DIR="test-results"
LOG_FILE="${LOG_DIR}/${SAFE_NAME}.log"
mkdir -p "$LOG_DIR"

# Human-readable label for the boxed summary (uppercase, spaces for dashes).
LABEL="$(printf '%s' "$LOG_NAME" | tr '[:lower:]' '[:upper:]' | tr '-' ' ')"

echo "==> ${LOG_NAME}: $*"
echo "    log: ${LOG_FILE}"

# Run the command, teeing combined stdout+stderr to the log while preserving the
# command's exit code via PIPESTATUS.
"$@" 2>&1 | tee "$LOG_FILE"
EXIT_CODE=${PIPESTATUS[0]}

if [ "$EXIT_CODE" -ne 0 ]; then
  echo ""
  echo "════════════════════════════════════════════════════════════"
  echo "  ${LABEL} FAILED (exit ${EXIT_CODE})"
  echo "════════════════════════════════════════════════════════════"
  echo ""
  # Surface the most relevant lines from the log.
  grep -nE "(FAIL|ERROR|Error|error:|✘|×|✖|expect\(|Cannot|not found|EEXIST|ENOENT|Timeout|timed out)" \
    "$LOG_FILE" | tail -60 || echo "  (no recognizable error markers; see full log)"
  echo ""
  echo "────────────────────────────────────────────────────────────"
  echo "  Full log: ${LOG_FILE}"
  echo "════════════════════════════════════════════════════════════"
fi

exit "$EXIT_CODE"
