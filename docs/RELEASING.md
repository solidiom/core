# Releasing

Solidiom uses a **two-step release model** so that a publish run never mutates
the repository. Versioning happens first in a reviewable PR; merging that PR
creates an immutable release marker and explicitly dispatches publishing and the
website deployment at the exact merge commit.

```
 ┌─ accumulate changesets on main
 │
 ▼
 version.yml (manual dispatch)
 │   • pnpm changeset version   (bumps package.json + CHANGELOGs)
 │   • regenerate + re-sign registry/index.json
 │   • opens a Version PR       (branch: release/version-<run-id>)
 ▼
 Version PR ──► review ──► merge
 │
 ▼
 tag-on-version-merge.yml  (auto, on PR merge)
 │   • verifies publishable package versions changed
 │   • creates release-pr-<PR>-<SHA12> at the merge commit
 │   • dispatches release.yml on that tag with expected_sha=<full SHA>
 ▼
 release.yml  (workflow_dispatch at the immutable marker)
 │   • verify exact SHA and unpublished npm candidates
 │   • build → sign → changeset publish → deploy site → upload artifacts
 │   • GIT READ-ONLY — no version bump, no commit-back
 ▼
 published to npmjs.com and deployed to Cloudflare Pages
```

The marker is a release-run identifier, not a package version. Packages version
independently, so release automation must not derive a global tag from whichever
package happens to sort first. Explicit dispatch also avoids relying on a tag
push made with `GITHUB_TOKEN` to start another workflow.

The point of the split: **all the file churn** (changed `package.json` and
`CHANGELOG.md` files, the regenerated registry, and the lockfile) lands in **one
PR you approve** — not in a surprise commit pushed by the publish job.

---

## Cutting a full release

1. **Land changesets as you merge features.** Each user-facing change should
   include a changeset (`pnpm changeset`) describing the bump. These accumulate
   in `.changeset/`.

2. **Run the Version PR workflow.** Actions → **Version PR** → _Run workflow_
   (base defaults to `main`). It applies the changesets, regenerates the
   registry, and opens a PR titled `chore(release): version packages <v>`.

3. **Review the Version PR.** It shows exactly what will publish: version bumps,
   changelog entries, and the regenerated registry. CI runs against it like any
   other PR.

4. **Merge it.** The post-merge workflow verifies which public package versions
   changed, creates `release-pr-<PR>-<SHA12>` at the merge commit, and explicitly
   dispatches `release.yml` for `target=all` with that full expected SHA.
   `release.yml` verifies the immutable ref, requires at least one unpublished
   npm version, publishes packages, then deploys the website.

That's the whole loop: **CI green → merge → packages and website released.** No
manual tag, local publishing, or global package-version guess is involved.

### Coordinated full-catalog bump

The normal loop bumps only the packages named in the accumulated changesets.
Changesets' `linked` group (`runtime`, `dialog`, `select`, `calendar`,
`carousel`) moves those five together, but the rest move independently. To move
the **entire published catalog in lockstep** to a single new version — the way
`0.3.0` and `0.4.0` were cut — you author **one changeset that names every
publishable package** at the same bump level.

1. **Enumerate the publishable packages.** These are the non-`private`
   `packages/*` minus the `ignore` list in `.changeset/config.json`
   (`bench`, `eslint-plugin-solidiom`, `adapter-kit`, `release-tools`,
   `test-doubles`). A reliable way to derive the set is the packages tagged at
   the previous release plus any added since:

   ```bash
   # packages published at the last release
   git tag --list '@solidiom/*@0.3.0' | sed -E 's/@0\.3\.0$//' | sort
   ```

2. **Author a single coordinated changeset** in `.changeset/` (e.g.
   `beta-release-0-4-0.md`) whose frontmatter lists every package at the same
   level, followed by a summary of the release:

   ```md
   ---
   "@solidiom/accordion": minor
   "@solidiom/adapter-carousel-embla": minor
   # …one line per publishable package, all at the same bump level…
   "@solidiom/vite-plugin": minor
   ---

   Beta release 0.4.0. Coordinated workspace-wide minor bump.

   - Summarize the notable changes here (Solid window, adapters, CLI, tooling…).
   ```

   Fold any pre-existing per-package changesets into this summary and delete
   them, so the generated `CHANGELOG.md` entries are not duplicated.

3. **Run the Version PR workflow as usual** (or the local steps below). Every
   listed package moves to the new version together; the ignored packages are
   untouched.

