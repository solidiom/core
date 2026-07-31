import { describe, it, expect, afterEach } from "vitest"
import { mkdtempSync, mkdirSync, writeFileSync, rmSync, existsSync, readdirSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { runCombination } from "./smoke-create"

/**
 * CLI-008 acceptance criterion: "A deliberately injected `yarn.lock` in a
 * template payload fails the harness."
 *
 * `materialize.test.ts`'s existing `it.each(["pnpm-lock.yaml",
 * "package-lock.json", "yarn.lock", "bun.lockb", "bun.lock"])` coverage
 * already proves `materialize()` itself refuses a foreign lockfile, and
 * `commands/create.test.ts`'s "refuses a template payload containing a
 * foreign lockfile and rolls back" test already proves `runCreate()`
 * (create.ts's own orchestration) propagates that refusal end-to-end with a
 * rollback. Neither of those, however, routes through THIS repo's actual
 * smoke harness (`tools/smoke-create.ts`'s own `runCombination`) — the
 * function CI's `cli-smoke-create` job and `pnpm run smoke:create` actually
 * invoke. This test closes that specific gap: it proves the harness itself
 * (not just the lower-level functions it calls) reports the failure
 * correctly in its own result-row contract, attributing it to the "create"
 * phase with the real foreign-lockfile error message intact.
 */
describe("smoke-create harness — foreign lockfile rejection", () => {
  let templatesDir: string
  let rootTempDir: string

  afterEach(() => {
    rmSync(templatesDir, { recursive: true, force: true })
    rmSync(rootTempDir, { recursive: true, force: true })
  })

  it("fails the harness at the create phase when a template payload contains a yarn.lock", async () => {
    templatesDir = mkdtempSync(join(tmpdir(), "solidiom-smoke-harness-templates-"))
    rootTempDir = mkdtempSync(join(tmpdir(), "solidiom-smoke-harness-root-"))

    const badTemplateDir = join(templatesDir, "has-yarn-lock")
    mkdirSync(badTemplateDir, { recursive: true })
    writeFileSync(join(badTemplateDir, "template.json"), JSON.stringify({ name: "has-yarn-lock" }))
    writeFileSync(
      join(badTemplateDir, "package.json"),
      JSON.stringify({ name: "{{projectName}}", version: "0.0.0", private: true }),
    )
    // The deliberately injected foreign lockfile.
    writeFileSync(join(badTemplateDir, "yarn.lock"), "# yarn lockfile v1\n")

    const result = await runCombination(
      "has-yarn-lock",
      "npm",
      "http://localhost:4873",
      rootTempDir,
      templatesDir,
    )

    expect(result.ok).toBe(false)
    expect(result.phaseReached).toBe("create")
    const createPhase = result.phases.find((p) => p.phase === "create")
    expect(createPhase?.status).toBe("failed")
    expect(createPhase?.error).toMatch(/foreign lockfile/)

    // The harness must not proceed to install/typecheck/build/test once
    // create() itself refused — only the "create" phase row should exist.
    expect(result.phases).toHaveLength(1)
  })

  it("does not leave the destination directory behind after a foreign-lockfile rejection", async () => {
    templatesDir = mkdtempSync(join(tmpdir(), "solidiom-smoke-harness-templates-"))
    rootTempDir = mkdtempSync(join(tmpdir(), "solidiom-smoke-harness-root-"))

    const badTemplateDir = join(templatesDir, "has-yarn-lock-2")
    mkdirSync(badTemplateDir, { recursive: true })
    writeFileSync(
      join(badTemplateDir, "template.json"),
      JSON.stringify({ name: "has-yarn-lock-2" }),
    )
    writeFileSync(
      join(badTemplateDir, "package.json"),
      JSON.stringify({ name: "{{projectName}}", version: "0.0.0", private: true }),
    )
    writeFileSync(join(badTemplateDir, "yarn.lock"), "# yarn lockfile v1\n")

    await runCombination(
      "has-yarn-lock-2",
      "npm",
      "http://localhost:4873",
      rootTempDir,
      templatesDir,
    )

    // runCombination's own try/finally always removes its workspaceDir
    // (mirroring run-offline-test.sh's bash trap-cleanup discipline in
    // TypeScript) — rootTempDir itself is the caller's responsibility (it
    // is removed in afterEach here), but nothing under it should survive.
    const remaining = existsSync(rootTempDir) ? readdirSync(rootTempDir) : []
    expect(remaining).toEqual([])
  })
})
