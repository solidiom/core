import { readFileSync } from "node:fs"
import { join } from "node:path"
import { describe, expect, it } from "vitest"

const root = join(import.meta.dirname, "..")
const read = (path: string) => readFileSync(join(root, path), "utf8")

describe("release workflow policy", () => {
  it("runs credential and exact-SHA preflight before qualification", () => {
    const workflow = read(".github/workflows/release.yml")
    const preflight = workflow.indexOf("\n  preflight:")
    const gate = workflow.indexOf("\n  gate:")

    expect(preflight).toBeGreaterThan(0)
    expect(gate).toBeGreaterThan(preflight)
    expect(workflow).toContain("runs-on: ubuntu-latest")
    expect(workflow).toContain(
      "--packages=false\n          --site=false\n          --verify-ci=true",
    )
    expect(workflow).toMatch(/gate:\n\s+needs: \[plan, verify-tag, qualification, preflight\]/)
    expect(workflow).toContain("needs.qualification.result == 'success'")
    expect(workflow).toContain("needs.preflight.result == 'success'")
  })

  it("does not authorize a combined site deployment from a skipped publish", () => {
    const workflow = read(".github/workflows/release.yml")
    const deploy = workflow.slice(workflow.indexOf("\n  deploy-site:"))

    expect(deploy).toContain("needs: [plan, preflight, gate, publish-packages]")
    expect(deploy).toContain("needs.gate.result == 'success'")
    expect(deploy).toContain("needs.publish-packages.result == 'success'")
    expect(deploy).not.toContain("needs.publish-packages.result == 'skipped'")
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
