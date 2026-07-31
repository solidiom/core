/**
 * Project-local config generation (CLI-007).
 *
 * Writes `.solidiom/config.json` into a freshly materialized project so it
 * is immediately `solidiom add`-able, per the plan's acceptance wording.
 * Kept separate from materialize.ts per the plan's file split: materialize.ts
 * owns copying/substituting the template's own files, config-gen.ts owns
 * generating the Solidiom-specific config that every template shares
 * regardless of which one was chosen.
 */

import { mkdirSync, writeFileSync } from "node:fs"
import { join } from "node:path"
import { ConfigSchema } from "../schemas"
import type { PackageManagerName } from "../package-manager/detect"

export type StylingProfile = "css" | "tailwind" | "unocss"

export interface GenerateProjectConfigOptions {
  destination: string
  projectName: string
  styling?: StylingProfile
  packageManager?: PackageManagerName
}

export interface GenerateProjectConfigResult {
  filesWritten: string[]
}

/**
 * Writes `.solidiom/config.json` into `destination`, mirroring init.ts's
 * exact write pattern (`mkdirSync` + `writeFileSync(...,
 * JSON.stringify(config, null, 2) + "\n")`) so config files are byte-shape
 * consistent across `solidiom init` and `solidiom create`.
 *
 * `styling`, when provided, is threaded into the config as
 * `stylingProfile` — note this is not currently a ConfigSchema field, so it
 * is only included in the written JSON when explicitly passed, via a plain
 * object spread rather than a schema field, to avoid silently inventing an
 * unvalidated shape. `packageManager` is accepted for symmetry with the
 * options `create` collects, but is not persisted into config.json today —
 * package-manager choice is a one-time install-time decision (CLI-005),
 * not an ongoing project setting `plan`/`add` need to re-read.
 */
export function generateProjectConfig(
  options: GenerateProjectConfigOptions,
): GenerateProjectConfigResult {
  const { destination, styling } = options

  const solidiomDir = join(destination, ".solidiom")
  const configPath = join(solidiomDir, "config.json")

  const config = {
    ...ConfigSchema.parse({}),
    ...(styling ? { stylingProfile: styling } : {}),
  }

  mkdirSync(solidiomDir, { recursive: true })
  writeFileSync(configPath, JSON.stringify(config, null, 2) + "\n")

  return { filesWritten: [join(".solidiom", "config.json")] }
}
