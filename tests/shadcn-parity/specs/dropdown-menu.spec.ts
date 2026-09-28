import { test, expect, type Page } from "@playwright/test"
import { verifyEntry } from "../lib/verify"
import { writeReport } from "../lib/report"

const ENTRY = {
  id: "dropdown-menu",
  shadcn: {
    ref: "dropdown-menu",
  },
  solidiom: {
    package: "@solidiom/menu",
    siteSlug: "menu",
    sitePath: "/components/menu/examples",
  },
  status: "mapped",
  parts: ["Trigger", "Content", "Item"],
  selectors: {
    Trigger: {
      ref: "button[data-state]",
      sol: '.menu-example [data-scope="menu"][data-part="trigger"]',
    },
    Content: {
      ref: "[role='menu'][data-state]",
      sol: '[data-scope="menu"][data-part="content"]',
    },
    Item: {
      ref: "[role='menuitem']",
      sol: '.menu-example [data-scope="menu"][data-part="item"]',
    },
  },
  tokens: {
    Content: {
      "background-color": "rgb(255, 255, 255)",
      "border-radius": "6px",
      "border-width": "1px",
      "min-width": "128px",
      padding: "4px",
    },
    Item: {
      "background-color": "rgba(0, 0, 0, 0)",
      "border-radius": "4px",
      height: "32px",
      "font-size": "14px",
      padding: "6px 8px",
    },
  },
  interactions: ["open", "close-esc", "close-overlay-click"],
  states: ["default", "open", "close-esc"],
  themes: ["light", "dark"],
  tolerance: {
    pixelMaxDiff: 2,
    pixelMaxPercent: 1,
  },
  acceptedDivergences: [
    {
      signal: "tokens.Content.background-color",
      reason:
        "shadcn dropdown-menu content is bg-popover (white light / near-black dark); Solidiom menu content is a filled-light surface (rgb(248, 250, 252) / rgb(15, 23, 42)). Consistent with the filled-light palette decision.",
    },
    {
      signal: "tokens.Content.min-width",
      reason:
        "shadcn dropdown content is min-w-[8rem] (128px); Solidiom menu content is 160px (island-sized). Structural: Solidiom menu items are wider rows (41px vs 32px). Real size delta recorded for the fix pass; not a Batch-2 look change.",
    },
    {
      signal: "tokens.Item.height",
      reason:
        "shadcn menu item is 32px; Solidiom menu item is ~41px. Real size delta, alongside the min-width note.",
    },
  ],
} as import("../lib/types").MappingEntry
const REF_BASE = "http://127.0.0.1:4333"
const SOL_BASE = "http://127.0.0.1:4322"

test("dropdown-menu - shadcn parity", async ({ browser }) => {
  const refCtx = await browser.newContext()
  const solCtx = await browser.newContext()
  const refPage: Page = await refCtx.newPage()
  const solPage: Page = await solCtx.newPage()
  await refPage.goto(REF_BASE + "/" + ENTRY.shadcn.ref, { waitUntil: "networkidle" })
  await solPage.goto(SOL_BASE + "/components/menu/examples/", { waitUntil: "networkidle" })
  const report = await verifyEntry(ENTRY, refPage, solPage, "../../artifacts/shadcn-parity")
  const path = await writeReport(ENTRY, report, "../../artifacts/shadcn-parity")
  // A gap fails the test; accepted/parity pass.
  expect(report.failures, "unresolved gaps in " + ENTRY.id + " (see " + path + ")").toBe(0)
  await refCtx.close()
  await solCtx.close()
})
