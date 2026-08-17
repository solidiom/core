import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { createRoot, createSignal, flush } from "solid-js"
import { createDropzone, createSortable } from "./drag-and-drop"

// ─── Mock Helpers ────────────────────────────────────────────────────────────

/** Creates a mock File for testing. */
function createMockFile(name: string, size: number, type: string): File {
  const content = new Array(size).fill("a").join("")
  return new File([content], name, { type })
}

/** Creates a minimal DragEvent mock. */
function createDragEvent(
  type: string,
  options?: {
    files?: File[]
    types?: string[]
  },
): DragEvent {
  let defaultPrevented = false
  const files = options?.files ?? []
  const types = options?.types ?? (files.length > 0 ? ["Files"] : [])

  const fileList = {
    length: files.length,
    item: (i: number) => files[i] ?? null,
    [Symbol.iterator]: function* () {
      for (const f of files) yield f
    },
  } as unknown as FileList

  // Add indexed access
  for (let i = 0; i < files.length; i++) {
    ;(fileList as unknown as Record<number, File>)[i] = files[i]
  }

  const dataTransfer = {
    files: fileList,
    types,
    dropEffect: "none" as string,
    effectAllowed: "none" as string,
    setData: vi.fn(),
    getData: vi.fn(),
  } as unknown as DataTransfer

  return {
    type,
    dataTransfer,
    defaultPrevented,
    preventDefault() {
      defaultPrevented = true
      Object.defineProperty(this, "defaultPrevented", { value: true })
    },
  } as unknown as DragEvent
}

// ─── createDropzone tests ────────────────────────────────────────────────────

