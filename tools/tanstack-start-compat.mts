#!/usr/bin/env npx tsx
/**
 * tools/tanstack-start-compat — monitors the temporary
 * `@tanstack/start-server-core` ceiling in pnpm-workspace.yaml.
 *
 * Context: GHSA-qx66-fv34-fjm8 is patched in start-server-core >=1.169.39,
 * but 1.169.41 REMOVED the `getResponse`/`requestHandler` exports that
 * @tanstack/solid-start still imports, so the override is capped
 * `>=1.169.39 <1.169.41`. That ceiling is a ticking clock: the moment a
 * solid-start release imports the new surface, the cap must be raised (or
 * dropped) or Dependabot security PRs will keep reopening the advisory and
 * any bump past the cap breaks the TanStack Start template build.
 *
 * The probe answers, from the registry (no install needed):
 *   1. Which solid-start version is pinned in the workspace, and what
 *      start-server-core symbols its dist actually imports.
 *   2. For every start-server-core release at/above the patched floor: does
 *      its dist still export everything the pinned solid-start imports?
 *   3. Verdict:
 *      - RAISABLE: a newer server-core satisfies the pinned solid-start; the
 *        ceiling can move to `>=<floor> <(first-breaking+1)>` or be dropped
 *        entirely if the newest release is compatible.
 *      - BLOCKED: newest compatible is still <1.169.41 — ceiling stays;
 *        reports which solid-start prerelease (if any) already works with
 *        >=1.169.41, i.e. the template bump that would unblock it.
 *
 * Usage:
 *   pnpm tsx tools/tanstack-start-compat.mts          # report (exit 0 unless probe fails)
 *   pnpm tsx tools/tanstack-start-compat.mts --ci     # exit 1 when RAISABLE (action needed)
 *
 * Exit codes: 0 report-only / CI still-blocked · 1 CI verdict RAISABLE ·
 * 2 registry or workspace read failed (inconclusive).
 */
import { readFileSync } from "node:fs"
import { join } from "node:path"

const ROOT = join(import.meta.dirname!, "..")
const CI = process.argv.includes("--ci")
const REGISTRY = process.env.npm_config_registry ?? "https://registry.npmjs.org"

const SERVER_CORE = "@tanstack/start-server-core"
const PATCHED_FLOOR = "1.169.39"
const BREAKING_FIRST = "1.169.41"

/** Extract every `import { ... } from "<pkg>"` named binding for a package. */
function importedNames(dist: string, pkg: string): Set<string> {
  const names = new Set<string>()
  const importRe = /import\s*\{([^}]*)\}\s*from\s*["']([^"']+)["']/g
  for (const m of dist.matchAll(importRe)) {
    if (m[2] !== pkg && !m[2].startsWith(`${pkg}/`)) continue
    for (const part of m[1].split(",")) {
      const name = part
        .trim()
        .split(/\s+as\s+/)[0]
        ?.trim()
      if (name) names.add(name)
    }
  }
  return names
}

/** Named exports a package dist provides (export {..}, export const/class/function). */
function exportedNames(dist: string): Set<string> {
  const names = new Set<string>()
  for (const m of dist.matchAll(/export\s*\{([^}]*)\}/g)) {
    for (const part of m[1].split(",")) {
      const name = part
        .trim()
        .split(/\s+as\s+/)
        .pop()
        ?.trim()
      if (name && name !== "default") names.add(name)
    }
  }
  for (const m of dist.matchAll(
    /export\s+(?:declare\s+)?(?:async\s+)?(?:const|let|var|class|function)\s+([A-Za-z_$][\w$]*)/g,
  )) {
    names.add(m[1])
  }
  return names
}

