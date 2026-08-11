/**
 * @solidiom/pagination — Page navigation.
 *
 * Parts: Root, Content, Item, PreviousButton, NextButton, Ellipsis.
 */
import { type JSX } from "@solidjs/web"
export interface RootProps {
  children: JSX.Element
  class?: string
}
export declare function Root(props: RootProps): JSX.Element
export interface ContentProps {
  children: JSX.Element
  class?: string
}
export declare function Content(props: ContentProps): JSX.Element
export interface ItemProps {
  children: JSX.Element
  class?: string
}
export declare function Item(props: ItemProps): JSX.Element
export interface PreviousButtonProps {
  children?: JSX.Element
  class?: string
  disabled?: boolean
  onClick?: JSX.EventHandlerUnion<HTMLButtonElement, MouseEvent>
}
export declare function PreviousButton(props: PreviousButtonProps): JSX.Element
export interface NextButtonProps {
  children?: JSX.Element
  class?: string
  disabled?: boolean
  onClick?: JSX.EventHandlerUnion<HTMLButtonElement, MouseEvent>
}
export declare function NextButton(props: NextButtonProps): JSX.Element
export interface EllipsisProps {
  children?: JSX.Element
  class?: string
}
export declare function Ellipsis(props: EllipsisProps): JSX.Element
//# sourceMappingURL=index.d.ts.map
