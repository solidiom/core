import { test, expect, type Page } from "@playwright/test"
import { verifyEntry } from "../lib/verify"
import { writeReport } from "../lib/report"

const ENTRY = {
  id: "avatar",
  shadcn: {
    ref: "avatar",
  },
  solidiom: {
    package: "@solidiom/avatar",
    siteSlug: "avatar",
    sitePath: "/components/avatar/examples",
  },
  status: "mapped",
  parts: ["Root", "Fallback"],
  selectors: {
    Root: {
      ref: "span.relative.flex.h-10",
      sol: ".avatar-example [data-scope='avatar'][data-part='root']",
    },
    Fallback: {
      ref: "span.bg-muted",
      sol: ".avatar-example [data-scope='avatar'][data-part='fallback']",
    },
  },
  tokens: {
    Root: {
      "border-radius": "9999px",
      height: "40px",
      width: "40px",
    },
    Fallback: {
      "background-color": "rgb(241, 245, 249)",
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
      signal: "tokens.Root.border-radius",
      reason:
        "FORM: shadcn avatar is rounded-full (9999px); Solidiom is 50%. Both render a circle; non-visual CSS-form difference.",
    },
    {
      signal: "tokens.Fallback.background-color",
      reason:
        "shadcn avatar fallback is bg-muted (rgb(241, 245, 249)); Solidiom fallback is a light-gray fill (rgb(248, 250, 252)). Deliberate filled-light vs muted palette.",
    },
    {
      signal: "tokens.Fallback.color",
      reason:
        "shadcn fallback text is foreground (rgb(2, 8, 23)); Solidiom is its muted foreground (rgb(51, 65, 85)). Deliberate palette.",
    },
    {
      signal: "tokens.Fallback.font-weight",
      reason:
        "shadcn fallback is inherited weight (400); Solidiom fallback is font-semibold (600). Deliberate one-step-bold.",
    },
    {
      signal: "tokens.Fallback.border-width",
      reason:
        "shadcn fallback has no border (0px); Solidiom fallback carries the root's 2px border (rgb(203, 213, 225)). Structural: Solidiom avatar root has a 2px ring; shadcn does not.",
    },
    {
      signal: "pixels.light.default",
      reason:
        "Pixel crop includes differing avatar images/initials (ref loads github avatars; sol uses JD initials); geometry at parity.",
    },
    {
      signal: "pixels.dark.default",
      reason: "Dark-theme pixel delta from differing avatar content.",
    },
  ],
} as import("../lib/types").MappingEntry
const REF_BASE = "http://127.0.0.1:4333"
const SOL_BASE = "http://127.0.0.1:4322"

test("avatar - shadcn parity", async ({ browser }) => {
  const refCtx = await browser.newContext()
  const solCtx = await browser.newContext()
  const refPage: Page = await refCtx.newPage()
  const solPage: Page = await solCtx.newPage()
  await refPage.goto(REF_BASE + "/" + ENTRY.shadcn.ref, { waitUntil: "networkidle" })
  await solPage.goto(SOL_BASE + "/components/avatar/examples/", { waitUntil: "networkidle" })
  const report = await verifyEntry(ENTRY, refPage, solPage, "../../artifacts/shadcn-parity")
  const path = await writeReport(ENTRY, report, "../../artifacts/shadcn-parity")
  // A gap fails the test; accepted/parity pass.
  expect(report.failures, "unresolved gaps in " + ENTRY.id + " (see " + path + ")").toBe(0)
  await refCtx.close()
  await solCtx.close()
})
