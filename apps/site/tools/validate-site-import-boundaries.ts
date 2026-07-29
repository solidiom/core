#!/usr/bin/env tsx
/**
 * SITE-012 static-route import boundary validator.
 *
 * Static Astro routes may not reach playground, theme-builder, editor, or
 * compiler modules, either directly or through a transitive local import.
 * Route-local tool entries are exempt because they form their own lazy route
 * boundaries. This intentionally analyzes `.astro` frontmatter as well as
 * TypeScript/JavaScript modules, so Astro routes cannot bypass the rule.
 */
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs"
import { tmpdir } from "node:os"
import { dirname, extname, join, normalize, relative, resolve, sep } from "node:path"
import { fileURLToPath } from "node:url"

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..")
const sourceRoot = join(projectRoot, "src")
const pagesRoot = join(sourceRoot, "pages")
const extensions = [".astro", ".ts", ".tsx", ".js", ".jsx", ".mts", ".mjs"]
const importPattern = /(?:import\s+(?:[\s\S]*?\s+from\s+)?|export\s+(?:[\s\S]*?\s+from\s+)?|import\s*\()\s*["']([^"']+)["']/g
const forbiddenPackagePattern = /^(?:@babel\/|babel-|monaco-editor(?:\/|$)|@codemirror(?:\/|$)|codemirror$)/
const forbiddenPathPattern = /(?:^|\/)(?:playground|theme-builder|themes\/builder|editor|compiler)(?:\/|$)/

interface Violation {
  chain: string[]
  specifier: string
  reason: string
}

function isFile(pathname: string): boolean {
  return existsSync(pathname) && extname(pathname) !== ""
}

function resolveLocalImport(fromFile: string, specifier: string, root = sourceRoot): string | undefined {
  const aliases: Record<string, string> = {
    "@components/": join(root, "components") + sep,
    "@layouts/": join(root, "layouts") + sep,
    "@lib/": join(root, "lib") + sep,
    "@assets/": join(root, "assets") + sep,
  }

  let candidate: string | undefined
  if (specifier.startsWith(".")) {
    candidate = resolve(dirname(fromFile), specifier)
  } else {
    const alias = Object.entries(aliases).find(([prefix]) => specifier.startsWith(prefix))
    if (alias) candidate = join(alias[1], specifier.slice(alias[0].length))
  }

  if (!candidate) return undefined
  if (isFile(candidate)) return candidate

  for (const extension of extensions) {
    if (isFile(`${candidate}${extension}`)) return `${candidate}${extension}`
  }

  for (const extension of extensions) {
    const indexFile = join(candidate, `index${extension}`)
    if (isFile(indexFile)) return indexFile
  }

  return undefined
}

function importSpecifiers(source: string): string[] {
  return [...source.matchAll(importPattern)].map((match) => match[1])
}

function isToolRoute(pathname: string, root = pagesRoot): boolean {
  const routePath = relative(root, pathname).split(sep).join("/")
  return routePath.startsWith("playground/") || routePath.startsWith("themes/builder/")
}

function routeFiles(root = pagesRoot): string[] {
  const pending = [root]
  const files: string[] = []

  while (pending.length > 0) {
    const directory = pending.pop()!
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      const pathname = join(directory, entry.name)
      if (entry.isDirectory()) pending.push(pathname)
      else if (entry.isFile() && extname(entry.name) === ".astro" && !isToolRoute(pathname, root)) {
        files.push(pathname)
      }
    }
  }

  return files.sort()
}

function findViolationsForRoute(route: string, sourceRootForRoute = sourceRoot): Violation[] {
  const violations: Violation[] = []
  const visited = new Set<string>()

  const visit = (pathname: string, chain: string[]) => {
    const normalizedPath = normalize(pathname)
    if (visited.has(normalizedPath)) return
    visited.add(normalizedPath)

    const source = readFileSync(normalizedPath, "utf8")
    for (const specifier of importSpecifiers(source)) {
      if (forbiddenPackagePattern.test(specifier)) {
        violations.push({ chain, specifier, reason: "forbidden package" })
        continue
      }

      const importedFile = resolveLocalImport(normalizedPath, specifier, sourceRootForRoute)
      const normalizedSpecifier = specifier.replaceAll("\\", "/")
      if (forbiddenPathPattern.test(normalizedSpecifier) || (importedFile && forbiddenPathPattern.test(importedFile.replaceAll("\\", "/")))) {
        violations.push({ chain, specifier, reason: "forbidden tool module" })
        continue
      }

      if (importedFile) visit(importedFile, [...chain, importedFile])
    }
  }

  visit(route, [route])
  return violations
}

function displayPath(pathname: string, root = projectRoot): string {
  return relative(root, pathname).split(sep).join("/")
}

function validateProject(): Violation[] {
  return routeFiles().flatMap((route) => findViolationsForRoute(route))
}

function runSelfTest(): void {
  const fixtureRoot = mkdtempSync(join(tmpdir(), "solidiom-site-boundary-"))
  try {
    const fixtureSource = join(fixtureRoot, "src")
    const fixturePages = join(fixtureSource, "pages")
    const fixtureRoute = join(fixturePages, "index.astro")
    const fixtureShared = join(fixtureSource, "components", "shared.ts")
    const fixtureTool = join(fixtureSource, "playground", "compiler.ts")

    mkdirSync(dirname(fixtureRoute), { recursive: true })
    mkdirSync(dirname(fixtureShared), { recursive: true })
    mkdirSync(dirname(fixtureTool), { recursive: true })
    writeFileSync(fixtureRoute, '---\nimport "../components/shared"\n---\n<main />\n')
    writeFileSync(fixtureShared, 'import "../playground/compiler"\n')
    writeFileSync(fixtureTool, "export const compiler = true\n")

    const violations = findViolationsForRoute(fixtureRoute, fixtureSource)
    if (violations.length !== 1 || violations[0].reason !== "forbidden tool module") {
      throw new Error("Boundary self-test did not reject a transitive static-route import.")
    }

    const toolRoute = join(fixturePages, "themes", "builder", "index.astro")
    mkdirSync(dirname(toolRoute), { recursive: true })
    writeFileSync(toolRoute, '---\nimport "../../../playground/compiler"\n---\n<main />\n')
    if (!isToolRoute(toolRoute, fixturePages)) {
      throw new Error("Boundary self-test did not recognize the approved themes/builder route.")
    }
  } finally {
    rmSync(fixtureRoot, { recursive: true, force: true })
  }
}

if (process.argv.includes("--self-test")) {
  runSelfTest()
  console.log("SITE-012 boundary self-test passed.")
  process.exit(0)
}

const violations = validateProject()
if (violations.length > 0) {
  console.error("SITE-012 import-boundary violations found:\n")
  for (const violation of violations) {
    console.error(`- ${violation.reason}: ${violation.specifier}`)
    console.error(`  ${violation.chain.map((pathname) => displayPath(pathname)).join(" -> ")}`)
  }
  process.exit(1)
}

console.log(`SITE-012 import boundaries passed for ${routeFiles().length} static Astro route(s).`)
