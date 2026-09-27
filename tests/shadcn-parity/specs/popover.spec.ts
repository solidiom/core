import { test, expect, type Page } from "@playwright/test"
import { verifyEntry } from "../lib/verify"
import { writeReport } from "../lib/report"

const ENTRY = {
  id: "popover",
  shadcn: {
    ref: "popover",
  },
  solidiom: {
    package: "@solidiom/popover",
    siteSlug: "popover",
    sitePath: "/components/popover/examples",
  },
  status: "mapped",
  parts: ["Trigger", "Content"],
  selectors: {
    Trigger: {
      ref: "button[data-state]",
      sol: '.popover-example [data-scope="popover"][data-part="trigger"]',
    },
    Content: {
      ref: "[role='dialog'][data-state]",
      sol: '[data-scope="popover"][data-part="content"]',
    },
  },
  tokens: {
    Content: {
      "background-color": "rgb(255, 255, 255)",
      "border-radius": "6px",
      "border-width": "1px",
      padding: "16px",
      width: "320px",
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
      signal: "tokens.Content.background-color",
      reason:
        "shadcn popover content is bg-popover (white light / near-black dark); Solidiom popover content is a filled-light surface (rgb(248, 250, 252) / rgb(15, 23, 42)). Consistent with the filled-light palette decision.",
    },
    {
      signal: "behavior.close-esc",
      reason:
        "Open-state focus: shadcn (Radix Popover) moves focus into the content (activeElement = [role=dialog]); Solidiom popover keeps focus on the Trigger. Radix focus-capture vs Solidiom non-capturing popover are both valid patterns; recorded so the canonical focusedPart mismatch does not read as a fix-worthy gap.",
    },
    {
      signal: "behavior.open",
      reason:
        "Radix Popover moves focus to content on open; Solidiom keeps focus on trigger — focus-model difference (documented; the drawer was aligned to vaul per user decision, the popover stays as a known model divergence).",
    },
  ],
} as import("../lib/types").MappingEntry
const REF_BASE = "http://127.0.0.1:4333"
const SOL_BASE = "http://127.0.0.1:4322"

test("popover - shadcn parity", async ({ browser }) => {
  const refCtx = await browser.newContext()
  const solCtx = await browser.newContext()
  const refPage: Page = await refCtx.newPage()
  const solPage: Page = await solCtx.newPage()
  await refPage.goto(REF_BASE + "/" + ENTRY.shadcn.ref, { waitUntil: "networkidle" })
  await solPage.goto(SOL_BASE + "/components/popover/examples/", { waitUntil: "networkidle" })
  const report = await verifyEntry(ENTRY, refPage, solPage, "../../artifacts/shadcn-parity")
  const path = await writeReport(ENTRY, report, "../../artifacts/shadcn-parity")
  // A gap fails the test; accepted/parity pass.
  expect(report.failures, "unresolved gaps in " + ENTRY.id + " (see " + path + ")").toBe(0)
  await refCtx.close()
  await solCtx.close()
})
