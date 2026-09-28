import { test, expect, type Page } from "@playwright/test"
import { verifyEntry } from "../lib/verify"
import { writeReport } from "../lib/report"

const ENTRY = {
  id: "data-table",
  shadcn: {
    ref: "data-table",
  },
  solidiom: {
    package: "@solidiom/data-table",
    siteSlug: "data-table",
    sitePath: "/components/data-table/examples",
  },
  status: "mapped",
  parts: ["Root", "Header", "HeaderCell", "Row", "Cell"],
  selectors: {
    Root: {
      ref: "table",
      sol: ".data-table-example [data-scope='data-table'][data-part='root']",
    },
    Header: {
      ref: "thead",
      sol: ".data-table-example [data-scope='data-table'][data-part='header']",
    },
    HeaderCell: {
      ref: "th",
      sol: ".data-table-example [data-scope='data-table'][data-part='header-cell']",
    },
    Row: {
      ref: "tbody tr",
      sol: ".data-table-example [data-scope='data-table'][data-part='row']",
    },
    Cell: {
      ref: "tbody td",
      sol: ".data-table-example [data-scope='data-table'][data-part='cell']",
    },
  },
  tokens: {
    HeaderCell: {
      height: "40px",
      padding: "1px 8px",
      "font-size": "14px",
      "font-weight": "500",
    },
    Cell: {
      padding: "8px",
      "font-size": "14px",
      "font-weight": "400",
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

test("data-table - shadcn parity", async ({ browser }) => {
  const refCtx = await browser.newContext()
  const solCtx = await browser.newContext()
  const refPage: Page = await refCtx.newPage()
  const solPage: Page = await solCtx.newPage()
  await refPage.goto(REF_BASE + "/" + ENTRY.shadcn.ref, { waitUntil: "networkidle" })
  await solPage.goto(SOL_BASE + "/components/data-table/examples/", { waitUntil: "networkidle" })
  const report = await verifyEntry(ENTRY, refPage, solPage, "../../artifacts/shadcn-parity")
  const path = await writeReport(ENTRY, report, "../../artifacts/shadcn-parity")
  // A gap fails the test; accepted/parity pass.
  expect(report.failures, "unresolved gaps in " + ENTRY.id + " (see " + path + ")").toBe(0)
  await refCtx.close()
  await solCtx.close()
})
