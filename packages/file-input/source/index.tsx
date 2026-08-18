/**
 * @solidiom/file-input — Headless file upload primitive with dropzone support and validation.
 *
 * Parts: Root, Trigger, HiddenInput, FileList, FileItem, FileRemove.
 *
 * Provides drag-and-drop file upload via createDropzone, click-to-browse via
 * Trigger, file validation (type, size, count), and semantic data attributes
 * for styling hooks. Supports controlled and uncontrolled file lists.
 */

import { createSignal, createContext, useContext, For } from "solid-js"
import { type JSX } from "@solidjs/web"
import { applySemanticAttrs, createDropzone } from "@solidiom/runtime"

// ─── Types ──────────────────────────────────────────────────────────────────

export interface FileInputRootProps {
  /** Controlled file list. */
  files?: File[]
  /** Called when the file list changes. */
  onFilesChange?: (files: File[]) => void
  /** Accepted MIME types (e.g. 'image/*', 'application/pdf'). */
  accept?: string[]
  /** Maximum number of files. */
  maxFiles?: number
  /** Maximum file size in bytes. */
  maxFileSize?: number
  /** Whether multiple files can be selected. */
  multiple?: boolean
  /** Whether the file input is disabled. */
  disabled?: boolean
  /** Whether the field is required. */
  required?: boolean
  /** Whether the field is invalid. */
  invalid?: boolean
  /** Form field name. */
  name?: string
  /** Element id. */
  id?: string
  /** Called when files are rejected during validation. */
  onReject?: (files: File[], reasons: string[]) => void
  class?: string
  style?: JSX.CSSProperties | string
  children?: JSX.Element
}

// ─── Context ────────────────────────────────────────────────────────────────

interface FileInputContextValue {
  files: () => File[]
  addFiles: (newFiles: File[]) => void
  removeFile: (index: number) => void
  openFilePicker: () => void
  disabled: () => boolean
  required: () => boolean
  invalid: () => boolean
  isDragOver: () => boolean
  isAcceptable: () => boolean
  dropzoneProps: () => Record<string, unknown>
  inputRef: () => HTMLInputElement | undefined
  setInputRef: (el: HTMLInputElement) => void
  accept: () => string[] | undefined
  multiple: () => boolean
  name: () => string | undefined
  id: () => string | undefined
}

const FileInputContext = createContext<FileInputContextValue>()

function useFileInputContext(): FileInputContextValue {
  const ctx = useContext(FileInputContext)
  if (!ctx) throw new Error("FileInput parts must be used within FileInput.Root")
  return ctx
}

// ─── Root ───────────────────────────────────────────────────────────────────

/**
 * FileInput.Root — dropzone container providing context to all child parts.
 *
 * Emits `data-scope="file-input"`, `data-part="root"`, plus state flags
 * and drag attributes (`data-drag-over`, `data-drag-acceptable`).
 */
export function Root(props: FileInputRootProps) {
  const [internalFiles, setInternalFiles] = createSignal<File[]>([])
  const [inputRef, setInputRef] = createSignal<HTMLInputElement | undefined>(undefined)

  const isControlled = () => props.files !== undefined
  const files = () => (isControlled() ? props.files! : internalFiles())
  const disabled = () => props.disabled ?? false
  const required = () => props.required ?? false
  const invalid = () => props.invalid ?? false
  const multiple = () => props.multiple ?? false

  const updateFiles = (next: File[]) => {
    if (!isControlled()) {
      setInternalFiles(next)
    }
    props.onFilesChange?.(next)
  }

  const addFiles = (newFiles: File[]) => {
    if (disabled()) return
    const maxFiles = props.maxFiles ?? Infinity
    const current = files()
    const available = maxFiles - current.length
    if (available <= 0) return
    const toAdd = newFiles.slice(0, available)
    updateFiles([...current, ...toAdd])
  }

  const removeFile = (index: number) => {
    if (disabled()) return
    const current = files()
    const next = [...current.slice(0, index), ...current.slice(index + 1)]
    updateFiles(next)
  }

  const handleDrop = (accepted: File[]) => {
    addFiles(accepted)
  }

  const handleReject = (rejected: File[], reasons: string[]) => {
    props.onReject?.(rejected, reasons)
  }

  const dropzone = createDropzone({
    acceptedTypes: props.accept,
    maxFileSize: props.maxFileSize,
    maxFiles: props.maxFiles,
    disabled: () => disabled(),
    onDrop: handleDrop,
    onReject: handleReject,
  })

  const openFilePicker = () => {
    if (disabled()) return
    const input = inputRef()
    if (input) {
      input.click()
    } else {
      dropzone.openFilePicker()
    }
  }

  const contextValue: FileInputContextValue = {
    files,
    addFiles,
    removeFile,
    openFilePicker,
    disabled,
    required,
    invalid,
    isDragOver: dropzone.isDragOver,
    isAcceptable: dropzone.isAcceptable,
    dropzoneProps: dropzone.dropzoneProps as unknown as () => Record<string, unknown>,
    inputRef,
    setInputRef,
    accept: () => props.accept,
    multiple,
    name: () => props.name,
    id: () => props.id,
  }

  return (
    <FileInputContext value={contextValue}>
      <div
        id={props.id}
        class={props.class}
        style={props.style}
        {...(dropzone.dropzoneProps() as JSX.HTMLAttributes<HTMLDivElement>)}
        {...applySemanticAttrs({
          scope: "file-input",
          part: "root",
          disabled: disabled(),
          required: required(),
          invalid: invalid(),
        })}
      >
        {props.children}
      </div>
    </FileInputContext>
  )
}

