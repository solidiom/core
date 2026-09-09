import { describe, expect, it } from "vitest"
import { readFileSync } from "node:fs"
import { join } from "node:path"

const ROOT = join(import.meta.dirname, "..")
const DETERMINISTIC_BUILDERS = [
  "tools/generate-api-docs.ts",
  "tools/generate-beta-artifacts.ts",
  "tools/registry-build.ts",
  "apps/site/tools/report-route-budgets.ts",
  "tools/audit-primitives.ts",
] as const

const FORBIDDEN_CLOCK_OR_RANDOM_INPUTS = [
  { name: "Date.now", pattern: /\bDate\.now\s*\(/ },
  { name: "zero-argument Date", pattern: /\bnew\s+Date\s*\(\s*\)/ },
  { name: "performance.now", pattern: /\bperformance\.now\s*\(/ },
  { name: "random UUID", pattern: /\brandomUUID\s*\(/ },
  { name: "Math.random", pattern: /\bMath\.random\s*\(/ },
  { name: "filesystem mtime", pattern: /\b(?:mtime|mtimeMs|birthtime|birthtimeMs)\b/ },
  { name: "filesystem utimes", pattern: /\butimes(?:Sync)?\s*\(/ },
] as const

describe("deterministic build clock guard", () => {
  for (const relativePath of DETERMINISTIC_BUILDERS) {
    it(`${relativePath} has no wall-clock, filesystem-time, or random inputs`, () => {
      const source = readFileSync(join(ROOT, relativePath), "utf8")
      const violations = FORBIDDEN_CLOCK_OR_RANDOM_INPUTS.flatMap(({ name, pattern }) =>
        pattern.test(source) ? [name] : [],
      )
      expect(violations).toEqual([])
    })
  }
})
