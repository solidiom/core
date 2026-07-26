/**
 * @solidiom/virtual-list — Headless viewport-windowed list primitive.
 *
 * Parts: Root (scroll container), Item (positioned child).
 * Also exports createVirtualizer() for standalone usage.
 */

export {
  Root,
  Item,
  createVirtualizer,
  type VirtualListRootProps,
  type VirtualListItemProps,
  type CreateVirtualizerOptions,
  type VirtualizerState,
} from "./virtual-list"

export {
  type VirtualConfig,
  type VirtualItem,
  type VirtualizationPort,
  type VirtualListContextValue,
} from "./virtual-list-context"
