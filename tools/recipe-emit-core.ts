/**
 * tools/recipe-emit-core — profile-agnostic resolution shared by the CSS, Tailwind, and
 * UnoCSS emitters (RECIPE-002/003/004).
 *
 * Each emitter differs only in how it spells a resolved declaration (a literal CSS
 * property, an `@apply` utility, a UnoCSS rule). Everything upstream of that — which
 * rules exist, in what order, under what selector, with which token substituted — is
 * profile-independent and lives here so the three emitters cannot disagree about it.
 *
 * CASCADE ORDER (must match docs/contracts/recipe-contract.md §2.4)
 *   1. slot.base
 *   2. slot.states[state]      (one rule per declared state)
 *   3. slot.flags[flag]        (one rule per declared flag)
 *   4. slot.pseudos[pseudo]    (one rule per declared pseudo)
 *   5. variants[axis].values[value]   in declaration order
 *   6. compoundVariants[i]            in declaration order, last match wins
 *
 * A profile that emits these groups in a different order, or reorders variants/compound
 * variants relative to each other, produces output that disagrees with the other two
 * profiles on a conflicting axis. Emitters must consume `resolveRules()` rather than
 * walk `RecipeDefinition` themselves.
 */
import {
  declarationGroupsForPartStyling,
  isVariantPartStyling,
  type Declarations,
  type DeclarationValue,
  type RecipeDefinition,
} from "./recipe-contract-schema"
import { tokenSpelling, tokenCssFallback, type TokenNamespace } from "./recipe-contract-tokens"

/** A selector condition, expressed independently of any profile's selector syntax. */
export type RuleCondition =
  | { kind: "base" }
  | { kind: "state"; state: string }
  | { kind: "flag"; flag: string }
  | { kind: "pseudo"; pseudo: string }
  | { kind: "variant"; axis: string; value: string; pseudo?: string }
  | { kind: "compound"; index: number; when: Readonly<Record<string, string>>; pseudo?: string }

/** One resolved rule: a part, a condition under which it applies, and its declarations. */
export interface ResolvedRule {
  part: string
  condition: RuleCondition
  /** Kebab-case CSS property → resolved string value (token already substituted). */
  declarations: Readonly<Record<string, string>>
}

/**
 * Thrown when a declaration references a token identity with no spelling in the
 * requested namespace. Emitters must not silently drop a declaration — a missing
 * spelling is a gap that `recipe-contract-tokens.ts` must close, not an emission detail.
 */
export class UnmappedTokenError extends Error {
  constructor(
    public readonly tokenId: string,
    public readonly namespace: TokenNamespace,
    public readonly context: string,
  ) {
    super(
      `token "${tokenId}" has no "${namespace}" spelling (${context}) — add one in tools/recipe-contract-tokens.ts before emitting this namespace`,
    )
    this.name = "UnmappedTokenError"
  }
}

/**
 * Resolves one declaration value to a profile-spelled string, or throws
 * `UnmappedTokenError`.
 *
 * A declaration's own `fallback` takes precedence over the token's recorded
 * `cssFallback` when both exist — an individual recipe may need a different literal
 * than the token's shipped default. `css`/`unocss` wrap the spelling in `var(..., x)`
 * only when a fallback is available from either source; `tailwind`/`site` namespaces
 * spell as a name the profile's own mechanism resolves and never wrap in `var()`.
 */
export function resolveValue(
  value: DeclarationValue,
  namespace: TokenNamespace,
  context: string,
): string {
  if (typeof value === "string") return value
  const spelling = tokenSpelling(value.token, namespace)
  if (!spelling) {
    if (value.fallback !== undefined) return value.fallback
    throw new UnmappedTokenError(value.token, namespace, context)
  }
  if (namespace === "css" || namespace === "unocss") {
    const fallback = value.fallback ?? tokenCssFallback(value.token)
    return fallback !== undefined ? `var(${spelling}, ${fallback})` : `var(${spelling})`
  }
  return spelling
}

function resolveDeclarations(
  declarations: Declarations,
  namespace: TokenNamespace,
  context: string,
): Record<string, string> {
  const resolved: Record<string, string> = {}
  for (const [property, value] of Object.entries(declarations)) {
    resolved[property] = resolveValue(value, namespace, `${context}.${property}`)
  }
  return resolved
}

