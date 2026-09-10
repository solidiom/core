import { readFileSync } from "node:fs"
import { join } from "node:path"
import { describe, expect, it } from "vitest"

const root = join(import.meta.dirname, "..")
const read = (path: string) => readFileSync(join(root, path), "utf8")

describe("release workflow policy", () => {
  it("runs exact-SHA, credential, candidate, and CI preflight before qualification", () => {
    const workflow = read(".github/workflows/release.yml")
    const verifyRef = workflow.indexOf("\n  verify-ref:")
    const preflight = workflow.indexOf("\n  preflight:")
    const gate = workflow.indexOf("\n  gate:")

    expect(verifyRef).toBeGreaterThan(0)
    expect(preflight).toBeGreaterThan(verifyRef)
    expect(gate).toBeGreaterThan(preflight)
    expect(workflow).toContain("runs-on: ubuntu-latest")
    expect(workflow).toContain(
      "--packages=false\n          --site=false\n          --verify-ci=true",
    )
    expect(workflow).toMatch(/gate:\n\s+needs: \[plan, verify-ref, qualification, preflight\]/)
    expect(workflow).toContain("needs.qualification.result == 'success'")
    expect(workflow).toContain("needs.preflight.result == 'success'")
    expect(workflow).toContain('if [ "$GITHUB_SHA" != "$EXPECTED_SHA" ]')
    expect(workflow).toContain("release-pr-*-$EXPECTED_SUFFIX")
  })

  it("does not authorize a combined site deployment from a skipped publish", () => {
    const workflow = read(".github/workflows/release.yml")
    const deploy = workflow.slice(workflow.indexOf("\n  deploy-site:"))

    expect(deploy).toContain("needs: [plan, preflight, gate, publish-packages]")
    expect(deploy).toContain("needs.gate.result == 'success'")
    expect(deploy).toContain("needs.publish-packages.result == 'success'")
    expect(deploy).not.toContain("needs.publish-packages.result == 'skipped'")
  })

  it("dispatches a collision-safe exact-SHA combined release after a Version PR merge", () => {
    const version = read(".github/workflows/version.yml")
    const postMerge = read(".github/workflows/tag-on-version-merge.yml")

    expect(version).toContain("branch: release/version-${{ github.run_id }}")
    expect(version).not.toContain("first publishable package")
    expect(postMerge).toContain("release-pr-${process.env.PR_NUMBER}-${shortSha}")
    expect(postMerge).toContain('if [ "$EXISTING_SHA" != "$MERGE_SHA" ]')
    expect(postMerge).toContain("actions/workflows/release.yml/dispatches")
    expect(postMerge).toContain('target: "all"')
    expect(postMerge).toContain("expected_sha: process.env.EXPECTED_SHA")
    expect(postMerge).not.toContain("git tag -a")
    const betaArtifacts = read("tools/generate-beta-artifacts.ts")
    expect(betaArtifacts).toContain('options.releaseId?.trim() || "local-unversioned"')
    expect(betaArtifacts).toContain("releaseId: process.env.SOLIDIOM_RELEASE_ID")
  })

  it("fails package publishing closed when npm has no unpublished versions", () => {
    const workflow = read(".github/workflows/release.yml")
    const localRelease = read("scripts/release.sh")
    const preflight = read("tools/release-preflight.mjs")

    expect(preflight).toContain("requireUnpublishedPackages")
    expect(workflow).toContain('grep -Fq "No unpublished projects to publish."')
    expect(workflow).toContain("changeset publish completed without publishing a package")
    expect(localRelease).toContain("run node tools/release-candidates.mjs")
    expect(localRelease).toContain("changeset publish completed without publishing a package")
  })

  it("qualifies main pushes with hermetic catalog inputs", () => {
    const workflow = read(".github/workflows/ci-packages.yml")

    expect(workflow).toMatch(/push:\n\s+branches: \[main\]/)
    expect(workflow).toContain("name: Release qualification")
    expect(workflow).toContain("run: pnpm run api:generate")
    expect(workflow.indexOf("run: pnpm run api:generate")).toBeLessThan(
      workflow.indexOf("run: pnpm run primitive:catalog-gate"),
    )
  })

  it("builds package-source parity dependencies before its clean-checkout test", () => {
    const manifest = JSON.parse(read("tests/package-source-parity/package.json")) as {
      nx?: { targets?: { test?: { dependsOn?: string[] } } }
    }

    expect(manifest.nx?.targets?.test?.dependsOn).toContain("^build")
  })

  it("purges stale Solidiom registry metadata before Verdaccio starts", () => {
    const fixture = read("tools/offline-fixture/run-offline-test.sh")
    const purgeDirectory = fixture.indexOf('rm -rf "$STORAGE_DIR/@solidiom"')
    const purgeDatabase = fixture.indexOf(
      "db.list = (db.list || []).filter(n => !n.startsWith('@solidiom/'));",
    )
    const startVerdaccio = fixture.indexOf('echo "[3/8] Starting verdaccio..."')

    expect(purgeDirectory).toBeGreaterThan(0)
    expect(purgeDatabase).toBeGreaterThan(purgeDirectory)
    expect(startVerdaccio).toBeGreaterThan(purgeDatabase)
  })

  it("isolates pnpm metadata and rotates the offline registry cache identity", () => {
    const fixture = read("tools/offline-fixture/run-offline-test.sh")
    const workflow = read(".github/workflows/ci-packages.yml")

    expect(fixture).toContain("cache-dir=$cache_dir/metadata")
    expect(fixture).toContain("state-dir=$cache_dir/state")
    expect(fixture).toContain('XDG_CACHE_HOME="$cache_dir/xdg-cache"')
    expect(fixture).toContain('XDG_STATE_HOME="$cache_dir/xdg-state"')
    expect(fixture).toContain('MISE_STATE_DIR="$mise_state_dir"')
    expect(fixture).toContain('"packageManager": "$PNPM_PACKAGE_MANAGER"')
    expect(fixture).toContain('mise where "pnpm@$PNPM_FIXTURE_VERSION"')
    expect(fixture).toContain("exec %q")
    expect(fixture).toContain('pnpm_executable="$pnpm_install_root/pnpm"')
    expect(fixture).toContain('PATH="$pnpm_fixture_path"')

    expect(workflow).toContain("offline-registry-snapshot-v2-")
    expect(workflow).toContain("tools/offline-fixture/verdaccio-prep-config.yaml")
    expect(workflow).toContain("GITHUB_RUN_ID % 10000")
    expect(workflow).toContain('--port "$registry_port"')
  })

  it("keeps Node tests browser-free and runs browser jobs in the pinned Playwright image", () => {
    const required = read(".github/workflows/ci-required.yml")
    const packages = read(".github/workflows/ci-packages.yml")
    const site = read(".github/workflows/ci-site.yml")
    const nightly = read(".github/workflows/nightly.yml")
    const release = read(".github/workflows/release.yml")
    const setup = read(".github/actions/setup/action.yml")
    const image =
      "mcr.microsoft.com/playwright:v1.63.0-noble@sha256:eff16c30e6f3f4af0a03fa4b706120d5e9b0891c344a27d64559aff5900a4a27"

    expect(required).toContain("--exclude=@solidiom/site,@solidiom/tests-recipe-parity")
    expect(packages).toContain("--exclude=@solidiom/site,@solidiom/tests-recipe-parity")
    expect(setup).not.toContain("playwright")
    expect(packages.match(new RegExp(image, "g"))).toHaveLength(3)
    expect(site.match(new RegExp(image, "g"))).toHaveLength(2)
    expect(nightly.match(new RegExp(image, "g"))).toHaveLength(3)
    expect(release.match(new RegExp(image, "g"))).toHaveLength(1)

    for (const workflow of [packages, site, nightly, release]) {
      expect(workflow).not.toMatch(/^\s+playwright:\s/m)
      // A job container cannot run on the self-hosted pool: that runner agent
      // is itself containerized, so its externals mount (/__e) is absent on the
      // container host and every JavaScript action fails to start.
      for (const [, runner] of workflow.matchAll(
        /^ {4}runs-on:\s*(.+?)\s*\n(?:^ {4}#.*\n)*^ {4}container:/gm,
      )) {
        expect(runner).toBe("ubuntu-latest")
      }
      expect(workflow).not.toMatch(/^ {4}runs-on:.*self-hosted.*\n(?:^ {4}#.*\n)*^ {4}container:/m)
    }

    expect(read("tools/ci/validate-workflows.mjs")).toContain(
      "declares a job container and must set runs-on:",
    )
  })

  it("maps display labels to canonical generated block registry slugs", () => {
    const manifest = JSON.parse(read("docs/contracts/block-catalog-manifest.json")) as {
      blocks: Array<{ id: string; registryName?: string }>
    }
    const commandPalette = manifest.blocks.find((block) => block.id === "BLOCK-SHELL-02")
    const gate = read("tools/block-catalog-gate.ts")

    expect(commandPalette?.registryName).toBe("command-palette-shell")
    expect(gate).toContain("block.registryName")
    expect(read("registry/blocks/command-palette-shell.json")).toContain(
      '"name": "command-palette-shell"',
    )
  })

  it("treats root tooling and workflow changes as global release impact", () => {
    const workflow = read(".github/workflows/ci-required.yml")
    const releaseReadiness = workflow.slice(
      workflow.indexOf("\n  release-readiness:"),
      workflow.indexOf("\n  site-quality:"),
    )
    const packageBuild = releaseReadiness.indexOf(
      "pnpm nx run-many -t build --exclude=@solidiom/site",
    )
    const quickGate = releaseReadiness.indexOf("pnpm run gate:quick")

    expect(workflow).toContain("global_impact: ${{ steps.scope.outputs.global_impact }}")
    expect(workflow).toContain("tools/*|scripts/*|registry/*")
    expect(releaseReadiness).toContain("name: Release readiness")
    expect(releaseReadiness).toContain("timeout-minutes: 30")
    expect(packageBuild).toBeGreaterThan(0)
    expect(quickGate).toBeGreaterThan(packageBuild)
    expect(releaseReadiness).toContain("pnpm run primitive:catalog-gate")
    expect(workflow).toContain("RELEASE_APPLICABLE: ${{ needs.changes.outputs.global_impact }}")
  })

  it("uses self-hosted runners only for trusted main and post-merge work", () => {
    const required = read(".github/workflows/ci-required.yml")
    const trustedMainRunner =
      "runs-on: ${{ github.event_name == 'pull_request' && 'ubuntu-latest' || 'self-hosted-dfw-flex' }}"
    const release = read(".github/workflows/release.yml")
    const qualification = release.slice(
      release.indexOf("\n  qualification:"),
      release.indexOf("\n  preflight:"),
    )
    const tag = read(".github/workflows/tag-on-version-merge.yml")

    const policy = required.slice(
      required.indexOf("\n  workflow-policy:"),
      required.indexOf("\n  secret-scan:"),
    )
    const secretScan = required.slice(
      required.indexOf("\n  secret-scan:"),
      required.indexOf("\n  required:"),
    )

    expect(required.split(trustedMainRunner)).toHaveLength(7)
    expect(policy).toContain("actions/setup-node@")
    expect(secretScan).toContain("runs-on: ubuntu-latest")
    expect(qualification).toContain("runs-on: ubuntu-latest")
    expect(tag).toContain("types: [closed]")
    expect(tag).toContain("github.event.pull_request.merged == true")
    expect(tag).toContain("ref: ${{ github.event.pull_request.merge_commit_sha }}")
    expect(tag).toContain("runs-on: self-hosted-dfw-flex")
  })
})

describe("release gate ordering", () => {
  it("generates catalog inputs and runs catalog checks before primitive completion", () => {
    const gate = read("tools/release-gate.ts")
    const apiGeneration = gate.indexOf('run("pnpm run api:generate"')
    const catalog = gate.indexOf('run("pnpm exec tsx tools/primitive-catalog-gate.ts"')
    const completion = gate.indexOf('run("pnpm exec tsx tools/primitive-completion-gate.ts"')

    expect(apiGeneration).toBeGreaterThan(0)
    expect(catalog).toBeGreaterThan(apiGeneration)
    expect(completion).toBeGreaterThan(catalog)
  })

  it("does not retry deterministic structural, CLI, catalog, or acceptance gates", () => {
    const gate = read("tools/release-gate.ts")
    expect(gate).not.toMatch(/structural-gate\.ts"[\s\S]{0,100}retries:/)
    expect(gate).not.toMatch(/@solidiom\/cli[\s\S]{0,100}retries:/)
    expect(gate).not.toMatch(/primitive-catalog-gate\.ts"[\s\S]{0,100}retries:/)
    expect(gate).not.toMatch(/acceptance-criteria\.ts"[\s\S]{0,100}retries:/)
  })
})
