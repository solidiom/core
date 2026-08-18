import { describe, it, expect, vi, beforeEach } from "vitest"
import type { AstroIntegration } from "astro"

// Mock vite-plugin-solid to avoid pulling in the full Vite dependency graph
vi.mock("vite-plugin-solid", () => ({
  default: (opts: any) => [{ name: "vite:solid", ...opts }, { name: "solid-refresh" }],
}))

// Mock node:fs to control what solidSourceAlias sees
vi.mock("node:fs", async (importOriginal) => {
  const actual = (await importOriginal()) as typeof import("node:fs")
  return {
    ...actual,
    readdirSync: vi.fn(actual.readdirSync),
    readFileSync: vi.fn(actual.readFileSync),
    existsSync: vi.fn(actual.existsSync),
  }
})

describe("@solidiom/astrojs-solid-next", () => {
  let createIntegration: typeof import("./index").default
  let getContainerRenderer: typeof import("./index").getContainerRenderer

  beforeEach(async () => {
    vi.resetModules()
    const mod = await import("./index")
    createIntegration = mod.default
    getContainerRenderer = mod.getContainerRenderer
  })

  describe("default export (integration factory)", () => {
    it("returns an AstroIntegration with the correct name", () => {
      const integration = createIntegration()
      expect(integration.name).toBe("@solidiom/astrojs-solid-next")
    })

    it("has astro:config:setup hook", () => {
      const integration = createIntegration()
      expect(integration.hooks["astro:config:setup"]).toBeDefined()
      expect(typeof integration.hooks["astro:config:setup"]).toBe("function")
    })

    it("has astro:config:done hook", () => {
      const integration = createIntegration()
      expect(integration.hooks["astro:config:done"]).toBeDefined()
      expect(typeof integration.hooks["astro:config:done"]).toBe("function")
    })

    it("accepts empty options", () => {
      const integration = createIntegration({})
      expect(integration.name).toBe("@solidiom/astrojs-solid-next")
    })

    it("accepts include/exclude options", () => {
      const integration = createIntegration({
        include: ["src/**/*.tsx"],
        exclude: /node_modules/,
      })
      expect(integration.name).toBe("@solidiom/astrojs-solid-next")
    })
  })

  describe("astro:config:setup hook", () => {
    it("calls addRenderer with the correct renderer", async () => {
      const integration = createIntegration()
      const addRenderer = vi.fn()
      const updateConfig = vi.fn()

      await (integration.hooks["astro:config:setup"] as Function)({
        addRenderer,
        updateConfig,
      })

      expect(addRenderer).toHaveBeenCalledTimes(1)
      expect(addRenderer).toHaveBeenCalledWith(
        expect.objectContaining({
          name: "@solidiom/astrojs-solid-next",
          clientEntrypoint: "@solidiom/astrojs-solid-next/client.js",
          serverEntrypoint: "@solidiom/astrojs-solid-next/server.js",
        }),
      )
    })

    it("calls updateConfig with vite plugins and resolve.alias", async () => {
      const integration = createIntegration()
      const addRenderer = vi.fn()
      const updateConfig = vi.fn()

      await (integration.hooks["astro:config:setup"] as Function)({
        addRenderer,
        updateConfig,
      })

      expect(updateConfig).toHaveBeenCalledTimes(1)
      const config = updateConfig.mock.calls[0][0]
      expect(config.vite).toBeDefined()
      expect(config.vite.plugins).toBeDefined()
      expect(Array.isArray(config.vite.plugins)).toBe(true)
      expect(config.vite.plugins.length).toBeGreaterThanOrEqual(2)
      expect(config.vite.resolve).toBeDefined()
      expect(config.vite.resolve.alias).toBeDefined()
    })

    it("includes the configEnvironment plugin", async () => {
      const integration = createIntegration()
      const addRenderer = vi.fn()
      const updateConfig = vi.fn()

      await (integration.hooks["astro:config:setup"] as Function)({
        addRenderer,
        updateConfig,
      })

      const config = updateConfig.mock.calls[0][0]
      const plugins = config.vite.plugins as Array<{ name: string }>
      const envPlugin = plugins.find(
        (p) => p.name === "@solidiom/astrojs-solid-next:config-environment",
      )
      expect(envPlugin).toBeDefined()
    })

    it("forwards include/exclude to vite-plugin-solid", async () => {
      const integration = createIntegration({
        include: ["src/**/*.tsx"],
        exclude: /test/,
      })
      const addRenderer = vi.fn()
      const updateConfig = vi.fn()

      await (integration.hooks["astro:config:setup"] as Function)({
        addRenderer,
        updateConfig,
      })

      const config = updateConfig.mock.calls[0][0]
      const plugins = config.vite.plugins as Array<{ name: string; include?: any; exclude?: any }>
      const solidPlugin = plugins.find((p) => p.name === "vite:solid")
      expect(solidPlugin).toBeDefined()
      expect(solidPlugin!.include).toEqual(["src/**/*.tsx"])
      expect(solidPlugin!.exclude).toEqual(/test/)
    })
  })

  describe("astro:config:done hook", () => {
    it("warns when multiple JSX renderers are enabled without include/exclude", async () => {
      const integration = createIntegration()
      const warn = vi.fn()

      await (integration.hooks["astro:config:done"] as Function)({
        logger: { warn },
        config: {
          integrations: [{ name: "@astrojs/react" }, { name: "@solidiom/astrojs-solid-next" }],
        },
      })

      expect(warn).toHaveBeenCalledTimes(1)
      expect(warn).toHaveBeenCalledWith(expect.stringContaining("More than one JSX renderer"))
    })

    it("does not warn when only one JSX renderer is enabled", async () => {
      const integration = createIntegration()
      const warn = vi.fn()

      await (integration.hooks["astro:config:done"] as Function)({
        logger: { warn },
        config: {
          integrations: [{ name: "@solidiom/astrojs-solid-next" }],
        },
      })

      expect(warn).not.toHaveBeenCalled()
    })

    it("does not warn when include is set even with multiple renderers", async () => {
      const integration = createIntegration({ include: ["src/**/*.tsx"] })
      const warn = vi.fn()

      await (integration.hooks["astro:config:done"] as Function)({
        logger: { warn },
        config: {
          integrations: [{ name: "@astrojs/react" }, { name: "@solidiom/astrojs-solid-next" }],
        },
      })

      expect(warn).not.toHaveBeenCalled()
    })

    it("does not warn when exclude is set even with multiple renderers", async () => {
      const integration = createIntegration({ exclude: /react/ })
      const warn = vi.fn()

      await (integration.hooks["astro:config:done"] as Function)({
        logger: { warn },
        config: {
          integrations: [{ name: "@astrojs/preact" }, { name: "@solidiom/astrojs-solid-next" }],
        },
      })

      expect(warn).not.toHaveBeenCalled()
    })
  })

  describe("getContainerRenderer", () => {
    it("returns an AstroRenderer with correct entry points", () => {
      const renderer = getContainerRenderer()
      expect(renderer.name).toBe("@solidiom/astrojs-solid-next")
      expect(renderer.clientEntrypoint).toBe("@solidiom/astrojs-solid-next/client.js")
      expect(renderer.serverEntrypoint).toBe("@solidiom/astrojs-solid-next/server.js")
    })
  })
})
