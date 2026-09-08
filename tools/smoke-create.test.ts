import { describe, it, expect, afterEach } from "vitest"
import { mkdtempSync, mkdirSync, writeFileSync, rmSync, existsSync, readdirSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { isolationFor, parseCatalog, runCombination } from "./smoke-create"

describe("smoke-create catalog parsing", () => {
  it("preserves quoted semver ranges containing spaces", () => {
    expect(
      parseCatalog(`
packages:
  - "packages/*"

catalog:
  solid-js: ">=2.0.0-rc.6 <3.0.0"
  "@solidjs/web": '>=2.0.0-rc.6 <3.0.0'
  babel-preset-solid: ^2.0.0-rc.2 # unquoted values and comments remain supported

overrides:
  solid-js: "2.0.0-rc.6"
`),
    ).toEqual({
      "solid-js": ">=2.0.0-rc.6 <3.0.0",
      "@solidjs/web": ">=2.0.0-rc.6 <3.0.0",
      "babel-preset-solid": "^2.0.0-rc.2",
    })
  })
})

describe("smoke-create pnpm isolation", () => {
  it("replaces inherited pnpm, npm, and XDG state with combination-private paths", () => {
    const cacheDir = join(tmpdir(), "solidiom-pnpm-isolation-test")
    const isolation = isolationFor("pnpm", "http://127.0.0.1:54321", cacheDir, {
      PATH: "/host/bin",
      HOME: "/host/home",
      NPM_TOKEN: "test-token",
      npm_config_registry: "https://registry.npmjs.org/",
      npm_config_cache_dir: "/host/pnpm/metadata",
      NPM_CONFIG_STORE_DIR: "/host/pnpm/store",
      npm_config_state_dir: "/host/pnpm/state",
      PNPM_HOME: "/host/pnpm/home",
      PNPM_STORE_PATH: "/host/pnpm/other-store",
      XDG_CACHE_HOME: "/host/xdg/cache",
      XDG_CONFIG_HOME: "/host/xdg/config",
      XDG_DATA_HOME: "/host/xdg/data",
      XDG_STATE_HOME: "/host/xdg/state",
    })

    expect(isolation.env.PATH).toBe("/host/bin")
    // HOME remains available so mise/corepack shims can resolve their own
    // installations; every pnpm state location beneath it is overridden.
    expect(isolation.env.HOME).toBe("/host/home")
    expect(isolation.env.MISE_DATA_DIR).toBe("/host/xdg/data/mise")
    expect(isolation.env.MISE_CONFIG_DIR).toBe("/host/xdg/config/mise")
    expect(isolation.env.MISE_STATE_DIR).toBe("/host/xdg/state/mise")
    expect(isolation.env.NPM_TOKEN).toBe("test-token")
    expect(isolation.env.PNPM_STORE_PATH).toBeUndefined()

    const expected = {
      "store-dir": join(cacheDir, "store"),
      "cache-dir": join(cacheDir, "metadata"),
      "state-dir": join(cacheDir, "state"),
    }
    expect(isolation.expectedPnpmConfig).toEqual(expected)
    expect(isolation.env.npm_config_store_dir).toBe(expected["store-dir"])
    expect(isolation.env.NPM_CONFIG_STORE_DIR).toBe(expected["store-dir"])
    expect(isolation.env.npm_config_cache_dir).toBe(expected["cache-dir"])
    expect(isolation.env.NPM_CONFIG_CACHE_DIR).toBe(expected["cache-dir"])
    expect(isolation.env.npm_config_state_dir).toBe(expected["state-dir"])
    expect(isolation.env.NPM_CONFIG_STATE_DIR).toBe(expected["state-dir"])
    expect(isolation.env.XDG_CACHE_HOME).toBe(join(cacheDir, "xdg-cache"))
    expect(isolation.env.XDG_CONFIG_HOME).toBe(join(cacheDir, "xdg-config"))
    expect(isolation.env.XDG_STATE_HOME).toBe(join(cacheDir, "xdg-state"))
    // Tool/version caches are preserved so pnpm itself remains available
    // offline; package metadata and install state are still private.
    expect(isolation.env.XDG_DATA_HOME).toBe("/host/xdg/data")
    expect(isolation.env.PNPM_HOME).toBe("/host/pnpm/home")

    for (const path of isolation.directories) {
      expect(path.startsWith(`${cacheDir}/`) || path === cacheDir).toBe(true)
    }
    expect(isolation.files[".npmrc"]).toContain(`store-dir=${expected["store-dir"]}`)
    expect(isolation.files[".npmrc"]).toContain(`cache-dir=${expected["cache-dir"]}`)
    expect(isolation.files[".npmrc"]).toContain(`state-dir=${expected["state-dir"]}`)
  })
})

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
