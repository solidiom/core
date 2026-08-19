#!/usr/bin/env bash
#
# TEST-005: run the site visual-regression suite inside the pinned Playwright
# image, so screenshots are rasterised in a reproducible environment.
#
# Visual baselines are environment-sensitive. Baselines captured on macOS differ
# from Linux in all 36 images — font rasterisation is not portable — which is why
# committed baselines must only ever be produced through this image.
#
# Usage:
#   tools/visual-container.sh                    # verify against committed baselines
#   tools/visual-container.sh --update           # regenerate baselines in place
#   tools/visual-container.sh --update --amd64   # force amd64 (matches CI, emulated on ARM)
#
# Prefer the pnpm aliases: `pnpm run visual:container` / `pnpm run visual:update:container`.
#
# Without a container runtime, dispatch the `nightly.yml` workflow with
# `regenerate_baselines=true` and a `baseline_reason`, then commit its artifact.
#
# The repository is mounted read-only and cloned inside the container. Nothing is
# written back except the baseline images, and only with --update. This matters:
# installing dependencies over a read-write mount would leave Linux-native
# binaries in the host's node_modules trees and break local development.

set -euo pipefail

# Must track the @playwright/test version in package.json, or the browser build
# bundled in the image will not match the client library.
IMAGE_TAG="v1.62.1-noble"
IMAGE="mcr.microsoft.com/playwright:${IMAGE_TAG}"

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
OUT_DIR="${HOME}/.cache/solidiom-visual"
SNAPSHOT_REL="apps/site/tests/visual/__screenshots__"

TARGET="test:visual"
UPDATE=0
FORCE_AMD64=0

while [[ $# -gt 0 ]]; do
  case "$1" in
    --update)
      TARGET="test:visual:update"
      UPDATE=1
      ;;
    --amd64)
      FORCE_AMD64=1
      ;;
    -h | --help)
      sed -n '2,20p' "${BASH_SOURCE[0]}" | sed 's/^# \{0,1\}//'
      exit 0
      ;;
    *)
      echo "error: unknown argument '$1'" >&2
      exit 2
      ;;
  esac
  shift
done

# ─── Runtime detection ───────────────────────────────────────────────────────

RUNTIME="${CONTAINER_RUNTIME:-}"
if [[ -z "${RUNTIME}" ]]; then
  for candidate in podman docker; do
    if command -v "${candidate}" >/dev/null 2>&1; then
      RUNTIME="${candidate}"
      break
    fi
  done
fi

if [[ -z "${RUNTIME}" ]]; then
  echo "error: no container runtime found (looked for podman, docker)." >&2
  echo "Dispatch nightly.yml with regenerate_baselines=true instead and commit the artifact." >&2
  exit 1
fi

if ! "${RUNTIME}" info >/dev/null 2>&1; then
  echo "error: '${RUNTIME}' is installed but not usable." >&2
  [[ "${RUNTIME}" == "podman" ]] && echo "Hint: podman machine start" >&2
  exit 1
fi

# ─── Image / version consistency ─────────────────────────────────────────────

PINNED_PLAYWRIGHT="$(node -p "require('${REPO_ROOT}/package.json').devDependencies['@playwright/test']")"
if [[ "${IMAGE_TAG}" != "v${PINNED_PLAYWRIGHT}-"* ]]; then
  echo "error: image tag ${IMAGE_TAG} does not match @playwright/test ${PINNED_PLAYWRIGHT}." >&2
  echo "Update IMAGE_TAG here and the container tags in .github/workflows/." >&2
  exit 1
fi

# ─── Architecture warning ────────────────────────────────────────────────────
#
# CI runs on ubuntu-latest, which is amd64. Baselines captured on an arm64 host
# without --amd64 may not reproduce there. They are still far closer than macOS
# baselines, since the distro, fontconfig, and freetype all match.

if [[ ${FORCE_AMD64} -eq 0 && "$(uname -m)" == "arm64" ]]; then
  echo "note: capturing for arm64. CI runs amd64 — pass --amd64 to match it exactly (slower, emulated)."
fi

# ─── Run ─────────────────────────────────────────────────────────────────────

rm -rf "${OUT_DIR}"
mkdir -p "${OUT_DIR}"

echo "runtime: ${RUNTIME}   image: ${IMAGE}   target: ${TARGET}"

# Built incrementally. Kept as one array that is never empty, because macOS ships
# bash 3.2, where expanding an empty array under `set -u` is an error.
RUN_ARGS=(run --rm --ipc=host)

[[ ${FORCE_AMD64} -eq 1 ]] && RUN_ARGS+=(--platform linux/amd64)
[[ -t 0 && -t 1 ]] && RUN_ARGS+=(-t)

RUN_ARGS+=(-v "${REPO_ROOT}:/src:ro")
RUN_ARGS+=(-v "${OUT_DIR}:/out")
RUN_ARGS+=(-e "TARGET=${TARGET}")
RUN_ARGS+=(-e "UPDATE=${UPDATE}")
RUN_ARGS+=(-e NODE_OPTIONS=--max-old-space-size=3072)
RUN_ARGS+=(-e CI=1)

