import * as ScrollArea from "@solidiom/scroll-area"

export function ScrollAreaDemo() {
  const items = Array.from({ length: 50 }, (_, i) => `Item ${i + 1}`)

  return (
    <ScrollArea.Root type="hover" class="h-[200px] w-[300px] rounded-lg border border-zinc-200">
      <ScrollArea.Viewport class="h-full w-full p-3" style={{ height: "100%", width: "100%" }}>
        <div class="space-y-2">
          {items.map((item) => (
            <div class="rounded-md bg-zinc-50 px-3 py-2 text-sm">{item}</div>
          ))}
        </div>
      </ScrollArea.Viewport>
      <ScrollArea.Scrollbar orientation="vertical" class="p-0.5">
        <ScrollArea.Thumb class="rounded-full bg-zinc-400/50 hover:bg-zinc-400" />
      </ScrollArea.Scrollbar>
    </ScrollArea.Root>
  )
}

export const scrollAreaDemoCode = `import * as ScrollArea from "@solidiom/scroll-area"

function ScrollableList() {
  return (
    <ScrollArea.Root type="hover" class="h-[300px]">
      <ScrollArea.Viewport class="h-full p-4">
        {/* Long content */}
      </ScrollArea.Viewport>
      <ScrollArea.Scrollbar orientation="vertical">
        <ScrollArea.Thumb />
      </ScrollArea.Scrollbar>
    </ScrollArea.Root>
  )
}
`
