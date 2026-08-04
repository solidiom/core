import { existsSync, readFileSync, rmSync, writeFileSync } from "node:fs"
import { join, resolve } from "node:path"
import { AXE_REPORT_STAMPS, stabilizeStamps } from "./report-stamp"
import {
  type AxeResultsArtifact,
  type AxeScanResult,
  PUBLIC_PRIMITIVES,
  validateAxeResultsArtifact,
} from "./axe-results"

const ROOT = join(import.meta.dirname ?? __dirname, "..")
const OUTPUT = join(ROOT, "docs/axe-scan-results.md")
const DEFAULT_RESULTS = join(ROOT, "artifacts/axe-results.json")

function resultsPathFromArgs(): string {
  const optionIndex = process.argv.indexOf("--results-file")
  if (optionIndex === -1) return DEFAULT_RESULTS

  const providedPath = process.argv[optionIndex + 1]
  if (!providedPath) {
    throw new Error("--results-file requires a path")
  }
  return resolve(ROOT, providedPath)
}

function formatRow(result: AxeScanResult): string {
  const { incomplete, passes, violations } = result.evidence.summary
  return `| ${result.primitive.padEnd(16)} | ${result.evidence.id.padEnd(29)} | ${String(violations).padEnd(10)} | ${String(incomplete).padEnd(10)} | ${String(passes).padEnd(6)} | ✅ Pass |`
}

function generateReport(artifact: AxeResultsArtifact, resultsPath: string): string {
  const results = [...artifact.results].sort((a, b) => a.primitive.localeCompare(b.primitive))
  const incomplete = results.reduce(
    (total, result) => total + result.evidence.summary.incomplete,
    0,
  )
  const passes = results.reduce((total, result) => total + result.evidence.summary.passes, 0)
  const ciRun = artifact.ciRunUrl
    ? `[${artifact.ciRunUrl}](${artifact.ciRunUrl})`
    : "Local execution (not CI evidence)"

  return `---
id: axe-scan-results
title: "Automated Accessibility Scan Results"
doc_type: reference
audience: "Solidiom contributors, accessibility reviewers"
tags: [accessibility, axe, automated-testing]
---

> **Purpose:** Records axe-core results emitted by the executable browser suite. This report is rejected when the underlying result artifact is incomplete, duplicated, malformed, or contains violations.

## Methodology

- Tool: axe-core 4.10.2 via Vitest browser mode
- Browser: ${artifact.browser} (Playwright)
- Scope: Each public primitive rendered in isolation with minimal valid props
- Executed: ${artifact.generatedAt}
- Commit: \`${artifact.commitSha}\`
- CI run: ${ciRun}
- Test file: \`tests/a11y/primitives-axe-scan.browser.test.tsx\`
- Results artifact: \`${resultsPath.replace(`${ROOT}/`, "")}\`

## Results

| Primitive        | Evidence ID                   | Violations | Incomplete | Passes | Status  |
| ---------------- | ----------------------------- | ---------- | ---------- | ------ | ------- |
${results.map(formatRow).join("\n")}

## Coverage

- Total primitives scanned: ${results.length}/${PUBLIC_PRIMITIVES.length}
- Violations found: 0
- Incomplete checks: ${incomplete}
- Passing checks: ${passes}
- All primitives passing: Yes ✅

## Known Beta Gaps

- Calendar/DatePicker: color contrast is not assessed without recipe styling in the isolated fixture.
- Toast: live-region timing assertions remain manual verification work.
- VirtualList: dynamic content is not scanned because it requires scroll interaction.

## Out of scope

NVDA, JAWS, TalkBack, and full styled accessibility certification are Phase 4 work. This report records only the Phase 1 automated axe baseline.
`
}

function main(): void {
  const resultsPath = resultsPathFromArgs()
  // Captured before the removal below: the report is deleted up front so a failed
  // validation cannot leave stale evidence in place, but the prior run stamps are
  // still wanted if the regenerated report turns out identical.
  const previous = existsSync(OUTPUT) ? readFileSync(OUTPUT, "utf8") : undefined
  rmSync(OUTPUT, { force: true })

  if (!existsSync(resultsPath)) {
    throw new Error(`Axe result artifact does not exist: ${resultsPath}`)
  }

  let parsed: unknown
  try {
    parsed = JSON.parse(readFileSync(resultsPath, "utf8"))
  } catch (error) {
    throw new Error(`Unable to parse axe result artifact: ${String(error)}`)
  }

  const errors = validateAxeResultsArtifact(parsed)
  const artifact = parsed as AxeResultsArtifact
  if (!artifact.commitSha || !/^[0-9a-f]{40}$/i.test(artifact.commitSha)) {
    errors.push("Axe result artifact must identify the tested 40-character commit SHA")
  }

  if (errors.length > 0) {
    throw new Error(`Invalid axe result artifact:\n- ${errors.join("\n- ")}`)
  }

  writeFileSync(
    OUTPUT,
    stabilizeStamps(generateReport(artifact, resultsPath), previous, AXE_REPORT_STAMPS),
    "utf8",
  )
  console.log(`✓ Generated ${OUTPUT}`)
  console.log(`  ${artifact.results.length} primitives scanned from executed browser-test results`)
}

try {
  main()
} catch (error) {
  console.error(`✗ Unable to generate axe report: ${String(error)}`)
  process.exit(1)
}
