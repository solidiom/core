import { describe, it, expect, vi, beforeEach } from "vitest"
import { getLayerStack, clearLayerStack } from "./layer-stack"
import { setupDismissableLayer } from "./dismissable-layer"

// Minimal DOM mocks for node environment
function createMockDocument() {
  const listeners = new Map<string, Set<EventListener>>()

  return {
    addEventListener(type: string, handler: EventListener) {
      if (!listeners.has(type)) listeners.set(type, new Set())
      listeners.get(type)!.add(handler)
    },
    removeEventListener(type: string, handler: EventListener) {
      listeners.get(type)?.delete(handler)
    },
    dispatch(type: string, event: Record<string, unknown>) {
      for (const handler of listeners.get(type) ?? []) {
        handler(event as unknown as Event)
      }
    },
    getListenerCount(type: string) {
      return listeners.get(type)?.size ?? 0
    },
  } as unknown as Document & {
    dispatch: (type: string, event: Record<string, unknown>) => void
    getListenerCount: (type: string) => number
  }
}

describe("setupDismissableLayer", () => {
  let doc: ReturnType<typeof createMockDocument>

  beforeEach(() => {
    doc = createMockDocument()
    clearLayerStack(doc as unknown as Document)
  })

  it("calls onDismiss with escape-key when topmost", () => {
    const stack = getLayerStack(doc as unknown as Document)
    stack.push({ id: "layer1", modal: false })

    const onDismiss = vi.fn()
    const cleanup = setupDismissableLayer({
      document: doc as unknown as Document,
      layerId: "layer1",
      element: () => undefined,
      onDismiss,
    })

    doc.dispatch("keydown", { key: "Escape", preventDefault: vi.fn() })
    expect(onDismiss).toHaveBeenCalledWith("escape-key")

    cleanup()
  })

  it("does not dismiss on escape when not topmost", () => {
    const stack = getLayerStack(doc as unknown as Document)
    stack.push({ id: "layer1", modal: false })
    stack.push({ id: "layer2", modal: false })

    const onDismiss = vi.fn()
    setupDismissableLayer({
      document: doc as unknown as Document,
      layerId: "layer1",
      element: () => undefined,
      onDismiss,
    })

    doc.dispatch("keydown", { key: "Escape", preventDefault: vi.fn() })
    expect(onDismiss).not.toHaveBeenCalled()
  })

  it("calls onDismiss with pointer-outside when click is outside", () => {
    const stack = getLayerStack(doc as unknown as Document)
    stack.push({ id: "layer1", modal: false })

    const el = { contains: () => false } as unknown as Element
    const onDismiss = vi.fn()
    setupDismissableLayer({
      document: doc as unknown as Document,
      layerId: "layer1",
      element: () => el,
      onDismiss,
    })

    const outsideTarget = {} as EventTarget
    doc.dispatch("pointerdown", { target: outsideTarget })
    expect(onDismiss).toHaveBeenCalledWith("pointer-outside")
  })

  it("does not dismiss on pointer inside element", () => {
    const stack = getLayerStack(doc as unknown as Document)
    stack.push({ id: "layer1", modal: false })

    const insideTarget = {} as Node
    const el = { contains: (t: Node) => t === insideTarget } as unknown as Element
    const onDismiss = vi.fn()
    setupDismissableLayer({
      document: doc as unknown as Document,
      layerId: "layer1",
      element: () => el,
      onDismiss,
    })

    doc.dispatch("pointerdown", { target: insideTarget })
    expect(onDismiss).not.toHaveBeenCalled()
  })

  it("respects excludeElements for pointer-outside", () => {
    const stack = getLayerStack(doc as unknown as Document)
    stack.push({ id: "layer1", modal: false })

    const triggerTarget = {} as Node
    const el = { contains: () => false } as unknown as Element
    const trigger = { contains: (t: Node) => t === triggerTarget } as unknown as Element
    const onDismiss = vi.fn()
    setupDismissableLayer({
      document: doc as unknown as Document,
      layerId: "layer1",
      element: () => el,
      excludeElements: () => [trigger],
      onDismiss,
    })

    doc.dispatch("pointerdown", { target: triggerTarget })
    expect(onDismiss).not.toHaveBeenCalled()
  })

  it("does not fire when escapeKey is disabled", () => {
    const stack = getLayerStack(doc as unknown as Document)
    stack.push({ id: "layer1", modal: false })

    const onDismiss = vi.fn()
    setupDismissableLayer({
      document: doc as unknown as Document,
      layerId: "layer1",
      element: () => undefined,
      escapeKey: false,
      onDismiss,
    })

    doc.dispatch("keydown", { key: "Escape", preventDefault: vi.fn() })
    expect(onDismiss).not.toHaveBeenCalled()
  })

  it("cleanup removes all listeners", () => {
    const stack = getLayerStack(doc as unknown as Document)
    stack.push({ id: "layer1", modal: false })

    const cleanup = setupDismissableLayer({
      document: doc as unknown as Document,
      layerId: "layer1",
      element: () => undefined,
      onDismiss: vi.fn(),
    })

    expect(doc.getListenerCount("keydown")).toBe(1)
    cleanup()
    expect(doc.getListenerCount("keydown")).toBe(0)
  })
})