/**
 * Resolves a full definition into an ordered, profile-spelled rule list.
 *
 * Order is authoritative: emitters must render rules in the order returned here, and
 * must not re-sort, deduplicate across parts, or otherwise change relative ordering —
 * that ordering is what makes "last match wins" mean the same thing in all three
 * profiles.
 */
export function resolveRules(
  definition: RecipeDefinition,
  namespace: TokenNamespace,
): ResolvedRule[] {
  const rules: ResolvedRule[] = []

  for (const slot of definition.slots) {
    const part = slot.part

    rules.push({
      part,
      condition: { kind: "base" },
      declarations: resolveDeclarations(slot.base, namespace, `slots.${part}.base`),
    })

    for (const [state, declarations] of Object.entries(slot.states ?? {})) {
      rules.push({
        part,
        condition: { kind: "state", state },
        declarations: resolveDeclarations(declarations, namespace, `slots.${part}.states.${state}`),
      })
    }

    for (const [flag, declarations] of Object.entries(slot.flags ?? {})) {
      rules.push({
        part,
        condition: { kind: "flag", flag },
        declarations: resolveDeclarations(
          declarations as Declarations,
          namespace,
          `slots.${part}.flags.${flag}`,
        ),
      })
    }

    for (const [pseudo, declarations] of Object.entries(slot.pseudos ?? {})) {
      rules.push({
        part,
        condition: { kind: "pseudo", pseudo },
        declarations: resolveDeclarations(
          declarations,
          namespace,
          `slots.${part}.pseudos.${pseudo}`,
        ),
      })
    }
  }

  for (const axis of definition.variants ?? []) {
    for (const [value, parts] of Object.entries(axis.values)) {
      for (const [part, styling] of Object.entries(parts)) {
        for (const group of declarationGroupsForPartStyling(
          `variants.${axis.name}.${value}.${part}`,
          part,
          styling,
        )) {
          const pseudo = isVariantPartStyling(styling)
            ? group.path.match(/\.pseudos\.(.+)$/)?.[1]
            : undefined
          rules.push({
            part,
            condition: { kind: "variant", axis: axis.name, value, pseudo },
            declarations: resolveDeclarations(group.declarations, namespace, group.path),
          })
        }
      }
    }
  }

  for (const [index, compound] of (definition.compoundVariants ?? []).entries()) {
    for (const [part, styling] of Object.entries(compound.declarations)) {
      for (const group of declarationGroupsForPartStyling(
        `compoundVariants[${index}].${part}`,
        part,
        styling,
      )) {
        const pseudo = isVariantPartStyling(styling)
          ? group.path.match(/\.pseudos\.(.+)$/)?.[1]
          : undefined
        rules.push({
          part,
          condition: { kind: "compound", index, when: compound.when, pseudo },
          declarations: resolveDeclarations(group.declarations, namespace, group.path),
        })
      }
    }
  }

  return rules
}

/**
 * Builds a `[data-scope="x"][data-part="y"]...` attribute selector for a rule, with no
 * ancestor combinator — the shape every profile's class-string form can also express
 * (docs/contracts/recipe-authoring-guide.md §3.2).
 *
 * `variantClassPrefix`, when given, appends a data-qualified class selector for the
 * variant or compound-variant condition, e.g. `.solidiom-btn--destructive`. This is
 * what lets a generated class string resolve to real declarations in the CSS profile
 * without an unqualified class selector, which `tools/audit-recipe-contract.ts` rejects.
 *
 * A compound condition is qualified by a single dedicated class
 * (`.solidiom-btn--ghost-icon`), not by combining each axis's own class
 * (`.solidiom-btn--ghost.solidiom-btn--icon`) — cva's `compoundVariants[].class` field
 * emits one additional class alongside the per-axis classes, so the selector and the
 * class-string form must agree on that same dedicated name. `variantClassNames` derives
 * the identical name from the same `when` map.
 */
