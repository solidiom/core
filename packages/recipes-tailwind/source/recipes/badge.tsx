/**
 * Styled Badge — Tailwind recipe wrapper.
 * Import stylesheet: `import "@solidiom/recipes-tailwind/styles/badge.css"`
 *
 * Variant classes (`solidiom-badge--<variant>`) key CSS selectors in badge.css.
 * The primitive itself carries no variant concept — appearance is a recipe concern.
 */
import { type JSX } from "@solidjs/web"
import * as Badge from "@solidiom/badge"

export type BadgeVariant = "default" | "secondary" | "destructive" | "outline"

export function StyledBadge(props: { children: JSX.Element; variant?: BadgeVariant }) {
  const variant = () => props.variant ?? "default"
  return <Badge.Root class={`solidiom-badge--${variant()}`}>{props.children}</Badge.Root>
}
