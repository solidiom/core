/**
 * Drawer primitive — slide-in panel from any edge.
 *
 * Modal mode (default): backdrop + focus trap + scroll lock + aria-modal.
 * Non-modal mode: no backdrop, no focus trap, no scroll lock.
 * Dismiss on outside click/Escape via setupDismissableLayer.
 * Presence phases for open/close animation.
 *
 * Parts: Root, Trigger, Backdrop, Content, Close, Title, Description.
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
import {
  DrawerContext,
  useDrawerContext,
  type DrawerContextValue,
  type DrawerSide,
} from "./drawer-context"

// ─── Root ──────────────────────────────────────────────────────────────────────

export interface DrawerRootProps {
  /** Controlled open state. */
  open?: Accessor<boolean>
  /** Default open state (uncontrolled). */
  defaultOpen?: boolean
  /** Called when open state change is requested. */
  onOpenChange?: (open: boolean, details: ChangeDetails<DisclosureReason>) => void
  /** Whether the drawer is modal. Default: true. */
  modal?: boolean
  /** Edge from which the drawer slides. Default: "right". */
  side?: DrawerSide
  /** Discrete snap point positions (as percentages 0–100). */
  snapPoints?: number[]
  /** Whether the drawer can be dismissed by swipe/click-outside. Default: true. */
  dismissible?: boolean
  /** Whether the background should scale when drawer opens. Default: false. */
  shouldScaleBackground?: boolean
  children: JSX.Element
}

export function Root(props: DrawerRootProps) {
  const modal = props.modal ?? true
  const side = props.side ?? "right"
  const dismissible = props.dismissible ?? true
  const shouldScaleBackground = props.shouldScaleBackground ?? false
  const baseId = createStableId("drawer")

  const { open, requestOpenChange } = createDisclosureState({
    open: props.open,
    defaultOpen: props.defaultOpen,
    onOpenChange: props.onOpenChange,
  })

  const presence = createPresence({ open })

  const ctx: DrawerContextValue = {
    open,
    requestOpenChange,
    contentId: `${baseId}-content`,
    titleId: `${baseId}-title`,
    descriptionId: `${baseId}-description`,
    triggerId: `${baseId}-trigger`,
    phase: presence.phase,
    present: presence.present,
    modal,
    side,
    snapPoints: props.snapPoints,
    dismissible,
    shouldScaleBackground,
  }

  return <DrawerContext value={ctx}>{props.children}</DrawerContext>
}

// ─── Trigger ───────────────────────────────────────────────────────────────────

export interface DrawerTriggerProps {
  children: JSX.Element
  ref?: (el: HTMLButtonElement) => void
}

/** Button that toggles the drawer open/closed. */
export function Trigger(props: DrawerTriggerProps) {
  const ctx = useDrawerContext()

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
        scope: "drawer",
        part: "trigger",
        state: ctx.open() ? "open" : "closed",
      })}
    >
      {props.children}
    </button>
  )
}

// ─── Backdrop ──────────────────────────────────────────────────────────────────

export interface DrawerBackdropProps {
  class?: string
  style?: JSX.CSSProperties | string
}

/** Backdrop overlay — only rendered in modal mode when present. */
export function Backdrop(props: DrawerBackdropProps) {
  const ctx = useDrawerContext()

  return (
    <Show when={ctx.modal && ctx.present()}>
      <div
        aria-hidden="true"
        class={props.class}
        style={props.style}
        {...applySemanticAttrs({
          scope: "drawer",
          part: "backdrop",
          state: ctx.open() ? "open" : "closed",
        })}
      />
    </Show>
  )
}

// ─── Content ───────────────────────────────────────────────────────────────────

export interface DrawerContentProps {
  children: JSX.Element
  class?: string
  style?: JSX.CSSProperties | string
  ref?: (el: HTMLDivElement) => void
}

/** Slide-in content panel with overlay behaviors based on modal mode. */
export function Content(props: DrawerContentProps) {
  const ctx = useDrawerContext()
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

      // Dismissable layer (both modal and non-modal, only if dismissible)
      const removeDismissable = ctx.dismissible
        ? setupDismissableLayer({
            document: doc,
            layerId: ctx.contentId,
            element: () => el,
            onDismiss: (reason) => {
              ctx.requestOpenChange(false, createChangeDetails(reason))
            },
          })
        : () => {}

      // Focus scope (modal only)
      const deactivateFocus = ctx.modal
        ? activateFocusScope({
            element: () => el,
            restoreTarget: () => doc.getElementById(ctx.triggerId),
          })
        : () => {}

      // Modal isolation (modal only)
      const deactivateIsolation = ctx.modal ? activateModalIsolation(el) : () => {}

      // Scroll lock (modal only)
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
    <Show when={ctx.present()}>
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
          scope: "drawer",
          part: "content",
          state: ctx.open() ? "open" : "closed",
        })}
        data-side={ctx.side}
        data-snap-points={ctx.snapPoints ? ctx.snapPoints.join(",") : undefined}
      >
        {props.children}
      </div>
    </Show>
  )
}

// ─── Close ─────────────────────────────────────────────────────────────────────

export interface DrawerCloseProps {
  children: JSX.Element
  ref?: (el: HTMLButtonElement) => void
}

/** Button that closes the drawer. */
export function Close(props: DrawerCloseProps) {
  const ctx = useDrawerContext()

  const handleClick = () => {
    ctx.requestOpenChange(false, createChangeDetails("close"))
  }

  return (
    <button
      onClick={handleClick}
      ref={props.ref}
      {...applySemanticAttrs({ scope: "drawer", part: "close" })}
    >
      {props.children}
    </button>
  )
}

// ─── Title ─────────────────────────────────────────────────────────────────────

export interface DrawerTitleProps {
  children: JSX.Element
  class?: string
}

/** Drawer title, linked to content via aria-labelledby. */
export function Title(props: DrawerTitleProps) {
  const ctx = useDrawerContext()

  return (
    <h2
      id={ctx.titleId}
      class={props.class}
      {...applySemanticAttrs({ scope: "drawer", part: "title" })}
    >
      {props.children}
    </h2>
  )
}

// ─── Description ───────────────────────────────────────────────────────────────

export interface DrawerDescriptionProps {
  children: JSX.Element
  class?: string
}

/** Drawer description, linked to content via aria-describedby. */
export function Description(props: DrawerDescriptionProps) {
  const ctx = useDrawerContext()

  return (
    <p
      id={ctx.descriptionId}
      class={props.class}
      {...applySemanticAttrs({ scope: "drawer", part: "description" })}
    >
      {props.children}
    </p>
  )
}
