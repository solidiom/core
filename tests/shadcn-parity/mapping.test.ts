import { describe, it, expect } from "vitest"
import { readFileSync } from "node:fs"
import { join } from "node:path"
import type { MappingEntry } from "./lib/types"

const raw = readFileSync(join(import.meta.dirname, "mapping.json"), "utf8")
const mapping = JSON.parse(raw) as MappingEntry[]

const EXAMPLES = new Set([
  "accordion",
  "alert",
  "alert-dialog",
  "avatar",
  "badge",
  "breadcrumb",
  "button",
  "calendar",
  "card",
  "carousel",
  "checkbox",
  "collapsible",
  "combobox",
  "command-palette",
  "context-menu",
  "data-table",
  "date-picker",
  "dialog",
  "drawer",
  "empty-state",
  "field",
  "hover-card",
  "input",
  "input-otp",
  "kbd",
  "label",
  "listbox",
  "menu",
  "meter",
  "navigation-menu",
  "pagination",
  "popover",
  "progress",
  "radio-group",
  "resizable-panels",
  "scroll-area",
  "select",
  "sheet",
  "skeleton",
  "slider",
  "spinner",
  "switch",
  "tabs",
  "toast",
  "toggle",
  "toggle-group",
  "toolbar",
  "tooltip",
  "tree",
  "virtual-list",
])

describe("mapping.json", () => {
  it("has a unique id per entry", () => {
    const ids = mapping.map((m) => m.id)
    expect(new Set(ids).size).toBe(ids.length)
  })
  it("every 'mapped' entry has a solidiom slug that has a live examples island", () => {
    for (const m of mapping.filter((x) => x.status === "mapped")) {
      expect(
        EXAMPLES.has(m.solidiom.siteSlug),
        `${m.id} -> ${m.solidiom.siteSlug} has no live island`,
      ).toBe(true)
      expect(m.solidiom.sitePath).toBe(`/components/${m.solidiom.siteSlug}/examples`)
    }
  })
  it("every 'mapped' entry declares states, themes, tolerance (parts/tokens/interactions may be empty until Phase A)", () => {
    for (const m of mapping.filter((x) => x.status === "mapped")) {
      expect(Array.isArray(m.parts), `${m.id} parts must be an array`).toBe(true)
      expect(m.tokens, `${m.id} tokens must be present`).toBeTruthy()
      expect(Array.isArray(m.interactions), `${m.id} interactions must be an array`).toBe(true)
      expect(m.states.length).toBeGreaterThan(0)
      expect(m.themes).toEqual(expect.arrayContaining(["light", "dark"]))
      expect(m.tolerance.pixelMaxPercent).toBeGreaterThan(0)
    }
  })
  it("every entry has a status in {mapped, gap, na} and gap/na entries carry a gapReason", () => {
    for (const m of mapping) {
      expect(["mapped", "gap", "na"]).toContain(m.status)
      if (m.status === "gap" || m.status === "na") {
        expect(typeof m.gapReason, `${m.id} missing gapReason`).toBe("string")
      }
    }
  })
})
