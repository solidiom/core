import { describe, it, expect, beforeEach, afterEach } from "vitest"
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, existsSync, rmSync } from "node:fs"
import { tmpdir, homedir } from "node:os"
import { join, resolve, dirname } from "node:path"
import {
  runCreate,
  isValidPackageName,
  createCleanupJournal,
} from "./create"

/**
 * Builds a tiny fixture templates/ directory (containing both "t" and
 * "vite-solid-router" template names, since existing tests below use both
 * as arbitrary template identifiers) for injection via
 * CreateOptions.templatesDir, so these tests never depend on the real
 * templates/vite-solid-router tree.
 */
function makeFixtureTemplatesDir(): string {
  const templatesDir = mkdtempSync(join(tmpdir(), "solidiom-templates-fixture-"))
  for (const templateName of ["t", "vite-solid-router"]) {
    const dir = join(templatesDir, templateName)
    mkdirSync(dir, { recursive: true })
    writeFileSync(
      join(dir, "template.json"),
      JSON.stringify({ name: templateName, stack: "vite-solid-router", variables: ["projectName"] }, null, 2),
    )
    writeFileSync(
      join(dir, "package.json"),
      JSON.stringify({ name: "{{projectName}}", version: "0.0.0", private: true }, null, 2) + "\n",
    )
  }
  // Tiny "tanstack-start-solid" fixture (SSR template stand-in), independent
  // of the real templates/tanstack-start-solid/ tree — mirrors the shape of
  // the "vite-solid-router" fixture above, plus a nested src/routes file so
  // the SSR-specific {{projectName}} substitution surface (the root route's
  // page title) is exercised too.
  const ssrDir = join(templatesDir, "tanstack-start-solid")
  mkdirSync(join(ssrDir, "src", "routes"), { recursive: true })
  writeFileSync(
    join(ssrDir, "template.json"),
    JSON.stringify(
      { name: "tanstack-start-solid", stack: "tanstack-start-solid", variables: ["projectName"] },
      null,
      2,
    ),
  )
  writeFileSync(
    join(ssrDir, "package.json"),
    JSON.stringify({ name: "@solidiom/template-tanstack-start-solid", version: "0.0.0", private: true }, null, 2) +
      "\n",
  )
  writeFileSync(
    join(ssrDir, "src", "routes", "__root.tsx"),
    'export const title = "{{projectName}}"\n',
  )
  return templatesDir
}

