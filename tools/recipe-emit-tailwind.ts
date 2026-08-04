/**
 * tools/recipe-emit-tailwind — Tailwind emitter (RECIPE-003).
 *
 * Generates, per scope in `REFERENCE_DEFINITIONS`:
 *   - packages/recipes-tailwind/src/styles/<scope>.css   — `@apply` rules inside
 *     `@layer components`, targeting the same `[data-scope][data-part]` selectors as
 *     the CSS profile, with utilities from tools/recipe-emit-tailwind-utilities.ts
 *   - packages/recipes-tailwind/src/recipes/<scope>.variants.ts   — only for scopes with
 *     a `variants` axis; a generated `cva()` call, wrapped in `tailwind-merge`'s
 *     `twMerge()` to resolve same-property utility conflicts across axes, using real
 *     Tailwind utility classes instead of the CSS profile's data-qualified
 *     `solidiom-*` classes.
 *   - packages/recipes-tailwind/src/styles/index.css     — @import list, regenerated
 *
 * `styles/theme.css` is not generated here — it is the profile's token contract
 * (`@theme` registrations), hand-maintained until THEME-003, and already excluded from
 * the dual-emission pairing via `UTILITY_STYLESHEETS` in
 * tools/audit-recipe-dual-emission.ts alongside `prose`/`typeset`.
 *
 * The hand-written `recipes/<scope>.tsx` wrapper files are not touched — see
 * tools/recipe-emit-css.ts's header comment for why (the dual-emission audit reads them
 * for their primitive import and rendered parts).
 *
 * Usage: pnpm run recipe:emit:tailwind [--check]
 */
import { existsSync } from "node:fs"
import { join } from "node:path"
import { REFERENCE_DEFINITIONS } from "./recipe-contract-definitions"
import type { RecipeDefinition } from "./recipe-contract-schema"
import {
  generatedFileHeader,
  resolveRules,
  variantClassNames,
  writeEmittedFiles,
  type EmittedFile,
} from "./recipe-emit-core"
import { declarationToUtilities } from "./recipe-emit-tailwind-utilities"

const ROOT = join(import.meta.dirname ?? __dirname, "..")
const PACKAGE_DIR = join(ROOT, "packages/recipes-tailwind")
const STYLES_DIR = join(PACKAGE_DIR, "src/styles")
const RECIPES_DIR = join(PACKAGE_DIR, "src/recipes")

/**
 * Class prefix exceptions (D5). The default is `solidiom-<scope>`. Only override
 * for scopes where the prefix differs from the scope name.
 */
const CLASS_PREFIX_EXCEPTIONS: Readonly<Record<string, string>> = {
  button: "solidiom-btn",
}

function getClassPrefix(scope: string): string {
  return CLASS_PREFIX_EXCEPTIONS[scope] ?? `solidiom-${scope}`
}

/** Stylesheets that ship in this package but have no canonical definition or are hand-maintained. */
const NON_GENERATED_STYLESHEETS = ["typeset", "prose", "theme"] as const

/** One `@apply` rule's selector plus the utility classes it applies. */
interface ApplyRule {
  selector: string
  utilities: string[]
}

function applyRuleFor(
  scope: string,
  rule: ReturnType<typeof resolveRules>[number],
  prefix: string | undefined,
): ApplyRule | null {
  const utilities = Object.entries(rule.declarations).flatMap(([property, value]) =>
    declarationToUtilities(property, value, rule.declarations),
  )
  if (utilities.length === 0) return null

  let selector = `[data-scope="${scope}"][data-part="${rule.part}"]`
  switch (rule.condition.kind) {
    case "base":
      break
    case "state":
      selector += `[data-state="${rule.condition.state}"]`
      break
    case "flag":
      selector += `[data-${rule.condition.flag}]`
      break
    case "pseudo":
      // @apply cannot carry a pseudo-class on the rule itself; it is expressed as a
      // hover:/focus-visible: variant prefix on each utility instead.
      utilities.forEach((_, index) => {
        utilities[index] = withPseudoVariant(utilities[index]!, rule.condition)
      })
      break
    case "variant":
    case "compound":
      if (prefix) selector += `.${variantClassNames(rule, prefix)[0]}`
      if (rule.condition.pseudo) {
        utilities.forEach((_, index) => {
          utilities[index] = withPseudoVariant(utilities[index]!, {
            kind: "pseudo",
            pseudo: rule.condition.pseudo!,
          })
        })
      }
      break
  }

  return { selector, utilities }
}

/** Prefixes a utility with Tailwind's `hover:`/`focus-visible:` variant for a pseudo rule. */
function withPseudoVariant(utility: string, condition: { kind: string; pseudo?: string }): string {
  const variant = condition.pseudo === ":hover" ? "hover" : "focus-visible"
  return `${variant}:${utility}`
}

