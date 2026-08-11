/**
 * @solidiom/navigation-menu — A top-level navigation component with accessible dropdown sub-menus.
 *
 * Parts: Root, List, Item, Trigger, Content, Link.
 */
import { type Accessor } from "solid-js"
import { type JSX } from "@solidjs/web"
import { type PositioningPort } from "./navigation-menu-context"
export type { PositioningPort } from "./navigation-menu-context"
export interface NavigationMenuRootProps {
  /** Default active item value (uncontrolled). */
  defaultValue?: string
  /** Controlled active value. */
  value?: Accessor<string | undefined>
  /** Called when active value changes. */
  onValueChange?: (value: string) => void
  /** Orientation of the navigation bar. Default "horizontal". */
  orientation?: "horizontal" | "vertical"
  /** Delay for pointer intent (ms). Default 200. */
  delayDuration?: number
  /** Optional positioning adapter for dropdown panels. */
  positioning?: PositioningPort
  /** Accessible label for the nav element. */
  "aria-label"?: string
  class?: string
  style?: JSX.CSSProperties | string
  children?: JSX.Element
}
/**
 * NavigationMenu root — wraps the navigation in a `<nav>` element.
 *
 * Emits `data-scope="navigation-menu"`, `data-part="root"`.
 */
export declare function Root(props: NavigationMenuRootProps): JSX.Element
export interface NavigationMenuListProps {
  class?: string
  style?: JSX.CSSProperties | string
  children?: JSX.Element
}
/**
 * NavigationMenu list — the menubar container for trigger items.
 *
 * Emits `data-scope="navigation-menu"`, `data-part="list"`.
 */
export declare function List(props: NavigationMenuListProps): JSX.Element
export interface NavigationMenuItemProps {
  /** Unique value for this navigation item. */
  value: string
  class?: string
  style?: JSX.CSSProperties | string
  children?: JSX.Element
}
/**
 * NavigationMenu item — wraps a trigger and its content.
 *
 * Emits `data-scope="navigation-menu"`, `data-part="item"`.
 */
export declare function Item(props: NavigationMenuItemProps): JSX.Element
export interface NavigationMenuTriggerProps {
  class?: string
  style?: JSX.CSSProperties | string
  children?: JSX.Element
}
/**
 * NavigationMenu trigger — button that opens the associated content panel.
 *
 * Emits `data-scope="navigation-menu"`, `data-part="trigger"`, `data-state="open"|"closed"`.
 */
export declare function Trigger(props: NavigationMenuTriggerProps): JSX.Element
export interface NavigationMenuContentProps {
  class?: string
  style?: JSX.CSSProperties | string
  children?: JSX.Element
}
/**
 * NavigationMenu content — dropdown panel for a navigation item.
 *
 * Emits `data-scope="navigation-menu"`, `data-part="content"`, `data-state="open"|"closed"`.
 */
export declare function Content(props: NavigationMenuContentProps): JSX.Element
export interface NavigationMenuLinkProps {
  /** Whether this link represents the current page. */
  active?: boolean
  /** Link href. */
  href?: string
  class?: string
  style?: JSX.CSSProperties | string
  children?: JSX.Element
  /** Called on click. */
  onClick?: (e: MouseEvent) => void
}
/**
 * NavigationMenu link — an accessible link inside a content panel.
 *
 * Emits `data-scope="navigation-menu"`, `data-part="link"`, `data-active` when active.
 */
export declare function Link(props: NavigationMenuLinkProps): JSX.Element
//# sourceMappingURL=index.d.ts.map
