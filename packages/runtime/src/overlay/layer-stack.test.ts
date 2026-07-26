import { describe, it, expect, beforeEach } from "vitest"
import { getLayerStack, clearLayerStack, type Layer } from "./layer-stack"

// Minimal document stand-in
const doc = {} as Document

const makeLayer = (id: string, modal = false): Layer => ({
  id,
  modal,
})

describe("layer-stack", () => {
  beforeEach(() => {
    clearLayerStack(doc)
  })

  it("starts empty", () => {
    const stack = getLayerStack(doc)
    expect(stack.layers()).toHaveLength(0)
    expect(stack.top()).toBeUndefined()
  })

  it("pushes layers in order", () => {
    const stack = getLayerStack(doc)
    stack.push(makeLayer("a"))
    stack.push(makeLayer("b"))
    expect(stack.layers().map((l) => l.id)).toEqual(["a", "b"])
  })

  it("top returns the last pushed layer", () => {
    const stack = getLayerStack(doc)
    stack.push(makeLayer("a"))
    stack.push(makeLayer("b"))
    expect(stack.top()?.id).toBe("b")
  })

  it("isTop checks topmost correctly", () => {
    const stack = getLayerStack(doc)
    stack.push(makeLayer("a"))
    stack.push(makeLayer("b"))
    expect(stack.isTop("b")).toBe(true)
    expect(stack.isTop("a")).toBe(false)
  })

  it("removes a layer by ID", () => {
    const stack = getLayerStack(doc)
    stack.push(makeLayer("a"))
    stack.push(makeLayer("b"))
    stack.push(makeLayer("c"))
    stack.remove("b")
    expect(stack.layers().map((l) => l.id)).toEqual(["a", "c"])
    expect(stack.top()?.id).toBe("c")
  })

  it("push returns cleanup that removes the layer", () => {
    const stack = getLayerStack(doc)
    const cleanup = stack.push(makeLayer("a"))
    expect(stack.layers()).toHaveLength(1)
    cleanup()
    expect(stack.layers()).toHaveLength(0)
  })

  it("hasModal returns true when a modal layer exists", () => {
    const stack = getLayerStack(doc)
    stack.push(makeLayer("a", false))
    expect(stack.hasModal()).toBe(false)
    stack.push(makeLayer("b", true))
    expect(stack.hasModal()).toBe(true)
  })

  it("returns same stack for same document", () => {
    const stack1 = getLayerStack(doc)
    const stack2 = getLayerStack(doc)
    expect(stack1).toBe(stack2)
  })

  it("returns different stacks for different documents", () => {
    const doc2 = {} as Document
    const stack1 = getLayerStack(doc)
    const stack2 = getLayerStack(doc2)
    expect(stack1).not.toBe(stack2)
    clearLayerStack(doc2)
  })
})
