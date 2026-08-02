import { describe, it, expect } from "vitest"
import { resolveDestinationRoot, UnsupportedDeliverableError } from "./destinations"
import { ConfigSchema } from "../schemas"

describe("resolveDestinationRoot", () => {
  const config = ConfigSchema.parse({})

  it("resolves 'primitive' to config.sourceDir", () => {
    expect(resolveDestinationRoot("primitive", config)).toBe(config.sourceDir)
  })

  it("resolves 'component' to config.componentDir", () => {
    expect(resolveDestinationRoot("component", config)).toBe(config.componentDir)
  })

  it("resolves 'block' to config.blockDir", () => {
    expect(resolveDestinationRoot("block", config)).toBe(config.blockDir)
  })

  it("resolves 'theme' to config.themeDir", () => {
    expect(resolveDestinationRoot("theme", config)).toBe(config.themeDir)
  })

  it("throws a clear typed error for 'template'", () => {
    expect(() => resolveDestinationRoot("template", config)).toThrow(UnsupportedDeliverableError)
    expect(() => resolveDestinationRoot("template", config)).toThrow(/template/i)
  })

  it("resolves each deliverable to a DIFFERENT directory by default", () => {
    const dirs = new Set(
      (["primitive", "component", "block", "theme"] as const).map((d) =>
        resolveDestinationRoot(d, config),
      ),
    )
    expect(dirs.size).toBe(4)
  })

  it("respects custom config values", () => {
    const custom = ConfigSchema.parse({
      sourceDir: "custom/primitives",
      componentDir: "custom/components",
      blockDir: "custom/blocks",
      themeDir: "custom/themes",
    })
    expect(resolveDestinationRoot("primitive", custom)).toBe("custom/primitives")
    expect(resolveDestinationRoot("component", custom)).toBe("custom/components")
    expect(resolveDestinationRoot("block", custom)).toBe("custom/blocks")
    expect(resolveDestinationRoot("theme", custom)).toBe("custom/themes")
  })
})
