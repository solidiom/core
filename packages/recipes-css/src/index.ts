/**
 * @solidiom/recipes-css — Plain CSS recipe profiles for Solidiom primitives.
 *
 * Dual emission:
 *   - Raw stylesheets: importable CSS files targeting data-* semantic attributes
 *   - TSX wrappers: pre-styled component wrappers composing primitive + stylesheet classes
 */

export { recipeProfile, supportedPrimitives } from "./meta"

// TSX wrapper re-exports (component-shaped recipes)
export { StyledDialog } from "./recipes/dialog"
export { StyledButton, buttonVariants, type ButtonVariantProps } from "./recipes/button"
export { StyledCheckbox } from "./recipes/checkbox"
export { StyledSwitch } from "./recipes/switch"
export { StyledTabs } from "./recipes/tabs"
export { StyledAccordion } from "./recipes/accordion"
export { StyledPopover } from "./recipes/popover"
export { StyledTooltip } from "./recipes/tooltip"
export { StyledMenu } from "./recipes/menu"
export { StyledToast } from "./recipes/toast"
export { StyledSelect } from "./recipes/select"
export { StyledBadge, type BadgeVariant } from "./recipes/badge"
export { StyledAlert, type AlertVariant } from "./recipes/alert"
export { StyledAvatar } from "./recipes/avatar"
export { StyledSpinner } from "./recipes/spinner"
export { StyledCard } from "./recipes/card"
export { StyledBreadcrumb } from "./recipes/breadcrumb"
export { StyledPagination } from "./recipes/pagination"
export { StyledDataTable } from "./recipes/data-table"
export { StyledProgress } from "./recipes/progress"
