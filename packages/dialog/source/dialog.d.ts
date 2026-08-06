/**
 * Dialog primitive — modal overlay with focus trapping, escape dismissal,
 * pointer-outside dismissal, scroll lock, and presence phases.
 *
 * Parts: Root, Trigger, Portal, Backdrop, Content, Title, Description, Close.
 */
import { type Accessor } from "solid-js";
import { type JSX } from "@solidjs/web";
import { type DisclosureReason, type ChangeDetails } from "@solidiom/runtime";
export interface DialogRootProps {
    /** Controlled open state. */
    open?: Accessor<boolean>;
    /** Default open state (uncontrolled). */
    defaultOpen?: boolean;
    /** Called when open state change is requested. */
    onOpenChange?: (open: boolean, details: ChangeDetails<DisclosureReason>) => void;
    /** Whether the dialog is modal. Default: true. */
    modal?: boolean;
    children: JSX.Element;
}
export declare function Root(props: DialogRootProps): JSX.Element;
export interface DialogTriggerProps {
    children: JSX.Element;
    ref?: (el: HTMLButtonElement) => void;
}
export declare function Trigger(props: DialogTriggerProps): JSX.Element;
export interface DialogPortalProps {
    children: JSX.Element;
}
/**
 * Portal wrapper — renders children only when present.
 * In Solid 2 beta, native Portal API is not yet stable.
 * This renders inline with Show; actual DOM portalling deferred.
 */
export declare function Portal(props: DialogPortalProps): JSX.Element;
export interface DialogBackdropProps {
    class?: string;
    style?: JSX.CSSProperties | string;
}
export declare function Backdrop(props: DialogBackdropProps): JSX.Element;
export interface DialogContentProps {
    children: JSX.Element;
    class?: string;
    style?: JSX.CSSProperties | string;
    ref?: (el: HTMLDivElement) => void;
    /** Disable focus trapping. Default: true (trapping enabled). */
    trapFocus?: boolean;
}
export declare function Content(props: DialogContentProps): JSX.Element;
export interface DialogTitleProps {
    children: JSX.Element;
    class?: string;
}
export declare function Title(props: DialogTitleProps): JSX.Element;
export interface DialogDescriptionProps {
    children: JSX.Element;
    class?: string;
}
export declare function Description(props: DialogDescriptionProps): JSX.Element;
export interface DialogCloseProps {
    children: JSX.Element;
    ref?: (el: HTMLButtonElement) => void;
}
export declare function Close(props: DialogCloseProps): JSX.Element;
//# sourceMappingURL=dialog.d.ts.map