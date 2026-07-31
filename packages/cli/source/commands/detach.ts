/**
 * solidiom detach — marks source-installed files as detached from upstream updates.
 *
 * Non-destructive: only updates .solidiom/lock.json metadata.
 * Detached files are skipped by `solidiom update`.
 */

import { Command, Option } from "clipanion"
import { readLock, writeLock } from "../source-install/install"
import pc from "picocolors"

export interface DetachResult {
  detached: string[]
  alreadyDetached: string[]
}

/**
 * Core detach logic — marks files as detached in the lockfile.
 */
export function runDetach(options: { cwd: string; primitive: string }): DetachResult {
  const { cwd, primitive } = options
  const lock = readLock(cwd)
  const detached: string[] = []
  const alreadyDetached: string[] = []

  for (const [path, entry] of Object.entries(lock.installed)) {
    if (entry.primitive !== primitive) continue

    if (entry.detached) {
      alreadyDetached.push(path)
    } else {
      entry.detached = true
      detached.push(path)
    }
  }

  if (detached.length > 0) {
    writeLock(cwd, lock)
  }

  return { detached, alreadyDetached }
}

export class DetachCommand extends Command {
  static override paths = [["detach"]]
  static override usage = Command.Usage({
    description: "Detach a source-installed primitive from upstream updates",
    examples: [["Detach dialog", "solidiom detach dialog"]],
  })

  primitive = Option.String({ required: true })
  json = Option.Boolean("--json", false, { description: "Output as JSON" })

  async execute(): Promise<number> {
    const result = runDetach({ cwd: process.cwd(), primitive: this.primitive })

    if (this.json) {
      this.context.stdout.write(JSON.stringify(result, null, 2) + "\n")
      return 0
    }

    if (result.detached.length === 0 && result.alreadyDetached.length === 0) {
      this.context.stderr.write(
        pc.yellow(`No source-installed files found for ${this.primitive}\n`),
      )
      return 1
    }

    for (const path of result.detached) {
      this.context.stdout.write(pc.green(`  Detached: ${path}\n`))
    }
    for (const path of result.alreadyDetached) {
      this.context.stdout.write(`  Already detached: ${path}\n`)
    }

    this.context.stdout.write(
      pc.bold(
        `\n${result.detached.length} files detached. They will be skipped by 'solidiom update'.\n`,
      ),
    )
    return 0
  }
}
