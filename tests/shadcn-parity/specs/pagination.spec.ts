import { test, expect, type Page } from "@playwright/test"
import { verifyEntry } from "../lib/verify"
import { writeReport } from "../lib/report"

const ENTRY = {
  id: "pagination",
  shadcn: {
    ref: "pagination",
  },
  solidiom: {
    package: "@solidiom/pagination",
    siteSlug: "pagination",
    sitePath: "/components/pagination/examples",
  },
  status: "mapped",
  parts: ["Next", "Previous"],
  selectors: {
    Next: {
      ref: "a[aria-label='Go to next page']",
      sol: ".pagination-example [data-scope='pagination'][data-part='next']",
    },
    Previous: {
      ref: "a[aria-label='Go to previous page']",
      sol: ".pagination-example [data-scope='pagination'][data-part='previous']",
    },
  },
  tokens: {
    Next: {
      "border-radius": "6px",
      "font-size": "14px",
      "font-weight": "500",
      height: "36px",
    },
    Previous: {
      "border-radius": "6px",
      "font-size": "14px",
      "font-weight": "500",
      height: "36px",
    },
  },
  interactions: ["click-next"],
  states: ["default", "click-next"],
  themes: ["light", "dark"],
  tolerance: {
    pixelMaxDiff: 2,
    pixelMaxPercent: 1,
  },
  acceptedDivergences: [
    {
      signal: "tokens.Next.font-weight",
      reason:
        "shadcn pagination link is font-medium (500); Solidiom is font-semibold (600). Deliberate one-step-bold.",
    },
    {
      signal: "tokens.Previous.font-weight",
      reason:
        "shadcn pagination link is font-medium (500); Solidiom is font-semibold (600). Deliberate one-step-bold.",
    },
    {
      signal: "behavior.click-next",
      reason:
        "Clicking Next on the shadcn reference navigates to a '#' href (no client-side page state — the href does not advance an active item); the Solidiom pagination island has real page state so clicking Next advances the current page (1->2) and moves aria-current. Different state model (link-anchors vs stateful pager). Recorded; the visual geometry (Next/Previous) is at parity.",
    },
  ],
} as import("../lib/types").MappingEntry
const REF_BASE = "http://127.0.0.1:4333"
const SOL_BASE = "http://127.0.0.1:4322"

test("pagination - shadcn parity", async ({ browser }) => {
  const refCtx = await browser.newContext()
  const solCtx = await browser.newContext()
  const refPage: Page = await refCtx.newPage()
  const solPage: Page = await solCtx.newPage()
  await refPage.goto(REF_BASE + "/" + ENTRY.shadcn.ref, { waitUntil: "networkidle" })
  await solPage.goto(SOL_BASE + "/components/pagination/examples/", { waitUntil: "networkidle" })
  const report = await verifyEntry(ENTRY, refPage, solPage, "../../artifacts/shadcn-parity")
  const path = await writeReport(ENTRY, report, "../../artifacts/shadcn-parity")
  // A gap fails the test; accepted/parity pass.
  expect(report.failures, "unresolved gaps in " + ENTRY.id + " (see " + path + ")").toBe(0)
  await refCtx.close()
  await solCtx.close()
})
