/**
 * Accordion context — shared state between Accordion parts.
 */
import { type Accessor } from "solid-js"
import type { ChangeDetails, Collection } from "@solidiom/runtime"
/** Reason for an accordion value change. */
export type AccordionReason = "trigger-click" | "keyboard"
export interface AccordionContextValue {
  /** Currently expanded item value(s). */
  value: Accessor<string[]>
  /** Request value change. */
  requestValueChange: (next: string[], details: ChangeDetails<AccordionReason>) => void
  /** Whether multiple items can be expanded simultaneously. */
  multiple: boolean
  /** Whether the accordion is disabled. */
  disabled: Accessor<boolean>
  /** Collection instance for keyboard navigation. */
  collection: Collection
  /** Whether collapsible (single mode can collapse all). */
  collapsible: boolean
}
export interface AccordionItemContextValue {
  /** This item's value identifier. */
  value: string
  /** Whether this specific item is disabled. */
  disabled: Accessor<boolean>
  /** Whether this item is currently expanded. */
  isExpanded: Accessor<boolean>
  /** Generated trigger ID for aria-controls/labelledby. */
  triggerId: string
  /** Generated content region ID. */
  contentId: string
}
export declare const AccordionContext: import("solid-js").Context<AccordionContextValue>
export declare const AccordionItemContext: import("solid-js").Context<AccordionItemContextValue>
/** Access the root accordion context. Throws if used outside Root. */
export declare function useAccordionContext(): AccordionContextValue
/** Access the item-level accordion context. Throws if used outside Item. */
export declare function useAccordionItemContext(): AccordionItemContextValue
//# sourceMappingURL=accordion-context.d.ts.map
