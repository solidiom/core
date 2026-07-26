/**
 * Accordion context — shared state between Accordion parts.
 */

import { createContext, useContext, type Accessor } from "solid-js"
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

export const AccordionContext = createContext<AccordionContextValue>()
export const AccordionItemContext = createContext<AccordionItemContextValue>()

/** Access the root accordion context. Throws if used outside Root. */
export function useAccordionContext(): AccordionContextValue {
  const ctx = useContext(AccordionContext)
  if (!ctx) {
    throw new Error("[solidiom] Accordion parts must be used within Accordion.Root")
  }
  return ctx
}

/** Access the item-level accordion context. Throws if used outside Item. */
export function useAccordionItemContext(): AccordionItemContextValue {
  const ctx = useContext(AccordionItemContext)
  if (!ctx) {
    throw new Error("[solidiom] Accordion.Trigger/Content must be used within Accordion.Item")
  }
  return ctx
}
