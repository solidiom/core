/**
 * Dialog primitive — modal overlay with focus trapping, escape dismissal,
 * pointer-outside dismissal, scroll lock, and presence phases.
 *
 * Parts: Root, Trigger, Portal, Backdrop, Content, Title, Description, Close.
 */

import { type Accessor, createEffect, createSignal, Show } from "solid-js"
import { type JSX } from "@solidjs/web"
import {
  createDisclosureState,
  createStableId,
  createPresence,
  applySemanticAttrs,
  getLayerStack,
  setupDismissableLayer,
  activateFocusScope,
  activateModalIsolation,
  activateScrollLock,
  createChangeDetails,
  type DisclosureReason,
  type ChangeDetails,
} from "@solidiom/runtime"
import { DialogContext, useDialogContext, type DialogContextValue } from "./dialog-context"

// ─── Root ──────────────────────────────────────────────────────────────────────

export interface DialogRootProps {
  /** Controlled open state. */
  open?: Accessor<boolean>
  /** Default open state (uncontrolled). */
  defaultOpen?: boolean
  /** Called when open state change is requested. */
  onOpenChange?: (open: boolean, details: ChangeDetails<DisclosureReason>) => void
  /** Whether the dialog is modal. Default: true. */
  modal?: boolean
  children: JSX.Element
}

export function Root(props: DialogRootProps) {
  const modal = props.modal ?? true
  const baseId = createStableId("dialog")

  const { open, requestOpenChange } = createDisclosureState({
    open: props.open,
    defaultOpen: props.defaultOpen,
    onOpenChange: props.onOpenChange,
  })

  const presence = createPresence({ open })

  const ctx: DialogContextValue = {
    open,
    requestOpenChange,
    contentId: `${baseId}-content`,
    titleId: `${baseId}-title`,
    descriptionId: `${baseId}-description`,
    triggerId: `${baseId}-trigger`,
    phase: presence.phase,
    present: presence.present,
    modal,
  }

  return <DialogContext value={ctx}>{props.children}</DialogContext>
}

// ─── Trigger ───────────────────────────────────────────────────────────────────

export interface DialogTriggerProps {
  children: JSX.Element
  ref?: (el: HTMLButtonElement) => void
}

export function Trigger(props: DialogTriggerProps) {
  const ctx = useDialogContext()

  const handleClick = () => {
    ctx.requestOpenChange(!ctx.open(), createChangeDetails("trigger"))
  }

  return (
    <button
      id={ctx.triggerId}
      aria-haspopup="dialog"
      aria-expanded={ctx.open() ? "true" : undefined}
      aria-controls={ctx.open() ? ctx.contentId : undefined}
      onClick={handleClick}
      ref={props.ref}
      {...applySemanticAttrs({
        scope: "dialog",
        part: "trigger",
        state: ctx.open() ? "open" : "closed",
      })}
    >
      {props.children}
    </button>
  )
}

// ─── Portal ────────────────────────────────────────────────────────────────────

export interface DialogPortalProps {
  children: JSX.Element
}

/**
 * Portal wrapper — renders children only when present.
 * In Solid 2 beta, native Portal API is not yet stable.
 * This renders inline with Show; actual DOM portalling deferred.
 */
export function Portal(props: DialogPortalProps) {
  const ctx = useDialogContext()

  return <Show when={ctx.present()}>{props.children}</Show>
}

// ─── Backdrop ──────────────────────────────────────────────────────────────────

export interface DialogBackdropProps {
  class?: string
  style?: JSX.CSSProperties | string
}

export function Backdrop(props: DialogBackdropProps) {
  const ctx = useDialogContext()

  return (
    <div
      {...applySemanticAttrs({
        scope: "dialog",
        part: "backdrop",
        state: ctx.open() ? "open" : "closed",
      })}
      class={props.class}
      style={props.style}
      aria-hidden="true"
    />
  )
}

// ─── Content ───────────────────────────────────────────────────────────────────

export interface DialogContentProps {
  children: JSX.Element
  class?: string
  style?: JSX.CSSProperties | string
  ref?: (el: HTMLDivElement) => void
  /** Disable focus trapping. Default: true (trapping enabled). */
  trapFocus?: boolean
}

export function Content(props: DialogContentProps) {
  const ctx = useDialogContext()
  const shouldTrapFocus = () => props.trapFocus ?? true

  const [contentEl, setContentEl] = createSignal<HTMLDivElement>()

  createEffect(
    () => (ctx.present() ? contentEl() : undefined),
    (el) => {
      if (!el) return
      const doc = el.ownerDocument

      // Register layer
      const stack = getLayerStack(doc)
      const removeLayer = stack.push({
        id: ctx.contentId,
        element: el,
        modal: ctx.modal,
      })

      // Dismissable layer
      const removeDismissable = setupDismissableLayer({
        document: doc,
        layerId: ctx.contentId,
        element: () => el,
        onDismiss: (reason) => {
          ctx.requestOpenChange(false, createChangeDetails(reason))
        },
      })

      // Focus scope
      const deactivateFocus = shouldTrapFocus()
        ? activateFocusScope({
            element: () => el,
            restoreTarget: () => doc.getElementById(ctx.triggerId),
          })
        : () => {}

      // Modal isolation
      const deactivateIsolation = ctx.modal ? activateModalIsolation(el) : () => {}

      // Scroll lock
      const releaseScroll = ctx.modal ? activateScrollLock(doc) : () => {}

      return () => {
        releaseScroll()
        deactivateIsolation()
        deactivateFocus()
        removeDismissable()
        removeLayer()
      }
    },
  )

  return (
    <div
      id={ctx.contentId}
      role="dialog"
      aria-modal={ctx.modal ? "true" : undefined}
      aria-labelledby={ctx.titleId}
      aria-describedby={ctx.descriptionId}
      ref={(el: HTMLDivElement) => {
        setContentEl(el)
        props.ref?.(el)
      }}
      class={props.class}
      style={props.style}
      {...applySemanticAttrs({
        scope: "dialog",
        part: "content",
        state: ctx.open() ? "open" : "closed",
      })}
    >
      {props.children}
    </div>
  )
}

// ─── Title ─────────────────────────────────────────────────────────────────────

export interface DialogTitleProps {
  children: JSX.Element
  class?: string
}

export function Title(props: DialogTitleProps) {
  const ctx = useDialogContext()

  return (
    <h2
      id={ctx.titleId}
      class={props.class}
      {...applySemanticAttrs({ scope: "dialog", part: "title" })}
    >
      {props.children}
    </h2>
  )
}

// ─── Description ───────────────────────────────────────────────────────────────

export interface DialogDescriptionProps {
  children: JSX.Element
  class?: string
}

export function Description(props: DialogDescriptionProps) {
  const ctx = useDialogContext()

  return (
    <p
      id={ctx.descriptionId}
      class={props.class}
      {...applySemanticAttrs({ scope: "dialog", part: "description" })}
    >
      {props.children}
    </p>
  )
}

// ─── Close ─────────────────────────────────────────────────────────────────────

export interface DialogCloseProps {
  children: JSX.Element
  ref?: (el: HTMLButtonElement) => void
}

export function Close(props: DialogCloseProps) {
  const ctx = useDialogContext()

  const handleClick = () => {
    ctx.requestOpenChange(false, createChangeDetails("close"))
  }

  return (
    <button
      onClick={handleClick}
      ref={props.ref}
      {...applySemanticAttrs({ scope: "dialog", part: "close" })}
    >
      {props.children}
    </button>
  )
}
