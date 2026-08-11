/** Build-time helper to read bench baseline reports. */

import { existsSync, readFileSync } from "node:fs"
import { resolve } from "node:path"

// Site commands run from apps/site; resolve workspace root from there.
const workspaceCandidate = resolve(process.cwd(), "../..")
const WORKSPACE_ROOT = existsSync(resolve(workspaceCandidate, "packages/bench"))
  ? workspaceCandidate
  : process.cwd()

const BASELINE_PATH = resolve(WORKSPACE_ROOT, "packages/bench", "baselines", "initial.json")

export interface BenchBaseline {
  version: number
  generatedAt: string
  throughput: ThroughputResult[]
  bundle: BundleSizeResult[]
  interaction: InteractionResult[]
}

export interface ThroughputResult {
  name: string
  opsPerSecond: number
  avgNs: number
  samples: number
  timestamp: string
}

export interface BundleSizeResult {
  name: string
  sizeBytes: number
  gzipBytes: number
  limitBytes: number
  passed: boolean
  timestamp: string
}

export interface InteractionResult {
  name: string
  metrics: Record<string, number>
  tracePath?: string
  timestamp: string
}

export function getBenchBaseline(): BenchBaseline | undefined {
  if (!existsSync(BASELINE_PATH)) return undefined
  const raw = JSON.parse(readFileSync(BASELINE_PATH, "utf8")) as unknown
  if (!raw || typeof raw !== "object") return undefined
  const baseline = raw as Partial<BenchBaseline>
  if (
    typeof baseline.version !== "number" ||
    typeof baseline.generatedAt !== "string" ||
    !Array.isArray(baseline.throughput) ||
    !Array.isArray(baseline.bundle) ||
    !Array.isArray(baseline.interaction)
  ) {
    return undefined
  }
  return baseline as BenchBaseline
}
