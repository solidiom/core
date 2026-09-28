import { describe, it, expect } from "vitest"
import { renderFindings } from "./report"
import type { VerdictReport } from "./types"

const report: VerdictReport = {
  id: "dialog",
  shadcnVersion: "neutral@1.x",
  solidiomSha: "abc1234",
  signals: [
    {
      signal: "tokens.Trigger.borderRadius",
      expected: "0.5rem",
      actual: "0.625rem",
      verdict: "accepted",
    },
    { signal: "behavior.close-esc", expected: "closed", actual: "still open", verdict: "gap" },
    { signal: "pixels.light.default", expected: "—", actual: "delta 3.1%", verdict: "gap" },
  ],
  failures: 2,
  accepted: 1,
}

describe("renderFindings", () => {
  it("emits the header with status counts and a per-signal table", () => {
    const md = renderFindings(report)
    expect(md).toContain("# dialog — shadcn parity")
    expect(md).toContain("Status: ❌ 2 failures, 1 accepted divergence")
    expect(md).toContain("| tokens.Trigger.borderRadius | 0.5rem | 0.625rem | 🟡 accepted |")
    expect(md).toContain("| behavior.close-esc | closed | still open | ❌ |")
    expect(md).toContain(report.shadcnVersion)
    expect(md).toContain(report.solidiomSha)
  })
})
