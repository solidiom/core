import { readFileSync } from "node:fs"
import { join } from "node:path"
import { PUBLIC_PRIMITIVES } from "./axe-results"

const ROOT = join(import.meta.dirname ?? __dirname, "..")
const UMBRELLA_PATH = join(ROOT, "packages/primitives/src/index.ts")

export const INTENDED_PUBLIC_SURFACE = PUBLIC_PRIMITIVES.map((primitive) => `@solidiom/${primitive}`).sort()

export interface PurityError {
  line: number
  message: string
}

const REEXPORT_RE = /^export\s+\*\s+as\s+[A-Z][a-zA-Z]*\s+from\s+["'](@solidiom\/[a-z][a-z0-9-]*)["']\s*$/
const ALLOWED_NON_EXPORT_RE = /^\s*$|^\s*\/\/.*$|^\s*\/\*.*$|^\s*\*.*$/

export function auditUmbrellaSource(
  content: string,
  intendedPublicSurface = INTENDED_PUBLIC_SURFACE,
): PurityError[] {
  const errors: PurityError[] = []
  const foundExports: string[] = []

  for (const [index, line] of content.split("\n").entries()) {
    const lineNumber = index + 1
    const reExport = line.match(REEXPORT_RE)
    if (reExport) {
      foundExports.push(reExport[1])
      continue
    }
    if (!ALLOWED_NON_EXPORT_RE.test(line)) {
      errors.push({ line: lineNumber, message: `Implementation line detected: "${line.trim()}"` })
    }
  }

  const expected = [...intendedPublicSurface].sort()
  const found = [...foundExports].sort()
  for (const exportName of expected) {
    if (!found.includes(exportName)) {
      errors.push({ line: 0, message: `Missing re-export: ${exportName} is in the intended public surface but not in the umbrella` })
    }
  }
  for (const exportName of found) {
    if (!expected.includes(exportName)) {
      errors.push({ line: 0, message: `Extra re-export: ${exportName} is in the umbrella but not in the intended public surface` })
    }
  }
  for (const exportName of new Set(found)) {
    if (found.filter((candidate) => candidate === exportName).length > 1) {
      errors.push({ line: 0, message: `Duplicate re-export: ${exportName}` })
    }
  }

  return errors
}

export function auditUmbrellaFile(path = UMBRELLA_PATH): PurityError[] {
  return auditUmbrellaSource(readFileSync(path, "utf8"))
}

function main(): void {
  console.log("Umbrella re-export purity check\n")
  console.log(`File: ${UMBRELLA_PATH}\n`)
  const errors = auditUmbrellaFile()
  console.log(`Intended surface: ${INTENDED_PUBLIC_SURFACE.length}\n`)

  if (errors.length === 0) {
    console.log("✓ Umbrella purity check PASSED")
    console.log(`  ${INTENDED_PUBLIC_SURFACE.length} pure re-exports, zero implementation lines.`)
    return
  }

  console.error(`✗ Umbrella purity check FAILED — ${errors.length} issue(s):\n`)
  for (const error of errors) {
    console.error(`${error.line > 0 ? `  Line ${error.line}: ` : "  "}${error.message}`)
  }
  process.exitCode = 1
}

if (process.argv[1] && import.meta.url === new URL(`file://${process.argv[1]}`).href) {
  main()
}
