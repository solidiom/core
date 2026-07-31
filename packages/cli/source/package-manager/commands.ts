/**
 * Normalized package-manager command construction (CLI-005).
 *
 * Each function returns an argv array — never a shell string — for a given
 * `DetectedPackageManager`. Callers pass the array straight to `execFile`
 * (see exec.ts); nothing here concatenates user input into a command line.
 *
 * The one place the four managers genuinely diverge in shape (beyond the
 * binary name) is yarn's dev-dependency flag and its "run a package without
 * installing it" command, both of which changed between yarn 1 (Classic)
 * and yarn 2+ (Berry):
 *   - yarn 1:  `yarn add -D <pkg>`      `yarn create <name>` (implicit dlx)
 *   - yarn 2+: `yarn add -D <pkg>`      `yarn dlx <pkg>`
 * The dev flag is actually identical, but `dlx` only exists from yarn 2
 * onward — yarn 1 has no dlx equivalent and `yarn create` is the closest
 * substitute for scaffolding use cases. See `dlx()` below.
 */

import type { DetectedPackageManager, PackageManagerName } from "./detect"

export interface PackageManagerCommand {
  /** The binary to invoke, e.g. "pnpm". */
  bin: PackageManagerName
  /** Full argv, bin excluded — pass to execFile(bin, args). */
  args: string[]
}

function isYarnClassic(pm: DetectedPackageManager): boolean {
  return pm.name === "yarn" && pm.majorVersion !== undefined && pm.majorVersion < 2
}

/** `<pm> add <packages...>` — install one or more packages as dependencies. */
export function add(pm: DetectedPackageManager, packages: string[]): PackageManagerCommand {
  return { bin: pm.name, args: ["add", ...packages] }
}

/** `<pm> add -D <packages...>` — install as dev dependencies. */
export function addDev(pm: DetectedPackageManager, packages: string[]): PackageManagerCommand {
  switch (pm.name) {
    case "npm":
      return { bin: "npm", args: ["install", "--save-dev", ...packages] }
    case "pnpm":
      return { bin: "pnpm", args: ["add", "-D", ...packages] }
    case "yarn":
      return { bin: "yarn", args: ["add", "-D", ...packages] }
    case "bun":
      return { bin: "bun", args: ["add", "-d", ...packages] }
  }
}

/** `<pm> install` — install everything from the lockfile/manifest, no arguments. */
export function install(pm: DetectedPackageManager): PackageManagerCommand {
  switch (pm.name) {
    case "npm":
      return { bin: "npm", args: ["install"] }
    case "pnpm":
      return { bin: "pnpm", args: ["install"] }
    case "yarn":
      return { bin: "yarn", args: ["install"] }
    case "bun":
      return { bin: "bun", args: ["install"] }
  }
}

/** `<pm> exec <bin> [args...]` — run a binary already present in node_modules/.bin. */
export function exec(pm: DetectedPackageManager, bin: string, args: string[] = []): PackageManagerCommand {
  switch (pm.name) {
    case "npm":
      return { bin: "npm", args: ["exec", "--", bin, ...args] }
    case "pnpm":
      return { bin: "pnpm", args: ["exec", bin, ...args] }
    case "yarn":
      // yarn 1 and yarn 2+ both support `yarn <bin> [args]` for locally
      // installed binaries; `yarn exec` also exists on yarn 2+ but the bare
      // form works on both generations, so it is preferred here.
      return { bin: "yarn", args: [bin, ...args] }
    case "bun":
      return { bin: "bun", args: ["exec", bin, ...args] }
  }
}

/** `<pm> run <script> [args...]` — run a package.json script. */
export function run(pm: DetectedPackageManager, script: string, args: string[] = []): PackageManagerCommand {
  switch (pm.name) {
    case "npm":
      return { bin: "npm", args: ["run", script, ...(args.length > 0 ? ["--", ...args] : [])] }
    case "pnpm":
      return { bin: "pnpm", args: ["run", script, ...args] }
    case "yarn":
      return { bin: "yarn", args: ["run", script, ...args] }
    case "bun":
      return { bin: "bun", args: ["run", script, ...args] }
  }
}

/**
 * `<pm> dlx <package> [args...]` — download and run a package without
 * adding it as a project dependency (e.g. for template scaffolding tools).
 *
 * yarn 1 (Classic) has no dlx equivalent; `yarn create <name> [args]` is
 * yarn 1's closest substitute (it resolves and runs `create-<name>` without
 * a persistent install) and is used for that generation instead.
 */
export function dlx(
  pm: DetectedPackageManager,
  pkg: string,
  args: string[] = [],
): PackageManagerCommand {
  switch (pm.name) {
    case "npm":
      return { bin: "npm", args: ["exec", "--yes", "--", pkg, ...args] }
    case "pnpm":
      return { bin: "pnpm", args: ["dlx", pkg, ...args] }
    case "yarn":
      if (isYarnClassic(pm)) {
        return { bin: "yarn", args: ["create", pkg, ...args] }
      }
      return { bin: "yarn", args: ["dlx", pkg, ...args] }
    case "bun":
      return { bin: "bun", args: ["x", pkg, ...args] }
  }
}

/** Formats a command for display (e.g. in --dry-run output or the `add` command's default print path). */
export function formatCommand(command: PackageManagerCommand): string {
  return [command.bin, ...command.args].join(" ")
}
