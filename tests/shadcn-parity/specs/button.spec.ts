import { test, expect, type Page } from "@playwright/test"
import { verifyEntry } from "../lib/verify"
import { writeReport } from "../lib/report"

const ENTRY = {
  id: "button",
  shadcn: {
    ref: "button",
  },
  solidiom: {
    package: "@solidiom/button",
    siteSlug: "button",
    sitePath: "/components/button/examples",
  },
  status: "mapped",
  parts: ["Root"],
  selectors: {
    Root: {
      ref: "button:not([class*='ml-auto']):not([class*='px-2']):not([class*='text-xs'])",
      sol: "[data-button-example] [data-scope='button'][data-part='root']",
    },
  },
  tokens: {
    Root: {
      "background-color": "rgb(37, 99, 235)",
      color: "rgb(248, 250, 252)",
      "border-radius": "6px",
      padding: "8px 16px",
      "font-size": "14px",
      "font-weight": "500",
      height: "36px",
      "border-width": "0px",
    },
  },
  interactions: ["hover"],
  states: ["default", "hover"],
  themes: ["light", "dark"],
  tolerance: {
    pixelMaxDiff: 2,
    pixelMaxPercent: 1,
  },
  acceptedDivergences: [
    {
      signal: "tokens.Root.background-color",
      reason:
        "shadcn 'default' variant is a filled primary button (light: rgb(37, 99, 235)); Solidiom's island Root is its light/secondary style (rgb(248, 250, 252)). Deliberate: Solidiom's default button is filled-light, not brand-colored.",
    },
    {
      signal: "tokens.Root.color",
      reason:
        "Foreground tracks the fill: shadcn default is white-on-primary (rgb(248, 250, 252)); Solidiom is near-black on light (rgb(17, 24, 39)). Deliberate, follows the accepted background divergence.",
    },
  ],
} as import("../lib/types").MappingEntry
const REF_BASE = "http://127.0.0.1:4333"
const SOL_BASE = "http://127.0.0.1:4322"

test("button - shadcn parity", async ({ browser }) => {
  const refCtx = await browser.newContext()
  const solCtx = await browser.newContext()
  const refPage: Page = await refCtx.newPage()
  const solPage: Page = await solCtx.newPage()
  await refPage.goto(REF_BASE + "/" + ENTRY.shadcn.ref, { waitUntil: "networkidle" })
  await solPage.goto(SOL_BASE + "/components/button/examples/", { waitUntil: "networkidle" })
  const report = await verifyEntry(ENTRY, refPage, solPage, "../../artifacts/shadcn-parity")
  const path = await writeReport(ENTRY, report, "../../artifacts/shadcn-parity")
  // A gap fails the test; accepted/parity pass.
  expect(report.failures, "unresolved gaps in " + ENTRY.id + " (see " + path + ")").toBe(0)
  await refCtx.close()
  await solCtx.close()
})
