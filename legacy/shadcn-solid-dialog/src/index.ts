/**
 * @solidiom/legacy-shadcn-solid-dialog
 *
 * Legacy facade that re-exports @solidiom/dialog using shadcn-solid naming
 * conventions. This package is DEPRECATED — use @solidiom/dialog directly.
 *
 * The facade preserves the public API surface used by shadcn-solid consumers:
 * - Dialog namespace object with .Root, .Trigger, .Portal, .Overlay, .Content,
 *   .Title, .Description, .Close
 * - Individual prefixed exports: DialogRoot, DialogTrigger, etc.
 *
 * A development-only deprecation warning is emitted on first import.
 */

import {
  Root,
  Trigger,
  Portal,
  Backdrop,
  Content,
  Title,
  Description,
  Close,
  type DialogRootProps,
  type DialogTriggerProps,
  type DialogPortalProps,
  type DialogBackdropProps,
  type DialogContentProps,
  type DialogTitleProps,
  type DialogDescriptionProps,
  type DialogCloseProps,
} from "@solidiom/dialog"

// ─── Development-only deprecation warning ──────────────────────────────────

let _warned = false

function emitDeprecationWarning() {
  if (_warned) return
  _warned = true

  const processEnv = (globalThis as { process?: { env?: { NODE_ENV?: string } } }).process?.env
  if (processEnv && processEnv.NODE_ENV !== "production") {
    console.warn(
      "[@solidiom/legacy-shadcn-solid-dialog] DEPRECATED: This package is a migration bridge. " +
        "Use @solidiom/dialog directly. Run the migration with:\n" +
        "  npx tsx migrations/shadcn-solid-dialog/transform.ts\n" +
        "See: https://solidiom.dev/docs/migration/shadcn-solid-dialog",
    )
  }
}

emitDeprecationWarning()

// ─── Namespace-style export (Dialog.Root, Dialog.Trigger, etc.) ─────────────

/**
 * Dialog namespace object — maps shadcn-solid naming to Solidiom primitives.
 * `Overlay` is mapped to Solidiom's `Backdrop`.
 */
export const Dialog = {
  Root,
  Trigger,
  Portal,
  Overlay: Backdrop,
  Content,
  Title,
  Description,
  Close,
} as const

// ─── Prefixed individual exports (DialogRoot, DialogTrigger, etc.) ──────────

export const DialogRoot = Root
export const DialogTrigger = Trigger
export const DialogPortal = Portal
export const DialogOverlay = Backdrop
export const DialogContent = Content
export const DialogTitle = Title
export const DialogDescription = Description
export const DialogClose = Close

// ─── Type re-exports with shadcn-solid naming ──────────────────────────────

export type { DialogRootProps }
export type { DialogTriggerProps }
export type { DialogPortalProps }
export type { DialogBackdropProps as DialogOverlayProps }
export type { DialogContentProps }
export type { DialogTitleProps }
export type { DialogDescriptionProps }
export type { DialogCloseProps }
