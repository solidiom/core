import { afterEach, describe, expect, it } from "vitest"
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"
import {
  auditRecipeProfile,
  pendingRecipeProfile,
  COMPOSED_PART_ALLOWLIST,
} from "./audit-recipe-dual-emission"

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

  it("derives the composition exception from the canonical definition, not a hardcoded table", () => {
    // dialog's "close" slot is ownership: "consumer" in
    // tools/recipe-contract-definitions.ts — COMPOSED_PART_ALLOWLIST no longer lists it.
    expect(COMPOSED_PART_ALLOWLIST.dialog).toBeUndefined()
    const errors = audit({
      "styles/dialog.css": '[data-scope="dialog"][data-part="close"] {}',
      "recipes/dialog.tsx": 'import * as Dialog from "@solidiom/dialog"\n<Dialog.Root />',
    })
    expect(errors).toEqual([])
  })

  it("still rejects an undocumented part for a scope with a canonical definition", () => {
    // "footer" is not a slot in dialogRecipe at all, documented or otherwise.
    const errors = audit({
      "styles/dialog.css": '[data-scope="dialog"][data-part="footer"] {}',
      "recipes/dialog.tsx": 'import * as Dialog from "@solidiom/dialog"\n<Dialog.Root />',
    })
    expect(errors).toContainEqual(
      expect.objectContaining({
        message: expect.stringContaining("no documented composition exception"),
      }),
    )
  })

  it("rejects an empty profile that does not declare itself unimplemented", () => {
    const errors = audit({ "index.ts": 'export const recipeProfile = "fixture"' })
    expect(errors).toContainEqual(
      expect.objectContaining({
        message: expect.stringContaining("must state that it is unimplemented"),
      }),
    )
  })

  it("permits an empty profile that declares itself unimplemented", () => {
    const errors = audit({
      "index.ts": 'export const profileStatus = "declared"\nexport const implementedBy = "TASK-1"',
    })
    expect(errors).toEqual([])
  })
})

describe("pending recipe profiles", () => {
  it("reports a declared but unimplemented profile with its owning task", () => {
    const profileDir = createProfile({
      "index.ts": 'export const profileStatus = "declared"\nexport const implementedBy = "TASK-1"',
    })
    expect(pendingRecipeProfile({ profileName: "fixture", profileDir })).toEqual({
      profile: "fixture",
      implementedBy: "TASK-1",
    })
  })

  it("does not report a profile that ships recipes", () => {
    const profileDir = createProfile({
      "styles/button.css": '[data-scope="button"][data-part="root"] {}',
      "recipes/button.tsx": 'import * as Button from "@solidiom/button"\n<Button.Root />',
      "index.ts": 'export const profileStatus = "declared"',
    })
    expect(pendingRecipeProfile({ profileName: "fixture", profileDir })).toBeUndefined()
  })

  it("does not report an empty profile that omits the marker — that is an error, not pending", () => {
    const profileDir = createProfile({ "index.ts": "export const recipeProfile = 1" })
    expect(pendingRecipeProfile({ profileName: "fixture", profileDir })).toBeUndefined()
  })
})
