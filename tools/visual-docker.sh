#!/usr/bin/env bash
#
# TEST-005: run the site visual-regression suite inside the pinned Playwright
# image, so screenshots are rasterised in the same environment CI uses.
#
# Visual baselines are environment-sensitive. A baseline captured directly on
# macOS will not match what the `site-visual` job renders on Linux, which is why
# the committed baselines must only ever be produced through this image.
#
# Usage:
#   tools/visual-docker.sh              # verify against committed baselines
#   tools/visual-docker.sh --update     # regenerate baselines
#
# Prefer the pnpm aliases: `pnpm run visual:docker` / `pnpm run visual:update:docker`.
#
# Without Docker, dispatch .github/workflows/visual-baselines.yml instead and
# commit the artifact it produces.

set -euo pipefail

# Must track the @playwright/test version in package.json, or the browser build
# bundled in the image will not match the client library.
IMAGE="mcr.microsoft.com/playwright:v1.61.1-noble"

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

TARGET="test:visual"
if [[ "${1:-}" == "--update" ]]; then
  TARGET="test:visual:update"
fi

if ! command -v docker >/dev/null 2>&1; then
  echo "error: docker is not installed." >&2
  echo "Install Docker, or dispatch .github/workflows/visual-baselines.yml and commit the artifact." >&2
  exit 1
fi

if ! docker info >/dev/null 2>&1; then
  echo "error: the Docker daemon is not running." >&2
  exit 1
fi

PINNED_PLAYWRIGHT="$(node -p "require('${REPO_ROOT}/package.json').devDependencies['@playwright/test']")"
if [[ "${IMAGE}" != *"v${PINNED_PLAYWRIGHT}-"* ]]; then
  echo "error: image ${IMAGE} does not match @playwright/test ${PINNED_PLAYWRIGHT}." >&2
  echo "Update IMAGE in this script and the container tags in .github/workflows/." >&2
  exit 1
fi

echo "Running ${TARGET} in ${IMAGE}"

# --ipc=host avoids Chromium crashes from the default 64MB /dev/shm.
# node_modules is masked with an anonymous volume so the container installs its
# own Linux binaries instead of reusing macOS-native ones from the host mount.
docker run --rm -it \
  --ipc=host \
  -v "${REPO_ROOT}:/work" \
  -v /work/node_modules \
  -w /work \
  -e CI \
  -e NODE_OPTIONS=--max-old-space-size=4096 \
  "${IMAGE}" \
  bash -euo pipefail -c "
    corepack enable
    pnpm install --frozen-lockfile
    pnpm --filter @solidiom/site build
    pnpm --filter @solidiom/site search-index
    PLAYWRIGHT_USE_EXISTING_BUILD=1 pnpm --filter @solidiom/site run ${TARGET}
  "

if [[ "${TARGET}" == "test:visual:update" ]]; then
  echo
  echo "Baselines regenerated. Review each changed image before committing:"
  echo "  git status --short -- apps/site/tests/visual/__screenshots__"
fi
