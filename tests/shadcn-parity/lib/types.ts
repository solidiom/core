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
