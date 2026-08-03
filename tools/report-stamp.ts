/**
 * tools/report-stamp — writes a generated evidence report without churning its
 * `Generated:` stamp.
 *
 * Committed generated artifacts must be a pure function of their inputs. A
 * wall-clock stamp breaks that: every run rewrites the file even when nothing it
 * reports on has changed, so the working tree is dirtied by merely verifying,
 * and any staleness check comparing committed against freshly generated output
 * reports a difference that no amount of committing can resolve. That is the
 * same defect that made BUILD-001 unsatisfiable for the registry, where the
 * stamp was derived from the HEAD commit date.
 *
 * The stamp is therefore preserved whenever the rest of the report is identical,
 * and advances only when the report's substance does.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs"
import { dirname } from "node:path"

/** Matches the `Generated: <iso timestamp>` line these reports carry. */
const STAMP_PATTERN = /^Generated:\s*\S+/

function withoutStamp(contents: string): string {
  return contents
    .split("\n")
    .filter((line) => !STAMP_PATTERN.test(line))
    .join("\n")
}

function existingStampLine(contents: string): string | undefined {
  return contents.split("\n").find((line) => STAMP_PATTERN.test(line))
}

/**
 * Writes a report, reusing the committed `Generated:` line when every other line
 * is unchanged.
 *
 * `lines` is expected to already contain a freshly stamped `Generated:` line;
 * that value is used only when the report's substance has actually changed, or
 * when no readable previous report exists.
 */
export function writeReportWithStableStamp(filePath: string, lines: readonly string[]): void {
  const next = lines.join("\n") + "\n"

  mkdirSync(dirname(filePath), { recursive: true })

  if (!existsSync(filePath)) {
    writeFileSync(filePath, next)
    return
  }

  let previous: string
  try {
    previous = readFileSync(filePath, "utf8")
  } catch {
    writeFileSync(filePath, next)
    return
  }

  const previousStamp = existingStampLine(previous)
  if (previousStamp === undefined) {
    writeFileSync(filePath, next)
    return
  }

  if (withoutStamp(previous) !== withoutStamp(next)) {
    writeFileSync(filePath, next)
    return
  }

  // Substance unchanged — keep the recorded stamp so the file stays byte-identical.
  writeFileSync(
    filePath,
    lines.map((line) => (STAMP_PATTERN.test(line) ? previousStamp : line)).join("\n") + "\n",
  )
}
