/**
 * @solidiom/recipes-tailwind — Tailwind recipe profiles for Solidiom primitives.
 *
 * Dual emission:
 *   - Raw stylesheets: Tailwind @apply + data-* attribute selectors
 *   - TSX wrappers: pre-styled component wrappers with Tailwind utility classes
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
export { typeset, type TypesetKey } from "./recipes/typeset"
export { StyledSpinner } from "./recipes/spinner"
export { StyledCard } from "./recipes/card"
export { StyledBreadcrumb } from "./recipes/breadcrumb"
export { StyledPagination } from "./recipes/pagination"
export { StyledDataTable } from "./recipes/data-table"
export { StyledProgress } from "./recipes/progress"
export { StyledRadioGroup } from "./recipes/radio-group"
export { StyledCombobox } from "./recipes/combobox"
export { StyledSheet } from "./recipes/sheet"
export { StyledNavigationMenu } from "./recipes/navigation-menu"
export { StyledCommandPalette } from "./recipes/command-palette"
export { StyledKbd } from "./recipes/kbd"
export { StyledResizablePanels } from "./recipes/resizable-panels"
export { StyledScrollArea } from "./recipes/scroll-area"
export { StyledToolbar } from "./recipes/toolbar"
export { StyledField } from "./recipes/field"
export { StyledInput } from "./recipes/input"
export { StyledMeter } from "./recipes/meter"
