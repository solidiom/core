/**
 * Styled Button — Tailwind recipe wrapper, using generated variant classes.
 * Import stylesheet: `import "@solidiom/recipes-tailwind/styles/button.css"`
 */
import { type JSX } from "@solidjs/web";
import { buttonVariants, type ButtonVariantProps } from "./button.variants";
export { buttonVariants, type ButtonVariantProps };
export interface StyledButtonProps extends ButtonVariantProps {
    children: JSX.Element;
    disabled?: boolean;
    loading?: boolean;
    onClick?: () => void;
    type?: "button" | "submit" | "reset";
    class?: string;
}
export declare function StyledButton(props: StyledButtonProps): JSX.Element;
//# sourceMappingURL=button.d.ts.map