/** @solidiom/sheet — Side-panel dialog. Parts: Root, Trigger, Portal, Backdrop, Content, Title, Description, Close. */

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
  setupDismissableLayer,
  activateFocusScope,
  activateModalIsolation,
  activateScrollLock,
  createChangeDetails,
  type DisclosureReason,
  type ChangeDetails,
  type PresencePhase,
} from "@solidiom/runtime"

// ─── Context ───────────────────────────────────────────────────────────────────

type SheetSide = "left" | "right" | "top" | "bottom"

interface SheetContextValue {
  open: Accessor<boolean>
  requestOpenChange: (next: boolean, details: ChangeDetails<DisclosureReason>) => void
  contentId: string
  titleId: string
  descriptionId: string
  triggerId: string
  phase: Accessor<PresencePhase>
  present: Accessor<boolean>
  side: SheetSide
}

const SheetContext = createContext<SheetContextValue>()

function useSheetContext(): SheetContextValue {
  const ctx = useContext(SheetContext)
  if (!ctx) {
    throw new Error("[solidiom] Sheet parts must be used within Sheet.Root")
  }
  return ctx
}

// ─── Root ──────────────────────────────────────────────────────────────────────

export interface SheetRootProps {
  /** Which side the sheet slides in from. Default: "right". */
  side?: SheetSide
  /** Controlled open state. */
  open?: Accessor<boolean>
  /** Default open state (uncontrolled). */
  defaultOpen?: boolean
  /** Called when open state change is requested. */
  onOpenChange?: (open: boolean, details: ChangeDetails<DisclosureReason>) => void
  children: JSX.Element
}

export function Root(props: SheetRootProps) {
  const side = props.side ?? "right"
  const baseId = createStableId("sheet")

  const { open, requestOpenChange } = createDisclosureState({
    open: props.open,
    defaultOpen: props.defaultOpen,
    onOpenChange: props.onOpenChange,
  })

  const presence = createPresence({ open })

  const ctx: SheetContextValue = {
    open,
    requestOpenChange,
    contentId: `${baseId}-content`,
    titleId: `${baseId}-title`,
    descriptionId: `${baseId}-description`,
    triggerId: `${baseId}-trigger`,
    phase: presence.phase,
    present: presence.present,
    side,
  }

  return <SheetContext value={ctx}>{props.children}</SheetContext>
}

// ─── Trigger ───────────────────────────────────────────────────────────────────

export interface SheetTriggerProps {
  children: JSX.Element
  ref?: (el: HTMLButtonElement) => void
}

export function Trigger(props: SheetTriggerProps) {
  const ctx = useSheetContext()

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
        scope: "sheet",
        part: "trigger",
        state: ctx.open() ? "open" : "closed",
      })}
    >
      {props.children}
    </button>
  )
}

// ─── Portal ────────────────────────────────────────────────────────────────────

export interface SheetPortalProps {
  children: JSX.Element
}

/**
 * Portal wrapper — renders children only when present.
 * In Solid 2 beta, native Portal API is not yet stable.
 * This renders inline with Show; actual DOM portalling deferred.
 */
export function Portal(props: SheetPortalProps) {
  const ctx = useSheetContext()

  return <Show when={ctx.present()}>{props.children}</Show>
}

// ─── Backdrop ──────────────────────────────────────────────────────────────────

export interface SheetBackdropProps {
  class?: string
  style?: JSX.CSSProperties | string
}

export function Backdrop(props: SheetBackdropProps) {
  const ctx = useSheetContext()

  return (
    <div
      {...applySemanticAttrs({
        scope: "sheet",
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

export interface SheetContentProps {
  children: JSX.Element
  class?: string
  style?: JSX.CSSProperties | string
  ref?: (el: HTMLDivElement) => void
  /** Disable focus trapping. Default: true (trapping enabled). */
  trapFocus?: boolean
}

export function Content(props: SheetContentProps) {
  const ctx = useSheetContext()
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
        modal: true,
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
      const deactivateIsolation = activateModalIsolation(el)

      // Scroll lock
      const releaseScroll = activateScrollLock(doc)

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
      aria-modal="true"
      aria-labelledby={ctx.titleId}
      aria-describedby={ctx.descriptionId}
      data-side={ctx.side}
      ref={(el: HTMLDivElement) => {
        setContentEl(el)
        props.ref?.(el)
      }}
      class={props.class}
      style={props.style}
      {...applySemanticAttrs({
        scope: "sheet",
        part: "content",
        state: ctx.open() ? "open" : "closed",
      })}
    >
      {props.children}
    </div>
  )
}

// ─── Title ─────────────────────────────────────────────────────────────────────

export interface SheetTitleProps {
  children: JSX.Element
  class?: string
}

export function Title(props: SheetTitleProps) {
  const ctx = useSheetContext()

  return (
    <h2
      id={ctx.titleId}
      class={props.class}
      {...applySemanticAttrs({ scope: "sheet", part: "title" })}
    >
      {props.children}
    </h2>
  )
}

// ─── Description ───────────────────────────────────────────────────────────────

export interface SheetDescriptionProps {
  children: JSX.Element
  class?: string
}

export function Description(props: SheetDescriptionProps) {
  const ctx = useSheetContext()

  return (
    <p
      id={ctx.descriptionId}
      class={props.class}
      {...applySemanticAttrs({ scope: "sheet", part: "description" })}
    >
      {props.children}
    </p>
  )
}

// ─── Close ─────────────────────────────────────────────────────────────────────

export interface SheetCloseProps {
  children: JSX.Element
  ref?: (el: HTMLButtonElement) => void
}

export function Close(props: SheetCloseProps) {
  const ctx = useSheetContext()

  const handleClick = () => {
    ctx.requestOpenChange(false, createChangeDetails("close"))
  }

  return (
    <button
      onClick={handleClick}
      ref={props.ref}
      {...applySemanticAttrs({ scope: "sheet", part: "close" })}
    >
      {props.children}
    </button>
  )
}
