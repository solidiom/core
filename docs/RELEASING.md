# Releasing

Solidiom uses a **two-step release model** so that a publish run never mutates
the repository. Versioning happens first, in a reviewable PR; publishing happens
second, triggered by a tag.

```
 ┌─ accumulate changesets on main
 │
 ▼
 version.yml (manual dispatch)
 │   • pnpm changeset version   (bumps package.json + CHANGELOGs)
 │   • regenerate + re-sign registry/index.json
 │   • opens a "Version PR"     (branch: release/version-<v>)
 ▼
 Version PR ──► review ──► merge
 │
 ▼
 tag-on-version-merge.yml  (auto, on PR merge)
 │   • pushes tag v<version>
 ▼
 release.yml  (on: push tag v*)
 │   • build → sign → `changeset publish` → upload artifacts
 │   • GIT READ-ONLY — no version bump, no commit-back
 ▼
 published to npmjs.com
```

The point of the split: **all the file churn** (every `packages/*/package.json`,
every `CHANGELOG.md`, the regenerated registry, the lockfile) lands in **one PR
you approve** — not in a surprise commit pushed by the publish job.

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

4. **Merge it.** On merge, `tag-on-version-merge.yml` pushes `v<version>`, which
   triggers `release.yml` to publish. Nothing else to do.

That's the whole loop: **CI green → merge → published.** No editing code, no
manual commits, no local publishing.

### Dist-tags

`release.yml` derives the npm dist-tag from the tag shape:

| Tag             | Dist-tag |
| --------------- | -------- |
| `v0.3.0`        | `latest` |
| `v0.3.0-beta.1` | `beta`   |

To publish a pre-release, produce a pre-release version in the Version PR (e.g.
via `changeset pre enter beta`).

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

## Manual escape hatches

- **Publish packages from a ref without tagging:** Actions → **Release** →
  _Run workflow_, `target=packages`. Respects `gate` and `dist_tag` inputs.
- **Deploy the site only:** Actions → **Release**, `target=site`.
- **Dispatch from the CLI:** `scripts/release.sh` still dispatches `release.yml`
  via `gh` for the manual `workflow_dispatch` path.

---

## Troubleshooting

**"Tag does not match any committed publishable package version"** —
`release.yml`'s `verify-tag` job failed. The tag was pushed before the Version
PR merged, or points at a commit without the bumped versions. Merge the Version
PR (or push a tag that matches a committed version).

**Version PR CI fails on "stale generated artifacts"** — the registry or
`source/` trees drifted. `version.yml` regenerates them, but if you edited the
branch by hand, run `pnpm nx run-many -t build --exclude=@solidiom/site`,
`pnpm exec tsx tools/registry-build.ts`, and `pnpm run source:emit`, then commit.

**Auto-tag didn't fire on merge** — `tag-on-version-merge.yml` only runs for
merged PRs whose head branch starts with `release/version-`. If you renamed the
branch, push the tag manually: `git tag v<version> && git push origin v<version>`.

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
