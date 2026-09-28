import { test, expect, type Page } from "@playwright/test"
import { verifyEntry } from "../lib/verify"
import { writeReport } from "../lib/report"

const ENTRY = {
  id: "context-menu",
  shadcn: {
    ref: "context-menu",
  },
  solidiom: {
    package: "@solidiom/context-menu",
    siteSlug: "context-menu",
    sitePath: "/components/context-menu/examples",
  },
  status: "mapped",
  parts: ["Trigger", "Content", "Item"],
  selectors: {
    Trigger: {
      ref: "[data-state]",
      sol: '.context-menu-example [data-scope="context-menu"][data-part="trigger"]',
    },
    Content: {
      ref: "[role='menu'][data-state]",
      sol: '[data-scope="context-menu"][data-part="content"]',
    },
    Item: {
      ref: "[role='menuitem']",
      sol: '.context-menu-example [data-scope="context-menu"][data-part="item"]',
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
  interactions: ["right-click", "close-esc", "close-overlay-click"],
  states: ["default", "right-click", "close-esc"],
  themes: ["light", "dark"],
  tolerance: {
    pixelMaxDiff: 2,
    pixelMaxPercent: 1,
  },
  acceptedDivergences: [
    {
      signal: "tokens.Content.background-color",
      reason:
        "shadcn context-menu content is bg-popover (white light / near-black dark); Solidiom context-menu content is a filled-light surface (rgb(248, 250, 252) / rgb(15, 23, 42)). Consistent with the filled-light palette decision.",
    },
    {
      signal: "tokens.Content.min-width",
      reason:
        "shadcn context-menu content is min-w-[8rem] (128px); Solidiom context-menu content is 192px. Structural: Solidiom items are taller (28-35px vs 32px) and the island includes checkbox/radio rows the shadcn reference does not. Real size delta recorded for the fix pass.",
    },
    {
      signal: "behavior.close-esc",
      reason:
        "Focus-on-open: shadcn (Radix ContextMenu) moves focus into the menu content; Solidiom context-menu opens without moving focus (activeElement stays on main). Esc-close parity holds (both close; content unmounts on the sol side). Focus-return differs (shadcn returns to body — Radix ContextMenu has no persistent trigger — vs sol stays on main). Recorded so the canonical mismatch reads as known.",
    },
    {
      signal: "behavior.right-click",
      reason:
        "Open-state focus: the Radix reference keeps focus on the trigger element (focus=Trigger — Radix ContextMenu focuses the trigger, not the menu), while Solidiom leaves focus on <main> (focus=-). Both frames open the menu and Esc closes it (content unmounts on solid). The focus-on-open difference is Radix vs Solidiom context-menu focus models; recorded.",
    },
  ],
} as import("../lib/types").MappingEntry
const REF_BASE = "http://127.0.0.1:4333"
const SOL_BASE = "http://127.0.0.1:4322"

test("context-menu - shadcn parity", async ({ browser }) => {
  const refCtx = await browser.newContext()
  const solCtx = await browser.newContext()
  const refPage: Page = await refCtx.newPage()
  const solPage: Page = await solCtx.newPage()
  await refPage.goto(REF_BASE + "/" + ENTRY.shadcn.ref, { waitUntil: "networkidle" })
  await solPage.goto(SOL_BASE + "/components/context-menu/examples/", { waitUntil: "networkidle" })
  const report = await verifyEntry(ENTRY, refPage, solPage, "../../artifacts/shadcn-parity")
  const path = await writeReport(ENTRY, report, "../../artifacts/shadcn-parity")
  // A gap fails the test; accepted/parity pass.
  expect(report.failures, "unresolved gaps in " + ENTRY.id + " (see " + path + ")").toBe(0)
  await refCtx.close()
  await solCtx.close()
})
