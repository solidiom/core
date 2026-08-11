/**
 * Styled Breadcrumb — Tailwind recipe wrapper, using twMerge for class composition.
 */
import { twMerge } from "tailwind-merge"
import * as Breadcrumb from "@solidiom/breadcrumb"

export { Breadcrumb }

const ROOT_CLASSES = "flex items-center gap-2 text-sm"

export interface StyledBreadcrumbProps extends Omit<
  Parameters<typeof Breadcrumb.Root>[0],
  "class"
> {
  class?: string
}

export function StyledBreadcrumb(props: StyledBreadcrumbProps) {
  const className = () => twMerge(ROOT_CLASSES, props.class)

  return <Breadcrumb.Root {...props} class={className()} />
}
