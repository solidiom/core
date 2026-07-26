/**
 * Tabs primitive — tab selection with keyboard navigation, roving focus,
 * automatic/manual activation, and horizontal/vertical orientation.
 *
 * Parts: Root, List, Trigger, Content.
 */
import { type Accessor } from "solid-js";
import { type JSX } from "@solidjs/web";
import { type ChangeDetails } from "@solidiom/runtime";
import { type TabsReason, type ActivationMode } from "./tabs-context";
/** Props for the tabs root container. */
export interface TabsRootProps {
    /** Controlled active tab value. */
    value?: Accessor<string>;
    /** Default active tab for uncontrolled mode. */
    defaultValue?: string;
    /** Called when active tab changes. */
    onValueChange?: (value: string, details: ChangeDetails<TabsReason>) => void;
    /** Orientation: "horizontal" (default) or "vertical". */
    orientation?: "horizontal" | "vertical";
    /** Activation mode: "automatic" (default) activates on focus, "manual" on Enter/Space. */
    activationMode?: ActivationMode;
    children: JSX.Element;
}
/** Root container that provides tabs state context. */
export declare function Root(props: TabsRootProps): JSX.Element;
/** Props for the tab list container. */
export interface TabsListProps {
    children: JSX.Element;
    class?: string;
    ref?: (el: HTMLDivElement) => void;
}
/** Container for tab triggers with tablist role. */
export declare function List(props: TabsListProps): JSX.Element;
/** Props for an individual tab trigger button. */
export interface TabsTriggerProps {
    /** Value identifying this tab. Must match a Content's value. */
    value: string;
    /** Whether this tab trigger is disabled. */
    disabled?: boolean;
    children: JSX.Element;
    ref?: (el: HTMLButtonElement) => void;
}
/** Tab button that activates its corresponding content panel. */
export declare function Trigger(props: TabsTriggerProps): JSX.Element;
/** Props for a tab content panel. */
export interface TabsContentProps {
    /** Value identifying this panel. Must match a Trigger's value. */
    value: string;
    children: JSX.Element;
    class?: string;
    style?: JSX.CSSProperties | string;
}
/** Tab panel content that is shown when its corresponding trigger is active. */
export declare function Content(props: TabsContentProps): JSX.Element;
//# sourceMappingURL=tabs.d.ts.map