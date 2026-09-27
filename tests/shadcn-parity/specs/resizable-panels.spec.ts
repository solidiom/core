import { test, expect, type Page } from "@playwright/test"
import { verifyEntry } from "../lib/verify"
import { writeReport } from "../lib/report"

const ENTRY = {
  id: "resizable-panels",
  shadcn: {
    ref: "resizable-panels",
  },
  solidiom: {
    package: "@solidiom/resizable-panels",
    siteSlug: "resizable-panels",
    sitePath: "/components/resizable-panels/examples",
  },
  status: "mapped",
  parts: ["Group", "Panel", "Handle"],
  selectors: {
    Group: {
      ref: "[data-panel-group]",
      sol: ".resizable-panels-example [data-scope='resizable-panels'][data-part='group']",
    },
    Panel: {
      ref: "[data-panel-id]",
      sol: ".resizable-panels-example [data-scope='resizable-panels'][data-part='panel']",
    },
    Handle: {
      ref: "[data-resize-handle]",
      sol: ".resizable-panels-example [data-scope='resizable-panels'][data-part='handle']",
    },
  },
  tokens: {
    Handle: {
      "background-color": "rgb(226, 232, 240)",
      width: "1px",
    },
    Group: {
      "border-width": "1px",
      "border-radius": "8px",
    },
  },
  interactions: [],
  states: ["default"],
  themes: ["light", "dark"],
  tolerance: {
    pixelMaxDiff: 2,
    pixelMaxPercent: 1,
  },
  acceptedDivergences: [
    {
      signal: "tokens.Group.border-radius",
      reason:
        "shadcn resizable group is rounded-lg (8px); Solidiom group is 8px — at parity; the reference outer border wrapper (rounded-lg border) vs the island's own 8px group differ only by island chrome. Recorded (structural).",
    },
    {
      signal: "tokens.Handle.background-color",
      reason:
        "shadcn resize handle is bg-border (rgb(226, 232, 240), a 1px divider); Solidiom handle uses its own border palette (rgb(203, 213, 225)). Deliberate border palette difference.",
    },
    {
      signal: "pixels.light.default",
      reason:
        "Pixel crops include differing island chrome + panel text content; the handle geometry (1px divider) is at parity.",
    },
    {
      signal: "pixels.dark.default",
      reason: "Dark-theme pixel delta from island chrome + panel labels; handle at parity.",
    },
  ],
} as import("../lib/types").MappingEntry
const REF_BASE = "http://127.0.0.1:4333"
const SOL_BASE = "http://127.0.0.1:4322"

test("resizable-panels - shadcn parity", async ({ browser }) => {
  const refCtx = await browser.newContext()
  const solCtx = await browser.newContext()
  const refPage: Page = await refCtx.newPage()
  const solPage: Page = await solCtx.newPage()
  await refPage.goto(REF_BASE + "/" + ENTRY.shadcn.ref, { waitUntil: "networkidle" })
  await solPage.goto(SOL_BASE + "/components/resizable-panels/examples/", {
    waitUntil: "networkidle",
  })
  const report = await verifyEntry(ENTRY, refPage, solPage, "../../artifacts/shadcn-parity")
  const path = await writeReport(ENTRY, report, "../../artifacts/shadcn-parity")
  // A gap fails the test; accepted/parity pass.
  expect(report.failures, "unresolved gaps in " + ENTRY.id + " (see " + path + ")").toBe(0)
  await refCtx.close()
  await solCtx.close()
})
