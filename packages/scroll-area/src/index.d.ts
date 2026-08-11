/**
 * @solidiom/scroll-area — Custom-styled scrollbar with native scrolling performance.
 *
 * Parts: Root, Viewport, Scrollbar, Thumb.
 */
import { type JSX } from "@solidjs/web"
export interface ScrollAreaRootProps {
  /** Scrollbar visibility: "auto" | "always" | "hover" | "scroll". Default "hover". */
  type?: "auto" | "always" | "hover" | "scroll"
  /** Hide delay in ms for hover/scroll modes. Default 600. */
  scrollHideDelay?: number
  class?: string
  style?: JSX.CSSProperties | string
  children?: JSX.Element
}
/**
 * ScrollArea root — wraps viewport and scrollbars.
 *
 * Emits `data-scope="scroll-area"`, `data-part="root"`.
 */
export declare function Root(props: ScrollAreaRootProps): JSX.Element
export interface ScrollAreaViewportProps {
  class?: string
  style?: JSX.CSSProperties | string
  children?: JSX.Element
}
/**
 * ScrollArea viewport — the scrollable container. Hides native scrollbars.
 *
 * Emits `data-scope="scroll-area"`, `data-part="viewport"`.
 */
export declare function Viewport(props: ScrollAreaViewportProps): JSX.Element
export interface ScrollAreaScrollbarProps {
  /** Scrollbar orientation. */
  orientation?: "vertical" | "horizontal"
  class?: string
  style?: JSX.CSSProperties | string
  children?: JSX.Element
}
/**
 * ScrollArea scrollbar — the track for the scroll thumb.
 *
 * Emits `data-scope="scroll-area"`, `data-part="scrollbar"`, `data-orientation`.
 */
export declare function Scrollbar(props: ScrollAreaScrollbarProps): JSX.Element
export interface ScrollAreaThumbProps {
  class?: string
  style?: JSX.CSSProperties | string
}
/**
 * ScrollArea thumb — the draggable scroll indicator.
 *
 * Emits `data-scope="scroll-area"`, `data-part="thumb"`.
 */
export declare function Thumb(props: ScrollAreaThumbProps): JSX.Element
//# sourceMappingURL=index.d.ts.map