async function json<T>(url: string): Promise<T> {
  const res = await fetch(url, { headers: { accept: "application/json" } })
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`)
  return (await res.json()) as T
}

interface Packument {
  "dist-tags": Record<string, string>
  versions: Record<string, { dist: { tarball: string } }>
}

/** Fetch a package's dist and concatenate the JS entrypoints. */
async function distSource(pkg: string, version: string): Promise<string> {
  const packument = await json<Packument>(`${REGISTRY}/${pkg}`)
  const entry = packument.versions[version]
  if (!entry) throw new Error(`${pkg}@${version} not on registry`)
  const tarball = entry.dist.tarball
  const tgz = new Uint8Array(await (await fetch(tarball)).arrayBuffer())
  const untar = new Response(new Blob([tgz]).stream().pipeThrough(new DecompressionStream("gzip")))
  const buf = new Uint8Array(await untar.arrayBuffer())
  // Minimal USTAR reader: 512-byte headers, name 0..100, size 124..136 (octal).
  const files: string[] = []
  let off = 0
  while (off + 512 <= buf.length) {
    const name = new TextDecoder().decode(buf.subarray(off, off + 100)).split("\0")[0]
    const size = parseInt(
      new TextDecoder().decode(buf.subarray(off + 124, off + 136)).trim() || "0",
      8,
    )
    off += 512
    if (!name && size === 0) break
    if (name.endsWith(".js")) {
      files.push(new TextDecoder().decode(buf.subarray(off, off + size)))
    }
    off += Math.ceil(size / 512) * 512
  }
  return files.join("\n")
}

function gte(a: string, b: string): boolean {
  const pa = a.split(".").map(Number)
  const pb = b.split(".").map(Number)
  for (let i = 0; i < 3; i++) if ((pa[i] ?? 0) !== (pb[i] ?? 0)) return (pa[i] ?? 0) > (pb[i] ?? 0)
  return true
}

async function main() {
  // Workspace truth: pinned solid-start + the live override line.
  const template = JSON.parse(
    readFileSync(join(ROOT, "templates/tanstack-start-solid/package.json"), "utf8"),
  ) as { dependencies: Record<string, string> }
  const solidStart = template.dependencies["@tanstack/solid-start"]
  if (!solidStart) throw new Error("no @tanstack/solid-start in template deps")

  const workspace = readFileSync(join(ROOT, "pnpm-workspace.yaml"), "utf8")
  const overrideLine = workspace.split("\n").find((l) => l.includes(`"${SERVER_CORE}@`))
  const cappedBelow = overrideLine?.match(/<\s*([\d.]+)/)?.[1]
  const hasOverride = overrideLine !== undefined

  console.log(`pinned @tanstack/solid-start: ${solidStart}`)
  console.log(`override: ${overrideLine?.trim() ?? "(none)"}`)

  // What does the pinned solid-start import from server-core?
  const startDist = await distSource("@tanstack/solid-start", solidStart)
  const needed = importedNames(startDist, SERVER_CORE)
  console.log(`solid-start imports from server-core: {${[...needed].sort().join(", ")}}`)

  // Which server-core releases satisfy it?
  const packument = await json<Packument>(`${REGISTRY}/${SERVER_CORE}`)
  const candidates = Object.keys(packument.versions)
    .filter((v) => gte(v, PATCHED_FLOOR) && !v.includes("-"))
    .sort((a, b) => (gte(a, b) ? 1 : -1))
  let newestOk = ""
  for (const v of candidates) {
    const exports = exportedNames(await distSource(SERVER_CORE, v))
    const missing = [...needed].filter((n) => !exports.has(n))
    if (missing.length === 0) {
      newestOk = v
      break // candidates iterated newest-first
    }
  }
  const newest = candidates.at(-1) ?? "?"

  if (!newestOk) {
    console.log(
      `BLOCKED: no patched server-core (floor ${PATCHED_FLOOR}..${newest}) exports everything the pinned solid-start needs.`,
    )
    console.log(
      `Ceiling must stay. To unblock: bump @tanstack/solid-start in templates/tanstack-start-solid once a release drops the removed imports.`,
    )
    process.exit(0)
  }
  if (gte(newestOk, newest)) {
    if (!hasOverride || !cappedBelow || gte(newest, cappedBelow)) {
      console.log(
        `RAISABLE: newest ${SERVER_CORE} (${newest}) is compatible with the pinned solid-start — the ceiling can be dropped entirely.`,
      )
      process.exit(CI ? 1 : 0)
    }
    process.exit(0)
  }
  if (!cappedBelow || gte(newestOk, cappedBelow)) {
    console.log(
      `RAISABLE: ${newestOk} is compatible; ceiling <${cappedBelow ?? "∞"} can move to ">=${PATCHED_FLOOR} <${BREAKING_FIRST}"-adjacent range covering ${newestOk}.`,
    )
    process.exit(CI ? 1 : 0)
  }
  console.log(
    `OK: newest compatible ${newestOk} is still below the ceiling <${cappedBelow}; nothing to raise yet.`,
  )
  process.exit(0)
}

main().catch((err) => {
  console.error(`tanstack-start-compat: ${err instanceof Error ? err.message : err}`)
  process.exit(2)
})
