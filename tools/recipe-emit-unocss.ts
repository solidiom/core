/**
 * tools/recipe-emit-unocss — UnoCSS emitter (RECIPE-004).
 *
 * STYLESHEET MECHANISM DECISION
 * UnoCSS has no `@apply`-equivalent without `transformerDirectives`, which is an
 * opt-in transformer this profile should not require a consumer to install just to
 * render styling. The `unocss` token namespace resolves to the same `--ui-*` custom
 * properties as `css` (RECIPE-002/003 §4, tools/recipe-contract-tokens.ts), so the
 * UnoCSS stylesheet form is, structurally, a namespace re-spelling of the CSS
 * emitter's output: plain declarations, `var(--ui-*, fallback)` substitution, no
 * transformer dependency. This is why `resolveRules(definition, "unocss")` and
 * `buildSelector` — the exact functions tools/recipe-emit-css.ts uses — are reused
 * here unchanged rather than reimplemented.
 *
 * Generates, per scope in `REFERENCE_DEFINITIONS`:
 *   - packages/recipes-unocss/src/styles/<scope>.css   — plain CSS, `var(--ui-*, fallback)`
 *   - packages/recipes-unocss/src/recipes/<scope>.variants.ts   — only for scopes with a
 *     `variants` axis; a generated `cva()` call, same shape as the CSS profile's.
 *   - packages/recipes-unocss/src/styles/index.css     — @import list, regenerated
 *   - packages/unocss-preset/src/generated-variant-rules.ts   — static UnoCSS
 *     `[className, declarations]` rules for every variant/compound class name, so
 *     `@solidiom/unocss-preset` can resolve `solidiom-btn--destructive` as a utility
 *     without a stylesheet import. `packages/unocss-preset` cannot depend on `tools/`
 *     at runtime (`tools/` is not a published package), so this file is generated
 *     data, not a `tools/` import.
 *
 * The hand-written `recipes/<scope>.tsx` wrapper files are not generated — RECIPE-004
 * still writes them once, by hand, the same way RECIPE-002 left `recipes-css`'s
 * wrappers hand-written. See tools/recipe-emit-css.ts's header comment for why the
 * dual-emission audit needs a hand-written `.tsx` to read.
 *
 * Usage: pnpm run recipe:emit:unocss [--check]
 */
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
const PACKAGE_DIR = join(ROOT, "packages/recipes-unocss")
const STYLES_DIR = join(PACKAGE_DIR, "src/styles")
const RECIPES_DIR = join(PACKAGE_DIR, "src/recipes")
const PRESET_DIR = join(ROOT, "packages/unocss-preset/src")

/** Class prefix used for this profile's variant/compound selectors — same names as CSS/Tailwind. */
const CLASS_PREFIXES: Readonly<Record<string, string>> = {
  button: "solidiom-btn",
  badge: "solidiom-badge",
}

function cssDeclarationBlock(declarations: Readonly<Record<string, string>>): string {
  return Object.entries(declarations)
    .map(([property, value]) => `  ${property}: ${value};`)
    .join("\n")
}

function renderStylesheet(scope: string, definition: RecipeDefinition): string {
  const rules = resolveRules(definition, "unocss")
  const prefix = CLASS_PREFIXES[scope]
  const blocks: string[] = []

  for (const rule of rules) {
    if (Object.keys(rule.declarations).length === 0) continue
    const selector = buildSelector(scope, rule, { variantClassPrefix: prefix })
    blocks.push(`${selector} {\n${cssDeclarationBlock(rule.declarations)}\n}`)
  }

  return `${generatedFileHeader("tools/recipe-emit-unocss.ts", scope)}\n${blocks.join("\n\n")}\n`
}

