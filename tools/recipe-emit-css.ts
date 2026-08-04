/**
 * tools/recipe-emit-css — CSS emitter (RECIPE-002).
 *
 * Generates, per scope in `REFERENCE_DEFINITIONS`:
 *   - packages/recipes-css/src/styles/<scope>.css   — plain CSS, `var(--ui-*, fallback)`
 *   - packages/recipes-css/src/recipes/<scope>.variants.ts   — only for scopes with a
 *     `variants` axis; a generated `cva()` call the hand-written wrapper imports.
 *   - packages/recipes-css/src/styles/index.css     — @import list, regenerated
 *
 * The hand-written `recipes/<scope>.tsx` wrapper files are not touched — they compose
 * the primitive and, for button/badge, import the generated `.variants.ts` module.
 * This keeps `tools/audit-recipe-dual-emission.ts`'s pairing intact: it reads
 * `recipes/<scope>.tsx` to find the primitive import and rendered parts, and a
 * generator-owned `.tsx` would erase that signal.
 *
 * Usage: pnpm run recipe:emit:css [--check]
 */
import { existsSync, readdirSync } from "node:fs"
import { join } from "node:path"
import { REFERENCE_DEFINITIONS } from "./recipe-contract-definitions"
import type { RecipeDefinition } from "./recipe-contract-schema"
import {
  buildSelector,
  generatedFileHeader,
  resolveRules,
  variantClassNames,
  writeEmittedFiles,
  type EmittedFile,
} from "./recipe-emit-core"

const ROOT = join(import.meta.dirname ?? __dirname, "..")
const PACKAGE_DIR = join(ROOT, "packages/recipes-css")
const STYLES_DIR = join(PACKAGE_DIR, "src/styles")
const RECIPES_DIR = join(PACKAGE_DIR, "src/recipes")

/**
 * Class prefix exceptions (D5). The default is `solidiom-<scope>`. Only override
 * for scopes where the prefix differs from the scope name. `button` uses `btn`
 * rather than `button` as its prefix class.
 */
const CLASS_PREFIX_EXCEPTIONS: Readonly<Record<string, string>> = {
  button: "solidiom-btn",
}

function getClassPrefix(scope: string): string {
  return CLASS_PREFIX_EXCEPTIONS[scope] ?? `solidiom-${scope}`
}

/** Stylesheets that ship in this package but have no canonical definition (composite scopes). */
const UTILITY_STYLESHEETS = ["typeset", "prose"] as const

function cssDeclarationBlock(declarations: Readonly<Record<string, string>>): string {
  return Object.entries(declarations)
    .map(([property, value]) => `  ${property}: ${value};`)
    .join("\n")
}

/**
 * Renders one scope's rules as CSS, in the order `resolveRules` returned them.
 *
 * Variant and compound rules are only reachable through a class selector — they are
 * combined with the base/state/flag/pseudo rules of the same part rather than
 * generating a separate ruleset that would otherwise never match anything, since this
 * profile has no other way to select "variant applied".
 */
function renderStylesheet(scope: string, definition: RecipeDefinition): string {
  const rules = resolveRules(definition, "css")
  const prefix = getClassPrefix(scope)
  const blocks: string[] = []

  for (const rule of rules) {
    if (Object.keys(rule.declarations).length === 0) continue
    const selector = buildSelector(scope, rule, { variantClassPrefix: prefix })
    blocks.push(`${selector} {\n${cssDeclarationBlock(rule.declarations)}\n}`)
  }

  return `${generatedFileHeader("tools/recipe-emit-css.ts", scope)}\n${blocks.join("\n\n")}\n`
}

/**
 * Renders a `cva()` module for a scope with a `variants` axis, so the hand-written
 * wrapper can import real variant classes instead of hand-maintaining them.
 *
 * A compound variant becomes one dedicated additional class (cva's real mechanism —
 * `compoundVariants[].class` is applied alongside the per-axis classes, not instead of
 * them). `variantClassNames` derives the same class name here and in the stylesheet's
 * selector, so the two stay in lockstep without either side inventing a name the other
 * does not know about.
 */
