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
      signal: "tokens.Trigger.font-weight",
      reason:
        "shadcn accordion trigger is font-medium (500); Solidiom is font-semibold (600). Deliberate one-step-bold, consistent with the label/field/tabs weight decisions.",
    },
    {
      signal: "behavior.open",
      reason:
        "Open-state focus: clicking the trigger opens the item on both frames; shadcn (Radix) keeps focus on the trigger button (focus=Trigger) while Solidiom also focuses the trigger (focus=Trigger) — the canonical part name resolves the same; the open Content presence/absence (Radix keeps the closed region mounted vs Solidiom unmounts) is the only snapshot delta. Recorded.",
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