/** Renders a `cva()` module for a scope with a `variants` axis, matching the CSS profile's shape. */
function renderVariantsModule(scope: string, definition: RecipeDefinition): string | null {
  const axes = definition.variants
  if (!axes || axes.length === 0) return null
  const prefix = CLASS_PREFIXES[scope]
  if (!prefix) {
    throw new Error(
      `scope "${scope}" declares variants but has no CLASS_PREFIXES entry in tools/recipe-emit-unocss.ts`,
    )
  }

  const rules = resolveRules(definition, "unocss")
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

  const exportName = `${scope}Variants`
  const propsTypeName = `${capitalize(scope)}VariantProps`

  return [
    generatedFileHeader("tools/recipe-emit-unocss.ts", scope, "ts"),
    `import { cva, type VariantProps } from "class-variance-authority"`,
    ``,
    `export const ${exportName} = cva(${JSON.stringify(prefix)}, {`,
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
  // Every scope is generated by this same emitter invocation before this function's
  // result is written, so the import list is simply every scope with a definition —
  // no filesystem existence check is needed (or correct: on a first run into an empty
  // styles/ directory, existsSync would see nothing yet and emit an empty index).
  const imports = scopes.map((scope) => `@import "./${scope}.css";`)
  return `/* @solidiom/recipes-unocss — All primitives combined stylesheet */\n${imports.join("\n")}\n`
}

/**
 * Renders `packages/unocss-preset/src/generated-variant-rules.ts`: one static UnoCSS
 * rule per variant/compound class name across every definition with a `variants` axis,
 * resolved through the `unocss` token namespace — the same substitution
 * `renderStylesheet` uses, so the preset's rules and the stylesheet form cannot disagree
 * about a token's spelling.
 */
function renderPresetRules(): string {
  const rules: Array<{ className: string; declarations: Record<string, string> }> = []
  const seen = new Set<string>()

  for (const [scope, definition] of Object.entries(REFERENCE_DEFINITIONS)) {
    const prefix = CLASS_PREFIXES[scope]
    if (!prefix || !definition.variants || definition.variants.length === 0) continue

    for (const rule of resolveRules(definition, "unocss")) {
      if (rule.condition.kind !== "variant" && rule.condition.kind !== "compound") continue
      if (Object.keys(rule.declarations).length === 0) continue

      const className = variantClassNames(rule, prefix)[0]!
      if (seen.has(className)) continue
      seen.add(className)
      rules.push({ className, declarations: { ...rule.declarations } })
    }
  }

  const rulesLiteral = rules
    .map(({ className, declarations }) => {
      const declLiteral = Object.entries(declarations)
        .map(([property, value]) => `    ${JSON.stringify(property)}: ${JSON.stringify(value)},`)
        .join("\n")
      return `  [\n    ${JSON.stringify(className)},\n    {\n${declLiteral}\n    },\n  ],`
    })
    .join("\n")

  return [
    generatedFileHeader("tools/recipe-emit-unocss.ts", "unocss-preset", "ts"),
    `/** UnoCSS static rule shape: \`[matcher, declarations]\`, https://unocss.dev/config/rules. */`,
    `export type UnocssStaticRule = [string, Record<string, string>]`,
    ``,
    `/**`,
    ` * One static rule per variant/compound class name across every canonical recipe`,
    ` * definition with a \`variants\` axis. See packages/unocss-preset/src/index.ts for`,
    ` * how the preset consumes this.`,
    ` */`,
    `export const SOLIDIOM_VARIANT_RULES: UnocssStaticRule[] = [`,
    rulesLiteral,
    `]`,
    ``,
  ].join("\n")
}

export async function emitUnocss(options: { check: boolean }): Promise<boolean> {
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
  files.push({
    path: join(PRESET_DIR, "generated-variant-rules.ts"),
    contents: renderPresetRules(),
  })

  const result = await writeEmittedFiles(files, options)

  if (options.check) {
    if (result.upToDate) {
      console.log("✓ UnoCSS emission is up to date")
    } else {
      console.error("✗ UnoCSS emission is stale — run: pnpm run recipe:emit:unocss")
      for (const path of result.changed) console.error(`    ${path.replace(ROOT + "/", "")}`)
    }
  } else {
    console.log(
      result.changed.length > 0
        ? `✓ Wrote ${result.changed.length} generated file(s)`
        : "✓ UnoCSS emission already up to date, nothing written",
    )
  }

  return result.upToDate
}

async function main(): Promise<void> {
  const check = process.argv.includes("--check")
  const upToDate = await emitUnocss({ check })
  if (check && !upToDate) process.exitCode = 1
}

if (process.argv[1] && import.meta.url === new URL(`file://${process.argv[1]}`).href) {
  main()
}