function renderVariantsModule(scope: string, definition: RecipeDefinition): string | null {
  const axes = definition.variants
  if (!axes || axes.length === 0) return null
  const prefix = getClassPrefix(scope)

  const rules = resolveRules(definition, "css")
  const seenClasses = new Set<string>()

  const variantsByAxis = new Map<string, Map<string, string>>()
  for (const rule of rules) {
    if (rule.condition.kind !== "variant") continue
    const className = variantClassNames(rule, prefix)[0]!
    if (seenClasses.has(className)) continue
    seenClasses.add(className)
    const byValue = variantsByAxis.get(rule.condition.axis) ?? new Map<string, string>()
    byValue.set(rule.condition.value, className)
    variantsByAxis.set(rule.condition.axis, byValue)
  }

  const compoundEntries: Array<{ when: Record<string, string>; className: string }> = []
  for (const rule of rules) {
    if (rule.condition.kind !== "compound") continue
    const className = variantClassNames(rule, prefix)[0]!
    const key = JSON.stringify(rule.condition.when)
    if (compoundEntries.some((entry) => JSON.stringify(entry.when) === key)) continue
    compoundEntries.push({ when: { ...rule.condition.when }, className })
  }

  const variantsLiteral = [...variantsByAxis.entries()]
    .map(([axis, values]) => {
      const valuesLiteral = [...values.entries()]
        .map(
          ([value, className]) => `      ${JSON.stringify(value)}: ${JSON.stringify(className)},`,
        )
        .join("\n")
      return `    ${JSON.stringify(axis)}: {\n${valuesLiteral}\n    },`
    })
    .join("\n")

  const defaultsLiteral = Object.entries(definition.defaultVariants ?? {})
    .map(([axis, value]) => `    ${JSON.stringify(axis)}: ${JSON.stringify(value)},`)
    .join("\n")

  const compoundLiteral = compoundEntries
    .map(({ when, className }) => {
      const whenLiteral = Object.entries(when)
        .map(([axis, value]) => `      ${JSON.stringify(axis)}: ${JSON.stringify(value)},`)
        .join("\n")
      return `    {\n${whenLiteral}\n      class: ${JSON.stringify(className)},\n    },`
    })
    .join("\n")

  const baseClass = prefix

  const exportName = `${scope}Variants`
  const propsTypeName = `${capitalize(scope)}VariantProps`

  return [
    generatedFileHeader("tools/recipe-emit-css.ts", scope, "ts"),
    `import { cva, type VariantProps } from "class-variance-authority"`,
    ``,
    `export const ${exportName} = cva(${JSON.stringify(baseClass)}, {`,
    `  variants: {`,
    variantsLiteral,
    `  },`,
    ...(defaultsLiteral ? [`  defaultVariants: {`, defaultsLiteral, `  },`] : []),
    ...(compoundLiteral ? [`  compoundVariants: [`, compoundLiteral, `  ],`] : []),
    `})`,
    ``,
    `export type ${propsTypeName} = VariantProps<typeof ${exportName}>`,
    ``,
  ].join("\n")
}

function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1)
}

function renderIndexCss(scopes: readonly string[]): string {
  // Every scope is generated by this same emitter invocation, so its .css always
  // exists by the time index.css is written — no existence check needed there.
  // UTILITY_STYLESHEETS are hand-authored and may or may not exist, so those still
  // need the check.
  const generated = scopes.map((scope) => `@import "./${scope}.css";`)
  const utility = UTILITY_STYLESHEETS.filter((name) =>
    existsSync(join(STYLES_DIR, `${name}.css`)),
  ).map((name) => `@import "./${name}.css";`)
  return `/* @solidiom/recipes-css — All primitives combined stylesheet */\n${[...generated, ...utility].join("\n")}\n`
}

export async function emitCss(options: { check: boolean }): Promise<boolean> {
  const scopes = Object.keys(REFERENCE_DEFINITIONS).sort()
  const files: EmittedFile[] = []

  for (const scope of scopes) {
    const definition = REFERENCE_DEFINITIONS[scope]!
    files.push({
      path: join(STYLES_DIR, `${scope}.css`),
      contents: renderStylesheet(scope, definition),
    })

    const variantsModule = renderVariantsModule(scope, definition)
    if (variantsModule) {
      files.push({ path: join(RECIPES_DIR, `${scope}.variants.ts`), contents: variantsModule })
    }
  }

  files.push({ path: join(STYLES_DIR, "index.css"), contents: renderIndexCss(scopes) })

  const result = await writeEmittedFiles(files, options)

  if (options.check) {
    if (result.upToDate) {
      console.log("✓ CSS emission is up to date")
    } else {
      console.error("✗ CSS emission is stale — run: pnpm run recipe:emit:css")
      for (const path of result.changed) console.error(`    ${path.replace(ROOT + "/", "")}`)
    }
  } else {
    console.log(
      result.changed.length > 0
        ? `✓ Wrote ${result.changed.length} generated file(s)`
        : "✓ CSS emission already up to date, nothing written",
    )
  }

  return result.upToDate
}

async function main(): Promise<void> {
  const check = process.argv.includes("--check")
  const upToDate = await emitCss({ check })
  if (check && !upToDate) process.exitCode = 1
}

if (process.argv[1] && import.meta.url === new URL(`file://${process.argv[1]}`).href) {
  main()
}
