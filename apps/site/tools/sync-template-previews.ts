import { existsSync, readdirSync, statSync, copyFileSync, mkdirSync } from "node:fs"
import { resolve, join } from "node:path"

const workspaceRoot = resolve(process.cwd(), "..", "..")
const templatesDir = resolve(workspaceRoot, "templates")
const publicDir = resolve(process.cwd(), "public", "templates")

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
        if (
          srcStat.mtimeMs === destStat.mtimeMs &&
          srcStat.size === destStat.size
        ) {
          skipped++
          continue
        }
      }
      copyFileSync(src, dest)
      copied++
    }
  }
}

console.log(`Synced template previews: ${copied} copied, ${skipped} skipped`)
