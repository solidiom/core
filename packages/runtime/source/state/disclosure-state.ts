/**
 * Disclosure state — controllable open/close boolean for overlay and disclosure primitives.
 *
 * Built on top of createControllableValue. Used by Dialog, Popover, Collapsible,
 * Accordion panels, Select, Combobox, Menu, Tooltip, Drawer.
 */

import { type Accessor } from "solid-js"
import { createControllableValue, type ControllableValue } from "./controllable-value"
import type { ChangeDetails } from "../events/change-details"

/** Standard reasons for disclosure state changes. */
export type DisclosureReason =
  "trigger" | "close" | "escape-key" | "pointer-outside" | "focus-outside" | "programmatic"

/** Options for creating disclosure state. */
export interface DisclosureStateOptions {
  /** Controlled open state. */
  open?: Accessor<boolean | undefined>
  /** Default open state when uncontrolled. */
  defaultOpen?: boolean
  /** Called when open state change is requested. */
  onOpenChange?: (next: boolean, details: ChangeDetails<DisclosureReason>) => void
  /** Disables open/close transitions. */
  disabled?: Accessor<boolean>
}

/** Returned disclosure state interface. */
export interface DisclosureState {
  /** Whether the disclosure is currently open. */
  open: Accessor<boolean>
  /** Request an open state change with reason. */
  requestOpenChange: (next: boolean, details: ChangeDetails<DisclosureReason>) => void
}

/** Creates a controllable disclosure (open/close) state. */
export function createDisclosureState(options: DisclosureStateOptions = {}): DisclosureState {
  const controllable: ControllableValue<boolean, DisclosureReason> = createControllableValue({
    value: options.open,
    defaultValue: options.defaultOpen ?? false,
    onChange: options.onOpenChange,
    disabled: options.disabled,
  })

  return {
    open: controllable.value,
    requestOpenChange: controllable.requestChange,
  }
}
