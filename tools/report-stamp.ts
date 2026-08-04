/**
 * tools/report-stamp — writes generated evidence reports without churning their
 * run-provenance stamps.
 *
 * Committed generated artifacts must be a pure function of their inputs. A
 * wall-clock timestamp or a HEAD-derived commit SHA breaks that: every run
 * rewrites the file even when nothing it reports on has changed, so the working
 * tree is dirtied by merely verifying, and any staleness check comparing
 * committed against freshly generated output reports a difference that no amount
 * of committing can resolve. A HEAD-derived value is worse still, because
 * committing the file moves HEAD and so changes what the next run would write.
 *
 * That is the defect that made BUILD-001 unsatisfiable for the registry. The same
 * shape has now appeared in four places, which is why this lives in one module
 * rather than being reimplemented per report.
 *
 * Stamps are preserved whenever the rest of the report is identical, and advance
 * only when the report's substance does.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs"
import { dirname } from "node:path"

/** `Generated: <iso timestamp>`, used by the audit reports. */
export const GENERATED_STAMP = /^Generated:\s*\S+/

/** `- Executed: <iso>` and `- Commit: \`<sha>\``, used by the axe scan report. */
export const AXE_REPORT_STAMPS = [/^- Executed:\s*\S+/, /^- Commit:\s*\S+/] as const

function stampLines(contents: string, patterns: readonly RegExp[]): string[] {
  return contents.split("\n").filter((line) => patterns.some((pattern) => pattern.test(line)))
}

function withoutStamps(contents: string, patterns: readonly RegExp[]): string {
  return contents
    .split("\n")
    .filter((line) => !patterns.some((pattern) => pattern.test(line)))
    .join("\n")
}

/**
 * Returns `next`, with its stamp lines replaced by `previous`'s when everything
 * else matches.
 *
 * `previous` is passed in rather than read here so callers that must delete the
 * report before regenerating — `generate-axe-report.ts` removes it up front so a
 * failed validation cannot leave stale evidence behind — can still reuse the
 * prior stamps.
 *
 * Falls through to `next` unchanged when there is no previous report, when it
 * carries no recognisable stamps, or when the stamp counts differ, since in that
 * case the lines cannot be paired up safely.
 */
export function stabilizeStamps(
  next: string,
  previous: string | undefined,
  patterns: readonly RegExp[] = [GENERATED_STAMP],
): string {
  if (previous === undefined) return next

  const previousStamps = stampLines(previous, patterns)
  const nextStamps = stampLines(next, patterns)
  if (previousStamps.length === 0 || previousStamps.length !== nextStamps.length) return next

  if (withoutStamps(previous, patterns) !== withoutStamps(next, patterns)) return next

  // Substance unchanged — restore the recorded stamps, in order, so the file
  // stays byte-identical to what is committed.
  let index = 0
  return next
    .split("\n")
    .map((line) => (patterns.some((p) => p.test(line)) ? previousStamps[index++]! : line))
    .join("\n")
}

/**
 * Writes a report, reusing the committed stamps when every other line is
 * unchanged. `lines` is expected to already contain freshly stamped values.
 */
export function writeReportWithStableStamp(
  filePath: string,
  lines: readonly string[],
  patterns: readonly RegExp[] = [GENERATED_STAMP],
): void {
  const next = lines.join("\n") + "\n"
  mkdirSync(dirname(filePath), { recursive: true })

  let previous: string | undefined
  if (existsSync(filePath)) {
    try {
      previous = readFileSync(filePath, "utf8")
    } catch {
      previous = undefined
    }
  }

  writeFileSync(filePath, stabilizeStamps(next, previous, patterns))
}
