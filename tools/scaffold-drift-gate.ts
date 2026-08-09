/**
 * tools/scaffold-drift-gate — CI gate for generated artifact freshness (3B.7).
 *
 * Fails if any generated artifact is stale relative to its contract definition.
 * Designed to run in CI after a build to ensure no manual edit drifted from the
 * canonical source (recipe-contract-definitions → emitters → generated files).
 *
 * Checks:
 *   1. Recipe CSS/Tailwind/UnoCSS outputs match contract definitions
 *   2. Theme CSS/Tailwind/UnoCSS outputs match theme definitions
 *   3. Source parity (src/ → source/) is maintained
 *   4. Contract version is consistent across all definitions
 *   5. Registry manifests are current
 *
 * Usage:
 *   pnpm tsx tools/scaffold-drift-gate.ts
 *
 * Exit codes:
 *   0 — all artifacts fresh
 *   1 — drift detected
 */

import { execSync } from "node:child_process"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..")

interface CheckResult {
  name: string
  pass: boolean
  detail?: string
}

let passed = 0
let failed = 0

function check(name: string, cmd: string): CheckResult {
  try {
    execSync(cmd, { cwd: ROOT, encoding: "utf8", stdio: ["pipe", "pipe", "pipe"] })
    passed++
    console.log(`  ✓ ${name}`)
    return { name, pass: true }
  } catch (e: any) {
    failed++
    const detail = (e.stderr || e.stdout || e.message || "").slice(0, 150).trim()
    console.log(`  ✗ ${name}${detail ? " — " + detail : ""}`)
    return { name, pass: false, detail }
  }
}

console.log("Scaffold Drift Gate (3B.7)\n")

console.log("§1 Recipe emitter outputs:")
check("CSS recipes current", "pnpm run recipe:emit:css:check")
check("Tailwind recipes current", "pnpm run recipe:emit:tailwind:check")
check("UnoCSS recipes current", "pnpm run recipe:emit:unocss:check")

console.log("\n§2 Theme emitter outputs:")
check("CSS themes current", "pnpm run theme:emit:css:check")
check("Tailwind themes current", "pnpm run theme:emit:tailwind:check")
check("UnoCSS themes current", "pnpm run theme:emit:unocss:check")

console.log("\n§3 Source parity:")
check("source/ mirrors src/", "pnpm run source:emit:check")

console.log("\n§4 Contract version:")
check("All definitions use CONTRACT_VERSION", "pnpm tsx tools/contract-version.ts check")

console.log("\n§5 Registry integrity:")
check("Registry audit passes", "pnpm run audit:recipe-contract")

console.log("\n" + "═".repeat(50))
console.log(`Scaffold Drift Gate: ${passed} passed, ${failed} failed`)

if (failed > 0) {
  console.log("\n✗ Drift detected — regenerate with: pnpm tsx tools/scaffold-sync.ts")
  process.exit(1)
} else {
  console.log("\n✓ All generated artifacts are fresh.")
}
