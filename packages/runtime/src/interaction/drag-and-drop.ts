/**
 * Drag-and-drop — state managers for dropzone and sortable interactions.
 *
 * Provides file dropzone (with validation) and sortable list primitives
 * using the native HTML Drag and Drop API with reactive state tracking.
 *
 * Used by: FileUpload, Sortable, Kanban (future).
 */

import { createSignal, type Accessor } from "solid-js"

// ─── Types ───────────────────────────────────────────────────────────────────

/** Current drag status of a dropzone or draggable. */
export type DragStatus = "idle" | "dragging" | "over" | "dropped"

/** Describes a draggable item. */
export interface DragItem {
  /** Unique identifier for the dragged item. */
  id: string
  /** Type of item (for filtering compatible drop targets). */
  type: string
  /** Arbitrary data payload. */
  data?: unknown
}

/** Options for configuring a drop target. */
export interface DropTargetOptions {
  /** Accepted item types. If empty, accepts all. */
  accept?: string[]
  /** Whether this target is disabled. */
  disabled?: boolean
  /** Called when a compatible item enters this target. */
  onDragEnter?: (item: DragItem) => void
  /** Called when a compatible item leaves this target. */
  onDragLeave?: (item: DragItem) => void
  /** Called when an item is dropped on this target. */
  onDrop?: (item: DragItem, files?: File[]) => void
}

/** Options for configuring a draggable element. */
export interface DraggableOptions {
  /** The item being dragged. */
  item: DragItem
  /** Whether this draggable is disabled. */
  disabled?: boolean
  /** Called when drag starts. */
  onDragStart?: (item: DragItem) => void
  /** Called when drag ends (regardless of drop success). */
  onDragEnd?: (item: DragItem) => void
}

/** Reason a file was rejected during validation. */
export type FileRejectionReason = "type" | "size" | "count"

/** Options for configuring a file dropzone. */
export interface DropzoneOptions {
  /** Accepted file types (MIME patterns like 'image/*', 'application/pdf'). */
  acceptedTypes?: string[]
  /** Maximum file size in bytes. */
  maxFileSize?: number
  /** Maximum number of files. */
  maxFiles?: number
  /** Whether the dropzone is disabled. */
  disabled?: Accessor<boolean>
  /** Called when valid files are dropped. */
  onDrop?: (files: File[]) => void
  /** Called when invalid files are rejected. */
  onReject?: (files: File[], reasons: FileRejectionReason[]) => void
  /** Called when drag enters the zone. */
  onDragEnter?: () => void
  /** Called when drag leaves the zone. */
  onDragLeave?: () => void
}

/** Props to spread on the dropzone element. */
export interface DropzoneProps {
  onDragOver: (event: DragEvent) => void
  onDragEnter: (event: DragEvent) => void
  onDragLeave: (event: DragEvent) => void
  onDrop: (event: DragEvent) => void
  "data-drag-status": string
  "data-drag-over"?: ""
  "data-drag-acceptable"?: ""
}

/** Props for the hidden file input fallback. */
export interface FileInputProps {
  type: "file"
  accept?: string
  multiple?: boolean
  onChange: (event: Event) => void
  style: string
}

/** The file dropzone instance. */
export interface Dropzone {
  /** Current drag state (reactive). */
  status: Accessor<DragStatus>
  /** Whether a drag is currently over the dropzone (reactive). */
  isDragOver: Accessor<boolean>
  /** Whether the dragged content is acceptable (reactive). */
  isAcceptable: Accessor<boolean>
  /** Get props to spread on the dropzone element. */
  dropzoneProps: () => DropzoneProps
  /** Get props for a hidden file input (click-to-upload fallback). */
  inputProps: () => FileInputProps
  /** Programmatically open the file picker. */
  openFilePicker: () => void
  /** Validate files against constraints. */
  validateFiles: (files: File[]) => {
    accepted: File[]
    rejected: { file: File; reason: FileRejectionReason }[]
  }
}

