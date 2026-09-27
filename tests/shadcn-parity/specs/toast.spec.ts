import { test, expect, type Page } from "@playwright/test"
import { verifyEntry } from "../lib/verify"
import { writeReport } from "../lib/report"

const ENTRY = {
  id: "toast",
  shadcn: {
    ref: "toast",
  },
  solidiom: {
    package: "@solidiom/toast",
    siteSlug: "toast",
    sitePath: "/components/toast/examples",
  },
  status: "mapped",
  parts: ["Root", "Title", "Description", "Close"],
  selectors: {
    Root: {
      ref: "li[data-state='open']:has(.font-semibold)",
      sol: ".toast-example [data-scope='toast'][data-part='root']",
    },
    Title: {
      ref: "li[data-state='open'] .font-semibold",
      sol: ".toast-example [data-scope='toast'][data-part='title']",
    },
    Description: {
      ref: "li[data-state='open'] .opacity-90",
      sol: ".toast-example [data-scope='toast'][data-part='description']",
    },
    Close: {
      ref: "li[data-state='open'] button",
      sol: ".toast-example [data-scope='toast'][data-part='close']",
    },
  },
  tokens: {
    Root: {
      "border-radius": "6px",
      "border-width": "1px",
      "font-size": "14px",
    },
    Title: {
      "font-size": "14px",
      "font-weight": "600",
    },
    Description: {
      "font-size": "12px",
    },
  },
  interactions: ["show-toast"],
  states: ["default", "show-toast"],
  themes: ["light", "dark"],
  tolerance: {
    pixelMaxDiff: 2,
    pixelMaxPercent: 1,
  },
  acceptedDivergences: [],
} as import("../lib/types").MappingEntry
const REF_BASE = "http://127.0.0.1:4333"
const SOL_BASE = "http://127.0.0.1:4322"

test("toast - shadcn parity", async ({ browser }) => {
  const refCtx = await browser.newContext()
  const solCtx = await browser.newContext()
  const refPage: Page = await refCtx.newPage()
  const solPage: Page = await solCtx.newPage()
  await refPage.goto(REF_BASE + "/" + ENTRY.shadcn.ref, { waitUntil: "networkidle" })
  await solPage.goto(SOL_BASE + "/components/toast/examples/", { waitUntil: "networkidle" })
  const report = await verifyEntry(ENTRY, refPage, solPage, "../../artifacts/shadcn-parity")
  const path = await writeReport(ENTRY, report, "../../artifacts/shadcn-parity")
  // A gap fails the test; accepted/parity pass.
  expect(report.failures, "unresolved gaps in " + ENTRY.id + " (see " + path + ")").toBe(0)
  await refCtx.close()
  await solCtx.close()
})
