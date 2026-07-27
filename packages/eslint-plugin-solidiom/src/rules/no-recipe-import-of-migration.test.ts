import { describe, it, expect } from "vitest"
import noRecipeImportOfMigration from "./no-recipe-import-of-migration"

function runRule(rule: any, code: string, filename: string) {
  const errors: any[] = []
  const context = {
    filename,
    report(err: any) {
      errors.push(err)
    },
  }
  const visitors = rule.create(context)
  const importRegex = /import\s+.*?from\s+['"](.+?)['"]/g
  let match
  while ((match = importRegex.exec(code)) !== null) {
    const node = { source: { value: match[1] } }
    visitors.ImportDeclaration?.(node)
  }
  return errors
}

describe("no-recipe-import-of-migration", () => {
  const recipeFile = "/project/packages/recipes-css/src/recipes/button.tsx"
  const primitiveFile = "/project/packages/dialog/src/index.ts"
  const toolingFile = "/project/packages/cli/src/commands/doctor.ts"

  it("blocks recipe importing from a migration package", () => {
    const errors = runRule(
      noRecipeImportOfMigration,
      `import { transform } from "@solidiom/migration-shadcn"`,
      recipeFile,
    )
    expect(errors).toHaveLength(1)
    expect(errors[0].data.specifier).toBe("@solidiom/migration-shadcn")
  })

  it("blocks recipe importing from a relative migration path", () => {
    const errors = runRule(
      noRecipeImportOfMigration,
      `import { codemods } from "../../migrations/shadcn-solid-dialog/transform"`,
      recipeFile,
    )
    expect(errors).toHaveLength(1)
  })

  it("allows recipe importing from primitives", () => {
    const errors = runRule(
      noRecipeImportOfMigration,
      `import * as Button from "@solidiom/button"`,
      recipeFile,
    )
    expect(errors).toHaveLength(0)
  })

  it("allows recipe importing from cva", () => {
    const errors = runRule(
      noRecipeImportOfMigration,
      `import { cva } from "class-variance-authority"`,
      recipeFile,
    )
    expect(errors).toHaveLength(0)
  })

  it("does not enforce in primitive packages", () => {
    const errors = runRule(
      noRecipeImportOfMigration,
      `import { transform } from "@solidiom/migration-shadcn"`,
      primitiveFile,
    )
    expect(errors).toHaveLength(0)
  })

  it("does not enforce in tooling packages", () => {
    const errors = runRule(
      noRecipeImportOfMigration,
      `import { transform } from "@solidiom/migration-shadcn"`,
      toolingFile,
    )
    expect(errors).toHaveLength(0)
  })
})
