/**
 * Drawer context — shared state between Drawer parts.
 */
import { type Accessor } from "solid-js";
import type { ChangeDetails, DisclosureReason, PresencePhase } from "@solidiom/runtime";
/** The edge from which the drawer slides in. */
export type DrawerSide = "left" | "right" | "top" | "bottom";
export interface DrawerContextValue {
    open: Accessor<boolean>;
    requestOpenChange: (next: boolean, details: ChangeDetails<DisclosureReason>) => void;
    contentId: string;
    titleId: string;
    descriptionId: string;
    triggerId: string;
    phase: Accessor<PresencePhase>;
    present: Accessor<boolean>;
    modal: boolean;
    side: DrawerSide;
    snapPoints: number[] | undefined;
    dismissible: boolean;
    shouldScaleBackground: boolean;
}
export declare const DrawerContext: import("solid-js").Context<DrawerContextValue>;
/** Access drawer context from descendant parts. */
export declare function useDrawerContext(): DrawerContextValue;
//# sourceMappingURL=drawer-context.d.ts.map