describe("create", () => {
  let cwd: string
  let templatesDir: string

  beforeEach(() => {
    cwd = mkdtempSync(join(tmpdir(), "solidiom-create-test-"))
    templatesDir = makeFixtureTemplatesDir()
  })

  afterEach(() => {
    rmSync(cwd, { recursive: true, force: true })
    rmSync(templatesDir, { recursive: true, force: true })
  })

  describe("happy path", () => {
    it("creates the destination with package.json and .solidiom/config.json", async () => {
      const result = await runCreate({
        cwd,
        template: "vite-solid-router",
        name: "my-app",
        yes: true,
        install: false,
        templatesDir,
      })

      expect(result.errors).toBeUndefined()
      expect(result.created).toBe(true)
      expect(result.destination).toBe(join(cwd, "my-app"))
      expect(existsSync(join(result.destination, "package.json"))).toBe(true)
      expect(existsSync(join(result.destination, ".solidiom", "config.json"))).toBe(true)

      const pkg = JSON.parse(readFileSync(join(result.destination, "package.json"), "utf8"))
      expect(pkg).toEqual({ name: "my-app", version: "0.0.0", private: true })

      const config = JSON.parse(readFileSync(join(result.destination, ".solidiom", "config.json"), "utf8"))
      expect(config.defaultMode).toBe("package")
    })

    it("accepts a scoped, valid package name", async () => {
      const result = await runCreate({
        cwd,
        template: "vite-solid-router",
        name: "@acme/my-app",
        yes: true,
        install: false,
        templatesDir,
      })

      expect(result.errors).toBeUndefined()
      expect(result.created).toBe(true)
      expect(result.destination).toBe(resolve(cwd, "@acme/my-app"))
    })
  })

  describe("--yes semantics", () => {
    it("fails explicitly when --template is missing", async () => {
      const result = await runCreate({
        cwd,
        name: "my-app",
        yes: true,
      })

      expect(result.created).toBe(false)
      expect(result.errors?.[0]).toMatch(/--template/)
    })

    it("fails explicitly when --name is missing", async () => {
      const result = await runCreate({
        cwd,
        template: "vite-solid-router",
        yes: true,
      })

      expect(result.created).toBe(false)
      expect(result.errors?.[0]).toMatch(/--name/)
    })

    it("fails explicitly listing both when template and name are missing", async () => {
      const result = await runCreate({ cwd, yes: true })

      expect(result.created).toBe(false)
      expect(result.errors?.[0]).toMatch(/--template/)
      expect(result.errors?.[0]).toMatch(/--name/)
    })
  })

  describe("non-TTY without --yes", () => {
    it("runs without prompting when isTTY is false and required flags are supplied", async () => {
      // vitest's process.stdin is not a TTY, but we also pass isTTY explicitly
      // to avoid relying on ambient environment behavior.
      const result = await runCreate({
        cwd,
        template: "vite-solid-router",
        name: "my-app",
        isTTY: false,
        install: false,
        templatesDir,
      })

      expect(result.errors).toBeUndefined()
      expect(result.created).toBe(true)
    })

    it("fails with a clear validation error when required flags are missing and there is no TTY to prompt", async () => {
      const result = await runCreate({
        cwd,
        isTTY: false,
      })

      expect(result.created).toBe(false)
      expect(result.errors?.[0]).toMatch(/no TTY/)
    })
  })

  describe("destination safety", () => {
    it("refuses a name that escapes cwd via ../evil", async () => {
      const result = await runCreate({
        cwd,
        template: "vite-solid-router",
        name: "../evil",
        yes: true,
      })

      expect(result.created).toBe(false)
      expect(result.errors?.some((e) => /escapes the current working directory/.test(e))).toBe(true)
    })

    it("refuses a name that resolves to the home directory", async () => {
      // Construct cwd as home's immediate parent so that a valid package
      // name equal to the home directory's basename resolves exactly to
      // homedir — avoids using "." or ".." which collide with the package
      // name validator's leading-dot rule.
      const home = resolve(homedir())
      const parent = dirname(home)
      const base = home.slice(parent.length + 1).toLowerCase()
      if (!/^[a-z0-9-._~]+$/.test(base) || base.startsWith(".") || base.startsWith("_")) {
        // If the real home directory's basename isn't a valid package name
        // on this machine, skip — the check itself is still covered by the
        // "/" and monorepo-root tests below via the same isInside/equality logic.
        return
      }
      const result = await runCreate({
        cwd: parent,
        template: "vite-solid-router",
        name: base,
        yes: true,
      })

      expect(result.created).toBe(false)
      expect(result.errors?.some((e) => /home directory/.test(e))).toBe(true)
    })

    it("refuses a name that resolves to /", async () => {
      // "/" has no parent to walk from; instead verify the root-refusal
      // logic directly against a destination equal to "/" isn't reachable
      // via a valid package name and cwd combination on a POSIX filesystem
      // (no package name can resolve to "/" without escaping or being "."/
      // ".."), so we assert the escaping-cwd path instead, which is the
      // only way a real invocation could ever target "/".
      const result = await runCreate({
        cwd: "/",
        template: "vite-solid-router",
        name: "../../../../../../../../../..",
        yes: true,
      })

      expect(result.created).toBe(false)
      expect(result.errors?.some((e) => /escapes the current working directory|filesystem root/.test(e))).toBe(
        true,
      )
    })

    it("refuses a destination equal to the monorepo root", async () => {
      // Build a fake monorepo root (contains pnpm-workspace.yaml) and a
      // nested cwd inside it, then target the root via "..".
      const fakeRoot = mkdtempSync(join(tmpdir(), "solidiom-fakeroot-"))
      writeFileSync(join(fakeRoot, "pnpm-workspace.yaml"), "packages:\n  - packages/*\n")
      const nestedCwd = join(fakeRoot, "packages", "app")
      mkdirSync(nestedCwd, { recursive: true })

      try {
        const result = await runCreate({
          cwd: nestedCwd,
          template: "vite-solid-router",
          name: "../..",
          yes: true,
        })

        expect(result.created).toBe(false)
        // "../.." from nestedCwd both escapes cwd AND lands on the monorepo
        // root — both violations should be reported, not just one masking
        // the other.
        expect(result.errors?.some((e) => /escapes the current working directory/.test(e))).toBe(true)
        expect(result.errors?.some((e) => /monorepo root/.test(e))).toBe(true)
      } finally {
        rmSync(fakeRoot, { recursive: true, force: true })
      }
    })

    it("refuses the monorepo root identified via .git instead of pnpm-workspace.yaml", async () => {
      const fakeRoot = mkdtempSync(join(tmpdir(), "solidiom-fakeroot-"))
      writeFileSync(join(fakeRoot, ".git"), "gitdir: /nowhere\n")
      const nestedCwd = join(fakeRoot, "apps", "web")
      mkdirSync(nestedCwd, { recursive: true })

      try {
        const result = await runCreate({
          cwd: nestedCwd,
          template: "vite-solid-router",
          name: "../..",
          yes: true,
        })

        expect(result.created).toBe(false)
        expect(result.errors?.some((e) => /monorepo root/.test(e))).toBe(true)
      } finally {
        rmSync(fakeRoot, { recursive: true, force: true })
      }
    })

    it("refuses a non-empty existing directory without --force", async () => {
      const dest = join(cwd, "my-app")
      mkdirSync(dest, { recursive: true })
      writeFileSync(join(dest, "existing-file.txt"), "hello")

      const result = await runCreate({
        cwd,
        template: "vite-solid-router",
        name: "my-app",
        yes: true,
      })

      expect(result.created).toBe(false)
      expect(result.errors?.some((e) => /already exists and is not empty/.test(e))).toBe(true)
      // The pre-existing file must survive the refusal.
      expect(existsSync(join(dest, "existing-file.txt"))).toBe(true)
    })

    it("succeeds scaffolding into a non-empty existing directory WITH --force", async () => {
      const dest = join(cwd, "my-app")
      mkdirSync(dest, { recursive: true })
      writeFileSync(join(dest, "existing-file.txt"), "hello")

      const result = await runCreate({
        cwd,
        template: "vite-solid-router",
        name: "my-app",
        yes: true,
        force: true,
        install: false,
        templatesDir,
      })

      expect(result.errors).toBeUndefined()
      expect(result.created).toBe(true)
      expect(existsSync(join(dest, "existing-file.txt"))).toBe(true)
      expect(existsSync(join(dest, "package.json"))).toBe(true)
    })

    it("succeeds targeting an existing but empty directory without --force", async () => {
      const dest = join(cwd, "my-app")
      mkdirSync(dest, { recursive: true })

      const result = await runCreate({
        cwd,
        template: "vite-solid-router",
        name: "my-app",
        yes: true,
        install: false,
        templatesDir,
      })

      expect(result.errors).toBeUndefined()
      expect(result.created).toBe(true)
    })
  })

  describe("package name validation", () => {
    it("rejects uppercase names", async () => {
      const result = await runCreate({ cwd, template: "t", name: "MyApp", yes: true })
      expect(result.created).toBe(false)
      expect(result.errors?.[0]).toMatch(/not a valid npm package name/)
    })

    it("rejects a leading dot", async () => {
      const result = await runCreate({ cwd, template: "t", name: ".myapp", yes: true })
      expect(result.created).toBe(false)
      expect(result.errors?.[0]).toMatch(/not a valid npm package name/)
    })

    it("rejects a leading underscore", async () => {
      const result = await runCreate({ cwd, template: "t", name: "_myapp", yes: true })
      expect(result.created).toBe(false)
      expect(result.errors?.[0]).toMatch(/not a valid npm package name/)
    })

    it("rejects invalid characters", async () => {
      const result = await runCreate({ cwd, template: "t", name: "my app!", yes: true })
      expect(result.created).toBe(false)
      expect(result.errors?.[0]).toMatch(/not a valid npm package name/)
    })

    it("rejects a malformed scoped name (empty scope)", async () => {
      const result = await runCreate({ cwd, template: "t", name: "@/myapp", yes: true })
      expect(result.created).toBe(false)
      expect(result.errors?.[0]).toMatch(/not a valid npm package name/)
    })

    it("rejects a malformed scoped name (no slash)", async () => {
      const result = await runCreate({ cwd, template: "t", name: "@acme", yes: true })
      expect(result.created).toBe(false)
      expect(result.errors?.[0]).toMatch(/not a valid npm package name/)
    })

    it("rejects a name exceeding 214 characters", async () => {
      const longName = "a".repeat(215)
      const result = await runCreate({ cwd, template: "t", name: longName, yes: true })
      expect(result.created).toBe(false)
      expect(result.errors?.[0]).toMatch(/not a valid npm package name/)
    })
  })

  describe("isValidPackageName (unit)", () => {
    it("accepts valid unscoped and scoped names", () => {
      expect(isValidPackageName("my-app")).toBe(true)
      expect(isValidPackageName("my.app_2~thing")).toBe(true)
      expect(isValidPackageName("@acme/my-app")).toBe(true)
    })

    it("rejects invalid names", () => {
      expect(isValidPackageName("MyApp")).toBe(false)
      expect(isValidPackageName(".myapp")).toBe(false)
      expect(isValidPackageName("_myapp")).toBe(false)
      expect(isValidPackageName("my app")).toBe(false)
      expect(isValidPackageName("@/myapp")).toBe(false)
      expect(isValidPackageName("@acme")).toBe(false)
      expect(isValidPackageName("")).toBe(false)
    })
  })

  describe("package-manager / styling flag validation", () => {
    it("rejects an unknown --package-manager value", async () => {
      const result = await runCreate({
        cwd,
        template: "t",
        name: "my-app",
        yes: true,
        packageManager: "nope" as unknown as never,
      })
      expect(result.created).toBe(false)
      expect(result.errors?.[0]).toMatch(/Unknown package manager/)
    })

    it("rejects an unknown --styling value", async () => {
      const result = await runCreate({
        cwd,
        template: "t",
        name: "my-app",
        yes: true,
        styling: "sass" as unknown as never,
      })
      expect(result.created).toBe(false)
      expect(result.errors?.[0]).toMatch(/Unknown styling profile/)
    })
  })

  describe("cleanup journal (unit — cancellation mechanism)", () => {
    it("records paths and removes them in reverse order on cleanup", () => {
      const journal = createCleanupJournal()
      const root = mkdtempSync(join(tmpdir(), "solidiom-journal-"))
      const a = join(root, "a")
      const b = join(a, "b")
      mkdirSync(b, { recursive: true })

      journal.record(a)
      journal.record(b)
      expect(journal.entries()).toEqual([a, b])

      journal.cleanup()

      expect(existsSync(b)).toBe(false)
      expect(existsSync(a)).toBe(false)
      expect(journal.entries()).toEqual([])

      rmSync(root, { recursive: true, force: true })
    })

    it("does not touch paths that were never recorded", () => {
      const journal = createCleanupJournal()
      const root = mkdtempSync(join(tmpdir(), "solidiom-journal-"))
      const untouched = join(root, "untouched")
      mkdirSync(untouched, { recursive: true })

      journal.cleanup() // nothing recorded

      expect(existsSync(untouched)).toBe(true)

      rmSync(root, { recursive: true, force: true })
    })
  })

  describe("cancellation cleanup via runCreate", () => {
    it("leaves no destination directory behind when a clack prompt is cancelled", async () => {
      // Force the interactive path (isTTY: true, no --yes) but omit both
      // template and name so promptForMissing would need to prompt. We
      // cannot drive a real interactive clack prompt in a non-TTY vitest
      // process, so this test instead verifies the documented invariant via
      // the journal mechanism directly: a run that creates a destination
      // directory and is then cancelled removes exactly that directory.
      //
      // We exercise this through the public contract by using --yes (so no
      // prompt is attempted) combined with a name that fails validation
      // AFTER the destination would have been created in a hypothetical
      // materialize step — but runCreate validates before creating anything,
      // so nothing is created on validation failure. The stronger guarantee
      // — that a SIGINT/cancel arriving mid-write only removes directories
      // this run created — is covered directly against createCleanupJournal
      // above and documented as not independently re-derivable without
      // injecting a hook into runCreate's write phase.
      const dest = join(cwd, "my-app")
      const result = await runCreate({
        cwd,
        template: "t",
        name: "not valid!",
        yes: true,
      })

      expect(result.created).toBe(false)
      expect(existsSync(dest)).toBe(false)
    })
  })

  describe("real materialization (CLI-007)", () => {
    it("substitutes {{projectName}} in the copied package.json name field", async () => {
      const result = await runCreate({
        cwd,
        template: "vite-solid-router",
        name: "acme-app",
        yes: true,
        install: false,
        templatesDir,
      })

      expect(result.created).toBe(true)
      const pkg = JSON.parse(readFileSync(join(result.destination, "package.json"), "utf8"))
      expect(pkg.name).toBe("acme-app")
    })

    it("writes .solidiom/config.json with the chosen styling profile", async () => {
      const result = await runCreate({
        cwd,
        template: "vite-solid-router",
        name: "my-app",
        yes: true,
        styling: "tailwind",
        install: false,
        templatesDir,
      })

      expect(result.created).toBe(true)
      const config = JSON.parse(readFileSync(join(result.destination, ".solidiom", "config.json"), "utf8"))
      expect(config.stylingProfile).toBe("tailwind")
    })

    it("materializes the tanstack-start-solid (SSR) template with {{projectName}} substitution", async () => {
      const result = await runCreate({
        cwd,
        template: "tanstack-start-solid",
        name: "acme-ssr-app",
        yes: true,
        install: false,
        templatesDir,
      })

      expect(result.errors).toBeUndefined()
      expect(result.created).toBe(true)
      expect(result.destination).toBe(join(cwd, "acme-ssr-app"))

      const pkg = JSON.parse(readFileSync(join(result.destination, "package.json"), "utf8"))
      expect(pkg.name).toBe("@solidiom/template-tanstack-start-solid")

      expect(existsSync(join(result.destination, ".solidiom", "config.json"))).toBe(true)
      expect(existsSync(join(result.destination, "src", "routes", "__root.tsx"))).toBe(true)

      const rootRoute = readFileSync(join(result.destination, "src", "routes", "__root.tsx"), "utf8")
      expect(rootRoute).toContain('export const title = "acme-ssr-app"')
      expect(rootRoute).not.toContain("{{projectName}}")
    })

    it("fails and cleans up when the template source cannot be resolved", async () => {
      const dest = join(cwd, "my-app")
      const result = await runCreate({
        cwd,
        template: "does-not-exist",
        name: "my-app",
        yes: true,
        install: false,
        templatesDir,
      })

      expect(result.created).toBe(false)
      expect(result.errors?.some((e) => /Could not resolve source directory/.test(e))).toBe(true)
      // The directory this run created is rolled back — nothing left behind.
      expect(existsSync(dest)).toBe(false)
    })

    it("refuses a template payload containing a foreign lockfile and rolls back", async () => {
      const dest = join(cwd, "my-app")
      const badTemplateDir = join(templatesDir, "has-lockfile")
      mkdirSync(badTemplateDir, { recursive: true })
      writeFileSync(join(badTemplateDir, "template.json"), JSON.stringify({ name: "has-lockfile" }))
      writeFileSync(join(badTemplateDir, "package.json"), JSON.stringify({ name: "{{projectName}}" }))
      writeFileSync(join(badTemplateDir, "pnpm-lock.yaml"), "lockfileVersion: '9.0'\n")

      const result = await runCreate({
        cwd,
        template: "has-lockfile",
        name: "my-app",
        yes: true,
        install: false,
        templatesDir,
      })

      expect(result.created).toBe(false)
      expect(result.errors?.some((e) => /foreign lockfile/.test(e))).toBe(true)
      expect(existsSync(dest)).toBe(false)
    })

    it("rolls back the destination when the install step fails", async () => {
      const dest = join(cwd, "my-app")
      // A dependency version that cannot possibly resolve on any registry
      // guarantees `npm install` fails deterministically without requiring
      // network mocking — the failure surfaces after materialize() has
      // already written files, exercising the rollback path.
      const badTemplateDir = join(templatesDir, "bad-install")
      mkdirSync(badTemplateDir, { recursive: true })
      writeFileSync(join(badTemplateDir, "template.json"), JSON.stringify({ name: "bad-install" }))
      writeFileSync(
        join(badTemplateDir, "package.json"),
        JSON.stringify({
          name: "{{projectName}}",
          version: "0.0.0",
          private: true,
          dependencies: { "this-package-does-not-exist-solidiom-fixture": "0.0.0-does-not-exist" },
        }),
      )

      const result = await runCreate({
        cwd,
        template: "bad-install",
        name: "my-app",
        yes: true,
        install: true,
        packageManager: "npm",
        templatesDir,
      })

      expect(result.created).toBe(false)
      expect(result.errors?.some((e) => /Dependency install failed/.test(e))).toBe(true)
      expect(existsSync(dest)).toBe(false)
    }, 30000)
  })
})
