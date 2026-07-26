/**
 * solidiom init — initializes .solidiom/config.json in the current project.
 */

import { Command, Option } from "clipanion"
import { writeFileSync, readFileSync, mkdirSync, existsSync } from "node:fs"
import { join } from "node:path"
import { ConfigSchema, type Config } from "../schemas"
import pc from "picocolors"

export interface InitOptions {
  cwd: string
  force?: boolean
}

export interface InitResult {
  configPath: string
  created: boolean
  config: Config
}

/**
 * Core init logic — usable from CLI and programmatic API.
 */
export function runInit(options: InitOptions): InitResult {
  const { cwd, force = false } = options
  const solidiomDir = join(cwd, ".solidiom")
  const configPath = join(solidiomDir, "config.json")

  if (existsSync(configPath) && !force) {
    const existing = JSON.parse(readFileSync(configPath, "utf8"))
    return { configPath, created: false, config: ConfigSchema.parse(existing) }
  }

  const config = ConfigSchema.parse({})
  mkdirSync(solidiomDir, { recursive: true })
  writeFileSync(configPath, JSON.stringify(config, null, 2) + "\n")

  return { configPath, created: true, config }
}

/**
 * Clipanion command wrapper.
 */
export class InitCommand extends Command {
  static override paths = [["init"]]
  static override usage = Command.Usage({
    description: "Initialize .solidiom/config.json in the current project",
    examples: [
      ["Initialize with defaults", "solidiom init"],
      ["Force overwrite existing config", "solidiom init --force"],
    ],
  })

  force = Option.Boolean("--force", false, { description: "Overwrite existing config" })
  json = Option.Boolean("--json", false, { description: "Output as JSON" })

  async execute(): Promise<number> {
    const result = runInit({ cwd: process.cwd(), force: this.force })

    if (this.json) {
      this.context.stdout.write(JSON.stringify(result, null, 2) + "\n")
      return 0
    }

    if (result.created) {
      this.context.stdout.write(pc.green(`Created ${result.configPath}\n`))
    } else {
      this.context.stdout.write(`Config already exists at ${result.configPath}\n`)
    }
    return 0
  }
}