describe("createDropzone", () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe("file validation", () => {
    it("accepts files matching exact MIME type", () => {
      createRoot((dispose) => {
        const dz = createDropzone({ acceptedTypes: ["application/pdf"] })
        const pdf = createMockFile("doc.pdf", 100, "application/pdf")
        const { accepted, rejected } = dz.validateFiles([pdf])
        expect(accepted).toHaveLength(1)
        expect(rejected).toHaveLength(0)
        dispose()
      })
    })

    it("accepts files matching wildcard MIME type", () => {
      createRoot((dispose) => {
        const dz = createDropzone({ acceptedTypes: ["image/*"] })
        const png = createMockFile("photo.png", 100, "image/png")
        const jpg = createMockFile("photo.jpg", 100, "image/jpeg")
        const { accepted } = dz.validateFiles([png, jpg])
        expect(accepted).toHaveLength(2)
        dispose()
      })
    })

    it("rejects files not matching accepted types", () => {
      createRoot((dispose) => {
        const dz = createDropzone({ acceptedTypes: ["image/*"] })
        const pdf = createMockFile("doc.pdf", 100, "application/pdf")
        const { accepted, rejected } = dz.validateFiles([pdf])
        expect(accepted).toHaveLength(0)
        expect(rejected).toHaveLength(1)
        expect(rejected[0].reason).toBe("type")
        dispose()
      })
    })

    it("rejects files exceeding maxFileSize", () => {
      createRoot((dispose) => {
        const dz = createDropzone({ maxFileSize: 1000 })
        const large = createMockFile("big.txt", 2000, "text/plain")
        const { accepted, rejected } = dz.validateFiles([large])
        expect(accepted).toHaveLength(0)
        expect(rejected).toHaveLength(1)
        expect(rejected[0].reason).toBe("size")
        dispose()
      })
    })

    it("accepts files at exactly maxFileSize", () => {
      createRoot((dispose) => {
        const dz = createDropzone({ maxFileSize: 1000 })
        const exact = createMockFile("exact.txt", 1000, "text/plain")
        const { accepted } = dz.validateFiles([exact])
        expect(accepted).toHaveLength(1)
        dispose()
      })
    })

    it("rejects files exceeding maxFiles count", () => {
      createRoot((dispose) => {
        const dz = createDropzone({ maxFiles: 2 })
        const f1 = createMockFile("a.txt", 10, "text/plain")
        const f2 = createMockFile("b.txt", 10, "text/plain")
        const f3 = createMockFile("c.txt", 10, "text/plain")
        const { accepted, rejected } = dz.validateFiles([f1, f2, f3])
        expect(accepted).toHaveLength(2)
        expect(rejected).toHaveLength(1)
        expect(rejected[0].reason).toBe("count")
        dispose()
      })
    })

    it("handles mixed accepted/rejected files", () => {
      createRoot((dispose) => {
        const dz = createDropzone({
          acceptedTypes: ["image/*"],
          maxFileSize: 500,
          maxFiles: 2,
        })
        const goodImg = createMockFile("ok.png", 100, "image/png")
        const bigImg = createMockFile("big.png", 1000, "image/png")
        const badType = createMockFile("doc.pdf", 100, "application/pdf")
        const extraImg = createMockFile("extra.jpg", 100, "image/jpeg")
        const extraImg2 = createMockFile("extra2.jpg", 100, "image/jpeg")

        const { accepted, rejected } = dz.validateFiles([
          goodImg,
          bigImg,
          badType,
          extraImg,
          extraImg2,
        ])
        expect(accepted).toHaveLength(2) // goodImg, extraImg
        expect(rejected).toHaveLength(3) // bigImg (size), badType (type), extraImg2 (count)

        const reasons = rejected.map((r) => r.reason)
        expect(reasons).toContain("type")
        expect(reasons).toContain("size")
        expect(reasons).toContain("count")
        dispose()
      })
    })

    it("accepts all files when no constraints", () => {
      createRoot((dispose) => {
        const dz = createDropzone({})
        const f1 = createMockFile("a.bin", 999999, "application/octet-stream")
        const f2 = createMockFile("b.zip", 888888, "application/zip")
        const { accepted, rejected } = dz.validateFiles([f1, f2])
        expect(accepted).toHaveLength(2)
        expect(rejected).toHaveLength(0)
        dispose()
      })
    })
  })

  describe("isDragOver state", () => {
    it("becomes true on dragenter", () => {
      createRoot((dispose) => {
        const dz = createDropzone({})
        expect(dz.isDragOver()).toBe(false)

        const event = createDragEvent("dragenter", { types: ["Files"] })
        dz.dropzoneProps().onDragEnter(event)
        flush()

        expect(dz.isDragOver()).toBe(true)
        dispose()
      })
    })

    it("becomes false on dragleave", () => {
      createRoot((dispose) => {
        const dz = createDropzone({})
        const enter = createDragEvent("dragenter", { types: ["Files"] })
        const leave = createDragEvent("dragleave")

        dz.dropzoneProps().onDragEnter(enter)
        flush()
        expect(dz.isDragOver()).toBe(true)

        dz.dropzoneProps().onDragLeave(leave)
        flush()
        expect(dz.isDragOver()).toBe(false)
        dispose()
      })
    })
  })

  describe("nested dragenter/leave counting", () => {
    it("stays over with nested enters before leave", () => {
      createRoot((dispose) => {
        const dz = createDropzone({})
        const props = dz.dropzoneProps()
        const enter1 = createDragEvent("dragenter", { types: ["Files"] })
        const enter2 = createDragEvent("dragenter", { types: ["Files"] })
        const leave1 = createDragEvent("dragleave")

        props.onDragEnter(enter1)
        props.onDragEnter(enter2)
        flush()
        expect(dz.isDragOver()).toBe(true)

        props.onDragLeave(leave1)
        flush()
        // Counter is still > 0
        expect(dz.isDragOver()).toBe(true)
        dispose()
      })
    })

    it("goes idle only when all leaves match enters", () => {
      createRoot((dispose) => {
        const dz = createDropzone({})
        const props = dz.dropzoneProps()
        const enter = createDragEvent("dragenter", { types: ["Files"] })
        const leave = createDragEvent("dragleave")

        props.onDragEnter(enter)
        props.onDragEnter(createDragEvent("dragenter", { types: ["Files"] }))
        props.onDragEnter(createDragEvent("dragenter", { types: ["Files"] }))
        flush()

        props.onDragLeave(leave)
        props.onDragLeave(createDragEvent("dragleave"))
        flush()
        expect(dz.isDragOver()).toBe(true)

        props.onDragLeave(createDragEvent("dragleave"))
        flush()
        expect(dz.isDragOver()).toBe(false)
        dispose()
      })
    })
  })

  describe("status transitions", () => {
    it("starts as idle", () => {
      createRoot((dispose) => {
        const dz = createDropzone({})
        expect(dz.status()).toBe("idle")
        dispose()
      })
    })

    it("transitions to over on dragenter", () => {
      createRoot((dispose) => {
        const dz = createDropzone({})
        const enter = createDragEvent("dragenter", { types: ["Files"] })
        dz.dropzoneProps().onDragEnter(enter)
        flush()
        expect(dz.status()).toBe("over")
        dispose()
      })
    })

    it("transitions to dropped on drop then resets to idle", () => {
      createRoot((dispose) => {
        const file = createMockFile("test.txt", 10, "text/plain")
        const dz = createDropzone({})
        const enter = createDragEvent("dragenter", { types: ["Files"] })
        const drop = createDragEvent("drop", { files: [file] })

        dz.dropzoneProps().onDragEnter(enter)
        flush()
        dz.dropzoneProps().onDrop(drop)
        flush()
        // Status is "dropped" before the async reset fires
        expect(dz.status()).toBe("dropped")
        // After the queued reset
        vi.advanceTimersByTime(1)
        flush()
        expect(dz.status()).toBe("idle")
        dispose()
      })
    })

    it("transitions back to idle after drop", () => {
      createRoot((dispose) => {
        const file = createMockFile("test.txt", 10, "text/plain")
        const dz = createDropzone({})
        const enter = createDragEvent("dragenter", { types: ["Files"] })
        const drop = createDragEvent("drop", { files: [file] })

        dz.dropzoneProps().onDragEnter(enter)
        flush()
        dz.dropzoneProps().onDrop(drop)
        flush()
        // dropped before timeout
        expect(dz.status()).toBe("dropped")

        vi.advanceTimersByTime(1)
        flush()
        expect(dz.status()).toBe("idle")
        dispose()
      })
    })

    it("transitions to idle on dragleave", () => {
      createRoot((dispose) => {
        const dz = createDropzone({})
        const enter = createDragEvent("dragenter", { types: ["Files"] })
        const leave = createDragEvent("dragleave")

        dz.dropzoneProps().onDragEnter(enter)
        flush()
        dz.dropzoneProps().onDragLeave(leave)
        flush()
        expect(dz.status()).toBe("idle")
        dispose()
      })
    })
  })

  describe("disabled state", () => {
    it("prevents drop when disabled", () => {
      createRoot((dispose) => {
        const onDrop = vi.fn()
        const dz = createDropzone({ disabled: () => true, onDrop })
        const file = createMockFile("test.txt", 10, "text/plain")
        const drop = createDragEvent("drop", { files: [file] })

        dz.dropzoneProps().onDrop(drop)
        flush()
        expect(onDrop).not.toHaveBeenCalled()
        dispose()
      })
    })

    it("prevents dragenter when disabled", () => {
      createRoot((dispose) => {
        const onDragEnter = vi.fn()
        const dz = createDropzone({ disabled: () => true, onDragEnter })
        const enter = createDragEvent("dragenter", { types: ["Files"] })

        dz.dropzoneProps().onDragEnter(enter)
        flush()
        expect(onDragEnter).not.toHaveBeenCalled()
        expect(dz.isDragOver()).toBe(false)
        dispose()
      })
    })

    it("prevents dragleave when disabled", () => {
      createRoot((dispose) => {
        const onDragLeave = vi.fn()
        const dz = createDropzone({ disabled: () => true, onDragLeave })
        const leave = createDragEvent("dragleave")

        dz.dropzoneProps().onDragLeave(leave)
        flush()
        expect(onDragLeave).not.toHaveBeenCalled()
        dispose()
      })
    })
  })

  describe("callbacks", () => {
    it("fires onDrop with accepted files", () => {
      createRoot((dispose) => {
        const onDrop = vi.fn()
        const dz = createDropzone({ onDrop })
        const file = createMockFile("test.txt", 10, "text/plain")
        const drop = createDragEvent("drop", { files: [file] })

        dz.dropzoneProps().onDrop(drop)
        flush()
        expect(onDrop).toHaveBeenCalledWith([file])
        dispose()
      })
    })

    it("fires onReject with rejected files and reasons", () => {
      createRoot((dispose) => {
        const onReject = vi.fn()
        const dz = createDropzone({
          acceptedTypes: ["image/*"],
          onReject,
        })
        const pdf = createMockFile("doc.pdf", 10, "application/pdf")
        const drop = createDragEvent("drop", { files: [pdf] })

        dz.dropzoneProps().onDrop(drop)
        flush()
        expect(onReject).toHaveBeenCalledWith([pdf], ["type"])
        dispose()
      })
    })

    it("fires onDragEnter callback", () => {
      createRoot((dispose) => {
        const onDragEnter = vi.fn()
        const dz = createDropzone({ onDragEnter })
        const enter = createDragEvent("dragenter", { types: ["Files"] })

        dz.dropzoneProps().onDragEnter(enter)
        flush()
        expect(onDragEnter).toHaveBeenCalledTimes(1)
        dispose()
      })
    })

    it("fires onDragLeave callback", () => {
      createRoot((dispose) => {
        const onDragLeave = vi.fn()
        const dz = createDropzone({ onDragLeave })
        const enter = createDragEvent("dragenter", { types: ["Files"] })
        const leave = createDragEvent("dragleave")

        dz.dropzoneProps().onDragEnter(enter)
        dz.dropzoneProps().onDragLeave(leave)
        flush()
        expect(onDragLeave).toHaveBeenCalledTimes(1)
        dispose()
      })
    })

    it("does not fire onDragLeave on nested leave", () => {
      createRoot((dispose) => {
        const onDragLeave = vi.fn()
        const dz = createDropzone({ onDragLeave })
        const props = dz.dropzoneProps()

        props.onDragEnter(createDragEvent("dragenter", { types: ["Files"] }))
        props.onDragEnter(createDragEvent("dragenter", { types: ["Files"] }))
        props.onDragLeave(createDragEvent("dragleave"))
        flush()

        expect(onDragLeave).not.toHaveBeenCalled()
        dispose()
      })
    })
  })

  describe("inputProps", () => {
    it("generates correct attributes with no options", () => {
      createRoot((dispose) => {
        const dz = createDropzone({})
        const props = dz.inputProps()
        expect(props.type).toBe("file")
        expect(props.style).toContain("display:none")
        expect(props.accept).toBeUndefined()
        expect(props.multiple).toBeUndefined()
        dispose()
      })
    })

    it("sets accept from acceptedTypes", () => {
      createRoot((dispose) => {
        const dz = createDropzone({
          acceptedTypes: ["image/*", "application/pdf"],
        })
        const props = dz.inputProps()
        expect(props.accept).toBe("image/*,application/pdf")
        dispose()
      })
    })

    it("sets multiple when maxFiles > 1", () => {
      createRoot((dispose) => {
        const dz = createDropzone({ maxFiles: 5 })
        const props = dz.inputProps()
        expect(props.multiple).toBe(true)
        dispose()
      })
    })

    it("does not set multiple when maxFiles is 1", () => {
      createRoot((dispose) => {
        const dz = createDropzone({ maxFiles: 1 })
        const props = dz.inputProps()
        expect(props.multiple).toBeUndefined()
        dispose()
      })
    })
  })

  describe("dropzoneProps", () => {
    it("generates correct event handlers and data attributes", () => {
      createRoot((dispose) => {
        const dz = createDropzone({})
        const props = dz.dropzoneProps()
        expect(props.onDragOver).toBeTypeOf("function")
        expect(props.onDragEnter).toBeTypeOf("function")
        expect(props.onDragLeave).toBeTypeOf("function")
        expect(props.onDrop).toBeTypeOf("function")
        expect(props["data-drag-status"]).toBe("idle")
        expect(props["data-drag-over"]).toBeUndefined()
        expect(props["data-drag-acceptable"]).toBeUndefined()
        dispose()
      })
    })

    it("includes data-drag-over when dragging over", () => {
      createRoot((dispose) => {
        const dz = createDropzone({})
        const enter = createDragEvent("dragenter", { types: ["Files"] })
        dz.dropzoneProps().onDragEnter(enter)
        flush()

        const props = dz.dropzoneProps()
        expect(props["data-drag-over"]).toBe("")
        expect(props["data-drag-status"]).toBe("over")
        dispose()
      })
    })

    it("includes data-drag-acceptable when content is acceptable", () => {
      createRoot((dispose) => {
        const dz = createDropzone({})
        const enter = createDragEvent("dragenter", { types: ["Files"] })
        dz.dropzoneProps().onDragEnter(enter)
        flush()

        const props = dz.dropzoneProps()
        expect(props["data-drag-acceptable"]).toBe("")
        dispose()
      })
    })
  })

  describe("isAcceptable", () => {
    it("is true when Files type is present and no type constraint", () => {
      createRoot((dispose) => {
        const dz = createDropzone({})
        const enter = createDragEvent("dragenter", { types: ["Files"] })
        dz.dropzoneProps().onDragEnter(enter)
        flush()
        expect(dz.isAcceptable()).toBe(true)
        dispose()
      })
    })

    it("is true when Files type is present with type constraints", () => {
      createRoot((dispose) => {
        const dz = createDropzone({ acceptedTypes: ["image/*"] })
        const enter = createDragEvent("dragenter", { types: ["Files"] })
        dz.dropzoneProps().onDragEnter(enter)
        flush()
        // During drag, we can only see "Files" in types, so it's optimistic
        expect(dz.isAcceptable()).toBe(true)
        dispose()
      })
    })

    it("is false when no dataTransfer types", () => {
      createRoot((dispose) => {
        const dz = createDropzone({ acceptedTypes: ["image/*"] })
        const enter = createDragEvent("dragenter", { types: [] })
        dz.dropzoneProps().onDragEnter(enter)
        flush()
        expect(dz.isAcceptable()).toBe(false)
        dispose()
      })
    })

    it("resets to false on leave", () => {
      createRoot((dispose) => {
        const dz = createDropzone({})
        const enter = createDragEvent("dragenter", { types: ["Files"] })
        const leave = createDragEvent("dragleave")
        dz.dropzoneProps().onDragEnter(enter)
        flush()
        expect(dz.isAcceptable()).toBe(true)

        dz.dropzoneProps().onDragLeave(leave)
        flush()
        expect(dz.isAcceptable()).toBe(false)
        dispose()
      })
    })
  })
})

