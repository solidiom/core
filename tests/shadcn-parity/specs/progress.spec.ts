import { test, expect, type Page } from "@playwright/test"
import { verifyEntry } from "../lib/verify"
import { writeReport } from "../lib/report"

const ENTRY = {
  id: "progress",
  shadcn: {
    ref: "progress",
  },
  solidiom: {
    package: "@solidiom/progress",
    siteSlug: "progress",
    sitePath: "/components/progress/examples",
  },
  status: "mapped",
  parts: ["Root", "Indicator"],
  selectors: {
    Root: {
      ref: "[role='progressbar']",
      sol: ".progress-example [data-scope='progress'][data-part='root']",
    },
    Indicator: {
      ref: "[role='progressbar'] > div",
      sol: ".progress-example [data-scope='progress'][data-part='indicator']",
    },
  },
  tokens: {
    Root: {
      height: "8px",
      "border-radius": "9999px",
    },
    Indicator: {
      height: "8px",
      "border-radius": "0px",
    },
  },
  interactions: [],
  states: ["default"],
  themes: ["light", "dark"],
  tolerance: {
    pixelMaxDiff: 2,
    pixelMaxPercent: 1,
  },
  acceptedDivergences: [],
} as import("../lib/types").MappingEntry
const REF_BASE = "http://127.0.0.1:4333"
const SOL_BASE = "http://127.0.0.1:4322"

test("progress - shadcn parity", async ({ browser }) => {
  const refCtx = await browser.newContext()
  const solCtx = await browser.newContext()
  const refPage: Page = await refCtx.newPage()
  const solPage: Page = await solCtx.newPage()
  await refPage.goto(REF_BASE + "/" + ENTRY.shadcn.ref, { waitUntil: "networkidle" })
  await solPage.goto(SOL_BASE + "/components/progress/examples/", { waitUntil: "networkidle" })
  const report = await verifyEntry(ENTRY, refPage, solPage, "../../artifacts/shadcn-parity")
  const path = await writeReport(ENTRY, report, "../../artifacts/shadcn-parity")
  // A gap fails the test; accepted/parity pass.
  expect(report.failures, "unresolved gaps in " + ENTRY.id + " (see " + path + ")").toBe(0)
  await refCtx.close()
  await solCtx.close()
})
