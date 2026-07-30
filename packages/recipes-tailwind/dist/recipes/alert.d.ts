/**
 * Styled Alert — Tailwind recipe wrapper.
 * The stylesheet keys entirely off the primitive's own `data-state`, so no wrapper
 * class is needed. Import stylesheet: `import "@solidiom/recipes-tailwind/styles/alert.css"`
 */
import { type JSX } from "@solidjs/web";
import * as Alert from "@solidiom/alert";
import type { AlertType } from "@solidiom/alert";
export type AlertVariant = AlertType;
export declare function StyledAlert(props: {
    children: JSX.Element;
    variant?: AlertVariant;
    assertiveness?: "assertive" | "polite";
}): JSX.Element;
export { Alert };
//# sourceMappingURL=alert.d.ts.map