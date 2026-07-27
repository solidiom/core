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

const UTILITY_STYLESHEETS = new Set(["prose", "typeset"])

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
  return [...new Set([...cssContent.matchAll(/\[data-scope="([^"]+)"\]/g)].map((match) => match[1]))]
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

export function auditRecipeProfile({ profileName, profileDir }: RecipeAuditOptions): RecipeDriftError[] {
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
    if (!cssFiles.includes(tsxName) && extractPrimitiveImport(readFileSync(join(recipesDir, `${tsxName}.tsx`), "utf8"))) {
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

export function auditRecipeProfiles(root = ROOT): RecipeDriftError[] {
  const profiles = ["recipes-css", "recipes-tailwind", "recipes-unocss"]
    .map((profileName) => ({ profileName, profileDir: join(root, "packages", profileName, "src") }))
    .filter(({ profileDir }) => existsSync(profileDir))

  return profiles.flatMap(auditRecipeProfile)
}

function main(): void {
  console.log("Recipe dual-emission drift check\n")
  const errors = auditRecipeProfiles()

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
