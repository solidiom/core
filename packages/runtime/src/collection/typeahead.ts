/**
 * Typeahead — character-based search within a collection with timeout reset.
 *
 * Per §9.2: accumulates typed characters, matches against item text values,
 * resets after a configurable timeout, and is suppressed during IME composition.
 */

import type { CollectionItem } from "./collection"

/** Options for creating a typeahead manager. */
export interface TypeaheadOptions {
  /** Timeout in ms before the search string resets. Default: 500. */
  timeout?: number
  /** Called when typeahead matches an item. */
  onMatch?: (item: CollectionItem) => void
}

/** The typeahead manager instance. */
export interface Typeahead {
  /** Process a keyboard event. Returns the matched item or undefined. */
  handle: (key: string, items: CollectionItem[], currentId?: string) => CollectionItem | undefined
  /** Reset the accumulated search string. */
  reset: () => void
  /** Signal that IME composition has started (suppresses typeahead). */
  compositionStart: () => void
  /** Signal that IME composition has ended. */
  compositionEnd: () => void
}

/**
 * Creates a typeahead manager for character-based item search.
 *
 * Accumulates single printable characters into a search string.
 * Matches items by prefix against their textValue. Wraps search
 * starting from the item after the current active item.
 * Resets after the timeout elapses with no input.
 */
export function createTypeahead(options: TypeaheadOptions = {}): Typeahead {
  const timeout = options.timeout ?? 500

  let search = ""
  let timer: ReturnType<typeof setTimeout> | undefined
  let composing = false

  const reset = (): void => {
    search = ""
    if (timer !== undefined) {
      clearTimeout(timer)
      timer = undefined
    }
  }

  const compositionStart = (): void => {
    composing = true
  }

  const compositionEnd = (): void => {
    composing = false
  }

  const handle = (
    key: string,
    items: CollectionItem[],
    currentId?: string,
  ): CollectionItem | undefined => {
    // Suppress during IME composition
    if (composing) return undefined

    // Only accept single printable characters
    if (key.length !== 1 || key === " ") return undefined

    // Reset timeout
    if (timer !== undefined) clearTimeout(timer)
    timer = setTimeout(reset, timeout)

    // Accumulate character
    search += key.toLowerCase()

    // Find matching item, wrapping from current position
    const enabledItems = items.filter((item) => !item.disabled())
    if (enabledItems.length === 0) return undefined

    const currentIndex = currentId ? enabledItems.findIndex((item) => item.id === currentId) : -1

    // Search starting after current item (wrapping around)
    const startIndex = currentIndex + 1
    const orderedItems = [...enabledItems.slice(startIndex), ...enabledItems.slice(0, startIndex)]

    // For single-character repeated search (e.g. "aaa"), cycle through
    // items starting with that character instead of prefix matching
    const isRepeatedChar = search.length > 1 && new Set(search).size === 1
    const matchString = isRepeatedChar ? search[0]! : search

    const match = orderedItems.find((item) => {
      const text = item.textValue().toLowerCase()
      return text.startsWith(matchString)
    })

    if (match) {
      options.onMatch?.(match)
    }

    // Reset to single char for repeated-char cycling
    if (isRepeatedChar) {
      search = search[0]!
    }

    return match
  }

  return { handle, reset, compositionStart, compositionEnd }
}