export function buildSelector(
  scope: string,
  rule: ResolvedRule,
  options: { variantClassPrefix?: string } = {},
): string {
  if (/[ >+~.#[\]:]/.test(rule.part)) {
    throw new Error(`part "${rule.part}" contains selector characters — this is a contract bug`)
  }

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
      selector += rule.condition.pseudo
      break
    case "variant": {
      if (options.variantClassPrefix) {
        selector += `.${variantClassNames(rule, options.variantClassPrefix)[0]}`
      }
      if (rule.condition.pseudo) selector += rule.condition.pseudo
      break
    }
    case "compound": {
      if (options.variantClassPrefix) {
        selector += `.${variantClassNames(rule, options.variantClassPrefix)[0]}`
      }
      if (rule.condition.pseudo) selector += rule.condition.pseudo
      break
    }
  }

  return selector
}

/**
 * Stable class name(s) a rule's condition maps to, given a profile's class prefix.
 *
 * A `variant` condition names its own axis value (`prefix--destructive`). A `compound`
 * condition names one dedicated class built from every constrained axis value in
 * declaration order (`prefix--ghost-icon` for `{ variant: "ghost", size: "icon" }`),
 * matching cva's real mechanism: a compound variant adds one extra class, it does not
 * rely on two per-axis classes being simultaneously present in the selector.
 */
export function variantClassNames(rule: ResolvedRule, prefix: string): string[] {
  if (rule.condition.kind === "variant") return [`${prefix}--${rule.condition.value}`]
  if (rule.condition.kind === "compound") {
    return [`${prefix}--${Object.values(rule.condition.when).join("-")}`]
  }
  return []
}

/** Generated-file header, consistent across all three emitters. */
export function generatedFileHeader(
  toolPath: string,
  scope: string,
  commentStyle: "css" | "ts" = "css",
): string {
  const lines = [
    `GENERATED by ${toolPath} from tools/recipe-contract-definitions.ts ("${scope}")`,
    "Do not edit by hand — edit the definition and re-run the emitter.",
  ]
  if (commentStyle === "css") {
    return `/**\n${lines.map((line) => ` * ${line}`).join("\n")}\n */\n`
  }
  return `/**\n${lines.map((line) => ` * ${line}`).join("\n")}\n */\n`
}

// ─── Deterministic write / check-mode helper, shared by all three emitters ─────

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs"
import { createRequire } from "node:module"
import { dirname } from "node:path"

/**
 * Resolved via `createRequire` rather than a static import.
 *
 * `prettier`'s package `exports` map has a `browser` condition
 * (`standalone.mjs`) that some bundler-mediated ESM resolution paths — notably
 * Vite/Vitest's SSR transform for test files — pick over the Node-targeted
 * `index.cjs`/`index.mjs`. The standalone build has no parsers pre-registered and
 * cannot infer one from a `filepath`, so `format()` throws `UndefinedParserError` for
 * every file this emitter writes. `require()` always resolves the `require` condition
 * (`index.cjs`), which is the full Node build with `resolveConfig` and the built-in
 * CSS/TS/Babel parsers this emitter depends on.
 */
const prettier: typeof import("prettier") = createRequire(import.meta.url)("prettier")

/** One generated file an emitter produces, keyed by its absolute path. */
export interface EmittedFile {
  path: string
  contents: string
}

/** Formats generated source through the repo's Prettier config before it is compared or written. */
export async function formatGenerated(path: string, contents: string): Promise<string> {
  const config = (await prettier.resolveConfig(path)) ?? {}
  return prettier.format(contents, { ...config, filepath: path })
}

export interface EmitResult {
  /** Files that were written (write mode) or would change (check mode). */
  changed: string[]
  /** True when every file already matched (check mode only; always true after a write). */
  upToDate: boolean
}

/**
 * Writes (or, in check mode, diffs) a set of generated files.
 *
 * Mirrors the pattern `tools/registry-build.ts` uses for generated registry manifests:
 * deterministic content in, byte-for-byte comparison against disk in `--check`, so CI
 * can fail when a definition changed but nobody re-ran the emitter.
 */
export async function writeEmittedFiles(
  files: EmittedFile[],
  options: { check: boolean },
): Promise<EmitResult> {
  const changed: string[] = []

  for (const file of files) {
    const formatted = await formatGenerated(file.path, file.contents)
    const existing = existsSync(file.path) ? readFileSync(file.path, "utf8") : undefined

    if (existing === formatted) continue
    changed.push(file.path)

    if (!options.check) {
      mkdirSync(dirname(file.path), { recursive: true })
      writeFileSync(file.path, formatted, "utf8")
    }
  }

  return { changed, upToDate: changed.length === 0 }
}
