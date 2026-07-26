/**
 * Styled Badge — CSS recipe wrapper.
 * Import the stylesheet separately: `import "@solidiom/recipes-css/styles/badge.css"`
 */
import { type JSX } from "@solidjs/web"
import * as Badge from "@solidiom/badge"

export type BadgeVariant = "default" | "secondary" | "destructive" | "outline"

export function StyledBadge(props: { children: JSX.Element; variant?: BadgeVariant }) {
  const variant = () => props.variant ?? "default"
  return <Badge.Root class={`solidiom-badge--${variant()}`}>{props.children}</Badge.Root>
}
