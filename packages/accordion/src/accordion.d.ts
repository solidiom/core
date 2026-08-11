/**
 * Accordion primitive — expand/collapse panels with single or multiple mode,
 * keyboard navigation (Arrow Up/Down, Home/End, Enter/Space to toggle).
 *
 * Parts: Root, Item, Trigger, Content.
 */
import { type Accessor } from "solid-js"
import { type JSX } from "@solidjs/web"
import { type ChangeDetails } from "@solidiom/runtime"
import { type AccordionReason } from "./accordion-context"
/** Props for the accordion root container. */
export interface AccordionRootProps {
  /** Expand mode: "single" allows one open item, "multiple" allows many. */
  type?: "single" | "multiple"
  /** Controlled expanded value(s). */
  value?: Accessor<string[]>
  /** Default expanded value(s) for uncontrolled mode. */
  defaultValue?: string[]
  /** Called when expanded items change. */
  onValueChange?: (value: string[], details: ChangeDetails<AccordionReason>) => void
  /** Whether all items can be collapsed in single mode. Default: false. */
  collapsible?: boolean
  /** Disabled state for all items. */
  disabled?: Accessor<boolean>
  children: JSX.Element
}
/** Root container that provides accordion state context. */
export declare function Root(props: AccordionRootProps): JSX.Element
/** Props for an individual accordion item. */
export interface AccordionItemProps {
  /** Unique value identifying this item. */
  value: string
  /** Whether this item is disabled. */
  disabled?: boolean
  children: JSX.Element
}
/** Wraps a single collapsible section (trigger + content pair). */
export declare function Item(props: AccordionItemProps): JSX.Element
/** Props for the accordion item trigger button. */
export interface AccordionTriggerProps {
  children: JSX.Element
  ref?: (el: HTMLButtonElement) => void
}
/** Button that toggles its parent item's expanded state. */
export declare function Trigger(props: AccordionTriggerProps): JSX.Element
/** Props for the accordion item content region. */
export interface AccordionContentProps {
  children: JSX.Element
  class?: string
  style?: JSX.CSSProperties | string
}
/** Collapsible content region for an accordion item. */
export declare function Content(props: AccordionContentProps): JSX.Element
//# sourceMappingURL=accordion.d.ts.map
