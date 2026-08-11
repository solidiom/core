import {
  existsSync,
  readdirSync,
  statSync,
  copyFileSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
  rmSync,
} from "node:fs"
import { resolve, join, dirname } from "node:path"
import { execSync } from "node:child_process"

// Find the git common dir so we resolve templates/ from the main checkout
// (where untracked dist/ directories exist), not from a worktree.
let gitCommonDir: string
try {
  gitCommonDir = execSync("git rev-parse --git-common-dir", {
    cwd: process.cwd(),
    encoding: "utf8",
  }).trim()
} catch {
  gitCommonDir = process.cwd()
}

// The main repo root is the parent of the .git directory.
// In a normal checkout: common dir is .git, parent is repo root.
// In a worktree: common dir is .git, parent is still repo root.
const mainRepoRoot = dirname(gitCommonDir)
const templatesDir = resolve(mainRepoRoot, "templates")

const siteRoot = process.cwd()
const publicDir = resolve(siteRoot, "public", "templates", "__preview__")

mkdirSync(publicDir, { recursive: true })

const templateNames = readdirSync(templatesDir, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => d.name)

let copied = 0
let skipped = 0

function shouldCopyFile(src: string, dest: string): boolean {
  if (!existsSync(dest)) return true
  const srcStat = statSync(src)
  const destStat = statSync(dest)
  if (srcStat.size !== destStat.size) return true
  const srcBuf = readFileSync(src)
  const destBuf = readFileSync(dest)
  if (!srcBuf.equals(destBuf)) return true
  return false
}

/**
 * Rewrites root-relative asset paths to relative paths.
 * Template dist/index.html references /assets/foo.js, but when served
 * from /templates/__preview__/{name}/index.html, those resolve to
 * /assets/foo.js (which doesn't exist). Rewriting to ./assets/foo.js
 * makes them resolve relative to the template's own assets/ directory.
 *
 * Also injects a classic <script> just before </body> that resets the
 * browser pathname to "/" via history.replaceState. This is necessary
 * because template apps use path-based routers (e.g. @solidjs/router)
 * whose routes are defined relative to "/", but the preview is served at
 * /templates/__preview__/{name}/index.html inside an iframe. Placing the
 * script after all resource tags ensures relative src/href attributes
 * resolve against the original URL. Module scripts are deferred by spec,
 * so they execute after this classic script has already patched the path.
 */
const PATHNAME_RESET_SCRIPT = `<script>history.replaceState(null,"","/");</script>`

