import { existsSync, readdirSync, statSync, copyFileSync, mkdirSync, readFileSync } from "node:fs"
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

for (const name of templateNames) {
  const srcDist = join(templatesDir, name, "dist")
  if (!existsSync(srcDist) || !statSync(srcDist).isDirectory()) {
    continue
  }

  const destBase = join(publicDir, name)
  mkdirSync(destBase, { recursive: true })

  const entries = readdirSync(srcDist, { withFileTypes: true })
  for (const entry of entries) {
    const src = join(srcDist, entry.name)
    const dest = join(destBase, entry.name)

    if (entry.isDirectory()) {
      mkdirSync(dest, { recursive: true })
    } else {
      const srcStat = statSync(src)
      if (existsSync(dest)) {
        const destStat = statSync(dest)
        // Compare size first (cheap), then content bytes if sizes match.
        // copyFileSync changes mtime, so mtime-based skip doesn't work.
        if (srcStat.size === destStat.size) {
          const srcBuf = readFileSync(src)
          const destBuf = readFileSync(dest)
          if (srcBuf.equals(destBuf)) {
            skipped++
            continue
          }
        }
      }
      copyFileSync(src, dest)
      copied++
    }
  }
}

console.log(`Synced template previews: ${copied} copied, ${skipped} skipped`)
