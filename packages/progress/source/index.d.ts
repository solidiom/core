/**
 * @solidiom/progress — Headless progress indicator primitive.
 *
 * Parts: Root, Indicator.
 *
 * Supports determinate (value 0–100) and indeterminate (value=null) modes.
 * Emits semantic data attributes and ARIA progressbar role.
 */
import { type JSX } from "@solidjs/web"
export interface ProgressRootProps {
  /** Current value (0–max). Pass `null` for indeterminate. */
  value: number | null
  /** Maximum value. Defaults to 100. */
  max?: number
  /** Accessible label for the progress bar. */
  "aria-label"?: string
  /** ID of an element that labels this progress bar. */
  "aria-labelledby"?: string
  class?: string
  style?: JSX.CSSProperties | string
  children?: JSX.Element
}
/**
 * Progress root — renders a `div` with `role="progressbar"` and ARIA value attributes.
 *
 * Emits `data-scope="progress"`, `data-part="root"`, `data-state="loading"|"complete"`.
 */
export declare function Root(props: ProgressRootProps): JSX.Element
export interface ProgressIndicatorProps {
  class?: string
  style?: JSX.CSSProperties | string
  children?: JSX.Element
}
/**
 * Progress indicator — the visual fill element.
 *
 * Consumers typically style this with `width: var(--progress-value)%` or read
 * `data-value` from the parent root. The indicator receives its own semantic attrs.
 */
export declare function Indicator(props: ProgressIndicatorProps): JSX.Element
//# sourceMappingURL=index.d.ts.map
