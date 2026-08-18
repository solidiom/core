/**
 * Selection — manages shared selection state across a collection supporting
 * single, multiple, and range selection modes.
 *
 * Per §9.2: provides selection tracking consumed by listbox, menu, tree,
 * and other selectable collection primitives.
 */

import { createSignal, type Accessor } from "solid-js"

/** The selection mode determining how many items can be selected. */
export type SelectionMode = "single" | "multiple" | "range"

/** Behavior when selecting without modifier keys in multiple mode. */
export type SelectionBehavior = "toggle" | "replace"

/** Modifier keys held during a select operation. */
export interface SelectionModifiers {
  /** Shift key held (range select in multiple/range mode). */
  shift?: boolean
  /** Ctrl/Cmd key held (toggle individual in multiple mode). */
  ctrlMeta?: boolean
}

/** Options for creating a selection manager. */
export interface SelectionOptions {
  /** Selection mode. Default: 'single'. */
  mode?: Accessor<SelectionMode> | SelectionMode
  /** Behavior when selecting without modifier keys. Default: 'replace'. */
  selectionBehavior?: SelectionBehavior
  /** Controlled selected keys. */
  selectedKeys?: Accessor<Set<string> | undefined>
  /** Default selected keys (uncontrolled). */
  defaultSelectedKeys?: Set<string>
  /** Called when selection changes. */
  onSelectionChange?: (keys: Set<string>) => void
  /** Whether selection is disabled. */
  disabled?: Accessor<boolean>
  /** Whether to allow empty selection (deselect all). Default: true. */
  allowEmpty?: boolean
}

/** The selection manager instance. */
export interface Selection {
  /** Current selected keys (reactive). */
  selectedKeys: Accessor<Set<string>>
  /** Whether a specific key is selected. */
  isSelected: (key: string) => boolean
  /** Select a key. Behavior depends on mode and modifiers. */
  select: (key: string, modifiers?: SelectionModifiers) => void
  /** Toggle selection of a key. */
  toggle: (key: string) => void
  /** Select all provided keys. */
  selectAll: (keys: string[]) => void
  /** Deselect all. */
  deselectAll: () => void
  /** Select a range from anchor to key (inclusive). Requires orderedKeys. */
  selectRange: (fromKey: string, toKey: string, orderedKeys: string[]) => void
  /** Set the anchor key for range selection. */
  setAnchor: (key: string) => void
  /** Current anchor key for range selection. */
  anchor: Accessor<string | undefined>
  /** Replace the entire selection with a new set. */
  replaceSelection: (keys: Set<string>) => void
}

/**
 * Creates a selection manager for a collection.
 *
 * Supports single, multiple, and range selection modes with controlled
 * and uncontrolled state management. Respects modifier keys for
 * toggle and range operations.
 */
