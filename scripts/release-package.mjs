#!/usr/bin/env node

/**
 * Build, typecheck, test, and publish one public workspace package.
 *
 * Usage:
 *   pnpm release:package @solidiom/button --dry-run
 *   pnpm release:package @solidiom/button --tag beta
 *   pnpm release:package @solidiom/button --bump patch
 *
 * Releases that involve Changesets-linked packages should use the unified
 * GitHub Actions release workflow instead.
 */

import { existsSync, readFileSync } from "node:fs"
import { resolve } from "node:path"
import { spawnSync } from "node:child_process"

const root = resolve(import.meta.dirname, "..")
const args = process.argv.slice(2)

const usage = `Usage: pnpm release:package <package> [options]

Options:
  --dry-run          Build, typecheck, and test without publishing
  --tag <tag>        npm dist-tag (default: beta)
  --bump <type>      Version bump: patch, minor, major, or prerelease
  --preid <id>       Prerelease identifier (default: beta)
  --skip-tests       Skip the package test target
  --allow-linked     Permit publishing one package from a Changesets linked group
  --help, -h         Show this help
`

const fail = (message) => {
  console.error(`\nPublish aborted: ${message}`)
  process.exit(1)
}

const run = (command, commandArgs, options = {}) => {
  const result = spawnSync(command, commandArgs, {
    cwd: root,
    stdio: "inherit",
    ...options,
  })

  if (result.error) fail(`Could not run ${command}: ${result.error.message}`)
  if (result.status !== 0) fail(`${command} ${commandArgs.join(" ")} failed`)
}

const readJson = (path) => JSON.parse(readFileSync(path, "utf8"))

let packageName
let tag = "beta"
let bump
let preid = "beta"
let dryRun = false
let skipTests = false
let allowLinked = false

while (args.length > 0) {
  const arg = args.shift()

  switch (arg) {
    case "--dry-run":
      dryRun = true
      break
    case "--skip-tests":
      skipTests = true
      break
    case "--allow-linked":
      allowLinked = true
      break
    case "--tag":
      tag = args.shift() ?? fail("--tag requires a value")
      break
    case "--bump":
      bump = args.shift() ?? fail("--bump requires a value")
      break
    case "--preid":
      preid = args.shift() ?? fail("--preid requires a value")
      break
    case "--help":
    case "-h":
      console.log(usage)
      process.exit(0)
      break
    default:
      if (arg.startsWith("-")) fail(`Unknown option: ${arg}`)
      if (packageName) fail(`Only one package can be published at a time (received ${arg})`)
      packageName = arg
  }
}

if (!packageName) fail("A package name is required.\n\n" + usage)
if (bump && !["patch", "minor", "major", "prerelease"].includes(bump)) {
  fail("--bump must be patch, minor, major, or prerelease")
}

const project = spawnSync("pnpm", ["nx", "show", "project", packageName, "--json"], {
  cwd: root,
  encoding: "utf8",
})
if (project.status !== 0) fail(`Workspace project not found: ${packageName}`)

let packageRoot
try {
  packageRoot = JSON.parse(project.stdout).root
} catch {
  fail(`Could not resolve project metadata for ${packageName}`)
}

const manifestPath = resolve(root, packageRoot, "package.json")
if (!existsSync(manifestPath)) fail(`${packageName} has no package.json at ${packageRoot}`)

const manifest = readJson(manifestPath)
if (manifest.private) fail(`${packageName} is private and cannot be published`)
if (manifest.name !== packageName) {
  fail(`Project ${packageName} resolves to a package named ${manifest.name}`)
}

const changesetConfig = readJson(resolve(root, ".changeset/config.json"))
const linkedGroup = (changesetConfig.linked ?? []).find((group) => group.includes(packageName))
if (linkedGroup && !allowLinked) {
  fail(
    `${packageName} belongs to the linked Changesets group: ${linkedGroup.join(", ")}. ` +
      "Use the unified release workflow or pass --allow-linked if this is intentional.",
  )
}

console.log(
  `\nSingle-package release plan\n  package: ${packageName}\n  tag: ${tag}\n  version bump: ${bump ?? "none"}\n  dry run: ${dryRun}\n`,
)

run("pnpm", ["nx", "build", packageName])
run("pnpm", ["nx", "typecheck", packageName])
if (!skipTests) run("pnpm", ["nx", "test", packageName])

if (bump) {
  const versionArgs = ["version", bump, "--no-git-tag-version"]
  if (bump === "prerelease") versionArgs.push(`--preid=${preid}`)
  run("npm", versionArgs, { cwd: resolve(root, packageRoot) })
  run("pnpm", ["nx", "build", packageName])
}

const finalVersion = readJson(manifestPath).version
if (dryRun) {
  console.log(
    `\nDry run complete. Would publish ${packageName}@${finalVersion} with the ${tag} tag.`,
  )
  process.exit(0)
}

if (!process.env.NODE_AUTH_TOKEN && !process.env.NPM_TOKEN) {
  fail("Set NODE_AUTH_TOKEN (or NPM_TOKEN) before publishing")
}

run(
  "pnpm",
  ["--filter", packageName, "publish", "--tag", tag, "--access", "public", "--no-git-checks"],
  {
    env: { ...process.env, NODE_AUTH_TOKEN: process.env.NODE_AUTH_TOKEN ?? process.env.NPM_TOKEN },
  },
)

console.log(`\nPublished ${packageName}@${finalVersion} with the ${tag} tag.`)
