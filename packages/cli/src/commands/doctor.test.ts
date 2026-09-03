import { describe, it, expect, beforeEach, afterEach } from "vitest"
import { mkdirSync, writeFileSync, rmSync } from "node:fs"
import { join } from "node:path"
import { createTempDir } from "../test-utils/temp-dir"
import { runDoctor } from "./doctor"

describe("runDoctor", () => {
  let cwd: string

  beforeEach(() => {
    cwd = createTempDir("solidiom-doctor")
  })

  afterEach(() => {
    rmSync(cwd, { recursive: true, force: true })
  })

  it("no config.json produces warning", () => {
    const result = runDoctor(cwd)
    const check = result.checks.find((c) => c.name === "config.json exists")
    expect(check).toMatchObject({
      status: "warn",
      detail: expect.stringContaining("solidiom init"),
    })
  })

  it("valid config.json produces pass", () => {
    mkdirSync(join(cwd, ".solidiom"), { recursive: true })
    writeFileSync(join(cwd, ".solidiom", "config.json"), JSON.stringify({ defaultMode: "package" }))
    const result = runDoctor(cwd)
    const check = result.checks.find((c) => c.name === "config.json valid")
    expect(check).toMatchObject({ status: "pass" })
  })

  it("invalid config.json produces fail", () => {
    mkdirSync(join(cwd, ".solidiom"), { recursive: true })
    writeFileSync(join(cwd, ".solidiom", "config.json"), JSON.stringify({ defaultMode: "invalid" }))
    const result = runDoctor(cwd)
    const check = result.checks.find((c) => c.name === "config.json valid")
    expect(check).toMatchObject({ status: "fail" })
  })

  it("missing policy.json passes (optional)", () => {
    mkdirSync(join(cwd, ".solidiom"), { recursive: true })
    const result = runDoctor(cwd)
    const check = result.checks.find((c) => c.name === "policy.json exists")
    expect(check).toMatchObject({ status: "pass" })
  })

  it("valid policy.json passes", () => {
    mkdirSync(join(cwd, ".solidiom"), { recursive: true })
    writeFileSync(join(cwd, ".solidiom", "policy.json"), JSON.stringify({ signatureMode: "none" }))
    const result = runDoctor(cwd)
    const check = result.checks.find((c) => c.name === "policy.json valid")
    expect(check).toMatchObject({ status: "pass" })
  })

  it("missing solid-js in package.json fails", () => {
    writeFileSync(join(cwd, "package.json"), JSON.stringify({ dependencies: { react: "^18" } }))
    const result = runDoctor(cwd)
    const check = result.checks.find((c) => c.name === "solid-js dependency")
    expect(check).toMatchObject({ status: "fail" })
  })

  it("present solid-js in package.json passes", () => {
    writeFileSync(
      join(cwd, "package.json"),
      JSON.stringify({ dependencies: { "solid-js": "^1.8" } }),
    )
    const result = runDoctor(cwd)
    const check = result.checks.find((c) => c.name === "solid-js dependency")
    expect(check).toMatchObject({ status: "pass", detail: "^1.8" })
  })

  it("valid lock.json with version 1 passes", () => {
    mkdirSync(join(cwd, ".solidiom"), { recursive: true })
    writeFileSync(
      join(cwd, ".solidiom", "lock.json"),
      JSON.stringify({ version: 1, installed: {} }),
    )
    const result = runDoctor(cwd)
    const check = result.checks.find((c) => c.name === "lock.json valid")
    expect(check).toMatchObject({ status: "pass" })
  })

  it("lock.json with unverified entries produces warning", () => {
    mkdirSync(join(cwd, ".solidiom"), { recursive: true })
    writeFileSync(
      join(cwd, ".solidiom", "lock.json"),
      JSON.stringify({
        version: 1,
        installed: {
          "src/ui/primitives/dialog.tsx": {
            path: "src/ui/primitives/dialog.tsx",
            digest: "abc",
            primitive: "dialog",
            version: "1.0.0",
            manifestFilesHash: "h1",
            verifiedAt: "2024-01-01T00:00:00Z",
            provenance: "unverified",
          },
        },
      }),
    )
    const result = runDoctor(cwd)
    const check = result.checks.find((c) => c.name === "source-install provenance")
    expect(check).toMatchObject({ status: "warn" })
  })

  it("healthy when all checks pass, unhealthy when any fails", () => {
    mkdirSync(join(cwd, ".solidiom"), { recursive: true })
    writeFileSync(join(cwd, ".solidiom", "config.json"), JSON.stringify({ defaultMode: "package" }))
    writeFileSync(
      join(cwd, "package.json"),
      JSON.stringify({ dependencies: { "solid-js": "^1.8" } }),
    )
    writeFileSync(
      join(cwd, ".solidiom", "lock.json"),
      JSON.stringify({ version: 1, installed: {} }),
    )
    const result = runDoctor(cwd)
    expect(result.healthy).toBe(true)
  })
})
