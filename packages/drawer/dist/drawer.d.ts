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
import { type Accessor } from "solid-js";
import { type JSX } from "@solidjs/web";
import { type DisclosureReason, type ChangeDetails } from "@solidiom/runtime";
import { type DrawerSide } from "./drawer-context";
export interface DrawerRootProps {
    /** Controlled open state. */
    open?: Accessor<boolean>;
    /** Default open state (uncontrolled). */
    defaultOpen?: boolean;
    /** Called when open state change is requested. */
    onOpenChange?: (open: boolean, details: ChangeDetails<DisclosureReason>) => void;
    /** Whether the drawer is modal. Default: true. */
    modal?: boolean;
    /** Edge from which the drawer slides. Default: "right". */
    side?: DrawerSide;
    /** Discrete snap point positions (as percentages 0–100). */
    snapPoints?: number[];
    /** Whether the drawer can be dismissed by swipe/click-outside. Default: true. */
    dismissible?: boolean;
    /** Whether the background should scale when drawer opens. Default: false. */
    shouldScaleBackground?: boolean;
    children: JSX.Element;
}
export declare function Root(props: DrawerRootProps): JSX.Element;
export interface DrawerTriggerProps {
    children: JSX.Element;
    ref?: (el: HTMLButtonElement) => void;
}
/** Button that toggles the drawer open/closed. */
export declare function Trigger(props: DrawerTriggerProps): JSX.Element;
export interface DrawerBackdropProps {
    class?: string;
    style?: JSX.CSSProperties | string;
}
/** Backdrop overlay — only rendered in modal mode when present. */
export declare function Backdrop(props: DrawerBackdropProps): JSX.Element;
export interface DrawerContentProps {
    children: JSX.Element;
    class?: string;
    style?: JSX.CSSProperties | string;
    ref?: (el: HTMLDivElement) => void;
}
/** Slide-in content panel with overlay behaviors based on modal mode. */
export declare function Content(props: DrawerContentProps): JSX.Element;
export interface DrawerCloseProps {
    children: JSX.Element;
    ref?: (el: HTMLButtonElement) => void;
}
/** Button that closes the drawer. */
export declare function Close(props: DrawerCloseProps): JSX.Element;
export interface DrawerTitleProps {
    children: JSX.Element;
    class?: string;
}
/** Drawer title, linked to content via aria-labelledby. */
export declare function Title(props: DrawerTitleProps): JSX.Element;
export interface DrawerDescriptionProps {
    children: JSX.Element;
    class?: string;
}
/** Drawer description, linked to content via aria-describedby. */
export declare function Description(props: DrawerDescriptionProps): JSX.Element;
//# sourceMappingURL=drawer.d.ts.map