/**
 * Behavioral coverage for unused-capability detection (v2.0).
 * Verifies cross-module analysis of port/adapter usage.
 */
import { describe, expect, it } from "vitest"
import { solidiomPlugin } from "./index"

describe("unused-capability detection", () => {
  it("warns when an adapter is imported but its port is never referenced", () => {
    const plugin = solidiomPlugin({ unusedCapabilityDetection: true, strict: false })
    const warnings: string[] = []
    const originalWarn = console.warn
    console.warn = (msg: string) => warnings.push(msg)

    try {
      // Simulate processing a file that imports an adapter but no port
      const transformFn = plugin.transform as (
        code: string,
        id: string,
      ) => { code: string } | null
      transformFn(
        `import { createPositioning } from "@solidiom/adapter-positioning-floating-ui"`,
        "app.tsx",
      )

      // Trigger buildEnd
      const buildEnd = plugin.buildEnd as () => void
      buildEnd()
    } finally {
      console.warn = originalWarn
    }

    expect(warnings.some((w) => w.includes("adapter") || w.includes("capability"))).toBe(true)
  })

  it("does not warn when adapter and port are both referenced", () => {
    const plugin = solidiomPlugin({ unusedCapabilityDetection: true, strict: false })
    const warnings: string[] = []
    const originalWarn = console.warn
    console.warn = (msg: string) => warnings.push(msg)

    try {
      const transformFn = plugin.transform as (
        code: string,
        id: string,
      ) => { code: string } | null
      // File references both the port and the adapter
      transformFn(
        `import { createPositioning } from "@solidiom/adapter-positioning-floating-ui"\nconst p: PositioningPort = createPositioning()`,
        "component.tsx",
      )

      const buildEnd = plugin.buildEnd as () => void
      buildEnd()
    } finally {
      console.warn = originalWarn
    }

    // No warnings about positioning
    const positioningWarnings = warnings.filter(
      (w) => w.includes("positioning") || w.includes("Positioning"),
    )
    expect(positioningWarnings).toHaveLength(0)
  })

  it("throws in strict mode when unused capabilities are detected", () => {
    const plugin = solidiomPlugin({ unusedCapabilityDetection: true, strict: true })

    const transformFn = plugin.transform as (code: string, id: string) => { code: string } | null
    transformFn(
      `import { something } from "@solidiom/adapter-positioning-floating-ui"`,
      "orphan.tsx",
    )

    const buildEnd = plugin.buildEnd as () => void
    expect(() => buildEnd()).toThrow()
  })

  it("does nothing when the option is disabled", () => {
    const plugin = solidiomPlugin({ unusedCapabilityDetection: false })

    const transformFn = plugin.transform as (code: string, id: string) => { code: string } | null
    transformFn(
      `import { something } from "@solidiom/adapter-positioning-floating-ui"`,
      "orphan.tsx",
    )

    const buildEnd = plugin.buildEnd as () => void
    // Should not throw even with an orphan adapter
    expect(() => buildEnd()).not.toThrow()
  })
})
