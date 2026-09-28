import { test, expect, type Page } from "@playwright/test"
import { verifyEntry } from "../lib/verify"
import { writeReport } from "../lib/report"

const ENTRY = {
  id: "field",
  shadcn: {
    ref: "field",
  },
  solidiom: {
    package: "@solidiom/field",
    siteSlug: "field",
    sitePath: "/components/field/examples",
  },
  status: "mapped",
  parts: ["Root", "Label", "Description"],
  selectors: {
    Root: {
      ref: "[role='group']",
      sol: ".field-example [data-scope='field'][data-part='root']",
    },
    Label: {
      ref: "label",
      sol: ".field-example [data-scope='field'][data-part='label']",
    },
    Description: {
      ref: "p",
      sol: ".field-example [data-scope='field'][data-part='description']",
    },
  },
  tokens: {
    Label: {
      color: "rgb(2, 8, 23)",
      "font-size": "14px",
      "font-weight": "500",
    },
  },
  interactions: [],
  states: ["default"],
  themes: ["light", "dark"],
  tolerance: {
    pixelMaxDiff: 2,
    pixelMaxPercent: 1,
  },
  acceptedDivergences: [
    {
      signal: "tokens.Label.font-weight",
      reason:
        "shadcn FieldLabel is font-medium (500); Solidiom field label is font-semibold (600). Deliberate one-step-bold, consistent with the label component.",
    },
    {
      signal: "tokens.Root.color",
      reason:
        "shadcn field label color = rgb(2, 8, 23); Solidiom = rgb(17, 24, 39). Different foreground palettes, deliberate.",
    },
  ],
} as import("../lib/types").MappingEntry
const REF_BASE = "http://127.0.0.1:4333"
const SOL_BASE = "http://127.0.0.1:4322"

test("field - shadcn parity", async ({ browser }) => {
  const refCtx = await browser.newContext()
  const solCtx = await browser.newContext()
  const refPage: Page = await refCtx.newPage()
  const solPage: Page = await solCtx.newPage()
  await refPage.goto(REF_BASE + "/" + ENTRY.shadcn.ref, { waitUntil: "networkidle" })
  await solPage.goto(SOL_BASE + "/components/field/examples/", { waitUntil: "networkidle" })
  const report = await verifyEntry(ENTRY, refPage, solPage, "../../artifacts/shadcn-parity")
  const path = await writeReport(ENTRY, report, "../../artifacts/shadcn-parity")
  // A gap fails the test; accepted/parity pass.
  expect(report.failures, "unresolved gaps in " + ENTRY.id + " (see " + path + ")").toBe(0)
  await refCtx.close()
  await solCtx.close()
})
