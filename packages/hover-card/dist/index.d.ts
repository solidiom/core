/** @solidiom/hover-card — Content preview on hover. Parts: Root, Trigger, Content. */
import { type JSX } from "@solidjs/web";
export interface HoverCardRootProps {
    /** Delay in ms before opening. Default 700. */
    openDelay?: number;
    /** Delay in ms before closing. Default 300. */
    closeDelay?: number;
    children: JSX.Element;
}
export interface HoverCardTriggerProps {
    href?: string;
    children: JSX.Element;
    class?: string;
}
export interface HoverCardContentProps {
    children: JSX.Element;
    class?: string;
    style?: JSX.CSSProperties | string;
}
export declare function Root(props: HoverCardRootProps): JSX.Element;
export declare function Trigger(props: HoverCardTriggerProps): JSX.Element;
export declare function Content(props: HoverCardContentProps): JSX.Element;
//# sourceMappingURL=index.d.ts.map