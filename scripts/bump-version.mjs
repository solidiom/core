#!/usr/bin/env node
/**
 * Sets the `version` field of every publishable package to a target version.
 *
 * One job, done well: rewrite the version field. It does NOT regenerate the
 * registry, run tests, or commit — those are orchestrated by the
 * `version:bump` mise target, which chains the whole documented workflow from
 * docs/bumping-version.md.
 *
 * A package is "publishable" when it is under packages/, is not
 * `"private": true`, and is not in the changeset `ignore` list (tooling such
 * as bench, adapter-kit, release-tools, test-doubles and the eslint plugin).
 * Probe packages (version `0.0.0`) and other private packages are left alone.
 *
 * Idempotent: if a package already carries the target version it is not
 * rewritten, so re-running with the same version is a no-op that reports
 * "already at <version>" and exits 0. Only files that actually change are
 * written (formatting via 2-space JSON + trailing newline, matching the repo).
 *
 * Usage:
 *   node scripts/bump-version.mjs <semver>
 *   node scripts/bump-version.mjs --dry-run <semver>
 */

import { readFileSync, writeFileSync, readdirSync, existsSync } from "node:fs"
import { resolve } from "node:path"

const args = process.argv.slice(2)
const dryRun = args.includes("--dry-run")
const version = args.find((arg) => arg !== "--dry-run")

if (!version || !/^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?(?:\+[0-9A-Za-z.-]+)?$/.test(version)) {
  console.error("Usage: bump-version.mjs [--dry-run] <semver>")
  console.error(`  Invalid or missing version: ${version ?? "(none)"}`)
  process.exit(1)
}

const root = resolve(import.meta.dirname, "..")
const packagesDir = resolve(root, "packages")
const changesetConfig = JSON.parse(readFileSync(resolve(root, ".changeset/config.json"), "utf-8"))
const ignore = new Set(changesetConfig.ignore)

let bumped = 0
let unchanged = 0
const skipped = []

for (const dir of readdirSync(packagesDir).sort()) {
  const pkgPath = resolve(packagesDir, dir, "package.json")
  if (!existsSync(pkgPath)) continue

  const pkg = JSON.parse(readFileSync(pkgPath, "utf-8"))
  if (pkg.private || ignore.has(pkg.name)) {
    skipped.push(pkg.name ?? dir)
    continue
  }

  if (pkg.version === version) {
    unchanged++
    continue
  }

  const from = pkg.version
  pkg.version = version
  if (!dryRun) {
    writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n")
  }
  bumped++
  console.log(`${dryRun ? "[dry-run] " : ""}${pkg.name ?? dir}: ${from} -> ${version}`)
}

const verb = dryRun ? "would bump" : "bumped"
console.log(
  `\n${verb} ${bumped} package(s) to ${version}` +
    `; ${unchanged} already at ${version}` +
    (skipped.length ? `; ${skipped.length} skipped (private/ignored)` : ""),
)
