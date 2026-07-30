/**
 * Styled Badge — Tailwind recipe wrapper, using generated variant classes.
 * Import stylesheet: `import "@solidiom/recipes-tailwind/styles/badge.css"`
 */
import { type JSX } from "@solidjs/web"
import * as Badge from "@solidiom/badge"
import { badgeVariants, type BadgeVariantProps } from "./badge.variants"

export type BadgeVariant = NonNullable<BadgeVariantProps["variant"]>

export function StyledBadge(props: { children: JSX.Element; variant?: BadgeVariant }) {
  return <Badge.Root class={badgeVariants({ variant: props.variant })}>{props.children}</Badge.Root>
}
