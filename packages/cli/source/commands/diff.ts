/**
 * solidiom diff — show digest-based diff between installed source and upstream.
 */

import { Command, Option } from "clipanion"
import { existsSync, readFileSync } from "node:fs"
import { join } from "node:path"
import { readLock, computeDigest } from "../source/install"
import pc from "picocolors"

export interface DiffEntry {
  path: string
  primitive: string
  status: "unchanged" | "modified" | "deleted" | "new"
}

export interface DiffResult {
  entries: DiffEntry[]
  hasChanges: boolean
}

/**
 * Core diff logic — compares installed files against lockfile digests.
 */
export function runDiff(options: { cwd: string; primitive?: string }): DiffResult {
  const { cwd, primitive } = options
  const lock = readLock(cwd)

  const entries: DiffEntry[] = []

  for (const [path, lockEntry] of Object.entries(lock.installed)) {
    if (primitive && lockEntry.primitive !== primitive) continue

    const fullPath = join(cwd, path)
    if (!existsSync(fullPath)) {
      entries.push({ path, primitive: lockEntry.primitive, status: "deleted" })
    } else {
      const currentContent = readFileSync(fullPath, "utf8")
      const currentDigest = computeDigest(currentContent)
      const status = currentDigest === lockEntry.digest ? "unchanged" : "modified"
      entries.push({ path, primitive: lockEntry.primitive, status })
    }
  }

  return { entries, hasChanges: entries.some((e) => e.status !== "unchanged") }
}

export class DiffCommand extends Command {
  static override paths = [["diff"]]
  static override usage = Command.Usage({
    description: "Show changes between installed source and lockfile digests",
    examples: [
      ["Diff all installed primitives", "solidiom diff"],
      ["Diff specific primitive", "solidiom diff --primitive dialog"],
    ],
  })

  primitive = Option.String("--primitive", { description: "Filter by primitive name" })
  json = Option.Boolean("--json", false, { description: "Output as JSON" })

  async execute(): Promise<number> {
    const result = runDiff({ cwd: process.cwd(), primitive: this.primitive })

    if (this.json) {
      this.context.stdout.write(JSON.stringify(result, null, 2) + "\n")
      return 0
    }

    if (!result.hasChanges) {
      this.context.stdout.write(pc.green("No local modifications.\n"))
      return 0
    }

    for (const entry of result.entries) {
      switch (entry.status) {
        case "modified":
          this.context.stdout.write(pc.yellow(`  M ${entry.path}\n`))
          break
        case "deleted":
          this.context.stdout.write(pc.red(`  D ${entry.path}\n`))
          break
        case "new":
          this.context.stdout.write(pc.green(`  A ${entry.path}\n`))
          break
      }
    }
    return 0
  }
}
