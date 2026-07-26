import * as VirtualList from "@solidiom/virtual-list"
import { For } from "solid-js"

const items = Array.from({ length: 10000 }, (_, i) => `Item ${i + 1}`)

export function VirtualListDemo() {
  return (
    <div class="h-64 w-full overflow-hidden rounded-lg border border-[hsl(var(--border))]">
      <VirtualList.Root count={items.length} itemSize={36} class="h-full overflow-auto">
        {(virtualItems) => (
          <For each={virtualItems()}>
            {(item) => (
              <VirtualList.Item
                index={item.index}
                class="flex items-center px-4 text-sm border-b border-[hsl(var(--border))]"
                style={{ height: `${item.size}px` }}
              >
                {items[item.index]}
              </VirtualList.Item>
            )}
          </For>
        )}
      </VirtualList.Root>
    </div>
  )
}

export const virtualListDemoCode = `import * as VirtualList from "@solidiom/virtual-list"

const items = Array.from({ length: 10000 }, (_, i) => \`Item \${i + 1}\`)

function VirtualListExample() {
  return (
    <VirtualList.Root count={items.length} itemSize={36}>
      {(virtualItems) => (
        <For each={virtualItems()}>
          {(item) => (
            <VirtualList.Item index={item.index}>
              {items[item.index]}
            </VirtualList.Item>
          )}
        </For>
      )}
    </VirtualList.Root>
  )
}`
