export type SignalVerdict = "parity" | "accepted" | "gap"

export interface MappingEntry {
  id: string
  shadcn: { ref: string }
  solidiom: {
    package: string
    siteSlug: string
    sitePath: string
  }
  status: "mapped" | "gap" | "na"
  gapReason?: string
  parts: string[]
  tokens: Record<string, Record<string, string>>
  interactions: string[]
  states: string[]
  themes: ("light" | "dark")[]
  tolerance: { pixelMaxDiff: number; pixelMaxPercent: number }
  acceptedDivergences: { signal: string; reason: string }[]
  /**
   * Per-part, per-frame real selectors discovered in Phase A. Without this the
   * engine falls back to the generic `partSelector(part)` (which degrades to
   * `<body>` for parts whose name has no recognizable element), so the captured
   * tokens/behavior/pixels describe the whole page instead of the component.
   *
   * A string value is used verbatim on BOTH frames. An object value lets the
   * reference (shadcn) frame and the solidiom frame use different attribute
   * schemes: `ref` is the selector on the shadcn frame, `sol` on the solidiom
   * frame. shadcn components carry no `data-part`, while solidiom recipes render
   * `data-scope`/`data-part`, so per-frame overrides are the common case.
   */
  selectors?: Record<string, string | { ref: string; sol: string }>
}

export interface SignalResult {
  signal: string
  expected: string
  actual: string
  verdict: SignalVerdict
}

export interface VerdictReport {
  id: string
  shadcnVersion: string
  solidiomSha: string
  signals: SignalResult[]
  failures: number
  accepted: number
}
