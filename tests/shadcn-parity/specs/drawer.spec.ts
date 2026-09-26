import { test, expect, type Page } from "@playwright/test"
import { verifyEntry } from "../lib/verify"
import { writeReport } from "../lib/report"

const ENTRY = {
  id: "drawer",
  shadcn: {
    ref: "drawer",
  },
  solidiom: {
    package: "@solidiom/drawer",
    siteSlug: "drawer",
    sitePath: "/components/drawer/examples",
  },
  status: "mapped",
  parts: ["Trigger", "Content", "Backdrop"],
  selectors: {
    Trigger: {
      ref: "button[data-state]",
      sol: '.drawer-example [data-scope="drawer"][data-part="trigger"]',
    },
    Content: {
      ref: "[role='dialog'][data-state]",
      sol: '[data-scope="drawer"][data-part="content"]',
    },
    Backdrop: {
      ref: "div.fixed.inset-0[data-state]",
      sol: '[data-scope="drawer"][data-part="backdrop"]',
    },
  },
  tokens: {
    Content: {
      "background-color": "rgb(255, 255, 255)",
      "border-radius": "10px 10px 0px 0px",
      width: "900px",
      height: "158px",
    },
    Backdrop: {
      "background-color": "rgba(0, 0, 0, 0.8)",
    },
  },
  interactions: ["open", "close-esc", "close-overlay-click"],
  states: ["default", "open", "close-esc"],
  themes: ["light", "dark"],
  tolerance: {
    pixelMaxDiff: 2,
    pixelMaxPercent: 1,
  },
  acceptedDivergences: [
    {
      signal: "tokens.Content.border-radius",
      reason:
        "shadcn (vaul) drawer content is rounded-t-[10px] (a bottom sheet); Solidiom drawer is a right-side panel (border-radius 0). Structural: the two islands use different drawer sides (shadcn vaul default = bottom; Solidiom recipe = right). Size tokens (width 900 vs 288, height 158 vs 720) follow from that; recorded as structural, not a look fix.",
    },
    {
      signal: "tokens.Content.background-color",
      reason:
        "shadcn drawer content is bg-background (white light / near-black dark); Solidiom drawer content is a filled-light surface (rgb(248, 250, 252) / rgb(15, 23, 42)). Consistent with the filled-light palette decision.",
    },
    {
      signal: "tokens.Backdrop.background-color",
      reason:
        "shadcn drawer overlay is bg-black/80; Solidiom drawer backdrop is 0x0 / transparent (the right-side drawer in this island does not dim the page). Recorded as structural.",
    },
    {
      signal: "behavior.close-esc",
      reason:
        "Open-state focus: shadcn vaul keeps focus on the Trigger (vaul does not move focus into the sheet on open); Solidiom drawer moves focus to its Close button. Both frames return focus to the Trigger on Esc. The mismatch is vaul vs Radix focus models; recorded.",
    },
  ],
} as import("../lib/types").MappingEntry
const REF_BASE = "http://127.0.0.1:4333"
const SOL_BASE = "http://127.0.0.1:4322"

test("drawer - shadcn parity", async ({ browser }) => {
  const refCtx = await browser.newContext()
  const solCtx = await browser.newContext()
  const refPage: Page = await refCtx.newPage()
  const solPage: Page = await solCtx.newPage()
  await refPage.goto(REF_BASE + "/" + ENTRY.shadcn.ref, { waitUntil: "networkidle" })
  await solPage.goto(SOL_BASE + "/components/drawer/examples/", { waitUntil: "networkidle" })
  const report = await verifyEntry(ENTRY, refPage, solPage, "../../artifacts/shadcn-parity")
  const path = await writeReport(ENTRY, report, "../../artifacts/shadcn-parity")
  // A gap fails the test; accepted/parity pass.
  expect(report.failures, "unresolved gaps in " + ENTRY.id + " (see " + path + ")").toBe(0)
  await refCtx.close()
  await solCtx.close()
})
