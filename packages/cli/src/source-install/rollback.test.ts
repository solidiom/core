import { describe, it, expect, beforeEach, afterEach } from "vitest"
import { mkdirSync, writeFileSync, readFileSync, existsSync, rmSync } from "node:fs"
import { join } from "node:path"
import { createTempDir } from "../test-utils/temp-dir"
import { createRollbackJournal } from "./rollback"

function createTmpDir(): string {
  return createTempDir("solidiom-rollback-test")
}

describe("createRollbackJournal", () => {
  let root: string

  beforeEach(() => {
    root = createTmpDir()
  })

  afterEach(() => {
    rmSync(root, { recursive: true, force: true })
  })

  it("restores a pre-existing file's original content after a mid-loop failure", () => {
    const filePath = join(root, "existing.txt")
    writeFileSync(filePath, "original content")

    const journal = createRollbackJournal()
    journal.recordBeforeWrite(filePath)
    writeFileSync(filePath, "overwritten content")

    journal.apply()

    expect(readFileSync(filePath, "utf8")).toBe("original content")
  })

  it("removes a file that did not exist before the journal recorded it", () => {
    const filePath = join(root, "new-file.txt")
    expect(existsSync(filePath)).toBe(false)

    const journal = createRollbackJournal()
    journal.recordBeforeWrite(filePath)
    writeFileSync(filePath, "new content")
    expect(existsSync(filePath)).toBe(true)

    journal.apply()

    expect(existsSync(filePath)).toBe(false)
  })

  it("proves byte-identical tree after a forced failure partway through a simulated write loop", () => {
    // Simulate install.ts's write loop: some paths pre-exist with content,
    // some are brand new, and a failure is injected partway through.
    const preExisting1 = join(root, "src/ui/components/button/index.tsx")
    const preExisting2 = join(root, ".solidiom/lock.json")
    const newFile1 = join(root, "src/ui/components/button/styles.css")
    const newFile2 = join(root, "src/ui/_runtime/index.ts")

    mkdirSync(join(root, "src/ui/components/button"), { recursive: true })
    mkdirSync(join(root, ".solidiom"), { recursive: true })
    writeFileSync(preExisting1, "original button content")
    writeFileSync(preExisting2, '{"version":1,"installed":{}}')

    const journal = createRollbackJournal()
    const pathsToWrite = [
      { path: preExisting1, content: "new button content" },
      { path: newFile1, content: "button { color: red; }" },
      { path: newFile2, content: "export const x = 1" },
      { path: preExisting2, content: '{"version":1,"installed":{"x":"y"}}' },
    ]

    let failureInjectedAt = -1
    expect(() => {
      pathsToWrite.forEach((entry, i) => {
        journal.recordBeforeWrite(entry.path)
        mkdirSync(join(entry.path, ".."), { recursive: true })
        writeFileSync(entry.path, entry.content)

        // Inject a forced failure partway through the loop (after the 3rd write).
        if (i === 2) {
          failureInjectedAt = i
          throw new Error("simulated mid-install failure")
        }
      })
    }).toThrow("simulated mid-install failure")

    expect(failureInjectedAt).toBe(2)

    // Before calling apply(), the tree IS dirty (writes 0,1,2 happened).
    expect(existsSync(newFile1)).toBe(true)

    journal.apply()

    // After apply(), the tree must be byte-identical to before the loop started:
    // pre-existing files restored to their original content...
    expect(readFileSync(preExisting1, "utf8")).toBe("original button content")
    expect(readFileSync(preExisting2, "utf8")).toBe('{"version":1,"installed":{}}')
    // ...and files that didn't exist before are gone again.
    expect(existsSync(newFile1)).toBe(false)
    expect(existsSync(newFile2)).toBe(false)
  })

  it("rolls back to the ORIGINAL content when the same path is recorded/written more than once", () => {
    const filePath = join(root, "multi-write.txt")
    writeFileSync(filePath, "v0")

    const journal = createRollbackJournal()
    journal.recordBeforeWrite(filePath)
    writeFileSync(filePath, "v1")
    // A second recordBeforeWrite for the SAME path must be a no-op — it must
    // not clobber the journal's memory of the true original ("v0").
    journal.recordBeforeWrite(filePath)
    writeFileSync(filePath, "v2")

    journal.apply()

    expect(readFileSync(filePath, "utf8")).toBe("v0")
  })

  it("entries() returns a snapshot in recording order", () => {
    const a = join(root, "a.txt")
    const b = join(root, "b.txt")
    const journal = createRollbackJournal()
    journal.recordBeforeWrite(a)
    journal.recordBeforeWrite(b)
    expect(journal.entries()).toEqual([a, b])
  })

  it("clears its internal state after apply() so a second apply() is a no-op", () => {
    const filePath = join(root, "clear-test.txt")
    writeFileSync(filePath, "original")

    const journal = createRollbackJournal()
    journal.recordBeforeWrite(filePath)
    writeFileSync(filePath, "changed")
    journal.apply()
    expect(readFileSync(filePath, "utf8")).toBe("original")

    writeFileSync(filePath, "changed again")
    journal.apply() // should be a no-op — journal was cleared
    expect(readFileSync(filePath, "utf8")).toBe("changed again")
    expect(journal.entries()).toEqual([])
  })
})