/** An item in a sortable list. */
export interface SortableItem {
  /** Unique identifier. */
  id: string
  /** Current index in the list. */
  index: number
}

/** Options for configuring a sortable list. */
export interface SortableOptions {
  /** Ordered list of item IDs. */
  items: Accessor<string[]>
  /** Called when order changes via drag. */
  onReorder: (items: string[], details: { fromIndex: number; toIndex: number }) => void
  /** Whether sorting is disabled. */
  disabled?: Accessor<boolean>
  /** Orientation of the list (affects drag direction). */
  orientation?: "horizontal" | "vertical"
}

/** Props to spread on a sortable item element. */
export interface SortableDraggableProps {
  draggable: boolean
  onDragStart: (event: DragEvent) => void
  onDragOver: (event: DragEvent) => void
  onDragEnd: (event: DragEvent) => void
  "data-dragging"?: ""
  "data-drag-over"?: ""
}

/** The sortable list instance. */
export interface Sortable {
  /** Currently dragged item ID (reactive). */
  activeId: Accessor<string | undefined>
  /** Current over item ID (reactive). */
  overId: Accessor<string | undefined>
  /** Whether a sort drag is active (reactive). */
  isDragging: Accessor<boolean>
  /** Get draggable props for an item. */
  getDraggableProps: (id: string) => SortableDraggableProps
  /** Get the visual index for an item (accounts for drag reorder preview). */
  getVisualIndex: (id: string) => number
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Tests whether a file's MIME type matches a pattern.
 * Supports exact matches and wildcards (e.g. 'image/*').
 */
function matchesMimeType(fileType: string, pattern: string): boolean {
  if (pattern === "*" || pattern === "*/*") return true
  if (pattern.endsWith("/*")) {
    const prefix = pattern.slice(0, pattern.indexOf("/"))
    return fileType.startsWith(prefix + "/")
  }
  return fileType === pattern
}

/**
 * Check whether a file type matches any pattern in the list.
 */
function isTypeAccepted(fileType: string, acceptedTypes: string[]): boolean {
  if (acceptedTypes.length === 0) return true
  return acceptedTypes.some((pattern) => matchesMimeType(fileType, pattern))
}

/**
 * Detect if running in a browser environment.
 */
function isBrowser(): boolean {
  return typeof window !== "undefined" && typeof document !== "undefined"
}

// ─── createDropzone ──────────────────────────────────────────────────────────

/**
 * Creates a file dropzone interaction primitive.
 *
 * Handles drag events with nested enter/leave counting, file validation
 * against type/size/count constraints, and provides props for both
 * drag-and-drop and click-to-upload interactions.
 *
 * @param options - Configuration for the dropzone.
 * @returns A Dropzone instance with reactive state and prop generators.
 */
export function createDropzone(options: DropzoneOptions): Dropzone {
  const [status, setStatus] = createSignal<DragStatus>("idle", {
    ownedWrite: true,
  })
  const [isDragOver, setIsDragOver] = createSignal<boolean>(false, {
    ownedWrite: true,
  })
  const [isAcceptable, setIsAcceptable] = createSignal<boolean>(false, {
    ownedWrite: true,
  })

  // Nested drag enter/leave counter
  let dragCounter = 0

  // Reference to the hidden file input (set via inputProps.onChange)
  let fileInputRef: HTMLInputElement | undefined

  /**
   * Validates files against the configured constraints.
   */
  function validateFiles(files: File[]): {
    accepted: File[]
    rejected: { file: File; reason: FileRejectionReason }[]
  } {
    const accepted: File[] = []
    const rejected: { file: File; reason: FileRejectionReason }[] = []
    const maxFiles = options.maxFiles ?? Infinity
    const maxFileSize = options.maxFileSize ?? Infinity
    const acceptedTypes = options.acceptedTypes ?? []

    let acceptedCount = 0

    for (const file of files) {
      // Type check
      if (acceptedTypes.length > 0 && !isTypeAccepted(file.type, acceptedTypes)) {
        rejected.push({ file, reason: "type" })
        continue
      }

      // Size check
      if (file.size > maxFileSize) {
        rejected.push({ file, reason: "size" })
        continue
      }

      // Count check
      if (acceptedCount >= maxFiles) {
        rejected.push({ file, reason: "count" })
        continue
      }

      accepted.push(file)
      acceptedCount++
    }

    return { accepted, rejected }
  }

  /**
   * Checks whether DataTransfer types suggest acceptable content.
   */
  function checkAcceptable(dataTransfer: DataTransfer | null): boolean {
    if (!dataTransfer) return false
    const acceptedTypes = options.acceptedTypes ?? []
    if (acceptedTypes.length === 0) return true

    // During dragover, we can only inspect DataTransfer.types
    // If "Files" is present, we assume potentially acceptable
    if (dataTransfer.types.includes("Files")) return true
    return false
  }

  function handleDragOver(event: DragEvent): void {
    event.preventDefault()
    if (options.disabled?.()) return
    // Allow drop
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = "copy"
    }
  }

