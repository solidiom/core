import { test, expect, type Page } from "@playwright/test"
import { verifyEntry } from "../lib/verify"
import { writeReport } from "../lib/report"

const ENTRY = {
  id: "tooltip",
  shadcn: {
    ref: "tooltip",
  },
  solidiom: {
    package: "@solidiom/tooltip",
    siteSlug: "tooltip",
    sitePath: "/components/tooltip/examples",
  },
  status: "mapped",
  parts: ["Trigger", "Content"],
  selectors: {
    Trigger: {
      ref: "button[data-state]",
      sol: '.tooltip-example [data-scope="tooltip"][data-part="trigger"]',
    },
    Content: {
      ref: "[role='tooltip'][data-state]",
      sol: '[data-scope="tooltip"][data-part="content"]',
    },
  },
  tokens: {
    Content: {
      "background-color": "rgb(37, 99, 235)",
      "border-radius": "6px",
      height: "28px",
    },
  },
  interactions: ["hover"],
  states: ["default", "hover"],
  themes: ["light", "dark"],
  tolerance: {
    pixelMaxDiff: 2,
    pixelMaxPercent: 1,
  },
  acceptedDivergences: [
    {
      signal: "tokens.Content.background-color",
      reason:
        "shadcn tooltip is bg-primary (blue in this reference config: rgb(37, 99, 235) light / rgb(59, 130, 246) dark); Solidiom tooltip is a light/dark-contrast chip (rgb(17, 24, 39) light / rgb(241, 245, 249) dark). Different primary palettes; consistent with the Batch-1 button bg divergence.",
    },
    {
      signal: "behavior.hover",
      reason:
        "Open-state parity holds (tooltip open on hover, focus=- on both frames). The canonical open map differs in VOCABULARY: Radix tooltip exposes data-state=delayed-open (not open|closed), so the reference snapshot records no open flags, while Solidiom exposes data-state=open (open.Trigger/Content:false recorded). No fix possible without changing Radix's state vocabulary; recorded.",
    },
    {
      signal: "behavior.reset",
      reason:
        "Pointer-gated overlay vocabulary: on the dark-theme baseline the Radix reference (data-state=delayed-open / hover-gated) records no canonical open flags (open map empty), while Solidiom records open=Trigger:false open=Content:false. Both frames are closed (open=false) and unfocused — the mismatch is pure state-vocabulary (delayed-open is not in the canonical open|closed set), not a behavioral divergence. Recorded.",
    },
  ],
} as import("../lib/types").MappingEntry
const REF_BASE = "http://127.0.0.1:4333"
const SOL_BASE = "http://127.0.0.1:4322"

test("tooltip - shadcn parity", async ({ browser }) => {
  const refCtx = await browser.newContext()
  const solCtx = await browser.newContext()
  const refPage: Page = await refCtx.newPage()
  const solPage: Page = await solCtx.newPage()
  await refPage.goto(REF_BASE + "/" + ENTRY.shadcn.ref, { waitUntil: "networkidle" })
  await solPage.goto(SOL_BASE + "/components/tooltip/examples/", { waitUntil: "networkidle" })
  const report = await verifyEntry(ENTRY, refPage, solPage, "../../artifacts/shadcn-parity")
  const path = await writeReport(ENTRY, report, "../../artifacts/shadcn-parity")
  // A gap fails the test; accepted/parity pass.
  expect(report.failures, "unresolved gaps in " + ENTRY.id + " (see " + path + ")").toBe(0)
  await refCtx.close()
  await solCtx.close()
})
