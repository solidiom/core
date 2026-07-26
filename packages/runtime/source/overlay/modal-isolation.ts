/**
 * Modal isolation — reference-counted `aria-hidden` and `inert` application
 * to siblings of modal layers.
 *
 * Per §8.7: document-scoped. When a modal layer is active, all sibling
 * subtrees of the modal's portal container are marked inert. Multiple
 * concurrent modals share a single reference count.
 */

/** Document → reference count mapping. */
const refCounts = new Map<Document, number>()
/** Document → cleanup function mapping. */
const cleanups = new Map<Document, () => void>()

/**
 * Activates modal isolation for a given element's document.
 *
 * Marks all siblings of the element (and its portal ancestors) as
 * `aria-hidden="true"` and `inert`. Reference-counted so nested
 * modals don't conflict.
 *
 * Returns a deactivation function.
 */
export function activateModalIsolation(element: Element): () => void {
  const doc = element.ownerDocument
  const count = refCounts.get(doc) ?? 0
  refCounts.set(doc, count + 1)

  // Only apply isolation on first activation
  if (count === 0) {
    const cleanup = applyInertToSiblings(element)
    cleanups.set(doc, cleanup)
  }

  let deactivated = false

  return () => {
    if (deactivated) return
    deactivated = true

    const current = refCounts.get(doc) ?? 1
    const next = current - 1
    refCounts.set(doc, next)

    if (next === 0) {
      refCounts.delete(doc)
      const cleanup = cleanups.get(doc)
      cleanup?.()
      cleanups.delete(doc)
    }
  }
}

/**
 * Resets all modal isolation state (for testing).
 * @internal
 */
export function resetModalIsolation(): void {
  for (const cleanup of cleanups.values()) {
    cleanup()
  }
  refCounts.clear()
  cleanups.clear()
}

function applyInertToSiblings(element: Element): () => void {
  const restore: Array<{ el: Element; hadAriaHidden: string | null; hadInert: boolean }> = []

  // Walk up to find the direct child of <body> (portal container)
  let target: Element | null = element
  while (target && target.parentElement !== target.ownerDocument.body) {
    target = target.parentElement
  }

  if (!target) return () => {}

  const parent = target.parentElement
  if (!parent) return () => {}

  for (const sibling of Array.from(parent.children)) {
    if (sibling === target) continue
    // Skip script/style elements
    if (sibling.tagName === "SCRIPT" || sibling.tagName === "STYLE") continue

    const hadAriaHidden = sibling.getAttribute("aria-hidden")
    const hadInert = (sibling as HTMLElement).inert ?? false

    sibling.setAttribute("aria-hidden", "true")
    if ("inert" in sibling) {
      ;(sibling as HTMLElement).inert = true
    }

    restore.push({ el: sibling, hadAriaHidden, hadInert })
  }

  return () => {
    for (const { el, hadAriaHidden, hadInert } of restore) {
      if (hadAriaHidden === null) {
        el.removeAttribute("aria-hidden")
      } else {
        el.setAttribute("aria-hidden", hadAriaHidden)
      }
      if ("inert" in el) {
        ;(el as HTMLElement).inert = hadInert
      }
    }
  }
}
