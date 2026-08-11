/**
 * Styled Breadcrumb — CSS recipe wrapper.
 * Import the stylesheet separately: `import "@solidiom/recipes-css/styles/breadcrumb.css"`
 */
import * as Breadcrumb from "@solidiom/breadcrumb"

export { Breadcrumb }

const BASE_CLASS = "solidiom-breadcrumb"

export interface StyledBreadcrumbProps extends Omit<
  Parameters<typeof Breadcrumb.Root>[0],
  "class"
> {
  class?: string
}

export function StyledBreadcrumb(props: StyledBreadcrumbProps) {
  const className = () => [BASE_CLASS, props.class].filter(Boolean).join(" ")

  return <Breadcrumb.Root {...props} class={className()} />
}
