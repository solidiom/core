/**
 * ToggleButton — A variant that accepts a pressed state and handles
 * aria-pressed, suitable for UI toggles like bold/italic formatting buttons.
 */
import { type JSX } from "@solidjs/web"
export interface ToggleButtonProps {
  children: JSX.Element
  /** Whether the toggle is currently pressed/active. */
  pressed: boolean
  /** Called when the pressed state should change. */
  onPressedChange?: (pressed: boolean) => void
  disabled?: boolean
  loading?: boolean
  class?: string
}
export declare function ToggleButton(props: ToggleButtonProps): JSX.Element
//# sourceMappingURL=toggle-button.d.ts.map
