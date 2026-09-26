import { test, expect, type Page } from "@playwright/test"
import { verifyEntry } from "../lib/verify"
import { writeReport } from "../lib/report"

const ENTRY = {
  id: "radio-group",
  shadcn: {
    ref: "radio-group",
  },
  solidiom: {
    package: "@solidiom/radio-group",
    siteSlug: "radio-group",
    sitePath: "/components/radio-group/examples",
  },
  status: "mapped",
  parts: ["Item", "Indicator"],
  selectors: {
    Item: {
      ref: "[role='radio']",
      sol: ".radio-group-example [data-scope='radio-group'][data-part='item']",
    },
    Indicator: {
      ref: "[role='radio']",
      sol: ".radio-group-example [data-scope='radio-group'][data-part='indicator']",
    },
  },
  tokens: {
    Indicator: {
      "background-color": "rgba(0, 0, 0, 0)",
      height: "16px",
      "border-radius": "9999px",
    },
  },
  interactions: ["focus"],
  states: ["default", "focus"],
  themes: ["light", "dark"],
  tolerance: {
    pixelMaxDiff: 2,
    pixelMaxPercent: 1,
  },
  acceptedDivergences: [
    {
      signal: "tokens.Indicator.background-color",
      reason:
        "shadcn radio circle is transparent (border-primary, primary dot when checked); Solidiom indicator is a light-gray fill (rgb(248, 250, 252)). Deliberate 'filled-light' vs 'outline' base.",
    },
    {
      signal: "tokens.Indicator.border-radius",
      reason:
        "FORM: shadcn radio is rounded-full (9999px); Solidiom indicator is 50%. Both render a circle; non-visual CSS-form difference.",
    },
    {
      signal: "tokens.Indicator.height",
      reason:
        "STRUCTURAL: shadcn radio circle is 16px; Solidiom indicator is 20px, and its item row is full-width (602px) vs shadcn's bare 16px control with a sibling label. Different row model; the size delta is a real visual gap Task 8 should weigh.",
    },
  ],
} as import("../lib/types").MappingEntry
const REF_BASE = "http://127.0.0.1:4333"
const SOL_BASE = "http://127.0.0.1:4322"

test("radio-group - shadcn parity", async ({ browser }) => {
  const refCtx = await browser.newContext()
  const solCtx = await browser.newContext()
  const refPage: Page = await refCtx.newPage()
  const solPage: Page = await solCtx.newPage()
  await refPage.goto(REF_BASE + "/" + ENTRY.shadcn.ref, { waitUntil: "networkidle" })
  await solPage.goto(SOL_BASE + "/components/radio-group/examples/", { waitUntil: "networkidle" })
  const report = await verifyEntry(ENTRY, refPage, solPage, "../../artifacts/shadcn-parity")
  const path = await writeReport(ENTRY, report, "../../artifacts/shadcn-parity")
  // A gap fails the test; accepted/parity pass.
  expect(report.failures, "unresolved gaps in " + ENTRY.id + " (see " + path + ")").toBe(0)
  await refCtx.close()
  await solCtx.close()
})
