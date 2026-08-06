/**
 * Styled Pagination — CSS recipe wrapper.
 * Import the stylesheet separately: `import "@solidiom/recipes-css/styles/pagination.css"`
 */
import * as Pagination from "@solidiom/pagination"

export { Pagination }

const BASE_CLASS = "solidiom-pagination"

export interface StyledPaginationProps
  extends Omit<Parameters<typeof Pagination.Root>[0], "class"> {
  class?: string
}

export function StyledPagination(props: StyledPaginationProps) {
  const className = () =>
    [BASE_CLASS, props.class].filter(Boolean).join(" ")

  return <Pagination.Root {...props} class={className()} />
}