# Reuse a prebuilt dist when present: Astro output is static and
# platform-neutral, so rebuilding inside the container only costs time.
if [[ -f "${REPO_ROOT}/apps/site/dist/index.html" ]]; then
  RUN_ARGS+=(-e REUSE_HOST_DIST=1)
  echo "reusing prebuilt apps/site/dist"
fi

CONTAINER_SCRIPT='
set -euo pipefail
echo "--- arch: $(uname -m) ---"

# The read-only mount is owned by a different uid inside the container.
git config --global --add safe.directory /src
git config --global --add safe.directory /src/.git
echo "--- HEAD: $(git -C /src log --oneline -1) ---"

# Mirror the working tree rather than cloning HEAD. A clone would ignore
# uncommitted changes, which silently produces wrong answers: verifying
# candidate baselines that are not yet committed would compare the container
# render against the previous committed images instead of the new ones.
#
# node_modules is excluded so the container installs Linux-native binaries of
# its own; .git and caches are excluded for size. apps/site/dist is handled
# separately below.
mkdir -p /work
tar -C /src -cf - \
  --exclude=.git \
  --exclude=node_modules \
  --exclude=.nx \
  --exclude=test-results \
  --exclude=apps/site/dist \
  --exclude=apps/site/.astro \
  . | tar -C /work -xf -
cd /work

# The repository prepare script (git config core.hooksPath ...) requires a git
# directory. Since we excluded .git from the tar copy, initialise a throwaway
# repo so `pnpm install` lifecycle scripts do not fail.
git init -q

corepack enable >/dev/null 2>&1
echo "--- installing dependencies ---"
pnpm install --frozen-lockfile 2>&1 | tail -3

if [ "${REUSE_HOST_DIST:-0}" = "1" ]; then
  echo "--- copying prebuilt dist ---"
  mkdir -p apps/site/dist
  cp -a /src/apps/site/dist/. apps/site/dist/
else
  echo "--- building site ---"
  pnpm --filter @solidiom/site build
  pnpm --filter @solidiom/site search-index
fi

echo "--- running ${TARGET} ---"
mkdir -p /out/test-results
LOG_FILE="/out/test-results/site-visual.log"

set +e
PLAYWRIGHT_USE_EXISTING_BUILD=1 pnpm --filter @solidiom/site run "${TARGET}" 2>&1 | tee "$LOG_FILE"
STATUS=${PIPESTATUS[0]}
set -e

# Copy failure artifacts (traces, screenshots, diffs) out for inspection.
if [ "${STATUS}" -ne 0 ] && [ -d "test-results/site-visual" ]; then
  cp -a test-results/site-visual/. /out/test-results/site-visual/ 2>/dev/null || true
fi

# Copy JSON report if generated.
if [ -f "test-results/site-visual-results.json" ]; then
  cp -a test-results/site-visual-results.json /out/test-results/ 2>/dev/null || true
fi

if [ "${UPDATE}" = "1" ]; then
  cp -a "apps/site/tests/visual/__screenshots__/." /out/
  echo "--- baselines copied out ---"
fi

exit "${STATUS}"
'

set +e
"${RUNTIME}" "${RUN_ARGS[@]}" "${IMAGE}" bash -c "${CONTAINER_SCRIPT}"
RUN_STATUS=$?
set -e

if [[ "${UPDATE}" != "1" && ${RUN_STATUS} -ne 0 ]]; then
  echo ""
  echo "════════════════════════════════════════════════════════════"
  echo "  SITE VISUAL FAILURES"
  echo "════════════════════════════════════════════════════════════"
  echo ""
  LOG_FILE="${OUT_DIR}/test-results/site-visual.log"
  if [[ -f "${LOG_FILE}" ]]; then
    grep -E "(FAIL|Error|✘|×|expect\(|Screenshot|snapshot)" "${LOG_FILE}" | head -80
  fi
  echo ""
  echo "────────────────────────────────────────────────────────────"
  echo "  Full log:    ${OUT_DIR}/test-results/site-visual.log"
  echo "  JSON report: ${OUT_DIR}/test-results/site-visual-results.json"
  echo "  Artifacts:   ${OUT_DIR}/test-results/site-visual/"
  echo "════════════════════════════════════════════════════════════"
fi

if [[ "${UPDATE}" == "1" ]]; then
  CAPTURED=$(find "${OUT_DIR}" -name '*.png' | wc -l | tr -d ' ')
  if [[ "${CAPTURED}" == "0" ]]; then
    echo "error: no baselines were captured; leaving ${SNAPSHOT_REL} untouched." >&2
    exit 1
  fi
  cp -a "${OUT_DIR}/." "${REPO_ROOT}/${SNAPSHOT_REL}/"
  echo
  echo "Installed ${CAPTURED} baselines into ${SNAPSHOT_REL}."
  echo "Review every changed image before committing — each one is a visual change:"
  echo "  git status --short -- ${SNAPSHOT_REL}"
  exit 0
fi

exit "${RUN_STATUS}"