function fixAssetPaths(html: string): string {
  let result = html.replace(/"\/assets\//g, '"./assets/').replace(/'\/assets\//g, "'./assets/")
  // Inject the pathname reset script just before </body>. Module scripts
  // are deferred by spec: they execute in order after the document is parsed,
  // which is after all inline classic scripts have run.
  const bodyCloseIndex = result.indexOf("</body>")
  if (bodyCloseIndex !== -1) {
    result = result.slice(0, bodyCloseIndex) + PATHNAME_RESET_SCRIPT + result.slice(bodyCloseIndex)
  }
  return result
}

function syncDir(src: string, dest: string, preserve?: Set<string>): void {
  const entries = readdirSync(src, { withFileTypes: true })
  const srcNames = new Set(entries.map((e) => e.name))

  // Remove stale files/directories in dest that no longer exist in src.
  if (existsSync(dest)) {
    const destEntries = readdirSync(dest, { withFileTypes: true })
    for (const destEntry of destEntries) {
      if (!srcNames.has(destEntry.name) && !preserve?.has(destEntry.name)) {
        const stalePath = join(dest, destEntry.name)
        rmSync(stalePath, { recursive: true, force: true })
      }
    }
  }

  for (const entry of entries) {
    const srcPath = join(src, entry.name)
    const destPath = join(dest, entry.name)

    if (entry.isDirectory()) {
      mkdirSync(destPath, { recursive: true })
      syncDir(srcPath, destPath)
    } else {
      // For index.html, rewrite asset paths before comparing/writing.
      let destContent: Buffer | null = null
      if (entry.name === "index.html") {
        const raw = readFileSync(srcPath, "utf8")
        destContent = Buffer.from(fixAssetPaths(raw), "utf8")
        if (existsSync(destPath)) {
          const existing = readFileSync(destPath)
          if (existing.equals(destContent)) {
            skipped++
            continue
          }
        }
        writeFileSync(destPath, destContent)
        copied++
      } else if (shouldCopyFile(srcPath, destPath)) {
        copyFileSync(srcPath, destPath)
        copied++
      } else {
        skipped++
      }
    }
  }
}

/**
 * Generates a static index.html for SSR templates whose build output is
 * structured as client/ + server/ without a root index.html. The generated
 * file renders a static preview with just the CSS (no client JS) since the
 * client bundle is a hydration entry that cannot render without a server.
 * The HTML mirrors what the server would render for the "/" route.
 */
function generateSsrFallbackHtml(clientAssetsDir: string, name: string): string {
  const assets = readdirSync(clientAssetsDir)
  const cssEntry = assets.find((f) => f.startsWith("index-") && f.endsWith(".css"))

  const linkTag = cssEntry
    ? `    <link rel="stylesheet" crossorigin href="./client/assets/${cssEntry}">\n`
    : ""

  return (
    `<!doctype html>\n` +
    `<html lang="en">\n` +
    `  <head>\n` +
    `    <meta charset="utf-8" />\n` +
    `    <meta name="viewport" content="width=device-width, initial-scale=1" />\n` +
    `    <title>${name}</title>\n` +
    linkTag +
    `  </head>\n` +
    `  <body>\n` +
    `    <div class="min-h-screen">\n` +
    `      <header class="flex items-center justify-between border-b p-4">\n` +
    `        <h1 class="text-lg font-semibold">Solidiom Starter (SSR)</h1>\n` +
    `        <nav class="flex gap-4">\n` +
    `          <a href="/">Home</a>\n` +
    `          <a href="/about">About</a>\n` +
    `        </nav>\n` +
    `      </header>\n` +
    `      <main class="p-4">\n` +
    `        <section>\n` +
    `          <h2 class="text-xl font-medium">Welcome</h2>\n` +
    `          <p class="mt-2 text-sm text-neutral-600">\n` +
    `            This is a Solidiom starter scaffolded with TanStack Start (Solid), with server-side\n` +
    `            rendering enabled. Edit <code>src/routes/index.tsx</code> to get started.\n` +
    `          </p>\n` +
    `        </section>\n` +
    `      </main>\n` +
    `    </div>\n` +
    `  </body>\n` +
    `</html>\n`
  )
}

for (const name of templateNames) {
  const srcDist = join(templatesDir, name, "dist")
  if (!existsSync(srcDist) || !statSync(srcDist).isDirectory()) {
    continue
  }

  const destBase = join(publicDir, name)
  mkdirSync(destBase, { recursive: true })

  // Determine if this is an SSR template (no source index.html but has client/ assets).
  // If so, we'll generate the index.html after syncing — tell syncDir not to remove it.
  const srcIndex = join(srcDist, "index.html")
  const clientAssetsDir = join(srcDist, "client", "assets")
  const isSsr = !existsSync(srcIndex) && existsSync(clientAssetsDir)

  syncDir(srcDist, destBase, isSsr ? new Set(["index.html"]) : undefined)

  // SSR templates (e.g. TanStack Start) produce client/ + server/ but no
  // root index.html. Generate a static fallback so the preview iframe works.
  if (isSsr) {
    const destIndex = join(destBase, "index.html")
    const fallbackHtml = generateSsrFallbackHtml(clientAssetsDir, name)
    const fallbackBuf = Buffer.from(fallbackHtml, "utf8")
    if (existsSync(destIndex)) {
      const existing = readFileSync(destIndex)
      if (existing.equals(fallbackBuf)) {
        skipped++
      } else {
        writeFileSync(destIndex, fallbackBuf)
        copied++
      }
    } else {
      writeFileSync(destIndex, fallbackBuf)
      copied++
    }
  }
}

console.log(`Synced template previews: ${copied} copied, ${skipped} skipped`)
