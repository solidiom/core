/**
 * Resizable panels context — shared state between PanelGroup parts.
 */
import { type Accessor } from "solid-js";
import type { ChangeDetails } from "@solidiom/runtime";
/** Reason for a panel size change. */
export type PanelResizeReason = "pointer" | "keyboard" | "programmatic";
/** Size constraint for a single panel. */
export interface PanelConstraints {
    /** Minimum size as a percentage (0–100). Default: 0. */
    minSize?: number;
    /** Maximum size as a percentage (0–100). Default: 100. */
    maxSize?: number;
    /** Default size as a percentage. */
    defaultSize?: number;
    /** Whether this panel can collapse to 0 when dragged below minSize. */
    collapsible?: boolean;
}
/** Registration entry for a panel in the group. */
export interface PanelEntry {
    id: string;
    constraints: PanelConstraints;
    order: number;
}
export interface PanelGroupContextValue {
    /** Layout direction. */
    direction: Accessor<"horizontal" | "vertical">;
    /** Current panel sizes as percentages, indexed by panel order. */
    sizes: Accessor<number[]>;
    /** Request a size change for the group layout. */
    requestSizeChange: (sizes: number[], details: ChangeDetails<PanelResizeReason>) => void;
    /** Register a panel and return a cleanup function. */
    registerPanel: (entry: PanelEntry) => () => void;
    /** Ordered panel entries. */
    panels: Accessor<PanelEntry[]>;
    /** Generated base ID. */
    baseId: string;
}
export declare const PanelGroupContext: import("solid-js").Context<PanelGroupContextValue>;
/** Access the panel group context. Throws if used outside PanelGroup. */
export declare function usePanelGroupContext(): PanelGroupContextValue;
//# sourceMappingURL=panels-context.d.ts.map