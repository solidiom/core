/**
 * HoverCard primitive — content preview on hover, with configurable open/close
 * delays and a positioning port for anchoring content to the trigger.
 *
 * Parts: Root, Trigger, Content.
 */
import { type JSX } from "@solidjs/web";
import { type PositioningPort } from "./hover-card-context";
export interface HoverCardRootProps {
    /** Delay in ms before opening. Default 700. */
    openDelay?: number;
    /** Delay in ms before closing. Default 300. */
    closeDelay?: number;
    /** Positioning adapter for floating placement. */
    positioning?: PositioningPort;
    children: JSX.Element;
}
export declare function Root(props: HoverCardRootProps): JSX.Element;
export interface HoverCardTriggerProps {
    href?: string;
    children: JSX.Element;
    class?: string;
}
export declare function Trigger(props: HoverCardTriggerProps): JSX.Element;
export interface HoverCardContentProps {
    children: JSX.Element;
    class?: string;
    style?: JSX.CSSProperties | string;
}
export declare function Content(props: HoverCardContentProps): JSX.Element;
//# sourceMappingURL=hover-card.d.ts.map