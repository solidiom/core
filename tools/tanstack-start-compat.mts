#!/usr/bin/env npx tsx
/**
 * tools/tanstack-start-compat — monitors the temporary
 * `@tanstack/start-server-core` ceiling in pnpm-workspace.yaml.
 *
 * Context: GHSA-qx66-fv34-fjm8 is patched in start-server-core >=1.169.39,
 * but 1.169.41 removed `getResponse`/`requestHandler` from the
 * `/request-response` subpath that @tanstack/solid-start's createSolidStart-
 * Handler imports, so the override is capped `>=1.169.39 <1.169.41`. That
 * ceiling is a ticking clock: the moment a solid-start release imports the
 * new surface, the cap must be raised (or dropped) — otherwise Dependabot
 * keeps reopening the advisory and any bump past the cap breaks the
 * TanStack Start template build.
 *
 * The probe answers, from the registry (no install needed):
 *   1. Every symbol the WHOLE pinned solid-start dependency chain imports
 *      from server-core — root AND `/subpath` specifiers, collected per
 *      specifier (a root-level name does not satisfy a subpath import).
 *   2. For each server-core release at/above the patched floor: does its
 *      package `exports` map declare each needed subpath, and does the
 *      matching dist file export each symbol?
 *   3. Verdict:
 *      - RAISABLE: a newer server-core satisfies the pinned chain; the
 *        ceiling can move or be dropped. Exit 1 under --ci.
 *      - UNBLOCKED-READY: the pinned chain only needs symbols the NEWEST
 *        server-core still provides — the ceiling can be dropped entirely
 *        right now. Exit 1 under --ci.
 *      - BLOCKED: ceiling stays. Also probes the solid-start prerelease
 *        channel and reports whether bumping there would unblock.
 *
 * Usage:
 *   pnpm tsx tools/tanstack-start-compat.mts          # report (exit 0 unless probe fails)
 *   pnpm tsx tools/tanstack-start-compat.mts --ci     # exit 1 when action is needed
 *
 * Exit codes: 0 report-only / CI still-blocked · 1 CI verdict RAISABLE or
 * UNBLOCKED-READY · 2 registry or workspace read failed (inconclusive).
 */
import { readFileSync } from "node:fs"
import { join } from "node:path"

const ROOT = join(import.meta.dirname!, "..")
const CI = process.argv.includes("--ci")
const REGISTRY = process.env.npm_config_registry ?? "https://registry.npmjs.org"

const SERVER_CORE = "@tanstack/start-server-core"
const SOLID_START = "@tanstack/solid-start"
const PATCHED_FLOOR = "1.169.39"

// ─────────────────────────── registry + tarball ───────────────────────────

interface Packument {
  "dist-tags": Record<string, string>
  versions: Record<
    string,
    {
      dist: { tarball: string }
      exports?: Record<string, unknown>
      dependencies?: Record<string, string>
    }
  >
}

