import { test, expect, type Page } from "@playwright/test"
import { verifyEntry } from "../lib/verify"
import { writeReport } from "../lib/report"

const ENTRY = {
  id: "label",
  shadcn: {
    ref: "label",
  },
  solidiom: {
    package: "@solidiom/label",
    siteSlug: "label",
    sitePath: "/components/label/examples",
  },
  status: "mapped",
  parts: ["Root"],
  selectors: {
    Root: {
      ref: "[role='checkbox'] + label",
      sol: ".label-example [data-scope='label'][data-part='root']",
    },
  },
  tokens: {
    Root: {
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
      signal: "tokens.Root.color",
      reason:
        "shadcn label color = rgb(2, 8, 23) (foreground); Solidiom label color = rgb(17, 24, 39). Different foreground palettes, deliberate. The font-size (14px) token matches — that is the asserted 'like shadcn' value.",
    },
    {
      signal: "tokens.Root.font-weight",
      reason:
        "shadcn label is font-medium (500); Solidiom label is font-semibold (600). Deliberate one-step-bold label.",
    },
  ],
} as import("../lib/types").MappingEntry
const REF_BASE = "http://127.0.0.1:4333"
const SOL_BASE = "http://127.0.0.1:4322"

test("label - shadcn parity", async ({ browser }) => {
  const refCtx = await browser.newContext()
  const solCtx = await browser.newContext()
  const refPage: Page = await refCtx.newPage()
  const solPage: Page = await solCtx.newPage()
  await refPage.goto(REF_BASE + "/" + ENTRY.shadcn.ref, { waitUntil: "networkidle" })
  await solPage.goto(SOL_BASE + "/components/label/examples/", { waitUntil: "networkidle" })
  const report = await verifyEntry(ENTRY, refPage, solPage, "../../artifacts/shadcn-parity")
  const path = await writeReport(ENTRY, report, "../../artifacts/shadcn-parity")
  // A gap fails the test; accepted/parity pass.
  expect(report.failures, "unresolved gaps in " + ENTRY.id + " (see " + path + ")").toBe(0)
  await refCtx.close()
  await solCtx.close()
})
