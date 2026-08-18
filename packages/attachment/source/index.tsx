/**
 * @solidiom/attachment — File attachment display with preview, name, and size.
 *
 * Parts: Root, Preview, Name, Size, Remove, Icon.
 * Displays a single file attachment with metadata and actions.
 */

import { createContext, useContext, Show } from "solid-js"
import { type JSX } from "@solidjs/web"
import { applySemanticAttrs } from "@solidiom/runtime"

// ─── Types ──────────────────────────────────────────────────────────────────

export interface AttachmentFile {
  name: string
  size: number
  type: string
  url?: string
}

export interface AttachmentRootProps {
  /** File metadata to display. */
  file?: AttachmentFile
  /** Called when the remove button is clicked. */
  onRemove?: () => void
  class?: string
  children: JSX.Element
}

export interface AttachmentPreviewProps {
  class?: string
  style?: JSX.CSSProperties | string
  children?: JSX.Element
}

export interface AttachmentNameProps {
  class?: string
  children?: JSX.Element
}

export interface AttachmentSizeProps {
  class?: string
  children?: JSX.Element
}

export interface AttachmentRemoveProps {
  class?: string
  children?: JSX.Element
}

export interface AttachmentIconProps {
  class?: string
  children?: JSX.Element
}

// ─── Context ────────────────────────────────────────────────────────────────

interface AttachmentContextValue {
  file: () => AttachmentFile | undefined
  onRemove: (() => void) | undefined
  isImage: () => boolean
  mimeCategory: () => string
}

const AttachmentContext = createContext<AttachmentContextValue>()

function useAttachmentContext(): AttachmentContextValue {
  const ctx = useContext(AttachmentContext)
  if (!ctx) throw new Error("Attachment parts must be used within Attachment.Root")
  return ctx
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B"
  const units = ["B", "KB", "MB", "GB", "TB"]
  const k = 1024
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  const value = bytes / Math.pow(k, i)
  return `${value.toFixed(i === 0 ? 0 : 1)} ${units[i]}`
}

function getMimeCategory(type: string): string {
  if (!type) return "unknown"
  const [category] = type.split("/")
  return category ?? "unknown"
}

// ─── Components ─────────────────────────────────────────────────────────────

export function Root(props: AttachmentRootProps) {
  const file = () => props.file
  const isImage = () => file()?.type.startsWith("image/") ?? false
  const mimeCategory = () => getMimeCategory(file()?.type ?? "")

  const ctx: AttachmentContextValue = {
    file,
    onRemove: props.onRemove,
    isImage,
    mimeCategory,
  }

  return (
    <AttachmentContext value={ctx}>
      <div
        class={props.class}
        data-type={mimeCategory()}
        {...applySemanticAttrs({ scope: "attachment", part: "root" })}
      >
        {props.children}
      </div>
    </AttachmentContext>
  )
}

export function Preview(props: AttachmentPreviewProps) {
  const ctx = useAttachmentContext()

  return (
    <Show when={ctx.isImage()}>
      <div
        class={props.class}
        style={props.style}
        {...applySemanticAttrs({ scope: "attachment", part: "preview" })}
      >
        {props.children ?? (
          <Show when={ctx.file()?.url}>
            {(url) => <img src={url()} alt={ctx.file()?.name ?? "Preview"} />}
          </Show>
        )}
      </div>
    </Show>
  )
}

export function Name(props: AttachmentNameProps) {
  const ctx = useAttachmentContext()

  return (
    <span class={props.class} {...applySemanticAttrs({ scope: "attachment", part: "name" })}>
      {props.children ?? ctx.file()?.name ?? ""}
    </span>
  )
}

export function Size(props: AttachmentSizeProps) {
  const ctx = useAttachmentContext()

  return (
    <span class={props.class} {...applySemanticAttrs({ scope: "attachment", part: "size" })}>
      {props.children ?? formatFileSize(ctx.file()?.size ?? 0)}
    </span>
  )
}

export function Remove(props: AttachmentRemoveProps) {
  const ctx = useAttachmentContext()

  return (
    <button
      type="button"
      aria-label="Remove attachment"
      class={props.class}
      onClick={() => ctx.onRemove?.()}
      {...applySemanticAttrs({ scope: "attachment", part: "remove" })}
    >
      {props.children ?? "Remove"}
    </button>
  )
}

export function Icon(props: AttachmentIconProps) {
  useAttachmentContext()

  return (
    <span
      aria-hidden="true"
      class={props.class}
      {...applySemanticAttrs({ scope: "attachment", part: "icon" })}
    >
      {props.children}
    </span>
  )
}
