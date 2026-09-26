import { test, expect, type Page } from "@playwright/test"
import { verifyEntry } from "../lib/verify"
import { writeReport } from "../lib/report"

const ENTRY = {
  id: "dialog",
  shadcn: {
    ref: "dialog",
  },
  solidiom: {
    package: "@solidiom/dialog",
    siteSlug: "dialog",
    sitePath: "/components/dialog/examples",
  },
  status: "mapped",
  parts: ["Trigger", "Content", "Backdrop"],
  selectors: {
    Trigger: {
      ref: "button[data-state]",
      sol: '.dialog-example [data-scope="dialog"][data-part="trigger"]',
    },
    Content: {
      ref: "[role='dialog'][data-state]",
      sol: '[data-scope="dialog"][data-part="content"]',
    },
    Backdrop: {
      ref: "div.fixed.inset-0[data-state]",
      sol: '[data-scope="dialog"][data-part="backdrop"]',
    },
  },
  tokens: {
    Content: {
      "background-color": "rgb(255, 255, 255)",
      "border-radius": "8px",
      "border-width": "1px",
      padding: "24px",
      width: "512px",
    },
    Backdrop: {
      "background-color": "rgba(0, 0, 0, 0.8)",
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
      signal: "tokens.Content.border-radius",
      reason:
        "shadcn dialog content is sm:rounded-lg (8px); Solidiom dialog content is 12px. Deliberate larger-radius modal surface (Solidiom card radius token); recorded, not a Batch-2 look fix.",
    },
    {
      signal: "tokens.Content.padding",
      reason:
        "shadcn dialog content is p-6 (24px); Solidiom dialog content pads 24px horizontally but 32px vertically (content-box h=226 vs 146). Deliberate roomier modal; recorded.",
    },
    {
      signal: "tokens.Content.background-color",
      reason:
        "dark theme: shadcn content is bg-background (rgb(2, 8, 23) near-black); Solidiom content is rgb(30, 41, 59) (slate-800 surface). Different dark surface palettes, consistent with the Batch-1 filled-light vs outline palette decisions.",
    },
    {
      signal: "tokens.Backdrop.background-color",
      reason:
        "shadcn dialog overlay is bg-black/80 (rgba(0, 0, 0, 0.8)); Solidiom backdrop is a 55% surface tint (light: color(srgb 0.07 0.09 0.15 / 0.55), dark: a 55% light tint). Deliberate softer tinted backdrop; recorded as a known overlay divergence.",
    },
    {
      signal: "behavior.close-esc",
      reason:
        "Open-state focus: shadcn (Radix) focuses the content on open (activeElement inside [role=dialog]); Solidiom focuses its first Close button. Both frames trap focus inside the overlay, so the underlying behavior (focus-in-overlay) is equal; the canonical part name differs. Esc-close + focus-return-to-Trigger parity holds on both frames.",
    },
  ],
} as import("../lib/types").MappingEntry
const REF_BASE = "http://127.0.0.1:4333"
const SOL_BASE = "http://127.0.0.1:4322"

test("dialog - shadcn parity", async ({ browser }) => {
  const refCtx = await browser.newContext()
  const solCtx = await browser.newContext()
  const refPage: Page = await refCtx.newPage()
  const solPage: Page = await solCtx.newPage()
  await refPage.goto(REF_BASE + "/" + ENTRY.shadcn.ref, { waitUntil: "networkidle" })
  await solPage.goto(SOL_BASE + "/components/dialog/examples/", { waitUntil: "networkidle" })
  const report = await verifyEntry(ENTRY, refPage, solPage, "../../artifacts/shadcn-parity")
  const path = await writeReport(ENTRY, report, "../../artifacts/shadcn-parity")
  // A gap fails the test; accepted/parity pass.
  expect(report.failures, "unresolved gaps in " + ENTRY.id + " (see " + path + ")").toBe(0)
  await refCtx.close()
  await solCtx.close()
})
