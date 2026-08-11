/**
 * @solidiom/radio-group — Headless radio group primitive.
 *
 * Parts: Root, Item, Indicator.
 *
 * Implements WAI-ARIA radiogroup pattern with roving tabindex
 * keyboard navigation (Arrow keys move focus and select).
 */
import { type Accessor } from "solid-js"
import { type JSX } from "@solidjs/web"
export interface RadioGroupRootProps {
  /** Controlled value. */
  value?: Accessor<string | undefined>
  /** Default value (uncontrolled). */
  defaultValue?: string
  /** Called when the selected value changes. */
  onValueChange?: (value: string) => void
  /** Form field name for hidden inputs. */
  name?: string
  disabled?: boolean
  required?: boolean
  /** Layout orientation — affects arrow key navigation direction. */
  orientation?: "horizontal" | "vertical"
  class?: string
  style?: JSX.CSSProperties | string
  children: JSX.Element
}
/**
 * RadioGroup root — wraps radio items with `role="radiogroup"`.
 *
 * Emits `data-scope="radio-group"`, `data-part="root"`.
 */
export declare function Root(props: RadioGroupRootProps): JSX.Element
export interface RadioGroupItemProps {
  /** The value this item represents. */
  value: string
  disabled?: boolean
  class?: string
  style?: JSX.CSSProperties | string
  children: JSX.Element
}
/**
 * RadioGroup item — individual radio option with roving tabindex.
 *
 * Emits `data-scope="radio-group"`, `data-part="item"`, `data-state="checked"|"unchecked"`.
 */
export declare function Item(props: RadioGroupItemProps): JSX.Element
export interface RadioGroupIndicatorProps {
  class?: string
  style?: JSX.CSSProperties | string
  children?: JSX.Element
}
/**
 * RadioGroup indicator — visual indicator rendered inside an Item.
 * Only visible when the parent Item is checked.
 *
 * Must be placed as a child of `<Item>`. Reads checked state from
 * the nearest Item via DOM (checks parent's aria-checked).
 */
export declare function Indicator(props: RadioGroupIndicatorProps): JSX.Element
//# sourceMappingURL=index.d.ts.map
