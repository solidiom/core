import { describe, it, expect, beforeEach, afterEach } from "vitest"
import { mkdtempSync, readFileSync, existsSync, rmSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { generateProjectConfig } from "./config-gen"
import { ConfigSchema } from "../schemas"

describe("generateProjectConfig", () => {
  let destination: string

  beforeEach(() => {
    destination = mkdtempSync(join(tmpdir(), "solidiom-config-gen-"))
  })

  afterEach(() => {
    rmSync(destination, { recursive: true, force: true })
  })

  it("writes a valid .solidiom/config.json matching ConfigSchema", () => {
    const result = generateProjectConfig({ destination, projectName: "my-app" })

    const configPath = join(destination, ".solidiom", "config.json")
    expect(existsSync(configPath)).toBe(true)
    expect(result.filesWritten).toContain(join(".solidiom", "config.json"))

    const raw = JSON.parse(readFileSync(configPath, "utf8"))
    const parsed = ConfigSchema.parse(raw)
    expect(parsed.defaultMode).toBe("package")
    expect(parsed.sourceDir).toBe("src/ui/primitives")
  })

  it("ends the written file with a trailing newline, matching init.ts's write pattern", () => {
    generateProjectConfig({ destination, projectName: "my-app" })
    const raw = readFileSync(join(destination, ".solidiom", "config.json"), "utf8")
    expect(raw.endsWith("\n")).toBe(true)
    expect(raw.endsWith("\n\n")).toBe(false)
  })

  it("sets stylingProfile when a styling profile is passed", () => {
    generateProjectConfig({ destination, projectName: "my-app", styling: "tailwind" })
    const raw = JSON.parse(readFileSync(join(destination, ".solidiom", "config.json"), "utf8"))
    expect(raw.stylingProfile).toBe("tailwind")
  })

  it("omits stylingProfile entirely when no styling profile is passed", () => {
    generateProjectConfig({ destination, projectName: "my-app" })
    const raw = JSON.parse(readFileSync(join(destination, ".solidiom", "config.json"), "utf8"))
    expect(raw.stylingProfile).toBeUndefined()
  })

  it("does not persist packageManager into config.json", () => {
    generateProjectConfig({ destination, projectName: "my-app", packageManager: "pnpm" })
    const raw = JSON.parse(readFileSync(join(destination, ".solidiom", "config.json"), "utf8"))
    expect(raw.packageManager).toBeUndefined()
  })
})
