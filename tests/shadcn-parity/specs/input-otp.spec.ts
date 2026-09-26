import { test, expect, type Page } from "@playwright/test"
import { verifyEntry } from "../lib/verify"
import { writeReport } from "../lib/report"

const ENTRY = {
  id: "input-otp",
  shadcn: {
    ref: "input-otp",
  },
  solidiom: {
    package: "@solidiom/input-otp",
    siteSlug: "input-otp",
    sitePath: "/components/input-otp/examples",
  },
  status: "mapped",
  parts: ["Slot"],
  selectors: {
    Slot: {
      ref: "div.border-y.border-r.border-input:first-of-type",
      sol: ".input-otp-example [data-scope='input-otp'][data-part='slot']",
    },
  },
  tokens: {
    Slot: {
      "background-color": "rgba(0, 0, 0, 0)",
      height: "36px",
      "border-width": "1px",
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
      signal: "tokens.Slot.background-color",
      reason:
        "shadcn OTP slot is border-input (transparent bg with a 1px ring); Solidiom OTP slot is a light-gray fill (rgb(248, 250, 252)). Deliberate 'filled' slot style.",
    },
    {
      signal: "tokens.Slot.border-radius",
      reason:
        "STRUCTURAL: shadcn groups OTP slots into a segmented pill (only the outermost corners rounded: 6px on the group ends, 0 on the inner joins); Solidiom renders each slot as an individual fully-rounded box (8px on all four corners). No single per-slot radius token can express parity — documented so the report records it. A true fix changes Solidiom's slot grouping model (later batch).",
    },
    {
      signal: "tokens.Slot.height",
      reason:
        "shadcn OTP slot is 36px (h-9); Solidiom slot is 40px. A real size gap Task 8 should weigh, alongside the structural radius note.",
    },
  ],
} as import("../lib/types").MappingEntry
const REF_BASE = "http://127.0.0.1:4333"
const SOL_BASE = "http://127.0.0.1:4322"

test("input-otp - shadcn parity", async ({ browser }) => {
  const refCtx = await browser.newContext()
  const solCtx = await browser.newContext()
  const refPage: Page = await refCtx.newPage()
  const solPage: Page = await solCtx.newPage()
  await refPage.goto(REF_BASE + "/" + ENTRY.shadcn.ref, { waitUntil: "networkidle" })
  await solPage.goto(SOL_BASE + "/components/input-otp/examples/", { waitUntil: "networkidle" })
  const report = await verifyEntry(ENTRY, refPage, solPage, "../../artifacts/shadcn-parity")
  const path = await writeReport(ENTRY, report, "../../artifacts/shadcn-parity")
  // A gap fails the test; accepted/parity pass.
  expect(report.failures, "unresolved gaps in " + ENTRY.id + " (see " + path + ")").toBe(0)
  await refCtx.close()
  await solCtx.close()
})
