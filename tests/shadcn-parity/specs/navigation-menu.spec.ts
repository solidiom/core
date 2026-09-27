import { test, expect, type Page } from "@playwright/test"
import { verifyEntry } from "../lib/verify"
import { writeReport } from "../lib/report"

const ENTRY = {
  id: "navigation-menu",
  shadcn: {
    ref: "navigation-menu",
  },
  solidiom: {
    package: "@solidiom/navigation-menu",
    siteSlug: "navigation-menu",
    sitePath: "/components/navigation-menu/examples",
  },
  status: "mapped",
  parts: ["Trigger", "List"],
  selectors: {
    Trigger: {
      ref: "button[data-state][data-radix-collection-item]",
      sol: ".navigation-menu-example [data-scope='navigation-menu'][data-part='trigger']",
    },
    List: {
      ref: "ul",
      sol: ".navigation-menu-example [data-scope='navigation-menu'][data-part='list']",
    },
  },
  tokens: {
    Trigger: {
      "border-radius": "6px",
      "font-size": "14px",
      "font-weight": "500",
      height: "36px",
      padding: "8px 16px",
    },
    List: {
      "font-size": "16px",
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
      signal: "tokens.Trigger.background-color",
      reason:
        "shadcn navigation-menu trigger is bg-background (white); Solidiom trigger is transparent. Deliberate filled vs transparent nav trigger.",
    },
    {
      signal: "tokens.Trigger.font-weight",
      reason:
        "shadcn trigger is font-medium (500); Solidiom is font-semibold (600). Deliberate one-step-bold.",
    },
    {
      signal: "behavior.open",
      reason:
        "The shadcn reference opens a floating NavigationMenuContent viewport on trigger click; the Solidiom navigation-menu island does not render a content/viewport part in its example (the live island exposes only root/list/item/trigger). The open-state snapshot therefore cannot be compared — recorded as a structural island difference, not a fixable look gap. Parts limited to Trigger+List (both present on both frames).",
    },
  ],
} as import("../lib/types").MappingEntry
const REF_BASE = "http://127.0.0.1:4333"
const SOL_BASE = "http://127.0.0.1:4322"

test("navigation-menu - shadcn parity", async ({ browser }) => {
  const refCtx = await browser.newContext()
  const solCtx = await browser.newContext()
  const refPage: Page = await refCtx.newPage()
  const solPage: Page = await solCtx.newPage()
  await refPage.goto(REF_BASE + "/" + ENTRY.shadcn.ref, { waitUntil: "networkidle" })
  await solPage.goto(SOL_BASE + "/components/navigation-menu/examples/", {
    waitUntil: "networkidle",
  })
  const report = await verifyEntry(ENTRY, refPage, solPage, "../../artifacts/shadcn-parity")
  const path = await writeReport(ENTRY, report, "../../artifacts/shadcn-parity")
  // A gap fails the test; accepted/parity pass.
  expect(report.failures, "unresolved gaps in " + ENTRY.id + " (see " + path + ")").toBe(0)
  await refCtx.close()
  await solCtx.close()
})
