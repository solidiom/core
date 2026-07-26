/**
 * @solidiom/collapsible — Headless collapsible primitive with disclosure state.
 *
 * Parts: Root, Trigger, Content.
 */
import { type Accessor } from "solid-js";
import { type JSX } from "@solidjs/web";
export interface CollapsibleRootProps {
    open?: Accessor<boolean>;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
    disabled?: boolean;
    children: JSX.Element;
}
export declare function Root(props: CollapsibleRootProps): JSX.Element;
export interface CollapsibleTriggerProps {
    children: JSX.Element;
    class?: string;
    style?: JSX.CSSProperties | string;
}
export declare function Trigger(props: CollapsibleTriggerProps): JSX.Element;
export interface CollapsibleContentProps {
    children: JSX.Element;
    class?: string;
    style?: JSX.CSSProperties | string;
}
export declare function Content(props: CollapsibleContentProps): JSX.Element;
//# sourceMappingURL=index.d.ts.map