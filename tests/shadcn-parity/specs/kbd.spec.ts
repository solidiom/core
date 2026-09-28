import { test, expect, type Page } from "@playwright/test"
import { verifyEntry } from "../lib/verify"
import { writeReport } from "../lib/report"

const ENTRY = {
  id: "kbd",
  shadcn: {
    ref: "kbd",
  },
  solidiom: {
    package: "@solidiom/kbd",
    siteSlug: "kbd",
    sitePath: "/components/kbd/examples",
  },
  status: "mapped",
  parts: ["Root"],
  selectors: {
    Root: {
      ref: "kbd",
      sol: ".kbd-example [data-scope='kbd'][data-part='root']",
    },
  },
  tokens: {
    Root: {
      "border-radius": "4px",
      "font-size": "12px",
      height: "20px",
      padding: "0px 4px",
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
      signal: "tokens.Root.background-color",
      reason:
        "shadcn kbd is bg-muted (rgb(241, 245, 249)); Solidiom kbd is a light-gray fill (rgb(248, 250, 252)). Deliberate filled-light vs muted palette.",
    },
    {
      signal: "tokens.Root.color",
      reason:
        "shadcn kbd text is muted-foreground (rgb(100, 116, 139)); Solidiom is its foreground (rgb(17, 24, 39)). Deliberate palette.",
    },
    {
      signal: "tokens.Root.font-weight",
      reason:
        "shadcn kbd is font-medium (500); Solidiom is font-semibold (600). Deliberate one-step-bold.",
    },
    {
      signal: "tokens.Root.border-width",
      reason:
        "shadcn kbd is borderless (0px, bg-muted fill); Solidiom kbd has a 1px bottom border (key-cap model). Structural: Solidiom kbd renders a keycap; shadcn a flat chip.",
    },
    {
      signal: "tokens.Root.box-shadow",
      reason:
        "shadcn kbd has no shadow; Solidiom kbd has a 1px keycap shadow. Follows the accepted border/keycap model divergence.",
    },
    {
      signal: "pixels.light.default",
      reason:
        "Pixel crop differs by the accepted keycap-vs-chip model (border+shadow vs flat muted fill).",
    },
    {
      signal: "pixels.dark.default",
      reason: "Dark-theme pixel delta from the keycap model divergence.",
    },
  ],
} as import("../lib/types").MappingEntry
const REF_BASE = "http://127.0.0.1:4333"
const SOL_BASE = "http://127.0.0.1:4322"

test("kbd - shadcn parity", async ({ browser }) => {
  const refCtx = await browser.newContext()
  const solCtx = await browser.newContext()
  const refPage: Page = await refCtx.newPage()
  const solPage: Page = await solCtx.newPage()
  await refPage.goto(REF_BASE + "/" + ENTRY.shadcn.ref, { waitUntil: "networkidle" })
  await solPage.goto(SOL_BASE + "/components/kbd/examples/", { waitUntil: "networkidle" })
  const report = await verifyEntry(ENTRY, refPage, solPage, "../../artifacts/shadcn-parity")
  const path = await writeReport(ENTRY, report, "../../artifacts/shadcn-parity")
  // A gap fails the test; accepted/parity pass.
  expect(report.failures, "unresolved gaps in " + ENTRY.id + " (see " + path + ")").toBe(0)
  await refCtx.close()
  await solCtx.close()
})
