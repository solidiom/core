import { test, expect, type Page } from "@playwright/test"
import { verifyEntry } from "../lib/verify"
import { writeReport } from "../lib/report"

const ENTRY = {
  id: "input",
  shadcn: {
    ref: "input",
  },
  solidiom: {
    package: "@solidiom/input",
    siteSlug: "input",
    sitePath: "/components/input/examples",
  },
  status: "mapped",
  parts: ["Root"],
  selectors: {
    Root: {
      ref: "input:not([type='email'])",
      sol: ".input-example [data-scope='input'][data-part='root']",
    },
  },
  tokens: {
    Root: {
      "background-color": "rgba(0, 0, 0, 0)",
      "border-radius": "6px",
      "border-width": "1px",
      "font-size": "14px",
      height: "36px",
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
      signal: "tokens.Root.background-color",
      reason:
        "shadcn input is border-input (transparent/white bg with a 1px ring); Solidiom input is a light gray fill (rgb(248, 250, 252)). Deliberate 'filled' vs 'outlined' input style.",
    },
    {
      signal: "tokens.Root.border-color",
      reason:
        "shadcn border-color = rgb(226, 232, 240) (border-input); Solidiom border-color = rgb(203, 213, 225) (its own border token). Different border palettes, deliberate.",
    },
  ],
} as import("../lib/types").MappingEntry
const REF_BASE = "http://127.0.0.1:4333"
const SOL_BASE = "http://127.0.0.1:4322"

test("input - shadcn parity", async ({ browser }) => {
  const refCtx = await browser.newContext()
  const solCtx = await browser.newContext()
  const refPage: Page = await refCtx.newPage()
  const solPage: Page = await solCtx.newPage()
  await refPage.goto(REF_BASE + "/" + ENTRY.shadcn.ref, { waitUntil: "networkidle" })
  await solPage.goto(SOL_BASE + "/components/input/examples/", { waitUntil: "networkidle" })
  const report = await verifyEntry(ENTRY, refPage, solPage, "../../artifacts/shadcn-parity")
  const path = await writeReport(ENTRY, report, "../../artifacts/shadcn-parity")
  // A gap fails the test; accepted/parity pass.
  expect(report.failures, "unresolved gaps in " + ENTRY.id + " (see " + path + ")").toBe(0)
  await refCtx.close()
  await solCtx.close()
})
