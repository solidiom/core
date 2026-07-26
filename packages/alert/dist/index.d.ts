/**
 * @solidiom/alert — Inline, non-modal alert with live region semantics.
 *
 * Parts: Root, Title, Description.
 *
 * Uses role="alert" (assertive) or role="status" (polite) to announce
 * messages to screen readers without stealing focus.
 * Title and Description are wired via aria-labelledby/aria-describedby
 * using createStableId for SSR-safe IDs.
 */
import { type JSX } from "@solidjs/web";
export type AlertType = "info" | "success" | "warning" | "error";
export interface AlertRootProps {
    /** Alert variant — controls visual appearance via recipes. */
    type?: AlertType;
    /**
     * Live region assertiveness.
     * - "assertive" (default): uses role="alert", interrupts the user.
     * - "polite": uses role="status", announced at next opportunity.
     */
    assertiveness?: "assertive" | "polite";
    class?: string;
    children: JSX.Element;
}
/**
 * Alert.Root — container with ARIA live region role.
 * Wires Title and Description via aria-labelledby/aria-describedby.
 */
export declare function Root(props: AlertRootProps): JSX.Element;
export interface AlertTitleProps {
    class?: string;
    children: JSX.Element;
}
/** Alert.Title — heading element wired to aria-labelledby on Root. */
export declare function Title(props: AlertTitleProps): JSX.Element;
export interface AlertDescriptionProps {
    class?: string;
    children: JSX.Element;
}
/** Alert.Description — body text wired to aria-describedby on Root. */
export declare function Description(props: AlertDescriptionProps): JSX.Element;
//# sourceMappingURL=index.d.ts.map