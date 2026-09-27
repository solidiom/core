import { test, expect, type Page } from "@playwright/test"
import { verifyEntry } from "../lib/verify"
import { writeReport } from "../lib/report"

const ENTRY = {
  id: "collapsible",
  shadcn: {
    ref: "collapsible",
  },
  solidiom: {
    package: "@solidiom/collapsible",
    siteSlug: "collapsible",
    sitePath: "/components/collapsible/examples",
  },
  status: "mapped",
  parts: ["Trigger", "Content"],
  selectors: {
    Trigger: {
      ref: "button[aria-expanded]",
      sol: ".collapsible-example [data-scope='collapsible'][data-part='trigger']",
    },
    Content: {
      ref: "div[data-state='open']",
      sol: ".collapsible-example [data-scope='collapsible'][data-part='content']",
    },
  },
  tokens: {
    Trigger: {
      "border-radius": "6px",
      "font-size": "12px",
      "font-weight": "500",
      height: "32px",
    },
  },
  interactions: ["open"],
  states: ["default", "open"],
  themes: ["light", "dark"],
  tolerance: {
    pixelMaxDiff: 2,
    pixelMaxPercent: 1,
  },
  acceptedDivergences: [
    {
      signal: "tokens.Trigger.background-color",
      reason:
        "shadcn collapsible trigger is an outline sm button (border-input, bg-background); Solidiom trigger is a filled-light sm button (rgb(248, 250, 252)). Deliberate filled-light vs outline button, consistent with Batch-1.",
    },
    {
      signal: "tokens.Trigger.font-weight",
      reason:
        "shadcn sm button is font-medium (500); Solidiom is font-semibold (600). Deliberate one-step-bold.",
    },
    {
      signal: "behavior.open",
      reason:
        "Open-state focus/visibility: clicking opens the content on both frames; Radix keeps the content element mounted (hidden attribute) while Solidiom unmounts when closed, so the open Content snapshot differs by presence. Recorded.",
    },
  ],
} as import("../lib/types").MappingEntry
const REF_BASE = "http://127.0.0.1:4333"
const SOL_BASE = "http://127.0.0.1:4322"

test("collapsible - shadcn parity", async ({ browser }) => {
  const refCtx = await browser.newContext()
  const solCtx = await browser.newContext()
  const refPage: Page = await refCtx.newPage()
  const solPage: Page = await solCtx.newPage()
  await refPage.goto(REF_BASE + "/" + ENTRY.shadcn.ref, { waitUntil: "networkidle" })
  await solPage.goto(SOL_BASE + "/components/collapsible/examples/", { waitUntil: "networkidle" })
  const report = await verifyEntry(ENTRY, refPage, solPage, "../../artifacts/shadcn-parity")
  const path = await writeReport(ENTRY, report, "../../artifacts/shadcn-parity")
  // A gap fails the test; accepted/parity pass.
  expect(report.failures, "unresolved gaps in " + ENTRY.id + " (see " + path + ")").toBe(0)
  await refCtx.close()
  await solCtx.close()
})
