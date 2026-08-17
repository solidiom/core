import { describe, it, expect, vi } from "vitest"
import { createRoot, createSignal, flush } from "solid-js"
import { createSelection } from "./selection"

describe("createSelection", () => {
  describe("single mode", () => {
    it("starts with empty selection by default", () => {
      createRoot((dispose) => {
        const sel = createSelection({ mode: "single" })
        expect(sel.selectedKeys().size).toBe(0)
        dispose()
      })
    })

    it("uses defaultSelectedKeys", () => {
      createRoot((dispose) => {
        const sel = createSelection({
          mode: "single",
          defaultSelectedKeys: new Set(["a"]),
        })
        expect(sel.selectedKeys().has("a")).toBe(true)
        dispose()
      })
    })

    it("select replaces current selection", () => {
      createRoot((dispose) => {
        const sel = createSelection({ mode: "single", defaultSelectedKeys: new Set(["a"]) })
        sel.select("b")
        flush()
        expect(sel.selectedKeys().has("a")).toBe(false)
        expect(sel.selectedKeys().has("b")).toBe(true)
        expect(sel.selectedKeys().size).toBe(1)
        dispose()
      })
    })

    it("toggle selects if not selected", () => {
      createRoot((dispose) => {
        const sel = createSelection({ mode: "single" })
        sel.toggle("a")
        flush()
        expect(sel.isSelected("a")).toBe(true)
        dispose()
      })
    })

    it("toggle deselects if selected", () => {
      createRoot((dispose) => {
        const sel = createSelection({ mode: "single", defaultSelectedKeys: new Set(["a"]) })
        sel.toggle("a")
        flush()
        expect(sel.isSelected("a")).toBe(false)
        dispose()
      })
    })

    it("selectAll is a no-op", () => {
      createRoot((dispose) => {
        const sel = createSelection({ mode: "single" })
        sel.selectAll(["a", "b", "c"])
        flush()
        expect(sel.selectedKeys().size).toBe(0)
        dispose()
      })
    })

    it("modifiers are ignored in single mode", () => {
      createRoot((dispose) => {
        const sel = createSelection({ mode: "single", defaultSelectedKeys: new Set(["a"]) })
        sel.select("b", { shift: true })
        flush()
        expect(sel.selectedKeys().has("b")).toBe(true)
        expect(sel.selectedKeys().size).toBe(1)

        sel.select("c", { ctrlMeta: true })
        flush()
        expect(sel.selectedKeys().has("c")).toBe(true)
        expect(sel.selectedKeys().size).toBe(1)
        dispose()
      })
    })
  })

  describe("multiple mode", () => {
    it("select replaces selection by default (selectionBehavior=replace)", () => {
      createRoot((dispose) => {
        const sel = createSelection({ mode: "multiple", defaultSelectedKeys: new Set(["a", "b"]) })
        sel.select("c")
        flush()
        expect(sel.selectedKeys().size).toBe(1)
        expect(sel.isSelected("c")).toBe(true)
        expect(sel.isSelected("a")).toBe(false)
        dispose()
      })
    })

    it("ctrlMeta toggles individual key", () => {
      createRoot((dispose) => {
        const sel = createSelection({ mode: "multiple", defaultSelectedKeys: new Set(["a", "b"]) })
        sel.select("c", { ctrlMeta: true })
        flush()
        expect(sel.isSelected("a")).toBe(true)
        expect(sel.isSelected("b")).toBe(true)
        expect(sel.isSelected("c")).toBe(true)

        sel.select("b", { ctrlMeta: true })
        flush()
        expect(sel.isSelected("b")).toBe(false)
        expect(sel.isSelected("a")).toBe(true)
        expect(sel.isSelected("c")).toBe(true)
        dispose()
      })
    })

    it("shift does range selection from anchor", () => {
      createRoot((dispose) => {
        const sel = createSelection({ mode: "multiple" })
        sel.select("b") // sets anchor to "b"
        flush()
        expect(sel.anchor()).toBe("b")

        sel.select("d", { shift: true })
        flush()
        // Without orderedKeys, shift adds to selection
        expect(sel.isSelected("d")).toBe(true)
        dispose()
      })
    })

    it("shift without anchor behaves like single select and sets anchor", () => {
      createRoot((dispose) => {
        const sel = createSelection({ mode: "multiple" })
        sel.select("c", { shift: true })
        flush()
        expect(sel.isSelected("c")).toBe(true)
        expect(sel.anchor()).toBe("c")
        dispose()
      })
    })
  })

  describe("multiple mode with toggle behavior", () => {
    it("select toggles without modifiers when selectionBehavior=toggle", () => {
      createRoot((dispose) => {
        const sel = createSelection({
          mode: "multiple",
          selectionBehavior: "toggle",
        })
        sel.select("a")
        flush()
        expect(sel.isSelected("a")).toBe(true)

        sel.select("b")
        flush()
        expect(sel.isSelected("a")).toBe(true)
        expect(sel.isSelected("b")).toBe(true)

        sel.select("a")
        flush()
        expect(sel.isSelected("a")).toBe(false)
        expect(sel.isSelected("b")).toBe(true)
        dispose()
      })
    })
  })

  describe("range mode", () => {
    it("select does range from anchor when anchor exists", () => {
      createRoot((dispose) => {
        const sel = createSelection({ mode: "range" })
        // First select sets anchor
        sel.select("a")
        flush()
        expect(sel.isSelected("a")).toBe(true)
        expect(sel.anchor()).toBe("a")

        // Second select does range from anchor
        sel.select("c")
        flush()
        expect(sel.isSelected("c")).toBe(true)
        dispose()
      })
    })

    it("select without anchor behaves like single select and sets anchor", () => {
      createRoot((dispose) => {
        const sel = createSelection({ mode: "range" })
        sel.select("b")
        flush()
        expect(sel.isSelected("b")).toBe(true)
        expect(sel.selectedKeys().size).toBe(1)
        expect(sel.anchor()).toBe("b")
        dispose()
      })
    })
  })

  describe("selectAll", () => {
    it("selects all provided keys in multiple mode", () => {
      createRoot((dispose) => {
        const sel = createSelection({ mode: "multiple" })
        sel.selectAll(["a", "b", "c", "d"])
        flush()
        expect(sel.selectedKeys().size).toBe(4)
        expect(sel.isSelected("a")).toBe(true)
        expect(sel.isSelected("b")).toBe(true)
        expect(sel.isSelected("c")).toBe(true)
        expect(sel.isSelected("d")).toBe(true)
        dispose()
      })
    })

    it("selects all provided keys in range mode", () => {
      createRoot((dispose) => {
        const sel = createSelection({ mode: "range" })
        sel.selectAll(["x", "y", "z"])
        flush()
        expect(sel.selectedKeys().size).toBe(3)
        dispose()
      })
    })
  })

  describe("deselectAll", () => {
    it("clears all selection", () => {
      createRoot((dispose) => {
        const sel = createSelection({
          mode: "multiple",
          defaultSelectedKeys: new Set(["a", "b", "c"]),
        })
        sel.deselectAll()
        flush()
        expect(sel.selectedKeys().size).toBe(0)
        dispose()
      })
    })
  })

  describe("allowEmpty", () => {
    it("prevents clearing last key when allowEmpty=false", () => {
      createRoot((dispose) => {
        const sel = createSelection({
          mode: "single",
          defaultSelectedKeys: new Set(["a"]),
          allowEmpty: false,
        })
        sel.toggle("a")
        flush()
        expect(sel.isSelected("a")).toBe(true)
        expect(sel.selectedKeys().size).toBe(1)
        dispose()
      })
    })

    it("prevents deselectAll when allowEmpty=false and selection exists", () => {
      createRoot((dispose) => {
        const sel = createSelection({
          mode: "multiple",
          defaultSelectedKeys: new Set(["a", "b"]),
          allowEmpty: false,
        })
        sel.deselectAll()
        flush()
        // Should retain original selection
        expect(sel.selectedKeys().size).toBe(2)
        dispose()
      })
    })

    it("allows deselect when allowEmpty=true (default)", () => {
      createRoot((dispose) => {
        const sel = createSelection({
          mode: "single",
          defaultSelectedKeys: new Set(["a"]),
        })
        sel.toggle("a")
        flush()
        expect(sel.selectedKeys().size).toBe(0)
        dispose()
      })
    })
  })

  describe("controlled mode", () => {
    it("reads from controlled accessor", () => {
      createRoot((dispose) => {
        const [controlled] = createSignal<Set<string> | undefined>(new Set(["x"]), {
          ownedWrite: true,
        })
        const sel = createSelection({ mode: "single", selectedKeys: controlled })
        expect(sel.isSelected("x")).toBe(true)
        dispose()
      })
    })

    it("does not update internal state when controlled", () => {
      createRoot((dispose) => {
        const [controlled, setControlled] = createSignal<Set<string> | undefined>(new Set(["a"]), {
          ownedWrite: true,
        })
        const sel = createSelection({ mode: "single", selectedKeys: controlled })
        sel.select("b")
        flush()
        // Still "a" because controlled
        expect(sel.isSelected("a")).toBe(true)
        expect(sel.isSelected("b")).toBe(false)

        // Update externally
        setControlled(new Set(["b"]))
        flush()
        expect(sel.isSelected("b")).toBe(true)
        expect(sel.isSelected("a")).toBe(false)
        dispose()
      })
    })

    it("fires onSelectionChange even when controlled", () => {
      createRoot((dispose) => {
        const onChange = vi.fn()
        const [controlled] = createSignal<Set<string> | undefined>(new Set(["a"]), {
          ownedWrite: true,
        })
        const sel = createSelection({
          mode: "single",
          selectedKeys: controlled,
          onSelectionChange: onChange,
        })
        sel.select("b")
        flush()
        expect(onChange).toHaveBeenCalledWith(new Set(["b"]))
        dispose()
      })
    })
  })

  describe("uncontrolled mode", () => {
    it("updates internal state", () => {
      createRoot((dispose) => {
        const sel = createSelection({ mode: "single" })
        sel.select("a")
        flush()
        expect(sel.isSelected("a")).toBe(true)
        dispose()
      })
    })

    it("fires onSelectionChange", () => {
      createRoot((dispose) => {
        const onChange = vi.fn()
        const sel = createSelection({ mode: "single", onSelectionChange: onChange })
        sel.select("a")
        flush()
        expect(onChange).toHaveBeenCalledWith(new Set(["a"]))
        dispose()
      })
    })
  })

  describe("disabled", () => {
    it("select is a no-op when disabled", () => {
      createRoot((dispose) => {
        const sel = createSelection({
          mode: "single",
          disabled: () => true,
        })
        sel.select("a")
        flush()
        expect(sel.selectedKeys().size).toBe(0)
        dispose()
      })
    })

    it("toggle is a no-op when disabled", () => {
      createRoot((dispose) => {
        const sel = createSelection({
          mode: "single",
          disabled: () => true,
        })
        sel.toggle("a")
        flush()
        expect(sel.selectedKeys().size).toBe(0)
        dispose()
      })
    })

    it("selectAll is a no-op when disabled", () => {
      createRoot((dispose) => {
        const sel = createSelection({
          mode: "multiple",
          disabled: () => true,
        })
        sel.selectAll(["a", "b"])
        flush()
        expect(sel.selectedKeys().size).toBe(0)
        dispose()
      })
    })

    it("deselectAll is a no-op when disabled", () => {
      createRoot((dispose) => {
        const sel = createSelection({
          mode: "multiple",
          defaultSelectedKeys: new Set(["a"]),
          disabled: () => true,
        })
        sel.deselectAll()
        flush()
        expect(sel.selectedKeys().size).toBe(1)
        dispose()
      })
    })

    it("selectRange is a no-op when disabled", () => {
      createRoot((dispose) => {
        const sel = createSelection({
          mode: "multiple",
          disabled: () => true,
        })
        sel.selectRange("a", "c", ["a", "b", "c"])
        flush()
        expect(sel.selectedKeys().size).toBe(0)
        dispose()
      })
    })

    it("replaceSelection is a no-op when disabled", () => {
      createRoot((dispose) => {
        const sel = createSelection({
          mode: "multiple",
          disabled: () => true,
        })
        sel.replaceSelection(new Set(["a", "b"]))
        flush()
        expect(sel.selectedKeys().size).toBe(0)
        dispose()
      })
    })
  })

  describe("anchor tracking", () => {
    it("anchor starts undefined", () => {
      createRoot((dispose) => {
        const sel = createSelection({ mode: "multiple" })
        expect(sel.anchor()).toBeUndefined()
        dispose()
      })
    })

    it("setAnchor sets the anchor key", () => {
      createRoot((dispose) => {
        const sel = createSelection({ mode: "multiple" })
        sel.setAnchor("b")
        flush()
        expect(sel.anchor()).toBe("b")
        dispose()
      })
    })

    it("select sets anchor on first select", () => {
      createRoot((dispose) => {
        const sel = createSelection({ mode: "multiple" })
        sel.select("c")
        flush()
        expect(sel.anchor()).toBe("c")
        dispose()
      })
    })

    it("ctrlMeta toggle updates anchor", () => {
      createRoot((dispose) => {
        const sel = createSelection({ mode: "multiple" })
        sel.select("a")
        flush()
        sel.select("b", { ctrlMeta: true })
        flush()
        expect(sel.anchor()).toBe("b")
        dispose()
      })
    })
  })

  describe("selectRange", () => {
    it("selects inclusive range based on orderedKeys array", () => {
      createRoot((dispose) => {
        const sel = createSelection({ mode: "multiple" })
        sel.selectRange("b", "d", ["a", "b", "c", "d", "e"])
        flush()
        expect(sel.isSelected("a")).toBe(false)
        expect(sel.isSelected("b")).toBe(true)
        expect(sel.isSelected("c")).toBe(true)
        expect(sel.isSelected("d")).toBe(true)
        expect(sel.isSelected("e")).toBe(false)
        dispose()
      })
    })

    it("works with reversed from/to keys", () => {
      createRoot((dispose) => {
        const sel = createSelection({ mode: "multiple" })
        sel.selectRange("d", "b", ["a", "b", "c", "d", "e"])
        flush()
        expect(sel.isSelected("b")).toBe(true)
        expect(sel.isSelected("c")).toBe(true)
        expect(sel.isSelected("d")).toBe(true)
        expect(sel.selectedKeys().size).toBe(3)
        dispose()
      })
    })

    it("does nothing if fromKey not found", () => {
      createRoot((dispose) => {
        const sel = createSelection({ mode: "multiple" })
        sel.selectRange("z", "b", ["a", "b", "c"])
        flush()
        expect(sel.selectedKeys().size).toBe(0)
        dispose()
      })
    })

    it("does nothing if toKey not found", () => {
      createRoot((dispose) => {
        const sel = createSelection({ mode: "multiple" })
        sel.selectRange("a", "z", ["a", "b", "c"])
        flush()
        expect(sel.selectedKeys().size).toBe(0)
        dispose()
      })
    })

    it("selects single key when from and to are the same", () => {
      createRoot((dispose) => {
        const sel = createSelection({ mode: "multiple" })
        sel.selectRange("b", "b", ["a", "b", "c"])
        flush()
        expect(sel.selectedKeys().size).toBe(1)
        expect(sel.isSelected("b")).toBe(true)
        dispose()
      })
    })
  })

  describe("replaceSelection", () => {
    it("replaces entire selection with new set", () => {
      createRoot((dispose) => {
        const sel = createSelection({
          mode: "multiple",
          defaultSelectedKeys: new Set(["a", "b"]),
        })
        sel.replaceSelection(new Set(["x", "y", "z"]))
        flush()
        expect(sel.selectedKeys().size).toBe(3)
        expect(sel.isSelected("x")).toBe(true)
        expect(sel.isSelected("y")).toBe(true)
        expect(sel.isSelected("z")).toBe(true)
        expect(sel.isSelected("a")).toBe(false)
        dispose()
      })
    })

    it("respects allowEmpty=false", () => {
      createRoot((dispose) => {
        const sel = createSelection({
          mode: "multiple",
          defaultSelectedKeys: new Set(["a"]),
          allowEmpty: false,
        })
        sel.replaceSelection(new Set())
        flush()
        expect(sel.selectedKeys().size).toBe(1)
        expect(sel.isSelected("a")).toBe(true)
        dispose()
      })
    })
  })

  describe("mode as accessor", () => {
    it("supports reactive mode accessor", () => {
      createRoot((dispose) => {
        const [mode, setMode] = createSignal<"single" | "multiple" | "range">("single", {
          ownedWrite: true,
        })
        const sel = createSelection({ mode })

        sel.selectAll(["a", "b", "c"])
        flush()
        // single mode: selectAll is no-op
        expect(sel.selectedKeys().size).toBe(0)

        setMode("multiple")
        flush()
        sel.selectAll(["a", "b", "c"])
        flush()
        expect(sel.selectedKeys().size).toBe(3)
        dispose()
      })
    })
  })
})
