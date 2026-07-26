/**
 * @solidiom/alert-dialog — Modal confirmation dialog requiring explicit user action.
 *
 * Unlike regular Dialog, AlertDialog does not dismiss on click-outside or Escape.
 * Only Cancel and Action buttons close it.
 *
 * Parts: Root, Trigger, Portal, Content, Title, Description, Cancel, Action.
 */
import { type Accessor } from "solid-js";
import { type JSX } from "@solidjs/web";
import { type DisclosureReason, type ChangeDetails } from "@solidiom/runtime";
export interface AlertDialogRootProps {
    /** Controlled open state. */
    open?: Accessor<boolean>;
    /** Default open state (uncontrolled). */
    defaultOpen?: boolean;
    /** Called when open state change is requested. */
    onOpenChange?: (open: boolean, details: ChangeDetails<DisclosureReason>) => void;
    children: JSX.Element;
}
export declare function Root(props: AlertDialogRootProps): JSX.Element;
export interface AlertDialogTriggerProps {
    children: JSX.Element;
    ref?: (el: HTMLButtonElement) => void;
}
export declare function Trigger(props: AlertDialogTriggerProps): JSX.Element;
export interface AlertDialogPortalProps {
    children: JSX.Element;
}
/**
 * Portal wrapper — renders children only when present.
 * Renders inline with Show; actual DOM portalling deferred to stable Portal API.
 */
export declare function Portal(props: AlertDialogPortalProps): JSX.Element;
export interface AlertDialogContentProps {
    children: JSX.Element;
    class?: string;
    style?: JSX.CSSProperties | string;
    ref?: (el: HTMLDivElement) => void;
}
export declare function Content(props: AlertDialogContentProps): JSX.Element;
export interface AlertDialogTitleProps {
    children: JSX.Element;
    class?: string;
}
export declare function Title(props: AlertDialogTitleProps): JSX.Element;
export interface AlertDialogDescriptionProps {
    children: JSX.Element;
    class?: string;
}
export declare function Description(props: AlertDialogDescriptionProps): JSX.Element;
export interface AlertDialogCancelProps {
    children: JSX.Element;
    ref?: (el: HTMLButtonElement) => void;
}
export declare function Cancel(props: AlertDialogCancelProps): JSX.Element;
export interface AlertDialogActionProps {
    children: JSX.Element;
    /** Called after the dialog requests close from the action button. */
    onAction?: () => void;
    ref?: (el: HTMLButtonElement) => void;
}
export declare function Action(props: AlertDialogActionProps): JSX.Element;
//# sourceMappingURL=index.d.ts.map