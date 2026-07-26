/**
 * Toast primitive — notification queue with auto-dismiss, pause-on-hover,
 * configurable max visible, and programmatic control.
 *
 * Parts: Region (provider), Root (single toast), Title, Description, Close.
 * Export: createToaster() for programmatic queue management.
 */

import { createSignal, For, onCleanup } from "solid-js"
import { type JSX } from "@solidjs/web"
import { createStableId, applySemanticAttrs } from "@solidiom/runtime"
import {
  ToastContext,
  useToastContext,
  type ToastContextValue,
  type ToastEntry,
} from "./toast-context"

// ─── createToaster ─────────────────────────────────────────────────────────────

export interface ToasterOptions {
  /** Maximum visible toasts. Default: 3. */
  max?: number
  /** Default duration in ms. Default: 5000. */
  defaultDuration?: number
}

export interface ToasterApi {
  /** Add a toast to the queue. Returns the toast id. */
  toast: (entry: Omit<ToastEntry, "id" | "duration"> & { duration?: number }) => string
  /** Dismiss a toast by id. */
  dismiss: (id: string) => void
  /** Reactive accessor to the current toast list. */
  toasts: () => ToastEntry[]
}

/**
 * Creates a toaster instance for programmatic toast management.
 * Returns `{toast, dismiss, toasts}` — use with `Region` component.
 */
export function createToaster(options: ToasterOptions = {}): ToasterApi {
  const max = options.max ?? 3
  const defaultDuration = options.defaultDuration ?? 5000
  const [toasts, setToasts] = createSignal<ToastEntry[]>([])

  const dismiss = (id: string) => {
    setToasts((prev) => {
      const entry = prev.find((t) => t.id === id)
      entry?.onDismiss?.()
      return prev.filter((t) => t.id !== id)
    })
  }

  const toast = (entry: Omit<ToastEntry, "id" | "duration"> & { duration?: number }): string => {
    const id = createStableId("toast")
    const newEntry: ToastEntry = {
      id,
      title: entry.title,
      description: entry.description,
      duration: entry.duration ?? defaultDuration,
      onDismiss: entry.onDismiss,
    }

    setToasts((prev) => {
      const next = [...prev, newEntry]
      // Enforce max by removing oldest entries beyond the cap
      if (next.length > max) {
        const overflow = next.slice(0, next.length - max)
        overflow.forEach((t) => t.onDismiss?.())
        return next.slice(next.length - max)
      }
      return next
    })

    return id
  }

  return { toast, dismiss, toasts }
}

// ─── Region ────────────────────────────────────────────────────────────────────

export interface ToastRegionProps {
  /** Toaster API from createToaster(). */
  toaster: ToasterApi
  /** Custom aria-label. Default: "Notifications". */
  label?: string
  children?: JSX.Element | ((toasts: () => ToastEntry[]) => JSX.Element)
}

/**
 * Region container — wraps all toasts with role="region" and aria-live.
 * Manages auto-dismiss timers and pause-on-hover.
 */
