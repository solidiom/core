/**
 * Dialog context — shared state between Dialog parts.
 */
import { type Accessor } from "solid-js";
import type { ChangeDetails, DisclosureReason, PresencePhase } from "@solidiom/runtime";
export interface DialogContextValue {
    open: Accessor<boolean>;
    requestOpenChange: (next: boolean, details: ChangeDetails<DisclosureReason>) => void;
    contentId: string;
    titleId: string;
    descriptionId: string;
    triggerId: string;
    phase: Accessor<PresencePhase>;
    present: Accessor<boolean>;
    modal: boolean;
}
export declare const DialogContext: import("solid-js").Context<DialogContextValue>;
export declare function useDialogContext(): DialogContextValue;
//# sourceMappingURL=dialog-context.d.ts.map