export function createSelection(options: SelectionOptions = {}): Selection {
  const resolveMode = (): SelectionMode => {
    if (options.mode === undefined) return "single"
    if (typeof options.mode === "function") return options.mode()
    return options.mode
  }

  const selectionBehavior = options.selectionBehavior ?? "replace"
  const allowEmpty = options.allowEmpty ?? true

  const isControlled = (): boolean =>
    options.selectedKeys !== undefined && options.selectedKeys() !== undefined

  const [internal, setInternal] = createSignal<Set<string>>(
    options.defaultSelectedKeys ?? new Set(),
    { ownedWrite: true, equals: false },
  )

  const [anchorKey, setAnchorKey] = createSignal<string | undefined>(undefined, {
    ownedWrite: true,
  })

  const selectedKeys: Accessor<Set<string>> = (): Set<string> => {
    if (isControlled()) return options.selectedKeys!()!
    return internal()
  }

  const isDisabled = (): boolean => {
    return options.disabled?.() ?? false
  }

  const commitSelection = (next: Set<string>): void => {
    if (!isControlled()) {
      setInternal(next)
    }
    options.onSelectionChange?.(next)
  }

  const guardEmpty = (next: Set<string>): Set<string> => {
    if (!allowEmpty && next.size === 0) {
      return selectedKeys()
    }
    return next
  }

  const isSelected = (key: string): boolean => {
    return selectedKeys().has(key)
  }

  const select = (key: string, modifiers?: SelectionModifiers): void => {
    if (isDisabled()) return

    const mode = resolveMode()

    if (mode === "single") {
      const next = guardEmpty(new Set([key]))
      setAnchorKey(key)
      commitSelection(next)
      return
    }

    if (mode === "multiple") {
      if (modifiers?.shift) {
        // Range select from anchor
        const anchor = anchorKey()
        if (anchor === undefined) {
          // No anchor, just select the key
          const next = guardEmpty(new Set([key]))
          setAnchorKey(key)
          commitSelection(next)
        } else {
          // We can't do range without orderedKeys, so just add the key
          const current = selectedKeys()
          const next = new Set(current)
          next.add(key)
          commitSelection(guardEmpty(next))
        }
        return
      }

      if (modifiers?.ctrlMeta) {
        // Toggle individual key
        const current = selectedKeys()
        const next = new Set(current)
        if (next.has(key)) {
          next.delete(key)
        } else {
          next.add(key)
        }
        setAnchorKey(key)
        commitSelection(guardEmpty(next))
        return
      }

      // No modifiers
      if (selectionBehavior === "toggle") {
        const current = selectedKeys()
        const next = new Set(current)
        if (next.has(key)) {
          next.delete(key)
        } else {
          next.add(key)
        }
        setAnchorKey(key)
        commitSelection(guardEmpty(next))
      } else {
        // replace
        const next = guardEmpty(new Set([key]))
        setAnchorKey(key)
        commitSelection(next)
      }
      return
    }

    if (mode === "range") {
      const anchor = anchorKey()
      if (anchor === undefined) {
        // No anchor, behave like single select and set anchor
        const next = guardEmpty(new Set([key]))
        setAnchorKey(key)
        commitSelection(next)
      } else {
        // Range mode always does range from anchor, but needs orderedKeys
        // Without orderedKeys, select both anchor and current key
        const current = selectedKeys()
        const next = new Set(current)
        next.add(key)
        commitSelection(guardEmpty(next))
      }
      return
    }
  }

  const toggle = (key: string): void => {
    if (isDisabled()) return

    const current = selectedKeys()
    const next = new Set(current)
    if (next.has(key)) {
      next.delete(key)
    } else {
      next.add(key)
    }
    setAnchorKey(key)
    commitSelection(guardEmpty(next))
  }

  const selectAll = (keys: string[]): void => {
    if (isDisabled()) return

    const mode = resolveMode()
    if (mode === "single") return // no-op in single mode

    const next = new Set(keys)
    commitSelection(guardEmpty(next))
  }

  const deselectAll = (): void => {
    if (isDisabled()) return

    const next = guardEmpty(new Set<string>())
    commitSelection(next)
  }

  const selectRange = (fromKey: string, toKey: string, orderedKeys: string[]): void => {
    if (isDisabled()) return

    const fromIndex = orderedKeys.indexOf(fromKey)
    const toIndex = orderedKeys.indexOf(toKey)

    if (fromIndex === -1 || toIndex === -1) return

    const start = Math.min(fromIndex, toIndex)
    const end = Math.max(fromIndex, toIndex)

    const rangeKeys = orderedKeys.slice(start, end + 1)
    const next = new Set(rangeKeys)
    commitSelection(guardEmpty(next))
  }

  const setAnchor = (key: string): void => {
    setAnchorKey(key)
  }

  const replaceSelection = (keys: Set<string>): void => {
    if (isDisabled()) return
    commitSelection(guardEmpty(keys))
  }

  return {
    selectedKeys,
    isSelected,
    select,
    toggle,
    selectAll,
    deselectAll,
    selectRange,
    setAnchor,
    anchor: anchorKey,
    replaceSelection,
  }
}
