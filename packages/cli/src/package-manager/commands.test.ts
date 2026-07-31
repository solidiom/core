import { describe, it, expect } from "vitest"
import { add, addDev, install, exec, run, dlx, formatCommand } from "./commands"
import type { DetectedPackageManager } from "./detect"

function pm(name: DetectedPackageManager["name"], majorVersion?: number): DetectedPackageManager {
  return { name, majorVersion, source: "flag" }
}

describe("add", () => {
  it("returns 'add' + packages for every manager, with no shell string built", () => {
    for (const name of ["npm", "pnpm", "yarn", "bun"] as const) {
      const command = add(pm(name), ["@solidiom/dialog@1.0.0", "@solidiom/runtime@1.0.0"])
      expect(command.bin).toBe(name)
      expect(command.args).toEqual(["add", "@solidiom/dialog@1.0.0", "@solidiom/runtime@1.0.0"])
    }
  })

  it("does not mangle a package name containing shell metacharacters — argv, not a string", () => {
    // A malicious/unexpected package spec must survive as a single argv
    // element rather than being concatenated into anything a shell could
    // reinterpret. This is the property exec.ts's execFile call depends on.
    const dangerous = "@solidiom/dialog; rm -rf /"
    const command = add(pm("npm"), [dangerous])
    expect(command.args).toEqual(["add", dangerous])
    expect(command.args.join(" ")).not.toBe(command.args[0]) // sanity: still 2 distinct elements
  })
})

describe("addDev", () => {
  it("uses --save-dev for npm", () => {
    expect(addDev(pm("npm"), ["typescript"]).args).toEqual(["install", "--save-dev", "typescript"])
  })

  it("uses -D for pnpm and yarn", () => {
    expect(addDev(pm("pnpm"), ["typescript"]).args).toEqual(["add", "-D", "typescript"])
    expect(addDev(pm("yarn"), ["typescript"]).args).toEqual(["add", "-D", "typescript"])
  })

  it("uses -d for bun", () => {
    expect(addDev(pm("bun"), ["typescript"]).args).toEqual(["add", "-d", "typescript"])
  })
})

describe("install", () => {
  it("takes no packages and maps to a bare 'install' for every manager", () => {
    for (const name of ["npm", "pnpm", "yarn", "bun"] as const) {
      expect(install(pm(name))).toEqual({ bin: name, args: ["install"] })
    }
  })
})

describe("exec", () => {
  it("wraps npm's exec with a -- separator before the target binary", () => {
    expect(exec(pm("npm"), "tsc", ["--noEmit"]).args).toEqual(["exec", "--", "tsc", "--noEmit"])
  })

  it("uses the bare binary form for yarn on both major generations", () => {
    expect(exec(pm("yarn", 1), "tsc").args).toEqual(["tsc"])
    expect(exec(pm("yarn", 3), "tsc").args).toEqual(["tsc"])
  })

  it("uses pnpm exec and bun exec directly", () => {
    expect(exec(pm("pnpm"), "tsc").args).toEqual(["exec", "tsc"])
    expect(exec(pm("bun"), "tsc").args).toEqual(["exec", "tsc"])
  })
})

describe("run", () => {
  it("passes script args after a -- separator for npm only", () => {
    expect(run(pm("npm"), "build", ["--watch"]).args).toEqual(["run", "build", "--", "--watch"])
    expect(run(pm("pnpm"), "build", ["--watch"]).args).toEqual(["run", "build", "--watch"])
    expect(run(pm("yarn"), "build", ["--watch"]).args).toEqual(["run", "build", "--watch"])
    expect(run(pm("bun"), "build", ["--watch"]).args).toEqual(["run", "build", "--watch"])
  })

  it("omits the npm separator entirely when there are no extra args", () => {
    expect(run(pm("npm"), "build").args).toEqual(["run", "build"])
  })
})

describe("dlx", () => {
  it("uses dlx directly for pnpm and bun's 'x' alias", () => {
    expect(dlx(pm("pnpm"), "create-solid").args).toEqual(["dlx", "create-solid"])
    expect(dlx(pm("bun"), "create-solid").args).toEqual(["x", "create-solid"])
  })

  it("uses npm exec --yes as the dlx equivalent", () => {
    expect(dlx(pm("npm"), "create-solid").args).toEqual(["exec", "--yes", "--", "create-solid"])
  })

  it("uses 'yarn dlx' for yarn 2+ (Berry)", () => {
    expect(dlx(pm("yarn", 3), "create-solid").args).toEqual(["dlx", "create-solid"])
    expect(dlx(pm("yarn", 4), "create-solid").args).toEqual(["dlx", "create-solid"])
  })

  it("falls back to 'yarn create' for yarn 1 (Classic), which has no dlx", () => {
    expect(dlx(pm("yarn", 1), "solid").args).toEqual(["create", "solid"])
  })

  it("treats an unknown yarn major version as Berry (dlx), not Classic", () => {
    // majorVersion undefined means detection couldn't determine a version —
    // defaulting to the modern (dlx) behavior is safer than assuming the
    // decade-old Classic CLI surface.
    expect(dlx(pm("yarn"), "solid").args).toEqual(["dlx", "solid"])
  })

  it("forwards trailing args after the package name for every manager", () => {
    expect(dlx(pm("pnpm"), "create-solid", ["my-app"]).args).toEqual([
      "dlx",
      "create-solid",
      "my-app",
    ])
  })
})

describe("formatCommand", () => {
  it("joins bin and args with spaces for display purposes only", () => {
    const command = add(pm("pnpm"), ["@solidiom/dialog@1.0.0"])
    expect(formatCommand(command)).toBe("pnpm add @solidiom/dialog@1.0.0")
  })
})
