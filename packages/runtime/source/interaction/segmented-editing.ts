/**
 * SegmentedEditing — manages multiple editable segments within a single field.
 *
 * Implements segment-by-segment input handling for composite values
 * like time (HH:MM:SS), dates (DD/MM/YYYY), or IP addresses.
 * Supports numeric, text, and literal (non-editable) segments with
 * keyboard navigation, auto-advance, and controlled/uncontrolled modes.
 *
 * Used by: DatePicker, TimePicker, MaskedInput (future).
 */

import { createSignal, type Accessor } from "solid-js"

/** Definition of a single segment within the field. */
export interface SegmentDefinition {
  /** Unique identifier for this segment. */
  id: string
  /** Type of segment (affects validation and keyboard behavior). */
  type: "numeric" | "text" | "literal"
  /** Minimum numeric value (for numeric segments). */
  min?: number
  /** Maximum numeric value (for numeric segments). */
  max?: number
  /** Fixed width in characters. Input auto-advances when filled. */
  maxLength?: number
  /** Placeholder text when segment is empty. */
  placeholder?: string
  /** Whether this segment is editable. Literal segments are not. */
  editable?: boolean
  /** Allowed values for text segments. */
  allowedValues?: string[]
  /** Whether to pad with leading zeros (numeric). Default: true for numeric. */
  padZero?: boolean
}

/** Options for creating a segmented editing instance. */
export interface SegmentedEditingOptions {
  /** Segment definitions in display order. */
  segments: SegmentDefinition[] | Accessor<SegmentDefinition[]>
  /** Initial values keyed by segment ID. */
  defaultValues?: Record<string, string>
  /** Controlled values. */
  values?: Accessor<Record<string, string> | undefined>
  /** Called when any segment value changes. */
  onChange?: (values: Record<string, string>, details: { segmentId: string; event?: Event }) => void
  /** Called when all editable segments are filled (complete entry). */
  onComplete?: (values: Record<string, string>) => void
  /** Whether the field is disabled. */
  disabled?: Accessor<boolean>
  /** Whether the field is read-only. */
  readOnly?: Accessor<boolean>
  /** Separator character(s) that auto-advance to next segment. */
  separators?: string[]
}

/** Reactive state for a single segment. */
export interface SegmentState {
  /** Segment ID. */
  id: string
  /** Current value of this segment. */
  value: Accessor<string>
  /** Whether this segment is currently focused. */
  isFocused: Accessor<boolean>
  /** Display text (with placeholder when empty, zero-padding for numeric). */
  displayValue: Accessor<string>
}

/** The returned segmented editing instance. */
export interface SegmentedEditing {
  /** All segment states (reactive). */
  segments: Accessor<SegmentState[]>
  /** Current focused segment index. */
  focusedIndex: Accessor<number>
  /** Current focused segment ID. */
  focusedId: Accessor<string | undefined>
  /** Get all current values as a record. */
  values: Accessor<Record<string, string>>
  /** Whether all editable segments have values. */
  isComplete: Accessor<boolean>
  /** Focus a specific segment by index. */
  focusSegment: (index: number) => void
  /** Focus a specific segment by ID. */
  focusSegmentById: (id: string) => void
  /** Focus the next editable segment. */
  focusNext: () => void
  /** Focus the previous editable segment. */
  focusPrevious: () => void
  /** Handle keyboard input on the focused segment. */
  handleKeyDown: (event: KeyboardEvent) => void
  /** Handle text input on the focused segment. */
  handleInput: (text: string, event?: Event) => void
  /** Set a segment value directly. */
  setSegmentValue: (id: string, value: string, event?: Event) => void
  /** Clear all segment values. */
  clear: () => void
  /** Clear the focused segment. */
  clearFocused: () => void
}

/**
 * Resolves segment definitions from a static array or reactive accessor.
 */
function resolveSegments(
  segments: SegmentDefinition[] | Accessor<SegmentDefinition[]>,
): SegmentDefinition[] {
  if (typeof segments === "function") return (segments as Accessor<SegmentDefinition[]>)()
  return segments
}

/**
 * Determines whether a segment definition is editable.
 */
function isEditable(def: SegmentDefinition): boolean {
  if (def.type === "literal") return false
  return def.editable !== false
}

/**
 * Creates a segmented editing interaction primitive.
 *
 * Manages multiple editable segments within a single field, supporting
 * numeric, text, and literal segment types with keyboard navigation,
 * auto-advance on fill, separator-triggered advance, controlled/uncontrolled
 * value management, and completion tracking.
 *
 * @param options - Configuration for the segmented editing field.
 * @returns A SegmentedEditing instance with reactive segments, navigation, and input handling.
 */
