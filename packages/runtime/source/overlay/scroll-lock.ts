/**
 * Scroll lock — reference-counted scroll prevention on the document body.
 *
 * Per §8.7: document-scoped. Multiple overlays sharing a document
 * share one scroll lock with reference counting. Only removes the lock
 * when all holders release.
 */

/** Document → reference count mapping. */
const refCounts = new Map<Document, number>()
/** Document → original styles mapping for restoration. */
const originals = new Map<Document, { overflow: string; paddingRight: string }>()

/**
 * Activates scroll lock on the given document's body.
 *
 * Compensates for scrollbar removal by adding equivalent paddingRight.
 * Reference-counted — multiple activations share one lock.
 *
 * Returns a release function.
 */
export function activateScrollLock(doc: Document): () => void {
  const count = refCounts.get(doc) ?? 0
  refCounts.set(doc, count + 1)

  if (count === 0) {
    const body = doc.body
    const scrollbarWidth = window.innerWidth - doc.documentElement.clientWidth

    originals.set(doc, {
      overflow: body.style.overflow,
      paddingRight: body.style.paddingRight,
    })

    body.style.overflow = "hidden"
    if (scrollbarWidth > 0) {
      body.style.paddingRight = `${scrollbarWidth}px`
    }
  }

  let released = false

  return () => {
    if (released) return
    released = true

    const current = refCounts.get(doc) ?? 1
    const next = current - 1
    refCounts.set(doc, next)

    if (next === 0) {
      refCounts.delete(doc)
      const original = originals.get(doc)
      if (original) {
        const body = doc.body
        body.style.overflow = original.overflow
        body.style.paddingRight = original.paddingRight
        originals.delete(doc)
      }
    }
  }
}

/**
 * Resets all scroll lock state (for testing).
 * @internal
 */
export function resetScrollLock(): void {
  for (const [doc, original] of originals.entries()) {
    doc.body.style.overflow = original.overflow
    doc.body.style.paddingRight = original.paddingRight
  }
  refCounts.clear()
  originals.clear()
}
