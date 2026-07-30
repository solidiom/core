/**
 * Styled Badge — CSS recipe wrapper, using generated variant classes.
 * Import the stylesheet separately: `import "@solidiom/recipes-css/styles/badge.css"`
 */
import { type JSX } from "@solidjs/web";
import { type BadgeVariantProps } from "./badge.variants";
export type BadgeVariant = NonNullable<BadgeVariantProps["variant"]>;
export declare function StyledBadge(props: {
    children: JSX.Element;
    variant?: BadgeVariant;
}): JSX.Element;
//# sourceMappingURL=badge.d.ts.map