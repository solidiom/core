import {
  existsSync,
  readdirSync,
  statSync,
  copyFileSync,
  mkdirSync,
  readFileSync,
  cpSync,
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

function syncDir(src: string, dest: string): void {
  const entries = readdirSync(src, { withFileTypes: true })
  for (const entry of entries) {
    const srcPath = join(src, entry.name)
    const destPath = join(dest, entry.name)

    if (entry.isDirectory()) {
      mkdirSync(destPath, { recursive: true })
      syncDir(srcPath, destPath)
    } else {
      if (shouldCopyFile(srcPath, destPath)) {
        copyFileSync(srcPath, destPath)
        copied++
      } else {
        skipped++
      }
    }
  }
}

for (const name of templateNames) {
  const srcDist = join(templatesDir, name, "dist")
  if (!existsSync(srcDist) || !statSync(srcDist).isDirectory()) {
    continue
  }

  const destBase = join(publicDir, name)

  // Remove old preview so newly deleted source files are reflected.
  if (existsSync(destBase)) {
    rmSync(destBase, { recursive: true, force: true })
  }

  mkdirSync(destBase, { recursive: true })
  syncDir(srcDist, destBase)
}

console.log(`Synced template previews: ${copied} copied, ${skipped} skipped`)
