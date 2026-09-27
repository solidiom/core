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
      "background-color": "rgb(255, 255, 255)",
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
        "shadcn TabsList is bg-muted (rgb(241, 245, 249), a gray track); Solidiom tabs list is transparent with an active-underline (border-bottom) tab indicator instead. Deliberate: Solidiom tabs use an underline-active model, shadcn a segmented-track model. Structural + palette.",
    },
    {
      signal: "tokens.Trigger.background-color",
      reason:
        "shadcn active tab is bg-background (white, sitting on the muted track); Solidiom active tab is transparent (underline model). Follows the accepted list/track model divergence.",
    },
    {
      signal: "tokens.Trigger.border-radius",
      reason:
        "shadcn tab is rounded-md (6px) pill on the segmented track; Solidiom tab is square (0px) under the underline model. Follows the accepted tab-list model divergence.",
    },
    {
      signal: "tokens.Trigger.font-weight",
      reason:
        "shadcn tab is font-medium (500); Solidiom tab is font-semibold (600). Deliberate one-step-bold, consistent with the label/field weight decisions.",
    },
    {
      signal: "behavior.click-tab-2",
      reason:
        "Open-state focus: clicking the 2nd tab activates it on both frames, but shadcn (Radix Tabs) moves focus onto the tab button (focus=Trigger) while Solidiom leaves focus on the body/root after the click. Tab-activation parity holds; the focus-capture model differs. Recorded.",
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
