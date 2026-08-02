/**
 * @solidiom/alert-dialog — Modal confirmation dialog requiring explicit user action.
 *
 * Unlike regular Dialog, AlertDialog does not dismiss on click-outside or Escape.
 * Only Cancel and Action buttons close it.
 *
 * Parts: Root, Trigger, Portal, Content, Title, Description, Cancel, Action.
 */

import {
  type Accessor,
  Show,
  createEffect,
  createSignal,
  createContext,
  useContext,
} from "solid-js"
import { type JSX } from "@solidjs/web"
import {
  createDisclosureState,
  createStableId,
  createPresence,
  applySemanticAttrs,
  getLayerStack,
  activateFocusScope,
  activateModalIsolation,
  activateScrollLock,
  createChangeDetails,
  type DisclosureReason,
  type ChangeDetails,
  type PresencePhase,
} from "@solidiom/runtime"

// ─── Context ───────────────────────────────────────────────────────────────────

interface AlertDialogContextValue {
  open: Accessor<boolean>
  requestOpenChange: (next: boolean, details: ChangeDetails<DisclosureReason>) => void
  contentId: string
  titleId: string
  descriptionId: string
  triggerId: string
  phase: Accessor<PresencePhase>
  present: Accessor<boolean>
}

const AlertDialogContext = createContext<AlertDialogContextValue>()

function useAlertDialogContext(): AlertDialogContextValue {
  const ctx = useContext(AlertDialogContext)
  if (!ctx) throw new Error("[solidiom] AlertDialog parts must be used within AlertDialog.Root")
  return ctx
}

// ─── Root ──────────────────────────────────────────────────────────────────────

export interface AlertDialogRootProps {
  /** Controlled open state. */
  open?: Accessor<boolean>
  /** Default open state (uncontrolled). */
  defaultOpen?: boolean
  /** Called when open state change is requested. */
  onOpenChange?: (open: boolean, details: ChangeDetails<DisclosureReason>) => void
  children: JSX.Element
}

export function Root(props: AlertDialogRootProps) {
  const baseId = createStableId("alert-dialog")

  const { open, requestOpenChange } = createDisclosureState({
    open: props.open,
    defaultOpen: props.defaultOpen,
    onOpenChange: props.onOpenChange,
  })

  const presence = createPresence({ open })

  const ctx: AlertDialogContextValue = {
    open,
    requestOpenChange,
    contentId: `${baseId}-content`,
    titleId: `${baseId}-title`,
    descriptionId: `${baseId}-description`,
    triggerId: `${baseId}-trigger`,
    phase: presence.phase,
    present: presence.present,
  }

  return <AlertDialogContext value={ctx}>{props.children}</AlertDialogContext>
}

// ─── Trigger ───────────────────────────────────────────────────────────────────

export interface AlertDialogTriggerProps {
  children: JSX.Element
  ref?: (el: HTMLButtonElement) => void
}

export function Trigger(props: AlertDialogTriggerProps) {
  const ctx = useAlertDialogContext()

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
        scope: "alert-dialog",
        part: "trigger",
        state: ctx.open() ? "open" : "closed",
      })}
    >
      {props.children}
    </button>
  )
}

// ─── Portal ────────────────────────────────────────────────────────────────────

export interface AlertDialogPortalProps {
  children: JSX.Element
}

/**
 * Portal wrapper — renders children only when present.
 * Renders inline with Show; actual DOM portalling deferred to stable Portal API.
 */
export function Portal(props: AlertDialogPortalProps) {
  const ctx = useAlertDialogContext()

  return <Show when={ctx.present()}>{props.children}</Show>
}

// ─── Content ───────────────────────────────────────────────────────────────────

export interface AlertDialogContentProps {
  children: JSX.Element
  class?: string
  style?: JSX.CSSProperties | string
  ref?: (el: HTMLDivElement) => void
}

export function Content(props: AlertDialogContentProps) {
  const ctx = useAlertDialogContext()

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
        modal: true,
      })

      // Focus scope (trap focus within the dialog)
      const deactivateFocus = activateFocusScope({
        element: () => el,
        restoreTarget: () => doc.getElementById(ctx.triggerId),
      })

      // Modal isolation (aria-hidden on siblings)
      const deactivateIsolation = activateModalIsolation(el)

      // Scroll lock
      const releaseScroll = activateScrollLock(doc)

      // No dismissable layer — alert dialog requires explicit Cancel/Action
      return () => {
        releaseScroll()
        deactivateIsolation()
        deactivateFocus()
        removeLayer()
      }
    },
  )

  return (
    <div
      id={ctx.contentId}
      role="alertdialog"
      aria-modal="true"
      aria-labelledby={ctx.titleId}
      aria-describedby={ctx.descriptionId}
      ref={(el: HTMLDivElement) => {
        setContentEl(el)
        props.ref?.(el)
      }}
      class={props.class}
      style={props.style}
      {...applySemanticAttrs({
        scope: "alert-dialog",
        part: "content",
        state: ctx.open() ? "open" : "closed",
      })}
    >
      {props.children}
    </div>
  )
}

// ─── Title ─────────────────────────────────────────────────────────────────────

export interface AlertDialogTitleProps {
  children: JSX.Element
  class?: string
}

export function Title(props: AlertDialogTitleProps) {
  const ctx = useAlertDialogContext()

  return (
    <h2
      id={ctx.titleId}
      class={props.class}
      {...applySemanticAttrs({ scope: "alert-dialog", part: "title" })}
    >
      {props.children}
    </h2>
  )
}

// ─── Description ───────────────────────────────────────────────────────────────

export interface AlertDialogDescriptionProps {
  children: JSX.Element
  class?: string
}

export function Description(props: AlertDialogDescriptionProps) {
  const ctx = useAlertDialogContext()

  return (
    <p
      id={ctx.descriptionId}
      class={props.class}
      {...applySemanticAttrs({ scope: "alert-dialog", part: "description" })}
    >
      {props.children}
    </p>
  )
}

// ─── Cancel ────────────────────────────────────────────────────────────────────

export interface AlertDialogCancelProps {
  children: JSX.Element
  ref?: (el: HTMLButtonElement) => void
}

export function Cancel(props: AlertDialogCancelProps) {
  const ctx = useAlertDialogContext()

  const handleClick = () => {
    ctx.requestOpenChange(false, createChangeDetails("close"))
  }

  return (
    <button
      onClick={handleClick}
      ref={props.ref}
      {...applySemanticAttrs({
        scope: "alert-dialog",
        part: "cancel",
        state: ctx.open() ? "open" : "closed",
      })}
    >
      {props.children}
    </button>
  )
}

// ─── Action ────────────────────────────────────────────────────────────────────

export interface AlertDialogActionProps {
  children: JSX.Element
  /** Called after the dialog requests close from the action button. */
  onAction?: () => void
  ref?: (el: HTMLButtonElement) => void
}

export function Action(props: AlertDialogActionProps) {
  const ctx = useAlertDialogContext()

  const handleClick = () => {
    ctx.requestOpenChange(false, createChangeDetails("programmatic"))
    props.onAction?.()
  }

  return (
    <button
      onClick={handleClick}
      ref={props.ref}
      {...applySemanticAttrs({
        scope: "alert-dialog",
        part: "action",
        state: ctx.open() ? "open" : "closed",
      })}
    >
      {props.children}
    </button>
  )
}