  function handleDragEnter(event: DragEvent): void {
    event.preventDefault()
    if (options.disabled?.()) return

    dragCounter++
    if (dragCounter === 1) {
      setIsDragOver(true)
      setStatus("over")
      setIsAcceptable(checkAcceptable(event.dataTransfer))
      options.onDragEnter?.()
    }
  }

  function handleDragLeave(event: DragEvent): void {
    event.preventDefault()
    if (options.disabled?.()) return

    dragCounter--
    if (dragCounter <= 0) {
      dragCounter = 0
      setIsDragOver(false)
      setStatus("idle")
      setIsAcceptable(false)
      options.onDragLeave?.()
    }
  }

  function handleDrop(event: DragEvent): void {
    event.preventDefault()
    if (options.disabled?.()) return

    dragCounter = 0
    setIsDragOver(false)
    setStatus("dropped")

    const fileList = event.dataTransfer?.files
    if (!fileList || fileList.length === 0) {
      setIsAcceptable(false)
      // Reset status after a tick
      queueReset()
      return
    }

    const files = Array.from(fileList)
    const { accepted, rejected } = validateFiles(files)

    if (accepted.length > 0) {
      options.onDrop?.(accepted)
    }

    if (rejected.length > 0) {
      const reasons = [...new Set(rejected.map((r) => r.reason))]
      options.onReject?.(
        rejected.map((r) => r.file),
        reasons,
      )
    }

    setIsAcceptable(false)
    queueReset()
  }

  function queueReset(): void {
    setTimeout(() => {
      setStatus("idle")
    }, 0)
  }

  function handleInputChange(event: Event): void {
    const input = event.target as HTMLInputElement
    fileInputRef = input
    if (!input.files || input.files.length === 0) return
    if (options.disabled?.()) return

    const files = Array.from(input.files)
    const { accepted, rejected } = validateFiles(files)

    if (accepted.length > 0) {
      options.onDrop?.(accepted)
    }

    if (rejected.length > 0) {
      const reasons = [...new Set(rejected.map((r) => r.reason))]
      options.onReject?.(
        rejected.map((r) => r.file),
        reasons,
      )
    }

    // Reset input value to allow re-selection of same files
    input.value = ""
  }

  function dropzoneProps(): DropzoneProps {
    const props: DropzoneProps = {
      onDragOver: handleDragOver,
      onDragEnter: handleDragEnter,
      onDragLeave: handleDragLeave,
      onDrop: handleDrop,
      "data-drag-status": status(),
    }

    if (isDragOver()) {
      props["data-drag-over"] = ""
    }

    if (isAcceptable()) {
      props["data-drag-acceptable"] = ""
    }

    return props
  }