export function Region(props: ToastRegionProps) {
  const [paused, setPaused] = createSignal(false)
  const timers = new Map<string, ReturnType<typeof setTimeout>>()

  const dismiss = (id: string) => {
    clearTimerForId(id)
    props.toaster.dismiss(id)
  }

  const pause = () => {
    setPaused(true)
    // Clear all running timers
    for (const [, timer] of timers) {
      clearTimeout(timer)
    }
    timers.clear()
  }

  const resume = () => {
    setPaused(false)
    // Restart timers for all visible toasts
    const current = props.toaster.toasts()
    for (const entry of current) {
      if (entry.duration > 0) {
        startTimer(entry.id, entry.duration)
      }
    }
  }

  const startTimer = (id: string, duration: number) => {
    if (paused() || duration <= 0) return
    clearTimerForId(id)
    const timer = setTimeout(() => {
      timers.delete(id)
      props.toaster.dismiss(id)
    }, duration)
    timers.set(id, timer)
  }

  const clearTimerForId = (id: string) => {
    const existing = timers.get(id)
    if (existing) {
      clearTimeout(existing)
      timers.delete(id)
    }
  }

  // Start timers for new toasts via effect-like tracking
  let prevIds = new Set<string>()
  const trackToasts = () => {
    const current = props.toaster.toasts()
    const currentIds = new Set(current.map((t) => t.id))

    // Start timers for newly added toasts
    for (const entry of current) {
      if (!prevIds.has(entry.id) && entry.duration > 0 && !paused()) {
        startTimer(entry.id, entry.duration)
      }
    }

    // Clear timers for removed toasts
    for (const id of prevIds) {
      if (!currentIds.has(id)) {
        clearTimerForId(id)
      }
    }

    prevIds = currentIds
  }

  // We track toast changes in the render to start/clear timers
  const toastsAccessor = () => {
    trackToasts()
    return props.toaster.toasts()
  }

  onCleanup(() => {
    for (const [, timer] of timers) {
      clearTimeout(timer)
    }
    timers.clear()
  })

  const ctx: ToastContextValue = {
    toasts: toastsAccessor,
    dismiss,
    pause,
    resume,
    paused,
  }

  const handlePointerEnter = () => pause()
  const handlePointerLeave = () => resume()

  return (
    <ToastContext value={ctx}>
      <div
        role="region"
        aria-label={props.label ?? "Notifications"}
        aria-live="polite"
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        {...applySemanticAttrs({ scope: "toast", part: "region" })}
      >
        {typeof props.children === "function" ? (
          props.children(toastsAccessor)
        ) : (
          <For each={toastsAccessor()}>
            {(entry) => (
              <ToastRoot toastId={entry.id}>
                <Title>{entry.title}</Title>
                {entry.description && <Description>{entry.description}</Description>}
                <Close>×</Close>
              </ToastRoot>
            )}
          </For>
        )}
      </div>
    </ToastContext>
  )
}

// ─── Root (single toast) ───────────────────────────────────────────────────────

export interface ToastRootProps {
  /** Toast entry id for dismissal. */
  toastId: string
  children: JSX.Element
  class?: string
  style?: JSX.CSSProperties | string
}

/** Single toast wrapper — provides semantic attributes and data. */
export function Root(props: ToastRootProps) {
  return (
    <div
      role="status"
      aria-atomic="true"
      class={props.class}
      style={props.style}
      {...applySemanticAttrs({ scope: "toast", part: "root" })}
      data-toast-id={props.toastId}
    >
      {props.children}
    </div>
  )
}

// Alias for internal use within Region default rendering
const ToastRoot = Root

// ─── Title ─────────────────────────────────────────────────────────────────────

export interface ToastTitleProps {
  children: JSX.Element
  class?: string
}

/** Toast title text. */
export function Title(props: ToastTitleProps) {
  return (
    <div class={props.class} {...applySemanticAttrs({ scope: "toast", part: "title" })}>
      {props.children}
    </div>
  )
}

// ─── Description ───────────────────────────────────────────────────────────────

export interface ToastDescriptionProps {
  children: JSX.Element
  class?: string
}

/** Toast description body. */
export function Description(props: ToastDescriptionProps) {
  return (
    <div class={props.class} {...applySemanticAttrs({ scope: "toast", part: "description" })}>
      {props.children}
    </div>
  )
}

// ─── Close ─────────────────────────────────────────────────────────────────────

export interface ToastCloseProps {
  children: JSX.Element
  /** Toast id to dismiss. If omitted, reads from nearest Root's data-toast-id. */
  toastId?: string
  class?: string
}

/** Close button — dismisses the toast. */
export function Close(props: ToastCloseProps) {
  const ctx = useToastContext()

  const handleClick = (e: MouseEvent) => {
    const id =
      props.toastId ??
      (e.currentTarget as HTMLElement).closest("[data-toast-id]")?.getAttribute("data-toast-id")
    if (id) ctx.dismiss(id)
  }

  return (
    <button
      onClick={handleClick}
      aria-label="Dismiss"
      class={props.class}
      {...applySemanticAttrs({ scope: "toast", part: "close" })}
    >
      {props.children}
    </button>
  )
}
