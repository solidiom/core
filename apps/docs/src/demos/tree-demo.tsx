import * as Tree from "@solidiom/tree"

export function TreeDemo() {
  return (
    <Tree.Root class="w-64 rounded-lg border border-[hsl(var(--border))] p-2">
      <Tree.Branch>
        <Tree.Item
          id="src"
          class="flex items-center gap-2 rounded px-2 py-1 text-sm hover:bg-[hsl(var(--accent))] cursor-pointer"
        >
          <Tree.ItemIndicator>
            <span class="text-xs">▶</span>
          </Tree.ItemIndicator>
          <span>src</span>
        </Tree.Item>
        <Tree.Branch>
          <Tree.Item
            id="src/components"
            class="ml-4 flex items-center gap-2 rounded px-2 py-1 text-sm hover:bg-[hsl(var(--accent))] cursor-pointer"
          >
            <Tree.ItemIndicator>
              <span class="text-xs">▶</span>
            </Tree.ItemIndicator>
            <span>components</span>
          </Tree.Item>
          <Tree.Branch>
            <Tree.Item
              id="src/components/button.tsx"
              class="ml-8 rounded px-2 py-1 text-sm hover:bg-[hsl(var(--accent))] cursor-pointer"
            >
              button.tsx
            </Tree.Item>
            <Tree.Item
              id="src/components/dialog.tsx"
              class="ml-8 rounded px-2 py-1 text-sm hover:bg-[hsl(var(--accent))] cursor-pointer"
            >
              dialog.tsx
            </Tree.Item>
          </Tree.Branch>
        </Tree.Branch>
        <Tree.Branch>
          <Tree.Item
            id="src/utils"
            class="ml-4 flex items-center gap-2 rounded px-2 py-1 text-sm hover:bg-[hsl(var(--accent))] cursor-pointer"
          >
            <Tree.ItemIndicator>
              <span class="text-xs">▶</span>
            </Tree.ItemIndicator>
            <span>utils</span>
          </Tree.Item>
        </Tree.Branch>
      </Tree.Branch>
    </Tree.Root>
  )
}

export const treeDemoCode = `import * as Tree from "@solidiom/tree"

function TreeExample() {
  return (
    <Tree.Root>
      <Tree.Branch>
        <Tree.Item id="src">
          <Tree.ItemIndicator>▶</Tree.ItemIndicator>
          src
        </Tree.Item>
        <Tree.Branch>
          <Tree.Item id="src/components">components</Tree.Item>
          <Tree.Branch>
            <Tree.Item id="button.tsx">button.tsx</Tree.Item>
          </Tree.Branch>
        </Tree.Branch>
      </Tree.Branch>
    </Tree.Root>
  )
}`
