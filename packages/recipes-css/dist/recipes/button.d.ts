/**
 * Styled Button — CSS recipe wrapper with CVA variants.
 * Import the stylesheet separately: `import "@solidiom/recipes-css/styles/button.css"`
 */
import { type JSX } from "@solidjs/web";
import { type VariantProps } from "class-variance-authority";
export declare const buttonVariants: (props?: ({
    variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | null | undefined;
    size?: "default" | "sm" | "lg" | "icon" | null | undefined;
} & import("class-variance-authority/types").ClassProp) | undefined) => string;
export type ButtonVariantProps = VariantProps<typeof buttonVariants>;
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