/**
 * Generates per-primitive AT (assistive-technology) verification records
 * from axe scan results and evidence artifacts.
 *
 * Output is prettier-clean so `format:check` passes without a second step.
 *
 * Usage: node scripts/generate-at-records.js
 * Prereqs: artifacts/axe-results.json, artifacts/a11y-evidence.json,
 *          docs/keyboard-audit-results.md must exist (run test:a11y first).
 */

const fs = require("fs")
const path = require("path")

const axeData = JSON.parse(fs.readFileSync("artifacts/axe-results.json", "utf8"))
const evidence = JSON.parse(fs.readFileSync("artifacts/a11y-evidence.json", "utf8"))
const keyboard = fs.readFileSync("docs/keyboard-audit-results.md", "utf8")

// ─── Parse keyboard audit table ─────────────────────────────────────────────

const kbRows = {}
for (const line of keyboard.split("\n")) {
  const parts = line
    .split("|")
    .map((s) => s.trim())
    .filter(Boolean)
  if (parts.length >= 7) {
    const primitive = parts[0].toLowerCase()
    const focus = parts[1]
    const status = parts[6]
    if (status === "Pass" || status === "Fail") {
      kbRows[primitive] = { hasFocus: focus, status }
    }
  }
}

// ─── Table formatting helpers ───────────────────────────────────────────────

/**
 * Formats a markdown table. We emit minimal formatting here — prettier --write
 * is called on all generated files at the end of this script so alignment is
 * always canonical regardless of content width or multi-byte characters.
 * @param {string[]} headers
 * @param {string[][]} rows
 * @returns {string}
 */
function formatTable(headers, rows) {
  const sep = headers.map(() => "---")
  const fmt = (r) => "| " + r.join(" | ") + " |"
  return [fmt(headers), fmt(sep), ...rows.map(fmt)].join("\n")
}

// ─── Generate records ───────────────────────────────────────────────────────

const outDir = "docs/at-audit-results"
fs.mkdirSync(outDir, { recursive: true })
let count = 0

for (const result of axeData.results) {
  const name = result.primitive
  const ev = evidence.primitives[name] || {}
  const kb = kbRows[name]
  const evId = ev.evidenceIds ? ev.evidenceIds[0] : "N/A"
  const lastRun = ev.lastRun || axeData.generatedAt

  const s = result.evidence.summary
  const title = name.charAt(0).toUpperCase() + name.slice(1).replace(/-/g, " ")

  const summaryTable = formatTable(
    ["Field", "Value"],
    [
      ["Evidence ID", evId],
      ["Outcome", s.outcome],
      ["Passes", String(s.passes)],
      ["Violations", String(s.violations)],
      ["Incomplete", String(s.incomplete)],
      ["Last Run", lastRun],
      ["Keyboard Interactive", kb ? kb.hasFocus : "N/A"],
      ["Keyboard Status", kb ? kb.status : "N/A"],
    ],
  )

  const manualTable = formatTable(
    ["Dimension", "Status"],
    [
      ["Keyboard", kb && kb.status === "Pass" ? "Verified (keyboard-audit-results.md)" : "N/A"],
      ["Focus", kb && kb.hasFocus && kb.hasFocus !== "N/A" ? "Verified" : "N/A"],
      ["Zoom", "—"],
      ["Contrast", "—"],
      ["Reduced motion", "—"],
      ["Screen readers (VoiceOver)", "—"],
      ["Touch", "—"],
    ],
  )

  const content = [
    "---",
    "id: at-" + name,
    'title: "AT Verification Record - ' + title + '"',
    "doc_type: reference",
    'audience: "Solidiom contributors, accessibility reviewers"',
    "tags: [accessibility, AT, verification, " + name + "]",
    "lifecycle: current",
    "---",
    "",
    "# AT Verification Record: " + title,
    "",
    "## Summary",
    "",
    summaryTable,
    "",
    "## Automated Evidence",
    "",
    "Source: axe-core isolated scan (" + result.evidence.kind + ").",
    "",
    "- " + s.passes + " rule(s) passed",
    "- " + s.violations + " violation(s) found",
    "- " + s.incomplete + " incomplete result(s)",
    "",
    "## Manual Verification Status",
    "",
    manualTable,
    "",
    "## Notes",
    "",
    "Generated from axe scan artifact " +
      axeData.generatedAt +
      ". Manual dimensions marked with — are tracked as Phase 4 work per A11Y-005.",
    "",
  ].join("\n")

  fs.writeFileSync(path.join(outDir, name + ".md"), content)
  count++
}

console.log("Generated " + count + " per-primitive AT records")

// Format the generated files so they pass `prettier --check` without a separate step.
const { execSync } = require("child_process")
try {
  execSync("pnpm exec prettier --write " + outDir + "/*.md", {
    stdio: ["ignore", "ignore", "pipe"],
  })
  console.log("Formatted " + count + " files with prettier")
} catch (e) {
  console.error("Warning: prettier formatting failed:", e.stderr?.toString().trim())
  process.exitCode = 1
}
