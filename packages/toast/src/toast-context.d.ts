/**
 * Toast context — shared state between Toast parts and the toaster API.
 */
import { type Accessor } from "solid-js"
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
export declare const ToastContext: import("solid-js").Context<ToastContextValue>
/** Retrieve toast context. Throws if used outside Toast.Region. */
export declare function useToastContext(): ToastContextValue
//# sourceMappingURL=toast-context.d.ts.map
