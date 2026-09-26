import { test, expect, type Page } from "@playwright/test"
import { verifyEntry } from "../lib/verify"
import { writeReport } from "../lib/report"

const ENTRY = {
  id: "checkbox",
  shadcn: {
    ref: "checkbox",
  },
  solidiom: {
    package: "@solidiom/checkbox",
    siteSlug: "checkbox",
    sitePath: "/components/checkbox/examples",
  },
  status: "mapped",
  parts: ["Root"],
  selectors: {
    Root: {
      ref: "[role='checkbox'][data-state='checked'] + label",
      sol: ".checkbox-example span",
    },
  },
  tokens: {
    Root: {
      "background-color": "rgba(0, 0, 0, 0)",
      "border-radius": "4px",
      height: "16px",
      "border-width": "1px",
    },
  },
  interactions: ["check"],
  states: ["default", "checked"],
  themes: ["light", "dark"],
  tolerance: {
    pixelMaxDiff: 2,
    pixelMaxPercent: 1,
  },
  acceptedDivergences: [
    {
      signal: "tokens.Root.background-color",
      reason:
        "shadcn unchecked checkbox is transparent (border-primary ring); Solidiom renders a light-gray fill (rgb(248, 250, 252)). Deliberate 'filled-light' base vs shadcn 'outline' base.",
    },
  ],
} as import("../lib/types").MappingEntry
const REF_BASE = "http://127.0.0.1:4333"
const SOL_BASE = "http://127.0.0.1:4322"

test("checkbox - shadcn parity", async ({ browser }) => {
  const refCtx = await browser.newContext()
  const solCtx = await browser.newContext()
  const refPage: Page = await refCtx.newPage()
  const solPage: Page = await solCtx.newPage()
  await refPage.goto(REF_BASE + "/" + ENTRY.shadcn.ref, { waitUntil: "networkidle" })
  await solPage.goto(SOL_BASE + "/components/checkbox/examples/", { waitUntil: "networkidle" })
  const report = await verifyEntry(ENTRY, refPage, solPage, "../../artifacts/shadcn-parity")
  const path = await writeReport(ENTRY, report, "../../artifacts/shadcn-parity")
  // A gap fails the test; accepted/parity pass.
  expect(report.failures, "unresolved gaps in " + ENTRY.id + " (see " + path + ")").toBe(0)
  await refCtx.close()
  await solCtx.close()
})
