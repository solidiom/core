import * as VirtualList from "@solidiom/virtual-list"
import type { Locale } from "../lib/locale"

const COPY: Record<Locale, { prefix: string }> = {
  en: { prefix: "Item" },
  es: { prefix: "Elemento" },
}

export interface VirtualListExampleProps {
  locale: Locale
}

/**
 * Canonical executable source for the Virtual List documentation example.
 * Demonstrates efficient rendering of a large list with virtualization.
 */
export function VirtualListExample(props: VirtualListExampleProps) {
  const copy = () => COPY[props.locale]

  return (
    <div
      ref={(element) => element.setAttribute("data-hydrated", "true")}
      class="virtual-list-example"
      data-virtual-list-example
    >
      <VirtualList.Root totalCount={1000} itemSize={40} height="200px">
        {(items) =>
          items().map((item) => (
            <VirtualList.Item item={item}>
              {copy().prefix} {item.index + 1}
            </VirtualList.Item>
          ))
        }
      </VirtualList.Root>
    </div>
  )
}
