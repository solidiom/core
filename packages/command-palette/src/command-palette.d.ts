/**
 * Command palette primitive — modal combobox overlay with filtering,
 * keyboard navigation, group support, empty state, focus trapping,
 * and dismissable layer.
 *
 * Parts: Root, Input, List (listbox), Group, Item, Empty.
 */
import { type Accessor } from "solid-js"
import { type JSX } from "@solidjs/web"
import { type ChangeDetails, type DisclosureReason } from "@solidiom/runtime"
export interface CommandPaletteRootProps {
  /** Controlled open state. */
  open?: Accessor<boolean>
  defaultOpen?: boolean
  onOpenChange?: (open: boolean, details: ChangeDetails<DisclosureReason>) => void
  /** Controlled input value. */
  inputValue?: Accessor<string>
  defaultInputValue?: string
  onInputValueChange?: (value: string) => void
  children: JSX.Element
  class?: string
  style?: JSX.CSSProperties | string
}
/**
 * Root provider — composes modal dialog state, input value, and collection.
 * Renders the portal/overlay wrapper and manages focus trapping + dismiss.
 */
export declare function Root(props: CommandPaletteRootProps): JSX.Element
export interface CommandPaletteInputProps {
  /** Placeholder text. */
  placeholder?: string
  /** Called on each input change to trigger filtering. */
  onFilter?: (value: string) => void
  ref?: (el: HTMLInputElement) => void
  class?: string
  style?: JSX.CSSProperties | string
}
/** Filter input — triggers filtering callback and manages keyboard navigation. */
export declare function Input(props: CommandPaletteInputProps): JSX.Element
export interface CommandPaletteListProps {
  children: JSX.Element
  ref?: (el: HTMLDivElement) => void
  class?: string
  style?: JSX.CSSProperties | string
}
/** Listbox container for items and groups. */
export declare function List(props: CommandPaletteListProps): JSX.Element
export interface CommandPaletteGroupProps {
  /** Group heading label. */
  heading?: string
  children: JSX.Element
  class?: string
}
/** Groups items under a heading. */
export declare function Group(props: CommandPaletteGroupProps): JSX.Element
export interface CommandPaletteItemProps {
  /** Unique value/identifier for this command. */
  value: string
  /** Text value for filtering. Defaults to value. */
  textValue?: string
  /** Disabled state. */
  disabled?: boolean
  /** Called when the command is executed (Enter or click). */
  onSelect?: () => void
  children: JSX.Element
  class?: string
}
/** Individual command item — registers in collection, triggers onSelect. */
export declare function Item(props: CommandPaletteItemProps): JSX.Element
export interface CommandPaletteEmptyProps {
  children: JSX.Element
  class?: string
}
/** Rendered when no items match the filter. */
export declare function Empty(props: CommandPaletteEmptyProps): JSX.Element
//# sourceMappingURL=command-palette.d.ts.map
