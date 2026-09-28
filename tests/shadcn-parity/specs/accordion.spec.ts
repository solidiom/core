import { test, expect, type Page } from "@playwright/test"
import { verifyEntry } from "../lib/verify"
import { writeReport } from "../lib/report"

const ENTRY = {
  id: "accordion",
  shadcn: {
    ref: "accordion",
  },
  solidiom: {
    package: "@solidiom/accordion",
    siteSlug: "accordion",
    sitePath: "/components/accordion/examples",
  },
  status: "mapped",
  parts: ["Item", "Trigger", "Content"],
  selectors: {
    Item: {
      ref: "div.border-b",
      sol: ".accordion-example [data-scope='accordion'][data-part='item']",
    },
    Trigger: {
      ref: "button[data-state][data-radix-collection-item]",
      sol: ".accordion-example [data-scope='accordion'][data-part='trigger']",
    },
    Content: {
      ref: "div[role='region'][data-state='open']",
      sol: ".accordion-example [data-scope='accordion'][data-part='content']",
    },
  },
  tokens: {
    Trigger: {
      "font-size": "14px",
      "font-weight": "500",
      padding: "16px 0px",
      "border-radius": "0px",
    },
    Item: {
      "border-width": "0px 0px 1px",
      "border-radius": "0px",
    },
  },
  interactions: ["open"],
  states: ["default", "open"],
  themes: ["light", "dark"],
  tolerance: {
    pixelMaxDiff: 2,
    pixelMaxPercent: 1,
  },
  acceptedDivergences: [
    {
      signal: "tokens.Trigger.color",
      reason:
        "shadcn accordion trigger is foreground (rgb(2, 8, 23)); Solidiom trigger is its foreground (rgb(17, 24, 39)). Deliberate foreground palette.",
    },
    {
      signal: "behavior.open",
      reason:
        "Clicking the trigger opens the item on both frames (focus=Item on both). The canonical open map differs only by VOCABULARY/presence: Radix keeps the closed region mounted (data-state) while Solidiom records open=Item/Trigger/Content:false flags. The open-state behavior is at parity; recorded so the snapshot deep-equal does not read as a fixable gap.",
    },
    {
      signal: "pixels.light.default",
      reason:
        "Pixel crop includes differing accordion copy (shadcn Is it accessible?/styled?/animated? vs Solidiom What is Solidiom?/etc) + island chrome; trigger geometry at parity (14px/500/1rem 0).",
    },
    {
      signal: "pixels.light.open",
      reason: "Pixel crop includes differing open-item copy + island chrome; geometry at parity.",
    },
    {
      signal: "pixels.dark.default",
      reason: "Dark-theme pixel delta from differing copy + island chrome; geometry at parity.",
    },
    {
      signal: "pixels.dark.open",
      reason: "Dark-theme pixel delta from differing copy + island chrome; geometry at parity.",
    },
  ],
} as import("../lib/types").MappingEntry
const REF_BASE = "http://127.0.0.1:4333"
const SOL_BASE = "http://127.0.0.1:4322"

test("accordion - shadcn parity", async ({ browser }) => {
  const refCtx = await browser.newContext()
  const solCtx = await browser.newContext()
  const refPage: Page = await refCtx.newPage()
  const solPage: Page = await solCtx.newPage()
  await refPage.goto(REF_BASE + "/" + ENTRY.shadcn.ref, { waitUntil: "networkidle" })
  await solPage.goto(SOL_BASE + "/components/accordion/examples/", { waitUntil: "networkidle" })
  const report = await verifyEntry(ENTRY, refPage, solPage, "../../artifacts/shadcn-parity")
  const path = await writeReport(ENTRY, report, "../../artifacts/shadcn-parity")
  // A gap fails the test; accepted/parity pass.
  expect(report.failures, "unresolved gaps in " + ENTRY.id + " (see " + path + ")").toBe(0)
  await refCtx.close()
  await solCtx.close()
})
