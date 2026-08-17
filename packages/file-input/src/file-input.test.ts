/**
 * Unit tests for FileInput primitive.
 *
 * Verifies exports, component function signatures, and basic structure.
 * Browser-mode DOM tests belong in file-input.browser.test.tsx.
 */

import { describe, it, expect } from "vitest"
import * as FileInput from "./index"

// ─── Export Tests ───────────────────────────────────────────────────────────────

describe("file-input exports", () => {
  it("exports Root component", () => {
    expect(FileInput.Root).toBeDefined()
    expect(typeof FileInput.Root).toBe("function")
  })

  it("exports Trigger component", () => {
    expect(FileInput.Trigger).toBeDefined()
    expect(typeof FileInput.Trigger).toBe("function")
  })

  it("exports HiddenInput component", () => {
    expect(FileInput.HiddenInput).toBeDefined()
    expect(typeof FileInput.HiddenInput).toBe("function")
  })

  it("exports FileList component", () => {
    expect(FileInput.FileList).toBeDefined()
    expect(typeof FileInput.FileList).toBe("function")
  })

  it("exports FileItem component", () => {
    expect(FileInput.FileItem).toBeDefined()
    expect(typeof FileInput.FileItem).toBe("function")
  })

  it("exports FileRemove component", () => {
    expect(FileInput.FileRemove).toBeDefined()
    expect(typeof FileInput.FileRemove).toBe("function")
  })
})

describe("file-input part function arity", () => {
  it("Root accepts a props argument", () => {
    expect(FileInput.Root.length).toBeLessThanOrEqual(1)
  })

  it("Trigger accepts a props argument", () => {
    expect(FileInput.Trigger.length).toBeLessThanOrEqual(1)
  })

  it("HiddenInput accepts a props argument", () => {
    expect(FileInput.HiddenInput.length).toBeLessThanOrEqual(1)
  })

  it("FileList accepts a props argument", () => {
    expect(FileInput.FileList.length).toBeLessThanOrEqual(1)
  })

  it("FileItem accepts a props argument", () => {
    expect(FileInput.FileItem.length).toBeLessThanOrEqual(1)
  })

  it("FileRemove accepts a props argument", () => {
    expect(FileInput.FileRemove.length).toBeLessThanOrEqual(1)
  })
})
