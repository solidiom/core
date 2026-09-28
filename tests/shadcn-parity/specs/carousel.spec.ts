import { test, expect, type Page } from "@playwright/test"
import { verifyEntry } from "../lib/verify"
import { writeReport } from "../lib/report"

const ENTRY = {
  id: "carousel",
  shadcn: {
    ref: "carousel",
  },
  solidiom: {
    package: "@solidiom/carousel",
    siteSlug: "carousel",
    sitePath: "/components/carousel/examples",
  },
  status: "mapped",
  parts: ["Root", "Viewport", "Slide", "Prev", "Next"],
  selectors: {
    Root: {
      ref: "[aria-roledescription='carousel']",
      sol: ".carousel-example [data-scope='carousel'][data-part='root']",
    },
    Viewport: {
      ref: "[aria-roledescription='carousel'] > div.overflow-hidden",
      sol: ".carousel-example [data-scope='carousel'][data-part='viewport']",
    },
    Slide: {
      ref: "[aria-roledescription='slide']",
      sol: ".carousel-example [data-scope='carousel'][data-part='slide']",
    },
    Prev: {
      ref: "button:has(.sr-only):first-of-type",
      sol: ".carousel-example [data-scope='carousel'][data-part='prev-button']",
    },
    Next: {
      ref: "button:has(.sr-only)",
      sol: ".carousel-example [data-scope='carousel'][data-part='next-button']",
    },
  },
  tokens: {
    Prev: {
      height: "32px",
      width: "32px",
      "border-radius": "9999px",
      "border-width": "1px",
      "font-weight": "500",
    },
    Next: {
      height: "32px",
      width: "32px",
      "border-radius": "9999px",
      "border-width": "1px",
      "font-weight": "500",
    },
  },
  interactions: ["click-carousel-next"],
  states: ["default", "click-carousel-next"],
  themes: ["light", "dark"],
  tolerance: {
    pixelMaxDiff: 2,
    pixelMaxPercent: 1,
  },
  acceptedDivergences: [],
} as import("../lib/types").MappingEntry
const REF_BASE = "http://127.0.0.1:4333"
const SOL_BASE = "http://127.0.0.1:4322"

test("carousel - shadcn parity", async ({ browser }) => {
  const refCtx = await browser.newContext()
  const solCtx = await browser.newContext()
  const refPage: Page = await refCtx.newPage()
  const solPage: Page = await solCtx.newPage()
  await refPage.goto(REF_BASE + "/" + ENTRY.shadcn.ref, { waitUntil: "networkidle" })
  await solPage.goto(SOL_BASE + "/components/carousel/examples/", { waitUntil: "networkidle" })
  const report = await verifyEntry(ENTRY, refPage, solPage, "../../artifacts/shadcn-parity")
  const path = await writeReport(ENTRY, report, "../../artifacts/shadcn-parity")
  // A gap fails the test; accepted/parity pass.
  expect(report.failures, "unresolved gaps in " + ENTRY.id + " (see " + path + ")").toBe(0)
  await refCtx.close()
  await solCtx.close()
})