// ─── Trigger ────────────────────────────────────────────────────────────────

export interface FileInputTriggerProps {
  class?: string
  style?: JSX.CSSProperties | string
  children?: JSX.Element
}

/**
 * FileInput.Trigger — click target to open the file picker dialog.
 *
 * Emits `data-scope="file-input"`, `data-part="trigger"`.
 */
export function Trigger(props: FileInputTriggerProps) {
  const ctx = useFileInputContext()

  const handleClick = () => {
    ctx.openFilePicker()
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={ctx.disabled()}
      class={props.class}
      style={props.style}
      {...applySemanticAttrs({
        scope: "file-input",
        part: "trigger",
        disabled: ctx.disabled(),
      })}
    >
      {props.children}
    </button>
  )
}

// ─── HiddenInput ────────────────────────────────────────────────────────────

export interface FileInputHiddenInputProps {
  class?: string
}

/**
 * FileInput.HiddenInput — visually hidden native file input.
 *
 * Emits `data-scope="file-input"`, `data-part="hidden-input"`.
 */
export function HiddenInput(props: FileInputHiddenInputProps) {
  const ctx = useFileInputContext()

  const handleChange = (e: Event) => {
    const input = e.target as HTMLInputElement
    if (!input.files || input.files.length === 0) return
    const files = Array.from(input.files)
    ctx.addFiles(files)
    // Reset to allow re-selection of same files
    input.value = ""
  }

  const acceptStr = () => {
    const accept = ctx.accept()
    return accept && accept.length > 0 ? accept.join(",") : undefined
  }

  return (
    <input
      ref={(el) => ctx.setInputRef(el)}
      type="file"
      accept={acceptStr()}
      multiple={ctx.multiple()}
      disabled={ctx.disabled()}
      required={ctx.required()}
      name={ctx.name()}
      tabindex={-1}
      aria-hidden="true"
      class={props.class}
      style="position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0;"
      onChange={handleChange}
      {...applySemanticAttrs({
        scope: "file-input",
        part: "hidden-input",
        disabled: ctx.disabled(),
        required: ctx.required(),
      })}
    />
  )
}

// ─── FileList ───────────────────────────────────────────────────────────────

export interface FileInputFileListProps {
  class?: string
  style?: JSX.CSSProperties | string
  children?: JSX.Element | ((file: File, index: () => number) => JSX.Element)
}

/**
 * FileInput.FileList — container for displaying selected files.
 *
 * Emits `data-scope="file-input"`, `data-part="file-list"`.
 * Accepts either static children or a render function `(file, index) => JSX.Element`.
 */
export function FileList(props: FileInputFileListProps) {
  const ctx = useFileInputContext()

  return (
    <ul
      class={props.class}
      style={props.style}
      {...applySemanticAttrs({
        scope: "file-input",
        part: "file-list",
      })}
    >
      {typeof props.children === "function" ? (
        <For each={ctx.files()}>
          {(file, index) =>
            (props.children as (file: File, index: () => number) => JSX.Element)(file, index)
          }
        </For>
      ) : (
        props.children
      )}
    </ul>
  )
}

// ─── FileItem ───────────────────────────────────────────────────────────────

const FileItemContext = createContext<{ index: number }>()

export interface FileInputFileItemProps {
  /** Index of the file in the list. */
  index: number
  class?: string
  style?: JSX.CSSProperties | string
  children?: JSX.Element
}

/**
 * FileInput.FileItem — individual file display element.
 *
 * Emits `data-scope="file-input"`, `data-part="file-item"`.
 */
export function FileItem(props: FileInputFileItemProps) {
  return (
    <FileItemContext value={{ index: props.index }}>
      <li
        class={props.class}
        style={props.style}
        {...applySemanticAttrs({
          scope: "file-input",
          part: "file-item",
        })}
      >
        {props.children}
      </li>
    </FileItemContext>
  )
}

// ─── FileRemove ─────────────────────────────────────────────────────────────

export interface FileInputFileRemoveProps {
  /** Index of the file to remove. If omitted, uses FileItem context. */
  index?: number
  class?: string
  style?: JSX.CSSProperties | string
  children?: JSX.Element
}

/**
 * FileInput.FileRemove — button to remove a file by index.
 *
 * Emits `data-scope="file-input"`, `data-part="file-remove"`.
 * When nested inside a FileItem, automatically picks up the item's index.
 */
export function FileRemove(props: FileInputFileRemoveProps) {
  const ctx = useFileInputContext()
  const itemCtx = useContext(FileItemContext)

  const handleClick = () => {
    const index = props.index ?? itemCtx?.index
    if (index !== undefined) {
      ctx.removeFile(index)
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={ctx.disabled()}
      class={props.class}
      style={props.style}
      aria-label="Remove file"
      {...applySemanticAttrs({
        scope: "file-input",
        part: "file-remove",
        disabled: ctx.disabled(),
      })}
    >
      {props.children}
    </button>
  )
}
