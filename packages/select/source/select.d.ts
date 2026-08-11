/**
 * Select primitive — trigger + listbox with single/multiple selection,
 * keyboard navigation, typeahead, hidden form control, positioning port.
 *
 * Parts: Root, Trigger, Content (listbox), Item, ItemText, ItemIndicator, Value, HiddenInput.
 */
import { type Accessor } from "solid-js"
import { type JSX } from "@solidjs/web"
import { type ChangeDetails, type DisclosureReason } from "@solidiom/runtime"
import { type SelectReason } from "./select-context"
export interface SelectRootProps {
  /** Controlled open state. */
  open?: Accessor<boolean>
  defaultOpen?: boolean
  onOpenChange?: (open: boolean, details: ChangeDetails<DisclosureReason>) => void
  /** Controlled value. */
  value?: Accessor<string | string[] | undefined>
  defaultValue?: string | string[]
  onValueChange?: (value: string | string[], details: ChangeDetails<SelectReason>) => void
  /** Multiple selection mode. */
  multiple?: boolean
  /** Disabled state. */
  disabled?: Accessor<boolean>
  /** Form field name for hidden input. */
  name?: string
  children: JSX.Element
}
export declare function Root(props: SelectRootProps): JSX.Element
export interface SelectTriggerProps {
  /** Accessible name for the trigger when no visible label is present. */
  "aria-label"?: string
  /** ID reference to an external visible label. */
  "aria-labelledby"?: string
  children: JSX.Element
  ref?: (el: HTMLButtonElement) => void
}
export declare function Trigger(props: SelectTriggerProps): JSX.Element
export interface SelectContentProps {
  children: JSX.Element
  ref?: (el: HTMLDivElement) => void
}
export declare function Content(props: SelectContentProps): JSX.Element
export interface SelectItemProps {
  /** Unique value for this item. */
  value: string
  /** Text for typeahead matching. Defaults to value. */
  textValue?: string
  /** Disabled state. */
  disabled?: boolean
  children: JSX.Element
}
export declare function Item(props: SelectItemProps): JSX.Element
export interface SelectValueProps {
  /** Placeholder when no value is selected. */
  placeholder?: string
}
export declare function Value(props: SelectValueProps): JSX.Element
export declare function HiddenInput(): JSX.Element
/** Props for the select scroll up button. */
export interface SelectScrollUpButtonProps {
  class?: string
  style?: JSX.CSSProperties | string
  children?: JSX.Element
}
/**
 * ScrollUpButton — displays at the top of scrollable content to indicate
 * more items above. Scrolls the listbox up on pointer hover.
 */
export declare function ScrollUpButton(props: SelectScrollUpButtonProps): JSX.Element
/** Props for the select scroll down button. */
export interface SelectScrollDownButtonProps {
  class?: string
  style?: JSX.CSSProperties | string
  children?: JSX.Element
}
/**
 * ScrollDownButton — displays at the bottom of scrollable content to indicate
 * more items below. Scrolls the listbox down on pointer hover.
 */
export declare function ScrollDownButton(props: SelectScrollDownButtonProps): JSX.Element
//# sourceMappingURL=select.d.ts.map