export function createSegmentedEditing(options: SegmentedEditingOptions): SegmentedEditing {
  const [focusedIndex, setFocusedIndex] = createSignal<number>(0, { ownedWrite: true })

  // Internal values store (uncontrolled mode)
  const [internalValues, setInternalValues] = createSignal<Record<string, string>>(
    options.defaultValues ? { ...options.defaultValues } : {},
    { ownedWrite: true },
  )

  /**
   * Resolves the current values from controlled or internal state.
   */
  function getCurrentValues(): Record<string, string> {
    if (options.values !== undefined) {
      return options.values() ?? {}
    }
    return internalValues()
  }

  /**
   * Gets the current segment definitions.
   */
  function getDefs(): SegmentDefinition[] {
    return resolveSegments(options.segments)
  }

  /**
   * Gets indexes of all editable segments.
   */
  function getEditableIndexes(): number[] {
    const defs = getDefs()
    const indexes: number[] = []
    for (let i = 0; i < defs.length; i++) {
      const def = defs[i]
      if (def !== undefined && isEditable(def)) indexes.push(i)
    }
    return indexes
  }

  /**
   * Updates a single segment value with proper notification.
   */
  function updateSegmentValue(id: string, value: string, event?: Event): void {
    const isControlled = options.values !== undefined
    const current = getCurrentValues()

    const next = { ...current, [id]: value }

    if (!isControlled) {
      setInternalValues(next)
    }

    options.onChange?.(next, { segmentId: id, event })

    // Check completion
    const defs = getDefs()
    const editableDefs = defs.filter(isEditable)
    const allFilled = editableDefs.every((def) => {
      const val = next[def.id]
      return val !== undefined && val !== ""
    })

    if (allFilled) {
      options.onComplete?.(next)
    }
  }

  /**
   * Gets the display value for a segment, applying padding and placeholders.
   */
  function getDisplayValue(def: SegmentDefinition, rawValue: string): string {
    if (def.type === "literal") {
      return def.placeholder ?? ""
    }

    if (!rawValue) {
      return def.placeholder ?? ""
    }

    if (def.type === "numeric") {
      const shouldPad = def.padZero !== false
      if (shouldPad && def.maxLength && rawValue.length < def.maxLength) {
        return rawValue.padStart(def.maxLength, "0")
      }
    }

    return rawValue
  }

  /**
   * Finds the next editable segment index after the given index.
   */
  function findNextEditable(fromIndex: number): number | undefined {
    const defs = getDefs()
    for (let i = fromIndex + 1; i < defs.length; i++) {
      const def = defs[i]
      if (def !== undefined && isEditable(def)) return i
    }
    return undefined
  }

  /**
   * Finds the previous editable segment index before the given index.
   */
  function findPrevEditable(fromIndex: number): number | undefined {
    const defs = getDefs()
    for (let i = fromIndex - 1; i >= 0; i--) {
      const def = defs[i]
      if (def !== undefined && isEditable(def)) return i
    }
    return undefined
  }

  // -- Public API --

  const values: Accessor<Record<string, string>> = (): Record<string, string> => {
    return getCurrentValues()
  }

  const isComplete: Accessor<boolean> = (): boolean => {
    const defs = getDefs()
    const current = getCurrentValues()
    const editableDefs = defs.filter(isEditable)
    return editableDefs.every((def) => {
      const val = current[def.id]
      return val !== undefined && val !== ""
    })
  }

  const focusedId: Accessor<string | undefined> = (): string | undefined => {
    const defs = getDefs()
    const idx = focusedIndex()
    if (idx < 0 || idx >= defs.length) return undefined
    const def = defs[idx]
    return def?.id
  }

  const segments: Accessor<SegmentState[]> = (): SegmentState[] => {
    const defs = getDefs()
    const current = getCurrentValues()
    const focused = focusedIndex()

    return defs.map((def, index) => ({
      id: def.id,
      value: () => current[def.id] ?? "",
      isFocused: () => index === focused,
      displayValue: () => getDisplayValue(def, current[def.id] ?? ""),
    }))
  }

  function focusSegment(index: number): void {
    const defs = getDefs()
    if (index >= 0 && index < defs.length) {
      setFocusedIndex(index)
    }
  }

  function focusSegmentById(id: string): void {
    const defs = getDefs()
    const index = defs.findIndex((d) => d.id === id)
    if (index !== -1) {
      setFocusedIndex(index)
    }
  }

  function focusNext(): void {
    const next = findNextEditable(focusedIndex())
    if (next !== undefined) {
      setFocusedIndex(next)
    }
  }

  function focusPrevious(): void {
    const prev = findPrevEditable(focusedIndex())
    if (prev !== undefined) {
      setFocusedIndex(prev)
    }
  }

  function handleInput(text: string, event?: Event): void {
    if (options.disabled?.()) return
    if (options.readOnly?.()) return

    const defs = getDefs()
    const idx = focusedIndex()
    const def = defs[idx]
    if (!def || !isEditable(def)) return

    // Check for separator characters
    if (options.separators && options.separators.includes(text)) {
      focusNext()
      return
    }

    const current = getCurrentValues()
    const currentVal = current[def.id] ?? ""

    if (def.type === "numeric") {
      // Only accept digits
      if (!/^\d$/.test(text)) return

      const newVal = currentVal + text
      // Validate against max
      if (def.max !== undefined) {
        const numVal = parseInt(newVal, 10)
        if (numVal > def.max) {
          // If single digit exceeds max, clamp to max
          const clamped = String(def.max)
          updateSegmentValue(def.id, clamped, event)
          const next = findNextEditable(idx)
          if (next !== undefined) setFocusedIndex(next)
          return
        }
      }

      updateSegmentValue(def.id, newVal, event)

      // Auto-advance when maxLength reached
      if (def.maxLength && newVal.length >= def.maxLength) {
        const next = findNextEditable(idx)
        if (next !== undefined) setFocusedIndex(next)
      }
    } else if (def.type === "text") {
      // Accept alphabetic characters
      if (!/^[a-zA-Z]$/.test(text)) return

      if (def.allowedValues && def.allowedValues.length > 0) {
        // Type-ahead: find matching value
        const searchStr = currentVal + text
        const match = def.allowedValues.find((v) =>
          v.toLowerCase().startsWith(searchStr.toLowerCase()),
        )
        if (match) {
          updateSegmentValue(def.id, match, event)
        } else {
          // Try with just the new character (reset search)
          const singleMatch = def.allowedValues.find((v) =>
            v.toLowerCase().startsWith(text.toLowerCase()),
          )
          if (singleMatch) {
            updateSegmentValue(def.id, singleMatch, event)
          }
        }
      } else {
        const newVal = currentVal + text
        if (def.maxLength && newVal.length > def.maxLength) return
        updateSegmentValue(def.id, newVal, event)

        // Auto-advance when maxLength reached
        if (def.maxLength && newVal.length >= def.maxLength) {
          const next = findNextEditable(idx)
          if (next !== undefined) setFocusedIndex(next)
        }
      }
    }
  }

  function handleKeyDown(event: KeyboardEvent): void {
    if (options.disabled?.()) return

    const defs = getDefs()
    const idx = focusedIndex()
    const def = defs[idx]

    switch (event.key) {
      case "ArrowRight": {
        event.preventDefault()
        focusNext()
        break
      }
      case "ArrowLeft": {
        event.preventDefault()
        focusPrevious()
        break
      }
      case "Tab": {
        if (event.shiftKey) {
          const prev = findPrevEditable(idx)
          if (prev !== undefined) {
            event.preventDefault()
            setFocusedIndex(prev)
          }
          // If no previous segment, don't prevent default (let focus leave)
        } else {
          const next = findNextEditable(idx)
          if (next !== undefined) {
            event.preventDefault()
            setFocusedIndex(next)
          }
          // If no next segment, don't prevent default (let focus leave)
        }
        break
      }
      case "Home": {
        event.preventDefault()
        const editableIndexes = getEditableIndexes()
        if (editableIndexes.length > 0) {
          setFocusedIndex(editableIndexes[0]!)
        }
        break
      }
      case "End": {
        event.preventDefault()
        const editableIndexes = getEditableIndexes()
        if (editableIndexes.length > 0) {
          setFocusedIndex(editableIndexes[editableIndexes.length - 1]!)
        }
        break
      }
      case "ArrowUp": {
        event.preventDefault()
        if (options.readOnly?.()) break
        if (!def || !isEditable(def)) break
        handleArrowUp(def, event)
        break
      }
      case "ArrowDown": {
        event.preventDefault()
        if (options.readOnly?.()) break
        if (!def || !isEditable(def)) break
        handleArrowDown(def, event)
        break
      }
      case "Backspace": {
        event.preventDefault()
        if (options.readOnly?.()) break
        if (!def || !isEditable(def)) break
        handleBackspace(def, event)
        break
      }
      case "Delete": {
        event.preventDefault()
        if (options.readOnly?.()) break
        if (!def || !isEditable(def)) break
        updateSegmentValue(def.id, "", event)
        break
      }
      default: {
        // Handle character input via key (single char keys)
        if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
          event.preventDefault()
          handleInput(event.key, event)
        }
        break
      }
    }
  }

  /**
   * Handles ArrowUp for incrementing values.
   */
  function handleArrowUp(def: SegmentDefinition, event: KeyboardEvent): void {
    const current = getCurrentValues()
    const currentVal = current[def.id] ?? ""

    if (def.type === "numeric") {
      const numVal = currentVal === "" ? (def.min ?? 0) : parseInt(currentVal, 10)
      let next = numVal + 1
      if (def.max !== undefined && next > def.max) {
        next = def.min ?? 0
      }
      updateSegmentValue(def.id, String(next), event)
    } else if (def.type === "text" && def.allowedValues && def.allowedValues.length > 0) {
      const currentIndex = def.allowedValues.indexOf(currentVal)
      const nextIndex = currentIndex < 0 ? 0 : (currentIndex + 1) % def.allowedValues.length
      const nextValue = def.allowedValues[nextIndex]
      if (nextValue !== undefined) {
        updateSegmentValue(def.id, nextValue, event)
      }
    }
  }

  /**
   * Handles ArrowDown for decrementing values.
   */
  function handleArrowDown(def: SegmentDefinition, event: KeyboardEvent): void {
    const current = getCurrentValues()
    const currentVal = current[def.id] ?? ""

    if (def.type === "numeric") {
      const numVal = currentVal === "" ? (def.max ?? 0) : parseInt(currentVal, 10)
      let next = numVal - 1
      if (def.min !== undefined && next < def.min) {
        next = def.max ?? 0
      }
      updateSegmentValue(def.id, String(next), event)
    } else if (def.type === "text" && def.allowedValues && def.allowedValues.length > 0) {
      const currentIndex = def.allowedValues.indexOf(currentVal)
      const nextIndex = currentIndex <= 0 ? def.allowedValues.length - 1 : currentIndex - 1
      const nextValue = def.allowedValues[nextIndex]
      if (nextValue !== undefined) {
        updateSegmentValue(def.id, nextValue, event)
      }
    }
  }

  /**
   * Handles Backspace: removes last character or moves to previous segment.
   */
  function handleBackspace(def: SegmentDefinition, event: KeyboardEvent): void {
    const current = getCurrentValues()
    const currentVal = current[def.id] ?? ""

    if (currentVal.length > 0) {
      const newVal = currentVal.slice(0, -1)
      updateSegmentValue(def.id, newVal, event)
    } else {
      // Empty — move to previous editable segment
      const prev = findPrevEditable(focusedIndex())
      if (prev !== undefined) {
        setFocusedIndex(prev)
      }
    }
  }

  function setSegmentValue(id: string, value: string, event?: Event): void {
    if (options.disabled?.()) return
    if (options.readOnly?.()) return
    updateSegmentValue(id, value, event)
  }

  function clear(): void {
    if (options.disabled?.()) return
    if (options.readOnly?.()) return

    const defs = getDefs()
    const isControlled = options.values !== undefined
    const next: Record<string, string> = {}

    for (const def of defs) {
      if (isEditable(def)) {
        next[def.id] = ""
      }
    }

    if (!isControlled) {
      setInternalValues(next)
    }

    // Notify for each cleared segment
    const editableDefs = defs.filter(isEditable)
    if (editableDefs.length > 0) {
      options.onChange?.(next, { segmentId: editableDefs[0]!.id })
    }
  }

  function clearFocused(): void {
    if (options.disabled?.()) return
    if (options.readOnly?.()) return

    const defs = getDefs()
    const idx = focusedIndex()
    const def = defs[idx]
    if (!def || !isEditable(def)) return

    updateSegmentValue(def.id, "")
  }

  return {
    segments,
    focusedIndex,
    focusedId,
    values,
    isComplete,
    focusSegment,
    focusSegmentById,
    focusNext,
    focusPrevious,
    handleKeyDown,
    handleInput,
    setSegmentValue,
    clear,
    clearFocused,
  }
}
