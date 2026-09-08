#!/usr/bin/env node

import { existsSync, readFileSync, readdirSync } from "node:fs"
import { join } from "node:path"
import { pathToFileURL } from "node:url"

const DEFAULT_REGISTRY = "https://registry.npmjs.org"
const DEFAULT_TIMEOUT_MS = 15_000
const DEFAULT_CONCURRENCY = 12

export class ReleaseCandidateError extends Error {
  constructor(message, category = "infrastructure") {
    super(message)
    this.name = "ReleaseCandidateError"
    this.category = category
  }
}

export function readPublishablePackages(root = process.cwd()) {
  const packagesDirectory = join(root, "packages")
  const config = JSON.parse(readFileSync(join(root, ".changeset", "config.json"), "utf8"))
  const ignored = new Set(config.ignore ?? [])
  const packages = []

  for (const entry of readdirSync(packagesDirectory, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue
    const manifestPath = join(packagesDirectory, entry.name, "package.json")
    if (!existsSync(manifestPath)) continue

    const manifest = JSON.parse(readFileSync(manifestPath, "utf8"))
    if (!manifest.name || !manifest.version || manifest.private || ignored.has(manifest.name))
      continue
    packages.push({ name: manifest.name, version: manifest.version })
  }

  return packages.sort((left, right) => left.name.localeCompare(right.name))
}

async function mapConcurrent(values, concurrency, operation) {
  const results = new Array(values.length)
  let nextIndex = 0

  async function worker() {
    while (nextIndex < values.length) {
      const index = nextIndex++
      results[index] = await operation(values[index], index)
    }
  }

  await Promise.all(Array.from({ length: Math.min(concurrency, values.length) }, () => worker()))
  return results
}

export async function findUnpublishedPackages({
  packages,
  fetchImpl = globalThis.fetch,
  registry = DEFAULT_REGISTRY,
  timeoutMs = DEFAULT_TIMEOUT_MS,
  concurrency = DEFAULT_CONCURRENCY,
} = {}) {
  const candidates = packages ?? readPublishablePackages()
  if (candidates.length === 0) {
    throw new ReleaseCandidateError("no publishable workspace packages were found", "configuration")
  }

  const unpublished = await mapConcurrent(candidates, concurrency, async (candidate) => {
    const url = `${registry}/${encodeURIComponent(candidate.name)}/${encodeURIComponent(candidate.version)}`
    let response
    try {
      response = await fetchImpl(url, {
        headers: { Accept: "application/json" },
        signal: AbortSignal.timeout(timeoutMs),
      })
    } catch (error) {
      const detail = error instanceof Error ? error.message : String(error)
      throw new ReleaseCandidateError(
        `could not check ${candidate.name}@${candidate.version} on ${new URL(registry).host}: ${detail}`,
      )
    }

    if (response.status === 404) return candidate
    if (response.ok) return null

    const category =
      response.status === 401 || response.status === 403 ? "authentication" : "infrastructure"
    throw new ReleaseCandidateError(
      `npm registry rejected the candidate check for ${candidate.name}@${candidate.version} (HTTP ${response.status})`,
      category,
    )
  })

  return unpublished.filter(Boolean)
}

export async function requireUnpublishedPackages(options) {
  const unpublished = await findUnpublishedPackages(options)
  if (unpublished.length === 0) {
    throw new ReleaseCandidateError(
      "no unpublished package versions were found; run the Version PR workflow and merge its version bumps before releasing",
      "publication",
    )
  }
  return unpublished
}

async function main() {
  try {
    const unpublished = await requireUnpublishedPackages()
    console.log(`Unpublished npm packages (${unpublished.length}):`)
    for (const candidate of unpublished) console.log(`- ${candidate.name}@${candidate.version}`)
  } catch (error) {
    const category = error instanceof ReleaseCandidateError ? error.category : "unexpected"
    const message = error instanceof Error ? error.message : String(error)
    console.error(`::error title=Release candidate ${category} failure::${message}`)
    process.exitCode = 1
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  await main()
}
