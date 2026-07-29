#!/usr/bin/env tsx
/**
 * TEST-004: Lighthouse audit script for @solidiom/site.
 *
 * Runs Lighthouse against the production build preview server and outputs
 * a JSON report. Thresholds are advisory until G2 gate — failures produce
 * warnings, not exit codes.
 *
 * Usage:
 *   pnpm run lighthouse           # run audit, output summary
 *   pnpm run lighthouse --json    # output JSON only (for CI artifacts)
 *
 * Prerequisites:
 *   - Production build must exist (pnpm run build)
 *   - Chrome/Chromium must be available (handled by Playwright's chromium)
 */

import { execSync } from "node:child_process"
import { existsSync, mkdirSync, writeFileSync } from "node:fs"
import { dirname, join, resolve } from "node:path"
import { fileURLToPath } from "node:url"

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..")
const distDir = join(projectRoot, "dist")
const reportDir = join(projectRoot, "dist", "reports")

interface LighthouseScore {
  performance: number
  accessibility: number
  bestPractices: number
  seo: number
}

interface LighthouseReport {
  url: string
  scores: LighthouseScore
  timestamp: string
}

// Advisory thresholds — failures are warnings, not blockers (until G2)
const ADVISORY_THRESHOLDS: LighthouseScore = {
  performance: 90,
  accessibility: 95,
  bestPractices: 90,
  seo: 90,
}

function main(): void {
  if (!existsSync(distDir)) {
    console.error("Build directory not found. Run 'pnpm run build' first.")
    process.exit(1)
  }

  const jsonOnly = process.argv.includes("--json")

  if (!existsSync(reportDir)) {
    mkdirSync(reportDir, { recursive: true })
  }

  // For now, output a placeholder report structure.
  // Full Lighthouse integration requires either:
  //   1. lighthouse CLI (npx lighthouse)
  //   2. @lhci/cli for CI integration
  // Both need a running server. The actual implementation will use
  // the preview server started by the Nx target dependency chain.
  const report: LighthouseReport = {
    url: "http://127.0.0.1:4322/",
    scores: {
      performance: 0,
      accessibility: 0,
      bestPractices: 0,
      seo: 0,
    },
    timestamp: new Date().toISOString(),
  }

  // Try to run Lighthouse if available
  try {
    const result = execSync(
      `npx lighthouse http://127.0.0.1:4322/ --output=json --chrome-flags="--headless --no-sandbox" --quiet`,
      { timeout: 120_000, encoding: "utf8", stdio: ["pipe", "pipe", "pipe"] },
    )
    const lhr = JSON.parse(result) as { categories: Record<string, { score: number }> }
    report.scores = {
      performance: Math.round((lhr.categories["performance"]?.score ?? 0) * 100),
      accessibility: Math.round((lhr.categories["accessibility"]?.score ?? 0) * 100),
      bestPractices: Math.round((lhr.categories["best-practices"]?.score ?? 0) * 100),
      seo: Math.round((lhr.categories["seo"]?.score ?? 0) * 100),
    }
  } catch {
    if (!jsonOnly) {
      console.warn("Lighthouse not available or server not running. Generating placeholder report.")
      console.warn("To run: start the preview server first, then run this script.")
    }
  }

  const reportPath = join(reportDir, "lighthouse-report.json")
  writeFileSync(reportPath, JSON.stringify(report, null, 2))

  if (jsonOnly) {
    console.log(JSON.stringify(report, null, 2))
  } else {
    console.log("\n━━━ TEST-004 Lighthouse Report ━━━\n")
    console.log(`URL: ${report.url}`)
    console.log(`Timestamp: ${report.timestamp}`)
    console.log("")
    console.log("Scores (advisory thresholds in parentheses):")
    for (const [key, value] of Object.entries(report.scores)) {
      const threshold = ADVISORY_THRESHOLDS[key as keyof LighthouseScore]
      const status = value >= threshold ? "PASS" : "WARN"
      console.log(`  ${key}: ${value}/100 (threshold: ${threshold}) [${status}]`)
    }
    console.log("")
    console.log(`Report saved to: dist/reports/lighthouse-report.json`)
    console.log("Note: Thresholds are advisory until G2 gate.")
  }
}

main()