// ─── createSortable tests ────────────────────────────────────────────────────

describe("createSortable", () => {
  describe("activeId/overId tracking", () => {
    it("sets activeId on dragstart", () => {
      createRoot((dispose) => {
        const [items] = createSignal(["a", "b", "c"], { ownedWrite: true })
        const onReorder = vi.fn()
        const sortable = createSortable({ items, onReorder })

        const event = createDragEvent("dragstart")
        sortable.getDraggableProps("b").onDragStart(event)
        flush()

        expect(sortable.activeId()).toBe("b")
        dispose()
      })
    })

    it("sets overId on dragover of another item", () => {
      createRoot((dispose) => {
        const [items] = createSignal(["a", "b", "c"], { ownedWrite: true })
        const onReorder = vi.fn()
        const sortable = createSortable({ items, onReorder })

        // Start dragging "a"
        sortable.getDraggableProps("a").onDragStart(createDragEvent("dragstart"))
        flush()

        // Drag over "c"
        sortable.getDraggableProps("c").onDragOver(createDragEvent("dragover"))
        flush()

        expect(sortable.overId()).toBe("c")
        dispose()
      })
    })

    it("does not set overId for the same item as activeId", () => {
      createRoot((dispose) => {
        const [items] = createSignal(["a", "b", "c"], { ownedWrite: true })
        const onReorder = vi.fn()
        const sortable = createSortable({ items, onReorder })

        sortable.getDraggableProps("b").onDragStart(createDragEvent("dragstart"))
        flush()

        sortable.getDraggableProps("b").onDragOver(createDragEvent("dragover"))
        flush()

        expect(sortable.overId()).toBeUndefined()
        dispose()
      })
    })
  })

  describe("getVisualIndex", () => {
    it("returns original index when no drag is active", () => {
      createRoot((dispose) => {
        const [items] = createSignal(["a", "b", "c", "d"], { ownedWrite: true })
        const onReorder = vi.fn()
        const sortable = createSortable({ items, onReorder })

        expect(sortable.getVisualIndex("a")).toBe(0)
        expect(sortable.getVisualIndex("b")).toBe(1)
        expect(sortable.getVisualIndex("c")).toBe(2)
        expect(sortable.getVisualIndex("d")).toBe(3)
        dispose()
      })
    })

    it("returns reordered index during drag", () => {
      createRoot((dispose) => {
        const [items] = createSignal(["a", "b", "c", "d"], { ownedWrite: true })
        const onReorder = vi.fn()
        const sortable = createSortable({ items, onReorder })

        // Drag "a" over "c" → reorder preview: [b, c, a, d]
        // No wait: moving "a" to where "c" is → [b, a, c, d]? No:
        // splice(0,1) removes "a" → [b, c, d], splice(2, 0, "a") → [b, c, a, d]
        sortable.getDraggableProps("a").onDragStart(createDragEvent("dragstart"))
        flush()
        sortable.getDraggableProps("c").onDragOver(createDragEvent("dragover"))
        flush()

        expect(sortable.getVisualIndex("a")).toBe(2) // moved to index 2
        expect(sortable.getVisualIndex("b")).toBe(0)
        expect(sortable.getVisualIndex("c")).toBe(1) // shifted left
        expect(sortable.getVisualIndex("d")).toBe(3)
        dispose()
      })
    })

    it("returns original index when activeId equals overId", () => {
      createRoot((dispose) => {
        const [items] = createSignal(["a", "b", "c"], { ownedWrite: true })
        const onReorder = vi.fn()
        const sortable = createSortable({ items, onReorder })

        sortable.getDraggableProps("a").onDragStart(createDragEvent("dragstart"))
        flush()
        // overId won't be set because of the same-item guard,
        // so visual index stays original
        expect(sortable.getVisualIndex("a")).toBe(0)
        expect(sortable.getVisualIndex("b")).toBe(1)
        dispose()
      })
    })
  })

  describe("onReorder", () => {
    it("calls onReorder with correct from/to indices on drop", () => {
      createRoot((dispose) => {
        const [items] = createSignal(["a", "b", "c"], { ownedWrite: true })
        const onReorder = vi.fn()
        const sortable = createSortable({ items, onReorder })

        // Drag "a" (index 0) to "c" (index 2)
        sortable.getDraggableProps("a").onDragStart(createDragEvent("dragstart"))
        flush()
        sortable.getDraggableProps("c").onDragOver(createDragEvent("dragover"))
        flush()
        sortable.getDraggableProps("a").onDragEnd(createDragEvent("dragend"))
        flush()

        expect(onReorder).toHaveBeenCalledWith(["b", "c", "a"], {
          fromIndex: 0,
          toIndex: 2,
        })
        dispose()
      })
    })

    it("does not call onReorder if dropped on self", () => {
      createRoot((dispose) => {
        const [items] = createSignal(["a", "b", "c"], { ownedWrite: true })
        const onReorder = vi.fn()
        const sortable = createSortable({ items, onReorder })

        sortable.getDraggableProps("b").onDragStart(createDragEvent("dragstart"))
        flush()
        // overId never set (same item guard), just end
        sortable.getDraggableProps("b").onDragEnd(createDragEvent("dragend"))
        flush()

        expect(onReorder).not.toHaveBeenCalled()
        dispose()
      })
    })

    it("does not call onReorder if no overId", () => {
      createRoot((dispose) => {
        const [items] = createSignal(["a", "b", "c"], { ownedWrite: true })
        const onReorder = vi.fn()
        const sortable = createSortable({ items, onReorder })

        sortable.getDraggableProps("a").onDragStart(createDragEvent("dragstart"))
        flush()
        sortable.getDraggableProps("a").onDragEnd(createDragEvent("dragend"))
        flush()

        expect(onReorder).not.toHaveBeenCalled()
        dispose()
      })
    })
  })

  describe("disabled state", () => {
    it("prevents drag when disabled", () => {
      createRoot((dispose) => {
        const [items] = createSignal(["a", "b", "c"], { ownedWrite: true })
        const onReorder = vi.fn()
        const sortable = createSortable({
          items,
          onReorder,
          disabled: () => true,
        })

        const props = sortable.getDraggableProps("a")
        expect(props.draggable).toBe(false)

        props.onDragStart(createDragEvent("dragstart"))
        flush()
        expect(sortable.activeId()).toBeUndefined()
        expect(sortable.isDragging()).toBe(false)
        dispose()
      })
    })

    it("prevents dragover when disabled", () => {
      createRoot((dispose) => {
        const [items] = createSignal(["a", "b", "c"], { ownedWrite: true })
        const onReorder = vi.fn()
        const sortable = createSortable({
          items,
          onReorder,
          disabled: () => true,
        })

        sortable.getDraggableProps("b").onDragOver(createDragEvent("dragover"))
        flush()
        expect(sortable.overId()).toBeUndefined()
        dispose()
      })
    })

    it("prevents onReorder when disabled", () => {
      createRoot((dispose) => {
        const [items] = createSignal(["a", "b", "c"], { ownedWrite: true })
        const onReorder = vi.fn()
        const sortable = createSortable({
          items,
          onReorder,
          disabled: () => true,
        })

        sortable.getDraggableProps("a").onDragEnd(createDragEvent("dragend"))
        flush()
        expect(onReorder).not.toHaveBeenCalled()
        dispose()
      })
    })
  })

  describe("getDraggableProps", () => {
    it("generates correct attributes when not dragging", () => {
      createRoot((dispose) => {
        const [items] = createSignal(["a", "b"], { ownedWrite: true })
        const onReorder = vi.fn()
        const sortable = createSortable({ items, onReorder })

        const props = sortable.getDraggableProps("a")
        expect(props.draggable).toBe(true)
        expect(props.onDragStart).toBeTypeOf("function")
        expect(props.onDragOver).toBeTypeOf("function")
        expect(props.onDragEnd).toBeTypeOf("function")
        expect(props["data-dragging"]).toBeUndefined()
        expect(props["data-drag-over"]).toBeUndefined()
        dispose()
      })
    })

    it("includes data-dragging on the active item", () => {
      createRoot((dispose) => {
        const [items] = createSignal(["a", "b", "c"], { ownedWrite: true })
        const onReorder = vi.fn()
        const sortable = createSortable({ items, onReorder })

        sortable.getDraggableProps("b").onDragStart(createDragEvent("dragstart"))
        flush()

        const props = sortable.getDraggableProps("b")
        expect(props["data-dragging"]).toBe("")
        dispose()
      })
    })

    it("includes data-drag-over on the over item", () => {
      createRoot((dispose) => {
        const [items] = createSignal(["a", "b", "c"], { ownedWrite: true })
        const onReorder = vi.fn()
        const sortable = createSortable({ items, onReorder })

        sortable.getDraggableProps("a").onDragStart(createDragEvent("dragstart"))
        flush()
        sortable.getDraggableProps("c").onDragOver(createDragEvent("dragover"))
        flush()

        const props = sortable.getDraggableProps("c")
        expect(props["data-drag-over"]).toBe("")
        dispose()
      })
    })
  })

  describe("isDragging", () => {
    it("is false initially", () => {
      createRoot((dispose) => {
        const [items] = createSignal(["a", "b"], { ownedWrite: true })
        const onReorder = vi.fn()
        const sortable = createSortable({ items, onReorder })
        expect(sortable.isDragging()).toBe(false)
        dispose()
      })
    })

    it("becomes true on dragstart", () => {
      createRoot((dispose) => {
        const [items] = createSignal(["a", "b"], { ownedWrite: true })
        const onReorder = vi.fn()
        const sortable = createSortable({ items, onReorder })

        sortable.getDraggableProps("a").onDragStart(createDragEvent("dragstart"))
        flush()
        expect(sortable.isDragging()).toBe(true)
        dispose()
      })
    })

    it("becomes false on dragend", () => {
      createRoot((dispose) => {
        const [items] = createSignal(["a", "b", "c"], { ownedWrite: true })
        const onReorder = vi.fn()
        const sortable = createSortable({ items, onReorder })

        sortable.getDraggableProps("a").onDragStart(createDragEvent("dragstart"))
        flush()
        sortable.getDraggableProps("c").onDragOver(createDragEvent("dragover"))
        flush()
        sortable.getDraggableProps("a").onDragEnd(createDragEvent("dragend"))
        flush()

        expect(sortable.isDragging()).toBe(false)
        expect(sortable.activeId()).toBeUndefined()
        expect(sortable.overId()).toBeUndefined()
        dispose()
      })
    })
  })
})
