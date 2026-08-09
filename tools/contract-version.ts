/**
 * tools/contract-version — Recipe contract versioning and migration (3B.1).
 *
 * Manages the lifecycle of `CONTRACT_VERSION` in recipe-contract-schema.ts.
 * Provides:
 *   - Version checking: verifies all definitions match the current schema version
 *   - Migration stub generation: creates a migration function template when bumping
 *   - History tracking: records version bumps in a migrations log
 *
 * Usage:
 *   pnpm tsx tools/contract-version.ts check       — verify all definitions are current
 *   pnpm tsx tools/contract-version.ts bump        — increment version and generate migration stub
 *   pnpm tsx tools/contract-version.ts history     — print version history
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs"
import { join, dirname } from "node:path"
import { fileURLToPath } from "node:url"

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..")
const SCHEMA_PATH = join(ROOT, "tools/recipe-contract-schema.ts")
const DEFINITIONS_PATH = join(ROOT, "tools/recipe-contract-definitions.ts")
const MIGRATIONS_DIR = join(ROOT, "tools/contract-migrations")
const HISTORY_PATH = join(MIGRATIONS_DIR, "history.json")

interface VersionHistory {
  versions: Array<{
    version: number
    date: string
    description: string
  }>
}

function getCurrentVersion(): number {
  const content = readFileSync(SCHEMA_PATH, "utf8")
  const match = content.match(/CONTRACT_VERSION\s*=\s*(\d+)/)
  if (!match) throw new Error("Could not parse CONTRACT_VERSION from schema")
  return parseInt(match[1], 10)
}

function getDefinitionCount(): number {
  const content = readFileSync(DEFINITIONS_PATH, "utf8")
  const matches = content.match(/contractVersion:\s*CONTRACT_VERSION/g)
  return matches?.length ?? 0
}

function readHistory(): VersionHistory {
  if (!existsSync(HISTORY_PATH)) {
    return { versions: [{ version: 1, date: "2026-07-01", description: "Initial schema" }] }
  }
  return JSON.parse(readFileSync(HISTORY_PATH, "utf8"))
}

function writeHistory(history: VersionHistory): void {
  if (!existsSync(MIGRATIONS_DIR)) mkdirSync(MIGRATIONS_DIR, { recursive: true })
  writeFileSync(HISTORY_PATH, JSON.stringify(history, null, 2) + "\n")
}

function checkCommand(): void {
  const version = getCurrentVersion()
  const defCount = getDefinitionCount()

  console.log(`Contract version: ${version}`)
  console.log(`Definitions using CONTRACT_VERSION: ${defCount}`)

  // Check all definitions reference the current version constant
  const content = readFileSync(DEFINITIONS_PATH, "utf8")
  const hardcoded = content.match(/contractVersion:\s*\d+(?!\s*as\s*const)/g)
  if (hardcoded && hardcoded.length > 0) {
    console.error(`\n✗ Found ${hardcoded.length} definitions with hardcoded version (should use CONTRACT_VERSION)`)
    process.exit(1)
  }

  console.log(`\n✓ All ${defCount} definitions reference CONTRACT_VERSION (v${version})`)
}

function bumpCommand(): void {
  const current = getCurrentVersion()
  const next = current + 1
  const date = new Date().toISOString().split("T")[0]

  // Update schema
  const schema = readFileSync(SCHEMA_PATH, "utf8")
  const updated = schema.replace(
    /CONTRACT_VERSION\s*=\s*\d+/,
    `CONTRACT_VERSION = ${next}`,
  )
  writeFileSync(SCHEMA_PATH, updated)

  // Generate migration stub
  if (!existsSync(MIGRATIONS_DIR)) mkdirSync(MIGRATIONS_DIR, { recursive: true })
  const migrationPath = join(MIGRATIONS_DIR, `v${current}-to-v${next}.ts`)
  writeFileSync(
    migrationPath,
    `/**
 * Migration: contract v${current} → v${next}
 * Generated: ${date}
 *
 * Edit this file to transform definitions from the old schema to the new one.
 * Run with: pnpm tsx tools/contract-migrations/v${current}-to-v${next}.ts
 */
import type { RecipeDefinition } from "../recipe-contract-schema"

export function migrate(definition: RecipeDefinition): RecipeDefinition {
  // TODO: implement migration logic
  return definition
}
`,
  )

  // Update history
  const history = readHistory()
  history.versions.push({
    version: next,
    date,
    description: `Version ${next} (auto-generated migration stub)`,
  })
  writeHistory(history)

  console.log(`✓ Bumped CONTRACT_VERSION: ${current} → ${next}`)
  console.log(`  Schema: ${SCHEMA_PATH}`)
  console.log(`  Migration: ${migrationPath}`)
  console.log(`  History: ${HISTORY_PATH}`)
}

function historyCommand(): void {
  const history = readHistory()
  console.log("Contract Version History:")
  for (const entry of history.versions) {
    console.log(`  v${entry.version} — ${entry.date}: ${entry.description}`)
  }
}

const command = process.argv[2]
switch (command) {
  case "check":
    checkCommand()
    break
  case "bump":
    bumpCommand()
    break
  case "history":
    historyCommand()
    break
  default:
    console.log("Usage: pnpm tsx tools/contract-version.ts <check|bump|history>")
    process.exit(1)
}
