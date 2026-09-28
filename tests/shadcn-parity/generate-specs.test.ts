import { describe, it, expect } from "vitest"
import { generateSpecForEntry } from "./generate-specs"
import type { MappingEntry } from "./lib/types"

const entry: MappingEntry = {
  id: "button",
  shadcn: { ref: "button" },
  solidiom: {
    package: "@solidiom/button",
    siteSlug: "button",
    sitePath: "/components/button/examples",
  },
  status: "mapped",
  parts: ["Root"],
  tokens: { Root: { borderRadius: "0.5rem" } },
  interactions: ["hover"],
  states: ["default", "hover"],
  themes: ["light", "dark"],
  tolerance: { pixelMaxDiff: 2, pixelMaxPercent: 1.0 },
  acceptedDivergences: [],
}

describe("generateSpecForEntry", () => {
  it("emits a spec that references both frames and the entry id", () => {
    const code = generateSpecForEntry(entry)
    expect(code).toContain("button")
    expect(code).toContain("REF_BASE")
    expect(code).toContain("SOL_BASE")
    expect(code).toContain("verifyEntry")
    expect(code).toContain("writeReport")
  })
  it("emits nothing for non-mapped entries", () => {
    expect(generateSpecForEntry({ ...entry, status: "gap" })).toBe("")
  })
})
