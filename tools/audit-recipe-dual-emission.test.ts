import { afterEach, describe, expect, it } from "vitest"
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { auditRecipeProfile } from "./audit-recipe-dual-emission"

const temporaryRoots: string[] = []

function createProfile(files: Record<string, string>): string {
  const root = mkdtempSync(join(tmpdir(), "solidiom-recipe-audit-"))
  temporaryRoots.push(root)
  for (const [relativePath, content] of Object.entries(files)) {
    const destination = join(root, relativePath)
    mkdirSync(join(destination, ".."), { recursive: true })
    writeFileSync(destination, content, "utf8")
  }
  return root
}

function audit(files: Record<string, string>) {
  return auditRecipeProfile({ profileName: "fixture", profileDir: createProfile(files) })
}

afterEach(() => {
  for (const root of temporaryRoots.splice(0)) {
    rmSync(root, { recursive: true, force: true })
  }
})

describe("recipe dual-emission audit", () => {
  it("accepts matching scope and rendered part", () => {
    const errors = audit({
      "styles/button.css": '[data-scope="button"][data-part="root"] {}',
      "recipes/button.tsx": 'import * as Button from "@solidiom/button"\n<Button.Root />',
    })
    expect(errors).toEqual([])
  })

  it("rejects a stylesheet without a matching recipe", () => {
    const errors = audit({ "styles/button.css": '[data-scope="button"] {}' })
    expect(errors).toContainEqual(
      expect.objectContaining({ message: expect.stringContaining("matching recipes") }),
    )
  })

  it("rejects a recipe without a matching stylesheet", () => {
    const errors = audit({
      "recipes/button.tsx": 'import * as Button from "@solidiom/button"\n<Button.Root />',
    })
    expect(errors).toContainEqual(
      expect.objectContaining({ message: expect.stringContaining("matching styles") }),
    )
  })

  it("rejects a CSS scope that differs from the imported primitive", () => {
    const errors = audit({
      "styles/button.css": '[data-scope="dialog"][data-part="root"] {}',
      "recipes/button.tsx": 'import * as Button from "@solidiom/button"\n<Button.Root />',
    })
    expect(errors).toContainEqual(
      expect.objectContaining({ message: expect.stringContaining("does not match") }),
    )
  })

  it("rejects a CSS part not rendered by its recipe or documented as composed", () => {
    const errors = audit({
      "styles/button.css": '[data-scope="button"][data-part="icon"] {}',
      "recipes/button.tsx": 'import * as Button from "@solidiom/button"\n<Button.Root />',
    })
    expect(errors).toContainEqual(
      expect.objectContaining({
        message: expect.stringContaining("no documented composition exception"),
      }),
    )
  })

  it("permits an explicitly documented composed part", () => {
    const errors = audit({
      "styles/dialog.css": '[data-scope="dialog"][data-part="close"] {}',
      "recipes/dialog.tsx": 'import * as Dialog from "@solidiom/dialog"\n<Dialog.Root />',
    })
    expect(errors).toEqual([])
  })
})