function renderStylesheet(scope: string, definition: RecipeDefinition): string {
  const rules = resolveRules(definition, "tailwind")
  const prefix = getClassPrefix(scope)

  // Group by selector, in first-seen order, so a base rule and its :hover/:focus-visible
  // pseudo rules (which share the same selector — Tailwind expresses the pseudo as a
  // variant prefix on the utility, not as part of the selector) merge into one block
  // instead of two adjacent, identical-selector blocks.
  const utilitiesBySelector = new Map<string, string[]>()
  for (const rule of rules) {
    const applyRule = applyRuleFor(scope, rule, prefix)
    if (!applyRule) continue
    const existing = utilitiesBySelector.get(applyRule.selector)
    if (existing) existing.push(...applyRule.utilities)
    else utilitiesBySelector.set(applyRule.selector, [...applyRule.utilities])
  }

  const blocks = [...utilitiesBySelector.entries()].map(
    ([selector, utilities]) => `  ${selector} {\n    @apply ${utilities.join(" ")};\n  }`,
  )

  const body = blocks.join("\n\n")
  return `${generatedFileHeader("tools/recipe-emit-tailwind.ts", scope)}\n@layer components {\n${body}\n}\n`
}

/**
 * Renders a `cva()` module for a scope with a `variants` axis, using real Tailwind
 * utilities per value rather than the CSS profile's `solidiom-*` class names — the
 * Tailwind class-string form is meant to be self-describing without its stylesheet.
 *
 * The exported function wraps the internal `cva()` call in `tailwind-merge`'s
 * `twMerge()`. `cva()` only concatenates matched classes in declaration order; it does
 * not know that two of them set the same CSS property through different Tailwind
 * utility groups (e.g. a compound's `py-0`/`px-0` and a size's `py-2`/`px-4`), and
 * Tailwind's compiled stylesheet orders utilities by its own internal grouping and
 * scale value rather than by class-list order, so the "last one wins" assumption
 * `cva()` relies on does not hold. `twMerge()` understands Tailwind's utility groups
 * and resolves the conflict the way this scope's cascade-based css/unocss stylesheets
 * already do. See docs/contracts/recipe-contract.md §6.
 */
