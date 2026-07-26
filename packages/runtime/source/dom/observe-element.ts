/**
 * Element observation — owner-scoped ResizeObserver and MutationObserver wrappers.
 *
 * Per §8.2: browser measurement only after mount/settlement. These utilities
 * register observers that auto-dispose with the current reactive owner.
 * Safe to call only in browser context (no-ops during SSR).
 */

import { onCleanup, getOwner } from "solid-js"

/**
 * Observes element size changes via ResizeObserver.
 * Auto-cleans up when the reactive owner disposes.
 * No-op when called during SSR (no `ResizeObserver` global).
 */
export function observeElementSize(
  element: () => Element | undefined,
  callback: (entry: ResizeObserverEntry) => void,
): () => void {
  if (typeof ResizeObserver === "undefined") return () => {}

  const observer = new ResizeObserver((entries) => {
    const entry = entries[0]
    if (entry) callback(entry)
  })

  let currentEl: Element | undefined

  const update = () => {
    const el = element()
    if (el === currentEl) return
    if (currentEl) observer.unobserve(currentEl)
    currentEl = el
    if (el) observer.observe(el)
  }

  update()

  const dispose = () => {
    observer.disconnect()
    currentEl = undefined
  }

  if (getOwner()) {
    onCleanup(dispose)
  }

  return dispose
}

/**
 * Observes DOM mutations on an element via MutationObserver.
 * Auto-cleans up when the reactive owner disposes.
 * No-op when called during SSR (no `MutationObserver` global).
 */
export function observeElementMutations(
  element: () => Element | undefined,
  callback: (mutations: MutationRecord[]) => void,
  options: MutationObserverInit = { childList: true, subtree: true },
): () => void {
  if (typeof MutationObserver === "undefined") return () => {}

  const observer = new MutationObserver(callback)

  let currentEl: Element | undefined

  const update = () => {
    const el = element()
    if (el === currentEl) return
    if (currentEl) observer.disconnect()
    currentEl = el
    if (el) observer.observe(el, options)
  }

  update()

  const dispose = () => {
    observer.disconnect()
    currentEl = undefined
  }

  if (getOwner()) {
    onCleanup(dispose)
  }

  return dispose
}
