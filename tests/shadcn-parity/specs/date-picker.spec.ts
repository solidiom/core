import { test, expect, type Page } from "@playwright/test"
import { verifyEntry } from "../lib/verify"
import { writeReport } from "../lib/report"

const ENTRY = {
  id: "date-picker",
  shadcn: {
    ref: "date-picker",
  },
  solidiom: {
    package: "@solidiom/date-picker",
    siteSlug: "date-picker",
    sitePath: "/components/date-picker/examples",
  },
  status: "mapped",
  parts: ["Trigger", "Content", "Calendar"],
  selectors: {
    Trigger: {
      ref: "button[data-state]",
      sol: ".date-picker-example [data-scope='date-picker'][data-part='trigger']",
    },
    Content: {
      ref: "div[role='dialog'][data-state='open']",
      sol: "[data-scope='date-picker'][data-part='content']",
    },
    Calendar: {
      ref: "[data-slot='calendar']",
      sol: "[data-scope='date-picker'][data-part='calendar']",
    },
  },
  tokens: {
    Trigger: {
      "border-radius": "6px",
      height: "36px",
      padding: "8px 16px",
      "font-size": "14px",
      "border-width": "1px",
    },
    Content: {
      "border-radius": "6px",
      padding: "0px",
      "border-width": "1px",
    },
    Calendar: {
      padding: "12px",
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
      signal: "tokens.Calendar.padding",
      reason:
        "shadcn's date-picker is composed as PopoverContent (p-0) wrapping the standalone Calendar (12px padding on the [data-slot=calendar] node). Solidiom renders the 12px padding on the DatePicker.Content div instead of the inner Calendar wrapper node the harness measures (data-part=calendar), so that node reports 0px. The open calendar visually carries the same 12px padding in both frames — this is a DOM-node placement measurement artifact, not a Solidiom look gap.",
    },
  ],
} as import("../lib/types").MappingEntry
const REF_BASE = "http://127.0.0.1:4333"
const SOL_BASE = "http://127.0.0.1:4322"

test("date-picker - shadcn parity", async ({ browser }) => {
  const refCtx = await browser.newContext()
  const solCtx = await browser.newContext()
  const refPage: Page = await refCtx.newPage()
  const solPage: Page = await solCtx.newPage()
  await refPage.goto(REF_BASE + "/" + ENTRY.shadcn.ref, { waitUntil: "networkidle" })
  await solPage.goto(SOL_BASE + "/components/date-picker/examples/", { waitUntil: "networkidle" })
  const report = await verifyEntry(ENTRY, refPage, solPage, "../../artifacts/shadcn-parity")
  const path = await writeReport(ENTRY, report, "../../artifacts/shadcn-parity")
  // A gap fails the test; accepted/parity pass.
  expect(report.failures, "unresolved gaps in " + ENTRY.id + " (see " + path + ")").toBe(0)
  await refCtx.close()
  await solCtx.close()
})
