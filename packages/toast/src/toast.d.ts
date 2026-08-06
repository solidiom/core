/**
 * Toast primitive — notification queue with auto-dismiss, pause-on-hover,
 * configurable max visible, and programmatic control.
 *
 * Parts: Region (provider), Root (single toast), Title, Description, Close.
 * Export: createToaster() for programmatic queue management.
 */
import { type JSX } from "@solidjs/web";
import { type ToastEntry } from "./toast-context";
export interface ToasterOptions {
    /** Maximum visible toasts. Default: 3. */
    max?: number;
    /** Default duration in ms. Default: 5000. */
    defaultDuration?: number;
}
export interface ToasterApi {
    /** Add a toast to the queue. Returns the toast id. */
    toast: (entry: Omit<ToastEntry, "id" | "duration"> & {
        duration?: number;
    }) => string;
    /** Dismiss a toast by id. */
    dismiss: (id: string) => void;
    /** Reactive accessor to the current toast list. */
    toasts: () => ToastEntry[];
}
/**
 * Creates a toaster instance for programmatic toast management.
 * Returns `{toast, dismiss, toasts}` — use with `Region` component.
 */
export declare function createToaster(options?: ToasterOptions): ToasterApi;
export interface ToastRegionProps {
    /** Toaster API from createToaster(). */
    toaster: ToasterApi;
    /** Custom aria-label. Default: "Notifications". */
    label?: string;
    children?: JSX.Element | ((toasts: () => ToastEntry[]) => JSX.Element);
}
/**
 * Region container — wraps all toasts with role="region" and aria-live.
 * Manages auto-dismiss timers and pause-on-hover.
 */
export declare function Region(props: ToastRegionProps): JSX.Element;
export interface ToastRootProps {
    /** Toast entry id for dismissal. */
    toastId: string;
    children: JSX.Element;
    class?: string;
    style?: JSX.CSSProperties | string;
}
/** Single toast wrapper — provides semantic attributes and data. */
export declare function Root(props: ToastRootProps): JSX.Element;
export interface ToastTitleProps {
    children: JSX.Element;
    class?: string;
}
/** Toast title text. */
export declare function Title(props: ToastTitleProps): JSX.Element;
export interface ToastDescriptionProps {
    children: JSX.Element;
    class?: string;
}
/** Toast description body. */
export declare function Description(props: ToastDescriptionProps): JSX.Element;
export interface ToastCloseProps {
    children: JSX.Element;
    /** Toast id to dismiss. If omitted, reads from nearest Root's data-toast-id. */
    toastId?: string;
    class?: string;
}
/** Close button — dismisses the toast. */
export declare function Close(props: ToastCloseProps): JSX.Element;
//# sourceMappingURL=toast.d.ts.map