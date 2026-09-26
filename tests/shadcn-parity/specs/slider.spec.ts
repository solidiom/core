import { test, expect, type Page } from "@playwright/test"
import { verifyEntry } from "../lib/verify"
import { writeReport } from "../lib/report"

const ENTRY = {
  id: "slider",
  shadcn: {
    ref: "slider",
  },
  solidiom: {
    package: "@solidiom/slider",
    siteSlug: "slider",
    sitePath: "/components/slider/examples",
  },
  status: "mapped",
  parts: ["Root", "Track", "Range", "Thumb"],
  selectors: {
    Root: {
      ref: "[data-orientation='horizontal']:first-of-type",
      sol: ".slider-example [data-scope='slider'][data-part='root']",
    },
    Track: {
      ref: "[data-orientation='horizontal']:first-of-type > span:first-of-type",
      sol: ".slider-example [data-scope='slider'][data-part='track']",
    },
    Range: {
      ref: "[data-orientation='horizontal']:first-of-type > span:first-of-type > span",
      sol: ".slider-example [data-scope='slider'][data-part='range']",
    },
    Thumb: {
      ref: "[role='slider']:first-of-type",
      sol: ".slider-example [data-scope='slider'][data-part='thumb']",
    },
  },
  tokens: {
    Thumb: {
      "background-color": "rgb(255, 255, 255)",
      height: "16px",
      width: "16px",
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
      signal: "tokens.Thumb.background-color",
      reason:
        "shadcn slider thumb is bg-background (white in light) with a primary/50 border; Solidiom thumb is a solid foreground dot (rgb(17, 24, 39)). Deliberate 'white ringed' vs 'solid' thumb.",
    },
    {
      signal: "tokens.Thumb.border-radius",
      reason:
        "FORM: shadcn thumb is rounded-full (9999px); Solidiom thumb is 50%. Both render a 16px circle; non-visual CSS-form difference.",
    },
    {
      signal: "tokens.Thumb.border-width",
      reason:
        "shadcn thumb has a 1px border; Solidiom thumb has 0 (solid fill). Tracks the accepted background divergence.",
    },
  ],
} as import("../lib/types").MappingEntry
const REF_BASE = "http://127.0.0.1:4333"
const SOL_BASE = "http://127.0.0.1:4322"

test("slider - shadcn parity", async ({ browser }) => {
  const refCtx = await browser.newContext()
  const solCtx = await browser.newContext()
  const refPage: Page = await refCtx.newPage()
  const solPage: Page = await solCtx.newPage()
  await refPage.goto(REF_BASE + "/" + ENTRY.shadcn.ref, { waitUntil: "networkidle" })
  await solPage.goto(SOL_BASE + "/components/slider/examples/", { waitUntil: "networkidle" })
  const report = await verifyEntry(ENTRY, refPage, solPage, "../../artifacts/shadcn-parity")
  const path = await writeReport(ENTRY, report, "../../artifacts/shadcn-parity")
  // A gap fails the test; accepted/parity pass.
  expect(report.failures, "unresolved gaps in " + ENTRY.id + " (see " + path + ")").toBe(0)
  await refCtx.close()
  await solCtx.close()
})
