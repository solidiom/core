/**
 * @solidiom/switch — Headless toggle switch primitive.
 *
 * Parts: Root, Thumb.
 */
import { type Accessor } from "solid-js"
import { type JSX } from "@solidjs/web"
export interface SwitchRootProps {
  checked?: Accessor<boolean | undefined>
  defaultChecked?: boolean
  onCheckedChange?: (checked: boolean) => void
  disabled?: boolean
  class?: string
  style?: JSX.CSSProperties | string
  children: JSX.Element
}
export declare function Root(props: SwitchRootProps): JSX.Element
export interface SwitchThumbProps {
  class?: string
  style?: JSX.CSSProperties | string
  children?: JSX.Element
}
export declare function Thumb(props: SwitchThumbProps): JSX.Element
//# sourceMappingURL=index.d.ts.map
