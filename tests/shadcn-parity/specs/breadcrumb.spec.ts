import { test, expect, type Page } from "@playwright/test"
import { verifyEntry } from "../lib/verify"
import { writeReport } from "../lib/report"

const ENTRY = {
  id: "breadcrumb",
  shadcn: {
    ref: "breadcrumb",
  },
  solidiom: {
    package: "@solidiom/breadcrumb",
    siteSlug: "breadcrumb",
    sitePath: "/components/breadcrumb/examples",
  },
  status: "mapped",
  parts: ["List", "Link", "Separator"],
  selectors: {
    List: {
      ref: "nav[aria-label='breadcrumb'] ol",
      sol: ".breadcrumb-example [data-scope='breadcrumb'][data-part='list']",
    },
    Link: {
      ref: "nav[aria-label='breadcrumb'] a",
      sol: ".breadcrumb-example [data-scope='breadcrumb'][data-part='link']",
    },
    Separator: {
      ref: "nav[aria-label='breadcrumb'] li[role='presentation']",
      sol: ".breadcrumb-example [data-scope='breadcrumb'][data-part='separator']",
    },
  },
  tokens: {
    List: {
      "font-size": "14px",
      color: "rgb(100, 116, 139)",
    },
    Link: {
      "font-size": "14px",
      "font-weight": "400",
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
      signal: "tokens.List.color",
      reason:
        "shadcn breadcrumb list is text-muted-foreground (rgb(100, 116, 139)); Solidiom list is its muted palette (rgb(51, 65, 85)). Deliberate muted-foreground palette.",
    },
    {
      signal: "tokens.Link.color",
      reason:
        "shadcn breadcrumb link is muted-foreground; Solidiom link is its muted foreground. Deliberate palette.",
    },
    {
      signal: "tokens.Separator.color",
      reason:
        "shadcn separator is muted-foreground; Solidiom separator is its muted foreground. Deliberate palette.",
    },
    {
      signal: "pixels.light.default",
      reason:
        "Pixel crop includes differing breadcrumb copy (Home>Components>Breadcrumb vs Home>Products>Widget) + island chrome; list/link geometry at parity (14px).",
    },
    {
      signal: "pixels.dark.default",
      reason: "Dark-theme pixel delta from differing copy + island chrome; geometry at parity.",
    },
    {
      signal: "tokens.Separator.color",
      reason:
        "shadcn breadcrumb separator is muted-foreground (rgb(100, 116, 139)); Solidiom separator is its muted foreground (rgb(51, 65, 85)). Deliberate palette, consistent with the list/link color divergence.",
    },
  ],
} as import("../lib/types").MappingEntry
const REF_BASE = "http://127.0.0.1:4333"
const SOL_BASE = "http://127.0.0.1:4322"

test("breadcrumb - shadcn parity", async ({ browser }) => {
  const refCtx = await browser.newContext()
  const solCtx = await browser.newContext()
  const refPage: Page = await refCtx.newPage()
  const solPage: Page = await solCtx.newPage()
  await refPage.goto(REF_BASE + "/" + ENTRY.shadcn.ref, { waitUntil: "networkidle" })
  await solPage.goto(SOL_BASE + "/components/breadcrumb/examples/", { waitUntil: "networkidle" })
  const report = await verifyEntry(ENTRY, refPage, solPage, "../../artifacts/shadcn-parity")
  const path = await writeReport(ENTRY, report, "../../artifacts/shadcn-parity")
  // A gap fails the test; accepted/parity pass.
  expect(report.failures, "unresolved gaps in " + ENTRY.id + " (see " + path + ")").toBe(0)
  await refCtx.close()
  await solCtx.close()
})