function renderVariantsModule(scope: string, definition: RecipeDefinition): string | null {
  const axes = definition.variants
  if (!axes || axes.length === 0) return null

  const rules = resolveRules(definition, "tailwind")
  const baseUtilities = rules
    .filter((rule) => rule.condition.kind === "base")
    .flatMap((rule) =>
      Object.entries(rule.declarations).flatMap(([p, v]) =>
        declarationToUtilities(p, v, rule.declarations),
      ),
    )

  const variantsByAxis = new Map<string, Map<string, string[]>>()
  for (const rule of rules) {
    if (rule.condition.kind !== "variant") continue
    const utilities = Object.entries(rule.declarations).flatMap(([p, v]) =>
      declarationToUtilities(p, v, rule.declarations),
    )
    if (utilities.length === 0) continue
    // A variant value can produce more than one rule here: one for its base
    // declarations (no `pseudo`) and one per pseudo state (e.g. `:hover`). Both share
    // the same `value`, so they must accumulate into the same class list rather than
    // overwrite each other — this is the bug that silently dropped every variant's
    // base utilities in favor of whichever pseudo rule resolved last (RECIPE-005
    // caught it via computed-style parity: recipes-tailwind's badge/button variants
    // rendered only their :hover fill, never their base background/text color).
    const prefixedUtilities = rule.condition.pseudo
      ? utilities.map((utility) =>
          withPseudoVariant(utility, { kind: "pseudo", pseudo: rule.condition.pseudo }),
        )
      : utilities
    const byValue = variantsByAxis.get(rule.condition.axis) ?? new Map<string, string[]>()
    const existing = byValue.get(rule.condition.value) ?? []
    byValue.set(rule.condition.value, [...existing, ...prefixedUtilities])
    variantsByAxis.set(rule.condition.axis, byValue)
  }

  const compoundEntries: Array<{ when: Record<string, string>; utilities: string[] }> = []
  for (const rule of rules) {
    if (rule.condition.kind !== "compound") continue
    const utilities = Object.entries(rule.declarations).flatMap(([p, v]) =>
      declarationToUtilities(p, v, rule.declarations),
    )
    if (utilities.length === 0) continue
    // Same accumulation as the variant loop above: a compound condition can produce a
    // base rule and a separate pseudo rule for the same `when`, and both must merge
    // into one class list rather than the second silently replacing the first.
    const prefixedUtilities = rule.condition.pseudo
      ? utilities.map((utility) =>
          withPseudoVariant(utility, { kind: "pseudo", pseudo: rule.condition.pseudo }),
        )
      : utilities
    const key = JSON.stringify(rule.condition.when)
    const existingEntry = compoundEntries.find((entry) => JSON.stringify(entry.when) === key)
    if (existingEntry) existingEntry.utilities.push(...prefixedUtilities)
    else
      compoundEntries.push({ when: { ...rule.condition.when }, utilities: [...prefixedUtilities] })
  }

  const variantsLiteral = [...variantsByAxis.entries()]
    .map(([axis, values]) => {
      const valuesLiteral = [...values.entries()]
        .map(
          ([value, utilities]) =>
            `      ${JSON.stringify(value)}: ${JSON.stringify(utilities.join(" "))},`,
        )
        .join("\n")
      return `    ${JSON.stringify(axis)}: {\n${valuesLiteral}\n    },`
    })
    .join("\n")

  const defaultsLiteral = Object.entries(definition.defaultVariants ?? {})
    .map(([axis, value]) => `    ${JSON.stringify(axis)}: ${JSON.stringify(value)},`)
    .join("\n")

  const compoundLiteral = compoundEntries
    .map(({ when, utilities }) => {
      const whenLiteral = Object.entries(when)
        .map(([axis, value]) => `      ${JSON.stringify(axis)}: ${JSON.stringify(value)},`)
        .join("\n")
      return `    {\n${whenLiteral}\n      class: ${JSON.stringify(utilities.join(" "))},\n    },`
    })
    .join("\n")

  const exportName = `${scope}Variants`
  const cvaName = `${scope}VariantsCva`
  const propsTypeName = `${capitalize(scope)}VariantProps`

  return [
    generatedFileHeader("tools/recipe-emit-tailwind.ts", scope, "ts"),
    `import { cva, type VariantProps } from "class-variance-authority"`,
    `import { twMerge } from "tailwind-merge"`,
    ``,
    `const ${cvaName} = cva(${JSON.stringify(baseUtilities.join(" "))}, {`,
    `  variants: {`,
    variantsLiteral,
    `  },`,
    ...(defaultsLiteral ? [`  defaultVariants: {`, defaultsLiteral, `  },`] : []),
    ...(compoundLiteral ? [`  compoundVariants: [`, compoundLiteral, `  ],`] : []),
    `})`,
    ``,
    `export type ${propsTypeName} = VariantProps<typeof ${cvaName}>`,
    ``,
    `/**`,
    ` * ${cvaName}() concatenates each matched variant/compound's utilities in`,
    ` * declaration order; it does not resolve a later utility overriding an earlier`,
    ` * one on the same CSS property, because Tailwind's compiled stylesheet orders`,
    ` * utilities by its own internal grouping and scale value, not by the order`,
    ` * classes appear in a class string (docs/contracts/recipe-contract.md §6).`,
    ` * twMerge() reconciles that: it understands Tailwind's utility groups and`,
    ` * keeps only the last conflicting class for a given property, matching what`,
    ` * this scope's cascade-based css/unocss stylesheets already produce.`,
    ` */`,
    `export function ${exportName}(props?: ${propsTypeName}): string {`,
    `  return twMerge(${cvaName}(props))`,
    `}`,
    ``,
  ].join("\n")
}

function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1)
}

function renderIndexCss(scopes: readonly string[]): string {
  // theme.css is hand-authored and always imported first if present. Every scope is
  // generated by this same emitter invocation, so its .css always exists by the time
  // index.css is written. prose/typeset are hand-authored and may or may not exist.
  const lines: string[] = []
  if (existsSync(join(STYLES_DIR, "theme.css"))) lines.push('@import "./theme.css";')
  for (const scope of scopes) lines.push(`@import "./${scope}.css";`)
  for (const name of NON_GENERATED_STYLESHEETS) {
    if (name !== "theme" && existsSync(join(STYLES_DIR, `${name}.css`))) {
      lines.push(`@import "./${name}.css";`)
    }
  }
  return `/* @solidiom/recipes-tailwind — All primitives combined stylesheet */\n${lines.join("\n")}\n`
}

export async function emitTailwind(options: { check: boolean }): Promise<boolean> {
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
      console.log("✓ Tailwind emission is up to date")
    } else {
      console.error("✗ Tailwind emission is stale — run: pnpm run recipe:emit:tailwind")
      for (const path of result.changed) console.error(`    ${path.replace(ROOT + "/", "")}`)
    }
  } else {
    console.log(
      result.changed.length > 0
        ? `✓ Wrote ${result.changed.length} generated file(s)`
        : "✓ Tailwind emission already up to date, nothing written",
    )
  }

  return result.upToDate
}

async function main(): Promise<void> {
  const check = process.argv.includes("--check")
  const upToDate = await emitTailwind({ check })
  if (check && !upToDate) process.exitCode = 1
}

if (process.argv[1] && import.meta.url === new URL(`file://${process.argv[1]}`).href) {
  main()
}
