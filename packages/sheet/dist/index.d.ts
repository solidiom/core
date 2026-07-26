/** @solidiom/sheet — Side-panel dialog. Parts: Root, Trigger, Portal, Backdrop, Content, Title, Description, Close. */
import { type Accessor } from "solid-js";
import { type JSX } from "@solidjs/web";
import { type DisclosureReason, type ChangeDetails } from "@solidiom/runtime";
type SheetSide = "left" | "right" | "top" | "bottom";
export interface SheetRootProps {
    /** Which side the sheet slides in from. Default: "right". */
    side?: SheetSide;
    /** Controlled open state. */
    open?: Accessor<boolean>;
    /** Default open state (uncontrolled). */
    defaultOpen?: boolean;
    /** Called when open state change is requested. */
    onOpenChange?: (open: boolean, details: ChangeDetails<DisclosureReason>) => void;
    children: JSX.Element;
}
export declare function Root(props: SheetRootProps): JSX.Element;
export interface SheetTriggerProps {
    children: JSX.Element;
    ref?: (el: HTMLButtonElement) => void;
}
export declare function Trigger(props: SheetTriggerProps): JSX.Element;
export interface SheetPortalProps {
    children: JSX.Element;
}
/**
 * Portal wrapper — renders children only when present.
 * In Solid 2 beta, native Portal API is not yet stable.
 * This renders inline with Show; actual DOM portalling deferred.
 */
export declare function Portal(props: SheetPortalProps): JSX.Element;
export interface SheetBackdropProps {
    class?: string;
    style?: JSX.CSSProperties | string;
}
export declare function Backdrop(props: SheetBackdropProps): JSX.Element;
export interface SheetContentProps {
    children: JSX.Element;
    class?: string;
    style?: JSX.CSSProperties | string;
    ref?: (el: HTMLDivElement) => void;
    /** Disable focus trapping. Default: true (trapping enabled). */
    trapFocus?: boolean;
}
export declare function Content(props: SheetContentProps): JSX.Element;
export interface SheetTitleProps {
    children: JSX.Element;
    class?: string;
}
export declare function Title(props: SheetTitleProps): JSX.Element;
export interface SheetDescriptionProps {
    children: JSX.Element;
    class?: string;
}
export declare function Description(props: SheetDescriptionProps): JSX.Element;
export interface SheetCloseProps {
    children: JSX.Element;
    ref?: (el: HTMLButtonElement) => void;
}
export declare function Close(props: SheetCloseProps): JSX.Element;
export {};
//# sourceMappingURL=index.d.ts.map