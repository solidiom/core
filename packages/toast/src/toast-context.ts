/**
 * Toast context — shared state between Toast parts and the toaster API.
 */

import { createContext, useContext, type Accessor } from "solid-js"

export interface ToastEntry {
  /** Unique identifier. */
  id: string
  /** Toast title text. */
  title: string
  /** Optional description body. */
  description?: string
  /** Auto-dismiss duration in ms. 0 disables auto-dismiss. */
  duration: number
  /** Called when the toast is dismissed. */
  onDismiss?: () => void
}

export interface ToastContextValue {
  /** Currently visible toasts (FIFO, capped by max). */
  toasts: Accessor<ToastEntry[]>
  /** Dismiss a toast by id. */
  dismiss: (id: string) => void
  /** Pause all auto-dismiss timers (hover). */
  pause: () => void
  /** Resume all auto-dismiss timers. */
  resume: () => void
  /** Whether timers are paused. */
  paused: Accessor<boolean>
}

export const ToastContext = createContext<ToastContextValue>()

/** Retrieve toast context. Throws if used outside Toast.Region. */
export function useToastContext(): ToastContextValue {
  const ctx = useContext(ToastContext)
  if (!ctx) {
    throw new Error("[solidiom] Toast parts must be used within Toast.Region")
  }
  return ctx
}
