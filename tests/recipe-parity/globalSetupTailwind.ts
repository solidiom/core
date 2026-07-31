/**
 * Vitest `globalSetup` for the recipe-parity browser suite.
 *
 * Resolves `packages/recipes-tailwind/src/styles/*.css`'s `@apply` directives to
 * real declarations, once, using `@tailwindcss/node`'s programmatic `compile()` (the
 * same compiler Tailwind's own Vite plugin uses) — run here, in Node, because
 * `@tailwindcss/node` cannot be imported from browser-mode test code (see
 * harness.ts's module doc). The result is written to `.generated/tailwind-resolved.css`,
 * which `harness.ts`'s `resolveProfileCss` reads synchronously inside test files.
 *
 * `globalSetup` runs once per suite invocation, in Node, before any browser context
 * is created — exactly the split this needs.
 */
import { compile } from "@tailwindcss/node"
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs"
import { join } from "node:path"

const ROOT = join(import.meta.dirname ?? __dirname, "../..")
const STYLES_DIR = join(ROOT, "packages/recipes-tailwind/src/styles")
const RECIPES_DIR = join(ROOT, "packages/recipes-tailwind/src/recipes")
const OUTPUT_DIR = join(import.meta.dirname ?? __dirname, ".generated")
const OUTPUT_FILE = join(OUTPUT_DIR, "tailwind-resolved.css")

/**
 * Every class token referenced by any generated `recipes/<scope>.variants.ts` module
 * in `packages/recipes-tailwind`, plus the `solidiom-<scope>--<value>` selector
 * classes the *stylesheet* form's `@apply` rules target.
 *
 * `compile().build(candidates)` only emits utilities referenced by at least one
 * candidate — unlike a real project, this harness has no source files to scan for
 * class usage, so the candidate list must be supplied explicitly. It is derived from
 * the generated `.variants.ts` files' actual string literals (rather than
 * hand-maintained) so it can never drift from what `tools/recipe-emit-tailwind.ts`
 * really emits: if the emitter starts producing a new utility, this setup picks it up
 * on the next run with no edit required here. A hardcoded list would instead
 * silently omit new classes, since `compile().build()` treats an unlisted candidate
 * as "not used" rather than erroring — the exact failure mode this suite exists to
 * surface, not reproduce in its own setup.
 */
function classCandidates(): string[] {
  const candidates = new Set<string>()

  // solidiom-<scope>--<value> selector classes, used by the stylesheet form.
  for (const scope of readdirSync(STYLES_DIR).filter((f) => f.endsWith(".css"))) {
    const css = readFileSync(join(STYLES_DIR, scope), "utf8")
    for (const match of css.matchAll(/\.([\w-]+--[\w-]+)\b/g)) candidates.add(match[1]!)
  }

  // Literal Tailwind utilities the class-string form applies directly to the
  // element — every double-quoted string literal in a generated .variants.ts,
  // split on whitespace. This intentionally also picks up the cva() base-class
  // argument, defaultVariants keys/values (harmless, not real classes but never
  // match a real utility name either), and compoundVariants' `class` fields.
  if (existsSync(RECIPES_DIR)) {
    for (const file of readdirSync(RECIPES_DIR).filter((f) => f.endsWith(".variants.ts"))) {
      const source = readFileSync(join(RECIPES_DIR, file), "utf8")
      for (const match of source.matchAll(/"([^"]+)"/g)) {
        for (const token of match[1]!.split(/\s+/)) {
          if (token) candidates.add(token)
        }
      }
    }
  }

  return [...candidates]
}

export default async function setup(): Promise<void> {
  const theme = readFileSync(join(STYLES_DIR, "theme.css"), "utf8")
  // index.css already @imports every generated scope stylesheet; reusing it keeps
  // this setup from needing its own hardcoded scope list that could drift from
  // tools/recipe-emit-tailwind.ts's renderIndexCss.
  const index = readFileSync(join(STYLES_DIR, "index.css"), "utf8")
  const source = `@import "tailwindcss";\n${theme}\n${index.replace('@import "./theme.css";', "")}`

  const compiler = await compile(source, { base: STYLES_DIR, onDependency: () => {} })
  const resolved = compiler.build(classCandidates())

  mkdirSync(OUTPUT_DIR, { recursive: true })
  writeFileSync(OUTPUT_FILE, resolved, "utf8")
}