> Note on `0.x`: a `minor` bump on a `0.x` package advances the middle digit
> (`0.3.0 → 0.4.0`), which is the `0.x` "breaking" boundary the CLI's caret
> ranges stop at. Use `patch` for a coordinated `0.3.0 → 0.3.1` sweep.

### Dist-tags

The post-merge workflow derives one npm channel from the versions changed by the
Version PR: if any changed version is a prerelease, the release uses `beta`;
otherwise it uses `latest`. The immutable release marker itself does not encode a
package version.

To publish a prerelease, produce prerelease versions in the Version PR (for
example with `changeset pre enter beta`). Manual dispatches choose `dist_tag`
explicitly.

---

## Releasing a single package

Because the CLI installs **caret ranges** resolved from the registry (see
[Version decoupling](#version-decoupling-rel-c1) below), you can ship a fix to
one package without cutting a whole release — consumers pick up in-range
publishes automatically.

Actions → **Release (Single Package)** → _Run workflow_:

| Input          | Meaning                                                                    |
| -------------- | -------------------------------------------------------------------------- |
| `package`      | e.g. `@solidiom/button`                                                    |
| `bump`         | `none` (publish committed version) or `patch`/`minor`/`major`/`prerelease` |
| `dist_tag`     | `beta` or `latest`                                                         |
| `dry_run`      | build + typecheck + test without publishing                                |
| `allow_linked` | override the linked-group guard (advanced — see below)                     |

This wraps `scripts/release-package.mjs`, which builds, typechecks, tests, then
publishes the one package. When `bump` is set, it commits the single changed
`package.json` back.

### The linked-group limit

`runtime`, `dialog`, `select`, `calendar`, and `carousel` form a Changesets
**linked group** (see `.changeset/config.json`) — their versions move together.
Publishing one member in isolation desyncs the group, so `release-package.mjs`
**refuses** them unless you pass `allow_linked`. Release those through the full
flow instead. Single-package releases are intended for the ~100 unlinked
packages, which is the bulk of the catalog.

---

## Version decoupling (REL-C1)

The registry (`registry/index.json`) stores an **exact** version per entry,
copied from each package's `package.json`. The CLI, however, does **not** pin
that exact version at install time. `toInstallSpecifier()` in
`packages/cli/src/commands/plan.ts` widens it to a caret range:

- `0.3.0` → `^0.3.0` (0.x caret still stops at the `0.4.0` breaking boundary)
- pre-releases (`0.0.1-next.0`), dist-tags (`latest`), and already-ranged
  specifiers pass through unchanged

So `solidiom add button` installs `@solidiom/button@^0.3.0`. A later `0.3.1`
publish of `button` is picked up by consumers **without regenerating the
registry** — which is what makes single-package releases safe between full
releases. Registry version strings are not part of any integrity hash, so
changing them (or not) never affects `solidiom verify --registry`.

---

## Full release outside CI

When GitHub Actions is unavailable — or you need to cut a release from a
developer machine or a self-hosted box — `scripts/release.sh` reproduces the
`release.yml` jobs locally. The step order and commands mirror the workflow
exactly: gate → publish packages → deploy site.

**Important:** like the CI publish job, `release.sh` is **not** a versioning
step. It publishes exactly the versions committed in the current tree via
`changeset publish`. Do the versioning first (the coordinated bump above, then
`pnpm changeset version`, `pnpm exec tsx tools/registry-build.ts`, and a
`chore(release): version packages <v>` commit) so the working tree holds the
versions you intend to publish.

### 1. Prepare secrets

`release.sh` reads secrets from the shell environment first, then from the
project `.env`. Values are never printed.

| Variable                                         | Needed for                                                            |
| ------------------------------------------------ | --------------------------------------------------------------------- |
| `NPM_TOKEN`                                      | publishing packages (exported as `NODE_AUTH_TOKEN`)                   |
| `REGISTRY_SIGN_KEY`                              | signing `registry/index.json` (optional; unsigned + warned if absent) |
| `CLOUDFLARE_API_TOKEN` / `CLOUDFLARE_ACCOUNT_ID` | deploying the site                                                    |

Without `REGISTRY_SIGN_KEY` the registry index is built **unsigned** and the
beta signing verification is downgraded to a warning instead of a hard failure.

### 2. Dry run first

`changeset publish` has no dry-run mode, so `--dry-run` runs the full pipeline
(build, gate, registry build, verify, artifacts) and skips **only** the publish
and the site deploy. Use it to confirm the tree is releasable:

```bash
./scripts/release.sh --dry-run
```

### 3. Publish

```bash
# packages + site, quick gate, beta dist-tag (defaults)
./scripts/release.sh

# packages only, full gate, published under `latest`
./scripts/release.sh --target packages --gate full --dist-tag latest

# deploy the site only
./scripts/release.sh --target site
```

| Flag                           | Default | Meaning                                        |
| ------------------------------ | ------- | ---------------------------------------------- |
| `--target packages\|site\|all` | `all`   | what to release                                |
| `--gate quick\|full`           | `quick` | gate level before publishing                   |
| `--dist-tag beta\|latest`      | `beta`  | npm dist-tag to publish under                  |
| `--dry-run`                    | off     | build/gate/verify without publishing/deploying |

What the script runs, in order (mirroring `release.yml`):

1. **Gate** — `nx run-many -t build` (excluding the site) then
   `gate:quick` or `gate:full`.
2. **Publish packages** — rebuild → `tools/registry-build.ts` (re-signs when
   `REGISTRY_SIGN_KEY` is set) → `cli verify --registry` →
   `changeset publish --tag <dist-tag>` → beta audit artifacts + signing verify.
3. **Deploy site** — build packages + templates → validate boundaries/route
   parity → build site + search index → `wrangler pages deploy`.

### 4. Record an optional local release marker

A local publish does not run the Version PR post-merge automation. If you need a
traceability marker, use the same collision-safe shape and point it at the exact
published commit. Pushing this marker does **not** dispatch `release.yml`; only
the trusted post-merge workflow performs that explicit dispatch.

```bash
SHA="$(git rev-parse HEAD)"
git tag "release-local-${SHA:0:12}" "$SHA"
git push origin "release-local-${SHA:0:12}"
```

> The preflight checks abort early if no committed package version is
> unpublished, if a required secret is missing, or if Cloudflare rejects the
> configured account/token. A second no-op check around `changeset publish`
> protects against a candidate being published concurrently.

### Legacy: dispatch CI from the CLI

`./scripts/release.sh --dispatch` triggers `release.yml` in GitHub Actions via
`gh` instead of running locally. This is the pre-local-execution behavior and
still requires an authenticated `gh` and a valid ref.

---

## Manual escape hatches

- **Publish packages from a ref without tagging:** Actions → **Release** →
  _Run workflow_, `target=packages`. Respects `gate` and `dist_tag` inputs.
- **Deploy the site only:** Actions → **Release**, `target=site`.
- **Release from a developer machine:** `scripts/release.sh` runs the full
  pipeline locally — see [Full release outside CI](#full-release-outside-ci).

---

## Troubleshooting

**“No unpublished package versions were found”** — the selected ref contains
only versions that already exist on npm. Run and merge the Version PR first. Do
not create a package-looking Git tag; tags never change package manifests.

**Exact-SHA verification failed** — the automated release marker did not resolve
to the Version PR merge SHA passed by the post-merge workflow. Do not move or
reuse release markers. Rerun the post-merge workflow after investigating the ref.

**Version PR CI fails on “stale generated artifacts”** — the registry or
`source/` trees drifted. `version.yml` regenerates them, but if you edited the
branch by hand, run `pnpm nx run-many -t build --exclude=@solidiom/site`,
`pnpm exec tsx tools/registry-build.ts`, and `pnpm run source:emit`, then commit.

**Post-merge release did not dispatch** —
`tag-on-version-merge.yml` only accepts merged PRs whose head branch starts with
`release/version-`. Inspect that workflow first. It is responsible for both the
immutable marker and the explicit `release.yml` dispatch; manually pushing a tag
is not an equivalent trigger.

**A single-package release was refused** — the package is in the linked group.
Use the full release flow, or pass `allow_linked` if you understand the desync
tradeoff.

---

## Required secrets

| Secret                                           | Used by                              |
| ------------------------------------------------ | ------------------------------------ |
| `NPM_TOKEN`                                      | `release.yml`, `release-package.yml` |
| `REGISTRY_SIGN_KEY`                              | `release.yml`, `version.yml`         |
| `CLOUDFLARE_API_TOKEN` / `CLOUDFLARE_ACCOUNT_ID` | `release.yml` site deploy            |