const packumentCache = new Map<string, Packument>()
async function packument(pkg: string): Promise<Packument> {
  const hit = packumentCache.get(pkg)
  if (hit) return hit
  // npm shorthand `/<scope>/<name>` is ambiguous (reads as user path); use the
  // encoded form so scoped packages resolve.
  const url = `${REGISTRY}/${encodeURIComponent(pkg)}`
  const res = await fetch(url, { headers: { accept: "application/json" } })
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`)
  const doc = (await res.json()) as Packument
  packumentCache.set(pkg, doc)
  return doc
}

interface DistFile {
  name: string
  text: string
}
const distCache = new Map<string, DistFile[]>()

/** Fetch a package tarball and return its .js files (name + source). */
async function distFiles(pkg: string, version: string): Promise<DistFile[]> {
  const key = `${pkg}@${version}`
  const hit = distCache.get(key)
  if (hit) return hit
  const entry = (await packument(pkg)).versions[version]
  if (!entry) throw new Error(`${key} not on registry`)
  const res = await fetch(entry.dist.tarball)
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${key} tarball`)
  const tgz = new Uint8Array(await res.arrayBuffer())
  const buf = new Uint8Array(
    await new Response(
      new Blob([tgz]).stream().pipeThrough(new DecompressionStream("gzip")),
    ).arrayBuffer(),
  )
  // Minimal USTAR reader: 512-byte headers; name 0..100, size 124..136 (octal),
  // typeflag 156; 'L' GNU long-name headers prefix the next entry.
  const dec = new TextDecoder()
  const files: DistFile[] = []
  let pendingLong = ""
  let off = 0
  while (off + 512 <= buf.length) {
    const name = (pendingLong || dec.decode(buf.subarray(off, off + 100)).split("\0")[0]).replace(
      /^[^/]*\//,
      "",
    )
    pendingLong = ""
    const size = parseInt(dec.decode(buf.subarray(off + 124, off + 136)).trim() || "0", 8)
    const type = String.fromCharCode(buf[off + 156] ?? 0)
    off += 512
    if (!name && size === 0) break
    const body = buf.subarray(off, off + size)
    if (type === "L") pendingLong = dec.decode(body).split("\0")[0]!
    else if (name.endsWith(".js")) files.push({ name, text: dec.decode(body) })
    off += Math.ceil(size / 512) * 512
  }
  distCache.set(key, files)
  return files
}

// ───────────────────────────── import/export scan ─────────────────────────