  function inputProps(): FileInputProps {
    const acceptedTypes = options.acceptedTypes ?? []
    const maxFiles = options.maxFiles ?? 1

    const props: FileInputProps = {
      type: "file",
      onChange: handleInputChange,
      style: "display:none;position:absolute;width:1px;height:1px;overflow:hidden;",
    }

    if (acceptedTypes.length > 0) {
      props.accept = acceptedTypes.join(",")
    }

    if (maxFiles > 1) {
      props.multiple = true
    }

    return props
  }

  function openFilePicker(): void {
    if (!isBrowser()) return
    if (options.disabled?.()) return

    if (fileInputRef) {
      fileInputRef.click()
    }
  }

  return {
    status,
    isDragOver,
    isAcceptable,
    dropzoneProps,
    inputProps,
    openFilePicker,
    validateFiles,
  }
}

// ─── createSortable ──────────────────────────────────────────────────────────

/**
 * Creates a sortable list interaction primitive.
 *
 * Tracks drag state via native HTML drag-and-drop, computes visual indices
 * during drag for reorder preview, and fires onReorder when the drag ends.
 *
 * @param options - Configuration for the sortable list.
 * @returns A Sortable instance with reactive state and prop generators.
 */
export function createSortable(options: SortableOptions): Sortable {
  const [activeId, setActiveId] = createSignal<string | undefined>(undefined, {
    ownedWrite: true,
  })
  const [overId, setOverId] = createSignal<string | undefined>(undefined, {
    ownedWrite: true,
  })
  const [isDragging, setIsDragging] = createSignal<boolean>(false, {
    ownedWrite: true,
  })

  /**
   * Get the visual index for an item during drag (reflects reorder preview).
   * If no drag is active, returns the original index.
   */
  function getVisualIndex(id: string): number {
    const items = options.items()
    const active = activeId()
    const over = overId()

    if (!active || !over || active === over) {
      return items.indexOf(id)
    }

    // Compute reordered array for preview
    const fromIndex = items.indexOf(active)
    const toIndex = items.indexOf(over)

    if (fromIndex === -1 || toIndex === -1) {
      return items.indexOf(id)
    }

    // Create virtual reordered array
    const reordered = [...items]
    reordered.splice(fromIndex, 1)
    reordered.splice(toIndex, 0, active)

    return reordered.indexOf(id)
  }

  /**
   * Get draggable props for a specific item.
   */
  function getDraggableProps(id: string): SortableDraggableProps {
    const disabled = options.disabled?.() ?? false

    const props: SortableDraggableProps = {
      draggable: !disabled,
      onDragStart(event: DragEvent): void {
        if (disabled) return
        setActiveId(id)
        setIsDragging(true)

        if (event.dataTransfer) {
          event.dataTransfer.effectAllowed = "move"
          event.dataTransfer.setData("text/plain", id)
        }
      },
      onDragOver(event: DragEvent): void {
        event.preventDefault()
        if (disabled) return
        if (!activeId()) return
        if (activeId() === id) return

        setOverId(id)

        if (event.dataTransfer) {
          event.dataTransfer.dropEffect = "move"
        }
      },
      onDragEnd(_event: DragEvent): void {
        if (disabled) return

        const active = activeId()
        const over = overId()

        if (active && over && active !== over) {
          const items = options.items()
          const fromIndex = items.indexOf(active)
          const toIndex = items.indexOf(over)

          if (fromIndex !== -1 && toIndex !== -1) {
            const reordered = [...items]
            reordered.splice(fromIndex, 1)
            reordered.splice(toIndex, 0, active)
            options.onReorder(reordered, { fromIndex, toIndex })
          }
        }

        // Reset state
        setActiveId(undefined)
        setOverId(undefined)
        setIsDragging(false)
      },
    }

    if (activeId() === id) {
      props["data-dragging"] = ""
    }

    if (overId() === id) {
      props["data-drag-over"] = ""
    }

    return props
  }

  return {
    activeId,
    overId,
    isDragging,
    getDraggableProps,
    getVisualIndex,
  }
}
