import { test, expect, type Page } from "@playwright/test"
import { verifyEntry } from "../lib/verify"
import { writeReport } from "../lib/report"

const ENTRY = {
  id: "empty-state",
  shadcn: {
    ref: "empty",
  },
  solidiom: {
    package: "@solidiom/empty-state",
    siteSlug: "empty-state",
    sitePath: "/components/empty-state/examples",
  },
  status: "mapped",
  parts: ["Root", "Icon", "Title", "Description", "Action"],
  selectors: {
    Root: {
      ref: "[data-slot='empty']",
      sol: ".empty-state-example [data-scope='empty-state'][data-part='root']",
    },
    Icon: {
      ref: "[data-slot='empty-icon']",
      sol: ".empty-state-example [data-scope='empty-state'][data-part='icon']",
    },
    Title: {
      ref: "[data-slot='empty-title']",
      sol: ".empty-state-example [data-scope='empty-state'][data-part='title']",
    },
    Description: {
      ref: "[data-slot='empty-description']",
      sol: ".empty-state-example [data-scope='empty-state'][data-part='description']",
    },
    Action: {
      ref: "[data-slot='empty-content']",
      sol: ".empty-state-example [data-scope='empty-state'][data-part='action']",
    },
  },
  tokens: {
    Root: {
      "border-radius": "8px",
      "border-width": "0px",
      padding: "48px",
    },
    Icon: {
      width: "40px",
      height: "40px",
      "border-radius": "8px",
    },
    Title: {
      "font-size": "18px",
      "font-weight": "500",
    },
    Description: {
      "font-size": "14px",
    },
    Action: {
      height: "32px",
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

test("empty-state - shadcn parity", async ({ browser }) => {
  const refCtx = await browser.newContext()
  const solCtx = await browser.newContext()
  const refPage: Page = await refCtx.newPage()
  const solPage: Page = await solCtx.newPage()
  await refPage.goto(REF_BASE + "/" + ENTRY.shadcn.ref, { waitUntil: "networkidle" })
  await solPage.goto(SOL_BASE + "/components/empty-state/examples/", { waitUntil: "networkidle" })
  const report = await verifyEntry(ENTRY, refPage, solPage, "../../artifacts/shadcn-parity")
  const path = await writeReport(ENTRY, report, "../../artifacts/shadcn-parity")
  // A gap fails the test; accepted/parity pass.
  expect(report.failures, "unresolved gaps in " + ENTRY.id + " (see " + path + ")").toBe(0)
  await refCtx.close()
  await solCtx.close()
})
