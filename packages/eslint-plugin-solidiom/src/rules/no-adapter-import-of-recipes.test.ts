import { describe, it, expect } from "vitest"
import noAdapterImportOfRecipes from "./no-adapter-import-of-recipes"

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

describe("no-adapter-import-of-recipes", () => {
  const adapterFile = "/project/packages/adapter-positioning-floating-ui/src/index.ts"
  const primitiveFile = "/project/packages/dialog/src/index.ts"
  const recipeFile = "/project/packages/recipes-css/src/recipes/button.tsx"

  it("blocks adapter importing a recipe package", () => {
    const errors = runRule(
      noAdapterImportOfRecipes,
      `import { buttonVariants } from "@solidiom/recipes-css"`,
      adapterFile,
    )
    expect(errors).toHaveLength(1)
    expect(errors[0].data.specifier).toBe("@solidiom/recipes-css")
  })

  it("blocks adapter importing recipes-tailwind", () => {
    const errors = runRule(
      noAdapterImportOfRecipes,
      `import { buttonVariants } from "@solidiom/recipes-tailwind"`,
      adapterFile,
    )
    expect(errors).toHaveLength(1)
    expect(errors[0].data.specifier).toBe("@solidiom/recipes-tailwind")
  })

  it("allows adapter importing from runtime", () => {
    const errors = runRule(
      noAdapterImportOfRecipes,
      `import { createStableId } from "@solidiom/runtime"`,
      adapterFile,
    )
    expect(errors).toHaveLength(0)
  })

  it("allows adapter importing external packages", () => {
    const errors = runRule(
      noAdapterImportOfRecipes,
      `import { computePosition } from "@floating-ui/dom"`,
      adapterFile,
    )
    expect(errors).toHaveLength(0)
  })

  it("does not enforce in non-adapter packages (primitive)", () => {
    const errors = runRule(
      noAdapterImportOfRecipes,
      `import { buttonVariants } from "@solidiom/recipes-css"`,
      primitiveFile,
    )
    expect(errors).toHaveLength(0)
  })

  it("does not enforce in recipe packages themselves", () => {
    const errors = runRule(
      noAdapterImportOfRecipes,
      `import { dialogVariants } from "@solidiom/recipes-css"`,
      recipeFile,
    )
    expect(errors).toHaveLength(0)
  })
})
