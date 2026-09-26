import { test, expect, type Page } from "@playwright/test"
import { verifyEntry } from "../lib/verify"
import { writeReport } from "../lib/report"

const ENTRY = {
  id: "select",
  shadcn: {
    ref: "select",
  },
  solidiom: {
    package: "@solidiom/select",
    siteSlug: "select",
    sitePath: "/components/select/examples",
  },
  status: "mapped",
  parts: ["Trigger", "Content", "Item"],
  selectors: {
    Trigger: {
      ref: "button[role='combobox']",
      sol: ".select-example [data-scope='select'][data-part='trigger']",
    },
    Content: {
      ref: "[role='listbox']",
      sol: ".select-example [data-scope='select'][data-part='content']",
    },
    Item: {
      ref: "[role='option']",
      sol: ".select-example [data-scope='select'][data-part='item']",
    },
  },
  tokens: {
    Trigger: {
      "background-color": "rgba(0, 0, 0, 0)",
      "border-radius": "6px",
      height: "36px",
      "border-width": "1px",
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
        "shadcn select trigger is a border-input outlined button (transparent bg); Solidiom trigger is a light-gray fill (rgb(248, 250, 252)). Deliberate 'filled-light' vs 'outline'.",
    },
    {
      signal: "tokens.Trigger.border-color",
      reason:
        "shadcn border-color = rgb(226, 232, 240); Solidiom = rgb(203, 213, 225). Different border palettes, deliberate.",
    },
  ],
} as import("../lib/types").MappingEntry
const REF_BASE = "http://127.0.0.1:4333"
const SOL_BASE = "http://127.0.0.1:4322"

test("select - shadcn parity", async ({ browser }) => {
  const refCtx = await browser.newContext()
  const solCtx = await browser.newContext()
  const refPage: Page = await refCtx.newPage()
  const solPage: Page = await solCtx.newPage()
  await refPage.goto(REF_BASE + "/" + ENTRY.shadcn.ref, { waitUntil: "networkidle" })
  await solPage.goto(SOL_BASE + "/components/select/examples/", { waitUntil: "networkidle" })
  const report = await verifyEntry(ENTRY, refPage, solPage, "../../artifacts/shadcn-parity")
  const path = await writeReport(ENTRY, report, "../../artifacts/shadcn-parity")
  // A gap fails the test; accepted/parity pass.
  expect(report.failures, "unresolved gaps in " + ENTRY.id + " (see " + path + ")").toBe(0)
  await refCtx.close()
  await solCtx.close()
})
