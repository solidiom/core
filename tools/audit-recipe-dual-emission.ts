import { existsSync, readdirSync, readFileSync } from "node:fs"
import { basename, join } from "node:path"

const ROOT = join(import.meta.dirname ?? __dirname, "..")

export interface RecipeDriftError {
  profile: string
  file: string
  message: string
}

export interface RecipeAuditOptions {
  profileName: string
  profileDir: string
}

/**
 * A profile that ships neither emission form.
 *
 * Reported so an unimplemented profile is visibly pending rather than
 * indistinguishable from a clean one, which is how `recipes-unocss` previously
 * passed this check while advertising 13 primitives.
 */
export interface RecipePendingProfile {
  profile: string
  implementedBy: string
}

export interface RecipeAuditResult {
  errors: RecipeDriftError[]
  pending: RecipePendingProfile[]
}

/**
 * Reads the `profileStatus` / `implementedBy` markers from a profile entry point.
 *
 * A profile with no emission directories is tolerated only when it declares
 * itself unimplemented. Absent or contradictory markers are an error, so a
 * profile cannot silently regress to empty.
 */
function readProfileStatus(profileDir: string): { declared: boolean; implementedBy: string } {
  const entry = join(profileDir, "index.ts")
  if (!existsSync(entry)) return { declared: false, implementedBy: "" }

  const source = readFileSync(entry, "utf8")
  const declared = /profileStatus\s*=\s*["']declared["']/.test(source)
  const implementedBy = source.match(/implementedBy\s*=\s*["']([^"']+)["']/)?.[1] ?? ""
  return { declared, implementedBy }
}

/**
 * Stylesheets that are not recipes and therefore need no paired class-string form.
 *
 * - `prose`, `typeset` — composite typography scopes with no primitive behind them.
 * - `theme` — the profile's token contract (`@theme` registrations), not a recipe.
 */
const UTILITY_STYLESHEETS = new Set(["prose", "typeset", "theme"])

/**
 * Styled parts that a recipe intentionally leaves to consumer composition.
 * Each exception has a reason so it cannot silently disguise recipe drift.
 */
export const COMPOSED_PART_ALLOWLIST: Record<string, Record<string, string>> = {
  accordion: {
    item: "The wrapper exposes only Root; consumers supply repeatable items.",
    trigger: "The wrapper exposes only Root; consumers supply repeatable triggers.",
    content: "The wrapper exposes only Root; consumers supply repeatable content.",
  },
  alert: {
    title: "Alert title is optional consumer composition.",
    description: "Alert description is optional consumer composition.",
  },
  dialog: {
    close: "Close is optional consumer composition.",
  },
  menu: {
    item: "Menu items are consumer-provided collection content.",
    separator: "Menu separators are consumer-provided collection content.",
  },
  popover: {
    close: "Close is optional consumer composition.",
  },
  select: {
    item: "Select items are consumer-provided collection content.",
  },
  tabs: {
    list: "Tabs are consumer-provided repeatable content.",
    trigger: "Tabs are consumer-provided repeatable content.",
    content: "Tabs are consumer-provided repeatable content.",
  },
  toast: {
    region: "The toast region is owned by the provider, not this wrapper.",
    title: "Toast title is optional consumer composition.",
    description: "Toast description is optional consumer composition.",
    close: "Close is optional consumer composition.",
  },
}

function extractDataScopes(cssContent: string): string[] {
  return [
    ...new Set([...cssContent.matchAll(/\[data-scope="([^"]+)"\]/g)].map((match) => match[1])),
  ]
}

function extractDataParts(cssContent: string): string[] {
  return [...new Set([...cssContent.matchAll(/\[data-part="([^"]+)"\]/g)].map((match) => match[1]))]
}

function extractPrimitiveImport(tsxContent: string): string | undefined {
  return tsxContent.match(/import\s+\*\s+as\s+\w+\s+from\s+["']@solidiom\/([^"']+)["']/)?.[1]
}

function extractUsedParts(tsxContent: string): string[] {
  return [
    ...new Set(
      [...tsxContent.matchAll(/<\/?[A-Z][a-zA-Z]*\.([A-Z][a-zA-Z]*)/g)].map((match) =>
        match[1].replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase(),
      ),
    ),
  ]
}

export function auditRecipeProfile({
  profileName,
  profileDir,
}: RecipeAuditOptions): RecipeDriftError[] {
  const errors: RecipeDriftError[] = []
  const stylesDir = join(profileDir, "styles")
  const recipesDir = join(profileDir, "recipes")

  const hasStyles = existsSync(stylesDir)
  const hasRecipes = existsSync(recipesDir)
  if (!hasStyles || !hasRecipes) {
    if (hasStyles) {
      errors.push({
        profile: profileName,
        file: "styles/",
        message: "CSS styles directory has no matching recipes/ directory",
      })
    }
    if (hasRecipes) {
      errors.push({
        profile: profileName,
        file: "recipes/",
        message: "TSX recipes directory has no matching styles/ directory",
      })
    }
    // Neither form present: tolerated only when the profile declares itself unimplemented.
    if (!hasStyles && !hasRecipes && !readProfileStatus(profileDir).declared) {
      errors.push({
        profile: profileName,
        file: "src/",
        message:
          'profile ships neither styles/ nor recipes/ and does not declare profileStatus = "declared" — an empty profile must state that it is unimplemented and name the task that closes it',
      })
    }
    return errors
  }

  const cssFiles = readdirSync(stylesDir)
    .filter((file) => file.endsWith(".css") && file !== "index.css")
    .map((file) => basename(file, ".css"))
    .filter((file) => !UTILITY_STYLESHEETS.has(file))
    .sort()
  const tsxFiles = readdirSync(recipesDir)
    .filter((file) => file.endsWith(".tsx"))
    .map((file) => basename(file, ".tsx"))
    .sort()

  for (const cssName of cssFiles) {
    if (!tsxFiles.includes(cssName)) {
      errors.push({
        profile: profileName,
        file: `styles/${cssName}.css`,
        message: `CSS file has no matching TSX recipe (expected recipes/${cssName}.tsx)`,
      })
    }
  }

  for (const tsxName of tsxFiles) {
    if (
      !cssFiles.includes(tsxName) &&
      extractPrimitiveImport(readFileSync(join(recipesDir, `${tsxName}.tsx`), "utf8"))
    ) {
      errors.push({
        profile: profileName,
        file: `recipes/${tsxName}.tsx`,
        message: `TSX recipe has no matching CSS stylesheet (expected styles/${tsxName}.css)`,
      })
    }
  }

  for (const name of cssFiles.filter((file) => tsxFiles.includes(file))) {
    const cssContent = readFileSync(join(stylesDir, `${name}.css`), "utf8")
    const tsxContent = readFileSync(join(recipesDir, `${name}.tsx`), "utf8")
    const primitiveImport = extractPrimitiveImport(tsxContent)

    for (const scope of extractDataScopes(cssContent)) {
      if (!primitiveImport || scope !== primitiveImport) {
        errors.push({
          profile: profileName,
          file: `styles/${name}.css`,
          message: `data-scope="${scope}" does not match imported primitive "@solidiom/${primitiveImport ?? "missing"}" in recipes/${name}.tsx`,
        })
      }
    }

    const usedParts = new Set(extractUsedParts(tsxContent))
    for (const part of extractDataParts(cssContent)) {
      if (!usedParts.has(part) && !COMPOSED_PART_ALLOWLIST[name]?.[part]) {
        errors.push({
          profile: profileName,
          file: `styles/${name}.css`,
          message: `data-part="${part}" is not rendered by recipes/${name}.tsx and has no documented composition exception`,
        })
      }
    }
  }

  return errors
}

/** Reports a profile that ships neither emission form while declaring itself unimplemented. */
export function pendingRecipeProfile({
  profileName,
  profileDir,
}: RecipeAuditOptions): RecipePendingProfile | undefined {
  if (existsSync(join(profileDir, "styles")) || existsSync(join(profileDir, "recipes"))) return
  const { declared, implementedBy } = readProfileStatus(profileDir)
  if (!declared) return
  return { profile: profileName, implementedBy: implementedBy || "unassigned" }
}

export function auditRecipeProfiles(root = ROOT): RecipeAuditResult {
  const profiles = ["recipes-css", "recipes-tailwind", "recipes-unocss"]
    .map((profileName) => ({ profileName, profileDir: join(root, "packages", profileName, "src") }))
    .filter(({ profileDir }) => existsSync(profileDir))

  return {
    errors: profiles.flatMap(auditRecipeProfile),
    pending: profiles
      .map(pendingRecipeProfile)
      .filter((entry): entry is RecipePendingProfile => !!entry),
  }
}

function main(): void {
  console.log("Recipe dual-emission drift check\n")
  const { errors, pending } = auditRecipeProfiles()

  for (const { profile, implementedBy } of pending) {
    console.log(`  ⧗ ${profile}: declared but unimplemented — ships no recipes (${implementedBy})`)
  }
  if (pending.length > 0) console.log("")

  if (errors.length === 0) {
    console.log("✓ Recipe dual-emission drift check PASSED")
    console.log("  CSS/TSX mappings, scopes, and styled-part composition contracts are aligned.")
    return
  }

  console.error(`✗ Recipe dual-emission drift check FAILED — ${errors.length} issue(s):\n`)
  for (const error of errors) {
    console.error(`  [${error.profile}] ${error.file}: ${error.message}`)
  }
  process.exitCode = 1
}

if (process.argv[1] && import.meta.url === new URL(`file://${process.argv[1]}`).href) {
  main()
}