/** All `from "<pkg>"` / `from "<pkg>/sub"` specifiers a dist uses. */
function specifiersFor(files: DistFile[], pkg: string): Set<string> {
  const found = new Set<string>()
  const re = /(?:from|require\(|import\()\s*["']([^"']+)["']/g
  for (const f of files) {
    for (const m of f.text.matchAll(re)) {
      const s = m[1]!
      if (s === pkg || s.startsWith(`${pkg}/`)) found.add(s)
    }
  }
  return found
}

/** Named bindings imported from one exact specifier. */
function importedNames(files: DistFile[], specifier: string): Set<string> {
  const names = new Set<string>()
  const re = /import\s*(?:\{([^}]*)\})?[^;{}]*?from\s*["']([^"']+)["']/g
  for (const f of files) {
    for (const m of f.text.matchAll(re)) {
      if (m[2] !== specifier || !m[1]) continue
      for (const part of m[1].split(",")) {
        const n = part
          .trim()
          .split(/\s+as\s+/)[0]
          ?.trim()
        if (n && n !== "default") names.add(n)
      }
    }
  }
  return names
}

/** Named exports declared in the JS files whose path ends with `suffix`. */
function exportsOf(files: DistFile[], suffix: string): Set<string> {
  const names = new Set<string>()
  const collect = (text: string) => {
    for (const m of text.matchAll(/export\s*\{([^}]*)\}/g)) {
      for (const part of m[1]!.split(",")) {
        const n = part
          .trim()
          .split(/\s+as\s+/)
          .pop()
          ?.trim()
        if (n && n !== "default") names.add(n)
      }
    }
    for (const m of text.matchAll(
      /export\s+(?:declare\s+)?(?:async\s+)?(?:const|let|var|class|function)\s+([A-Za-z_$][\w$]*)/g,
    ))
      names.add(m[1]!)
  }
  for (const f of files) {
    const norm = f.name.replace(/^dist\/(?:esm|cjs)\//, "").replace(/\.js$/, "")
    if (suffix === "" ? /(^|\/)index$/.test(norm) : norm === suffix || norm.endsWith(`/${suffix}`))
      collect(f.text)
  }
  return names
}

function gte(a: string, b: string): boolean {
  const pa = a.split(".").map(Number)
  const pb = b.split(".").map(Number)
  for (let i = 0; i < 3; i++) if ((pa[i] ?? 0) !== (pb[i] ?? 0)) return (pa[i] ?? 0) > (pb[i] ?? 0)
  return true
}

// ─────────────────────────────── the check ────────────────────────────────

/** Per-specifier needs: specifier ("" = package root) -> imported names. */
async function chainNeeds(version: string): Promise<Map<string, Set<string>>> {
  const doc = await packument(SOLID_START)
  const chain = new Map<string, { pkg: string; version: string }>()
  chain.set(SOLID_START, { pkg: SOLID_START, version })
  for (const [pkg, ver] of Object.entries(doc.versions[version]!.dependencies ?? {}))
    chain.set(pkg, { pkg, version: ver })
  // second level (solid-start-server etc. import server-core directly)
  for (const { pkg, version: v } of [...chain.values()])
    for (const [pkg2, ver2] of Object.entries(
      (await packument(pkg)).versions[v]?.dependencies ?? {},
    ))
      if (!chain.has(pkg2)) chain.set(pkg2, { pkg: pkg2, version: ver2 })

  // Only @tanstack/* members can import server-core; their pins are exact.
  // Third-party ranges (^2.0.3, npm: aliases) are not resolvable from a
  // packument and can never import server-core, so they are skipped.
  const needs = new Map<string, Set<string>>()
  for (const { pkg, version } of chain.values()) {
    if (pkg === SERVER_CORE || !pkg.startsWith("@tanstack/") || !/^\d/.test(version)) continue
    const files = await distFiles(pkg, version)
    for (const spec of specifiersFor(files, SERVER_CORE)) {
      const sub = spec === SERVER_CORE ? "" : spec.slice(SERVER_CORE.length + 1)
      const names = importedNames(files, spec)
      if (names.size === 0) continue // namespace/default import: no named bindings to check
      const set = needs.get(sub) ?? new Set<string>()
      needs.set(sub, set)
      for (const n of names) set.add(n)
    }
  }
  return needs
}

/** Does server-core@version satisfy every per-subpath need? */
async function satisfies(version: string, needs: Map<string, Set<string>>): Promise<string[]> {
  const doc = await packument(SERVER_CORE)
  const entry = doc.versions[version]!
  const files = await distFiles(SERVER_CORE, version)
  const declared = Object.keys(entry.exports ?? {})
  const missing: string[] = []
  for (const [sub, names] of needs) {
    if (sub !== "" && !declared.some((k) => k === `./${sub}` || k.startsWith(`./${sub}/`))) {
      missing.push(`${sub}: {${[...names].join(", ")}} (subpath not in exports map)`)
      continue
    }
    const have = exportsOf(files, sub)
    const gone = [...names].filter((n) => !have.has(n))
    if (gone.length) missing.push(`${sub || "(root)"}: {${gone.join(", ")}}`)
  }
  return missing
}

async function main() {
  const template = JSON.parse(
    readFileSync(join(ROOT, "templates/tanstack-start-solid/package.json"), "utf8"),
  ) as { dependencies: Record<string, string> }
  const pinned = template.dependencies[SOLID_START]
  if (!pinned) throw new Error(`no ${SOLID_START} in template deps`)

  const workspace = readFileSync(join(ROOT, "pnpm-workspace.yaml"), "utf8")
  const overrideLine = workspace.split("\n").find((l) => l.includes(`"${SERVER_CORE}@`))
  const cappedBelow = overrideLine?.match(/<\s*([\d.]+)/)?.[1]

  console.log(`pinned ${SOLID_START}: ${pinned}`)
  console.log(`override: ${overrideLine?.trim() ?? "(none)"}`)

  const needs = await chainNeeds(pinned)
  for (const [sub, names] of needs)
    console.log(
      `needs from ${SERVER_CORE}${sub ? `/${sub}` : ""}: {${[...names].sort().join(", ")}}`,
    )

  const doc = await packument(SERVER_CORE)
  // Highest version the ceiling ALLOWS — the candidate the override should
  // move to when it becomes compatible. (Not the registry newest: releases
  // past the ceiling are what the cap exists to keep out.)
  const allowed = (v: string) => !cappedBelow || !gte(v, cappedBelow)
  const candidates = Object.keys(doc.versions)
    .filter((v) => gte(v, PATCHED_FLOOR) && allowed(v) && !v.includes("-"))
    .sort((a, b) => (gte(a, b) ? 1 : -1))
  const ceilingMax = candidates.at(-1)
  if (!ceilingMax) throw new Error("no candidate versions under the ceiling")

  let newestOk = ""
  for (const v of candidates) {
    if ((await satisfies(v, needs)).length === 0) {
      newestOk = v
      break // newest-first
    }
  }

  if (!newestOk) {
    // The ceiling's own newest allowed release must satisfy the pinned chain
    // (it did when the cap was set); anything else means the pin, the floor,
    // or the registry moved under us.
    console.log(
      `BLOCKED-UNEXPECTED: no server-core in [${PATCHED_FLOOR}, ${ceilingMax}] satisfies the pinned chain — re-verify the override by hand.`,
    )
    process.exit(CI ? 1 : 0)
  }
  if (newestOk === ceilingMax) {
    // Ceiling is no longer the binding constraint at ceilingMax; check the
    // registry newest to say whether it can be raised or dropped entirely.
    const newestDoc = Object.keys(doc.versions)
      .filter((v) => gte(v, PATCHED_FLOOR) && !v.includes("-"))
      .sort((a, b) => (gte(a, b) ? 1 : -1))
      .at(-1)!
    if ((await satisfies(newestDoc, needs)).length === 0) {
      console.log(
        `UNBLOCKED-READY: the pinned chain is compatible with the newest ${SERVER_CORE} (${newestDoc}) — drop the ceiling entirely.`,
      )
    } else {
      console.log(
        `RAISABLE: ceiling can move to ">=${PATCHED_FLOOR} <=${newestOk}" (newest ${newestDoc} still breaks the chain).`,
      )
    }
    process.exit(CI ? 1 : 0)
  }
  console.log(
    `OK: newest compatible under the ceiling is ${newestOk} < ${ceilingMax}; ceiling stays at <${cappedBelow}.`,
  )

  // Unblock path: does another solid-start channel already work with the
  // registry-newest server-core?
  const startDoc = await packument(SOLID_START)
  const scNewest = Object.keys(doc.versions)
    .filter((v) => gte(v, PATCHED_FLOOR) && !v.includes("-"))
    .sort((a, b) => (gte(a, b) ? 1 : -1))
    .at(-1)!
  // Newest release of each 2.0.0 channel (beta.N / rc.N per pre-id, plus
  // stable "latest"), excluding the pin.
  const channelNewest = new Map<string, string>()
  const chan = /^2\.0\.0-(beta|rc)\.(\d+)$/
  for (const v of Object.keys(startDoc.versions)) {
    const m = chan.exec(v)
    if (!m) continue
    const cur = channelNewest.get(m[1]!)
    if (!cur || Number(m[2]) > Number(chan.exec(cur)![2])) channelNewest.set(m[1]!, v)
  }
  const alts = [...channelNewest.values()].filter((v) => v !== pinned)
  for (const alt of alts) {
    try {
      const altNeeds = await chainNeeds(alt)
      if ((await satisfies(scNewest, altNeeds)).length === 0) {
        console.log(
          `UNBLOCK PATH: bumping the template to ${SOLID_START}@${alt} needs only symbols ${scNewest} provides — bump + drop the ceiling.`,
        )
      } else {
        console.log(`(probed ${SOLID_START}@${alt}: still incompatible with ${scNewest})`)
      }
    } catch (err) {
      console.log(`(probed ${SOLID_START}@${alt}: ${err instanceof Error ? err.message : err})`)
    }
  }
  process.exit(0)
}

main().catch((err) => {
  console.error(`tanstack-start-compat: ${err instanceof Error ? err.message : err}`)
  process.exit(2)
})
