import { mkdir, writeFile } from "node:fs/promises"
import { join } from "node:path"
import type { MappingEntry, SignalVerdict, VerdictReport } from "./types"
import { copyAssets } from "./verify"

const GLYPH: Record<SignalVerdict, string> = { parity: "✅", accepted: "🟡", gap: "❌" }

/**
 * Render the findings markdown for one component (spec §3 Step 5 contract).
 * Row format is exactly `| <signal> | <expected> | <actual> | <glyph> <suffix> |`
 * where suffix is `accepted` for the accepted verdict and empty for parity/gap.
 */
export function renderFindings(r: VerdictReport): string {
  const lines: string[] = []
  lines.push(`# ${r.id} — shadcn parity`)
  lines.push(`Reference: shadcn@${r.shadcnVersion}, solidiom @ ${r.solidiomSha}`)
  lines.push(
    `Status: ${r.failures > 0 ? "❌" : "✅"} ${r.failures} failures, ${r.accepted} accepted divergence${
      r.accepted === 1 ? "" : "s"
    }`,
  )
  lines.push("")
  lines.push("| Signal | Expected (shadcn) | Actual (solidiom) | Verdict |")
  lines.push("|---|---|---|---|")
  for (const s of r.signals) {
    const suffix = s.verdict === "accepted" ? "accepted" : ""
    const cell = `${GLYPH[s.verdict]}${suffix ? ` ${suffix}` : ""}`
    lines.push(`| ${s.signal} | ${s.expected} | ${s.actual} | ${cell} |`)
  }
  lines.push("")
  lines.push("[side-by-side PNGs + delta heatmaps: see assets/]")
  return lines.join("\n")
}

/**
 * Write `<outDir>/<id>.md` (creating `outDir` if missing), copy the component's
 * PNG assets next to it, and return the md path.
 */
export async function writeReport(
  entry: MappingEntry,
  report: VerdictReport,
  outDir: string,
): Promise<string> {
  await mkdir(outDir, { recursive: true })
  const path = join(outDir, `${entry.id}.md`)
  await writeFile(path, renderFindings(report) + "\n", "utf8")
  await copyAssets(join(outDir, entry.id), outDir)
  return path
}
