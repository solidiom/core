import { readFileSync, writeFileSync, mkdirSync } from "node:fs"
import { join } from "node:path"
// Prettier API so generated specs are byte-identical to what the repo's
// format-on-commit hook produces — re-running parity:generate keeps the tree clean.
import prettier from "prettier"
import type { MappingEntry } from "./lib/types"

// Artifacts land in the worktree-root artifacts/shadcn-parity/ (gitignored).
// The Playwright suite runs with cwd = apps/site/, so the generated spec uses
// a path relative to that cwd.
const OUT_DIR = "../../artifacts/shadcn-parity"

// The site is an astro app configured with `trailingSlash: "always"`. Under
// `astro preview` EVERY directory route 404s without a trailing slash
// (`/components/button/examples` → 404, `/components/button/examples/` → 200).
// `sitePath` in the mapping is stored in the canonical no-slash form, so the
// generated spec must append a trailing slash at navigation time or the Solidiom
// frame loads the 404 page and the whole comparison runs against empty DOM.
function solPath(p: string): string {
  return p.endsWith("/") ? p : p + "/"
}

// The generated spec embeds the entry as a JSON literal and calls the shared engine.
export function generateSpecForEntry(entry: MappingEntry): string {
  if (entry.status !== "mapped") return ""
  const literal = JSON.stringify(entry, null, 2)
  const sitePath = solPath(entry.solidiom.sitePath)
  return [
    'import { test, expect, type Page } from "@playwright/test"',
    'import { verifyEntry } from "../lib/verify"',
    'import { writeReport } from "../lib/report"',
    "",
    `const ENTRY = ${literal} as import("../lib/types").MappingEntry`,
    'const REF_BASE = "http://127.0.0.1:4333"',
    'const SOL_BASE = "http://127.0.0.1:4322"',
    "",
    `test("${entry.id} - shadcn parity", async ({ browser }) => {`,
    "  const refCtx = await browser.newContext()",
    "  const solCtx = await browser.newContext()",
    "  const refPage: Page = await refCtx.newPage()",
    "  const solPage: Page = await solCtx.newPage()",
    `  await refPage.goto(REF_BASE + "/" + ENTRY.shadcn.ref, { waitUntil: "networkidle" })`,
    `  await solPage.goto(SOL_BASE + ${JSON.stringify(sitePath)}, { waitUntil: "networkidle" })`,
    `  const report = await verifyEntry(ENTRY, refPage, solPage, "${OUT_DIR}")`,
    `  const path = await writeReport(ENTRY, report, "${OUT_DIR}")`,
    "  // A gap fails the test; accepted/parity pass.",
    '  expect(report.failures, "unresolved gaps in " + ENTRY.id + " (see " + path + ")").toBe(0)',
    "  await refCtx.close()",
    "  await solCtx.close()",
    "})",
    "",
  ].join("\n")
}

export async function generateAll(): Promise<string[]> {
  const mapping = JSON.parse(
    readFileSync(join(import.meta.dirname, "mapping.json"), "utf8"),
  ) as MappingEntry[]
  const outDir = join(import.meta.dirname, "specs")
  mkdirSync(outDir, { recursive: true })
  const written: string[] = []
  for (const entry of mapping) {
    const code = generateSpecForEntry(entry)
    if (!code) continue
    const file = join(outDir, `${entry.id}.spec.ts`)
    const options = await prettier.resolveConfig(file, { editorconfig: true })
    writeFileSync(file, await prettier.format(code, { parser: "typescript", ...options }))
    written.push(file)
  }
  return written
}

if (process.argv[1] && import.meta.url === `file://${process.argv[1]}`) {
  const written = await generateAll()
  console.log(`generated ${written.length} specs:`)
  for (const f of written) console.log("  " + f)
}
