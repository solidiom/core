import { test, expect, type Page } from "@playwright/test"
import { verifyEntry } from "../lib/verify"
import { writeReport } from "../lib/report"

const ENTRY = {
  id: "calendar",
  shadcn: {
    ref: "calendar",
  },
  solidiom: {
    package: "@solidiom/calendar",
    siteSlug: "calendar",
    sitePath: "/components/calendar/examples",
  },
  status: "mapped",
  parts: ["Root", "Title", "Prev", "Next", "Grid", "Cell"],
  selectors: {
    Root: {
      ref: "[data-slot='calendar']",
      sol: ".calendar-example [data-scope='calendar'][data-part='root']",
    },
    Title: {
      ref: ".rdp-caption_label",
      sol: ".calendar-example [data-scope='calendar'][data-part='title']",
    },
    Prev: {
      ref: "button.rdp-button_previous",
      sol: ".calendar-example [data-scope='calendar'][data-part='prev-button']",
    },
    Next: {
      ref: "button.rdp-button_next",
      sol: ".calendar-example [data-scope='calendar'][data-part='next-button']",
    },
    Grid: {
      ref: ".rdp-month_grid",
      sol: ".calendar-example [data-scope='calendar'][data-part='grid']",
    },
    Cell: {
      ref: ".rdp-day button",
      sol: ".calendar-example [data-scope='calendar'][data-part='cell']",
    },
  },
  tokens: {
    Root: {
      "border-radius": "0px",
      padding: "12px",
      "border-width": "0px",
    },
    Prev: {
      height: "32px",
      width: "32px",
      "border-radius": "6px",
      "font-size": "14px",
    },
    Next: {
      height: "32px",
      width: "32px",
      "border-radius": "6px",
      "font-size": "14px",
    },
    Title: {
      "font-size": "14px",
      "font-weight": "500",
    },
    Cell: {
      width: "32px",
      height: "32px",
      "font-size": "14px",
      "border-radius": "6px",
    },
  },
  interactions: ["click-calendar-next"],
  states: ["default", "click-calendar-next"],
  themes: ["light", "dark"],
  tolerance: {
    pixelMaxDiff: 2,
    pixelMaxPercent: 1,
  },
  acceptedDivergences: [],
} as import("../lib/types").MappingEntry
const REF_BASE = "http://127.0.0.1:4333"
const SOL_BASE = "http://127.0.0.1:4322"

test("calendar - shadcn parity", async ({ browser }) => {
  const refCtx = await browser.newContext()
  const solCtx = await browser.newContext()
  const refPage: Page = await refCtx.newPage()
  const solPage: Page = await solCtx.newPage()
  await refPage.goto(REF_BASE + "/" + ENTRY.shadcn.ref, { waitUntil: "networkidle" })
  await solPage.goto(SOL_BASE + "/components/calendar/examples/", { waitUntil: "networkidle" })
  const report = await verifyEntry(ENTRY, refPage, solPage, "../../artifacts/shadcn-parity")
  const path = await writeReport(ENTRY, report, "../../artifacts/shadcn-parity")
  // A gap fails the test; accepted/parity pass.
  expect(report.failures, "unresolved gaps in " + ENTRY.id + " (see " + path + ")").toBe(0)
  await refCtx.close()
  await solCtx.close()
})
