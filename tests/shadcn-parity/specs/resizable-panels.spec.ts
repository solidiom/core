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
    },
    Group: {
      "border-width": "0px",
      "border-radius": "6px",
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
      signal: "tokens.Handle.background-color",
      reason:
        "shadcn resize handle is bg-border (rgb(226, 232, 240)); Solidiom handle uses its own border palette (rgb(203, 213, 225)). Deliberate border palette difference.",
    },
    {
      signal: "tokens.Handle.width",
      reason:
        "STRUCTURAL: the shadcn (react-resizable-panels v2) resize handle renders a 1px divider (w-px) + a centered grip affordance; the Solidiom resizable handle is the panel separator whose measured node is the grip element (0px intrinsic width, sized by the primitive's flex layout). The divider role is present on both; the measured-node width model differs. Not a fixable look gap without changing the primitive's handle structure.",
    },
    {
      signal: "pixels",
      reason:
        "Pixel crops include differing island chrome (the sol island wraps the panels in a bordered surface-raised card) + panel labels (shadcn Panel 1/2 vs Solidiom its copy). The group (borderless, 6px radius, overflow-hidden) + handle (1px divider, border palette) geometry is at parity on the token rows; the delta is framing + copy + the structural handle-node width, not a component look gap.",
    },
    {
      signal: "tokens.Group.border-radius",
      reason:
        "STRUCTURAL: the shadcn resizable group element itself is borderless (border-radius 0px — its rounded-lg frame comes from the page's separate wrapper div); the Solidiom island's group carries the rounded overflow-hidden frame (6px, from the radius token). Both present a rounded, borderless-panel split visually; the radius sits on a different DOM node. Not a fixable look gap without moving the frame to a wrapper.",
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
