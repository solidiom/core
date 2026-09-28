import { test, expect, type Page } from "@playwright/test"
import { verifyEntry } from "../lib/verify"
import { writeReport } from "../lib/report"

const ENTRY = {
  id: "scroll-area",
  shadcn: {
    ref: "scroll-area",
  },
  solidiom: {
    package: "@solidiom/scroll-area",
    siteSlug: "scroll-area",
    sitePath: "/components/scroll-area/examples",
  },
  status: "mapped",
  parts: ["Root", "Viewport"],
  selectors: {
    Root: {
      ref: "div.relative.overflow-hidden",
      sol: ".scroll-area-example [data-scope='scroll-area'][data-part='root']",
    },
    Viewport: {
      ref: "div.relative.overflow-hidden > div:first-of-type",
      sol: ".scroll-area-example [data-scope='scroll-area'][data-part='viewport']",
    },
  },
  tokens: {
    Root: {
      "border-radius": "6px",
      "border-width": "1px",
      padding: "16px",
    },
    Viewport: {
      "border-radius": "6px",
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
      signal: "tokens.Root.border-color",
      reason:
        "shadcn root border is rgb(226, 232, 240); Solidiom is rgb(203, 213, 225). Deliberate border palette.",
    },
    {
      signal: "tokens.Root.background-color",
      reason:
        "shadcn scroll-area root is transparent (no bg); Solidiom root is a light surface fill (rgb(248, 250, 252)). Deliberate filled-light vs transparent.",
    },
    {
      signal: "pixels.light.default",
      reason:
        "Pixel crop includes differing scroll content (shadcn paragraph lines vs Solidiom Item rows) + island chrome; root/viewport geometry at parity (6px radius, 1px border, 16px padding).",
    },
    {
      signal: "pixels.dark.default",
      reason: "Dark-theme pixel delta from differing scroll content; geometry at parity.",
    },
  ],
} as import("../lib/types").MappingEntry
const REF_BASE = "http://127.0.0.1:4333"
const SOL_BASE = "http://127.0.0.1:4322"

test("scroll-area - shadcn parity", async ({ browser }) => {
  const refCtx = await browser.newContext()
  const solCtx = await browser.newContext()
  const refPage: Page = await refCtx.newPage()
  const solPage: Page = await solCtx.newPage()
  await refPage.goto(REF_BASE + "/" + ENTRY.shadcn.ref, { waitUntil: "networkidle" })
  await solPage.goto(SOL_BASE + "/components/scroll-area/examples/", { waitUntil: "networkidle" })
  const report = await verifyEntry(ENTRY, refPage, solPage, "../../artifacts/shadcn-parity")
  const path = await writeReport(ENTRY, report, "../../artifacts/shadcn-parity")
  // A gap fails the test; accepted/parity pass.
  expect(report.failures, "unresolved gaps in " + ENTRY.id + " (see " + path + ")").toBe(0)
  await refCtx.close()
  await solCtx.close()
})
