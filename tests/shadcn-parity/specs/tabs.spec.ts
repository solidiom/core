import { test, expect, type Page } from "@playwright/test"
import { verifyEntry } from "../lib/verify"
import { writeReport } from "../lib/report"

const ENTRY = {
  id: "tabs",
  shadcn: {
    ref: "tabs",
  },
  solidiom: {
    package: "@solidiom/tabs",
    siteSlug: "tabs",
    sitePath: "/components/tabs/examples",
  },
  status: "mapped",
  parts: ["List", "Trigger", "Content"],
  selectors: {
    List: {
      ref: "[role='tablist']",
      sol: ".tabs-example [data-scope='tabs'][data-part='list']",
    },
    Trigger: {
      ref: "[role='tab']:first-of-type",
      sol: ".tabs-example [data-scope='tabs'][data-part='trigger']",
    },
    Content: {
      ref: "[role='tabpanel'][data-state='active']",
      sol: ".tabs-example [data-scope='tabs'][data-part='content']",
    },
  },
  tokens: {
    List: {
      "background-color": "rgb(241, 245, 249)",
      "border-radius": "8px",
      padding: "4px",
    },
    Trigger: {
      "border-radius": "6px",
      "font-weight": "500",
      height: "28px",
      padding: "4px 12px",
    },
  },
  interactions: ["click-tab-2"],
  states: ["default", "click-tab-2"],
  themes: ["light", "dark"],
  tolerance: {
    pixelMaxDiff: 2,
    pixelMaxPercent: 1,
  },
  acceptedDivergences: [
    {
      signal: "tokens.List.background-color",
      reason:
        "shadcn TabsList is bg-muted (rgb(241, 245, 249), a gray segmented track); Solidiom island list uses its surface-muted palette (a light gray fill). Same model (segmented track), different muted palette.",
    },
    {
      signal: "tokens.Trigger.background-color",
      reason:
        "shadcn active tab is bg-background (white on the muted track); Solidiom active tab is its surface-raised/background fill. Same model, palette difference. Inactive tabs are transparent on both frames.",
    },
    {
      signal: "behavior.click-tab-2",
      reason:
        "Clicking the 2nd tab activates it on both frames (the canonical open/focus map matches: focus=List on both); recorded so the per-state focus capture does not read as a gap.",
    },
    {
      signal: "pixels.light.default",
      reason:
        "Pixel crop includes differing tab labels (shadcn Account/Password/Team vs Solidiom General/Security/Notifications) + island chrome; geometry at parity.",
    },
    {
      signal: "pixels.light.click-tab-2",
      reason: "Pixel crop includes differing tab labels + island chrome; geometry at parity.",
    },
    {
      signal: "pixels.dark.default",
      reason: "Dark-theme pixel delta from differing labels + island chrome; geometry at parity.",
    },
    {
      signal: "pixels.dark.click-tab-2",
      reason: "Dark-theme pixel delta from differing labels + island chrome; geometry at parity.",
    },
  ],
} as import("../lib/types").MappingEntry
const REF_BASE = "http://127.0.0.1:4333"
const SOL_BASE = "http://127.0.0.1:4322"

test("tabs - shadcn parity", async ({ browser }) => {
  const refCtx = await browser.newContext()
  const solCtx = await browser.newContext()
  const refPage: Page = await refCtx.newPage()
  const solPage: Page = await solCtx.newPage()
  await refPage.goto(REF_BASE + "/" + ENTRY.shadcn.ref, { waitUntil: "networkidle" })
  await solPage.goto(SOL_BASE + "/components/tabs/examples/", { waitUntil: "networkidle" })
  const report = await verifyEntry(ENTRY, refPage, solPage, "../../artifacts/shadcn-parity")
  const path = await writeReport(ENTRY, report, "../../artifacts/shadcn-parity")
  // A gap fails the test; accepted/parity pass.
  expect(report.failures, "unresolved gaps in " + ENTRY.id + " (see " + path + ")").toBe(0)
  await refCtx.close()
  await solCtx.close()
})
