import * as Panels from "@solidiom/resizable-panels"

export function ResizablePanelsDemo() {
  return (
    <Panels.PanelGroup
      direction="horizontal"
      class="h-48 w-full rounded-lg border border-[hsl(var(--border))] overflow-hidden"
    >
      <Panels.Panel
        defaultSize={30}
        class="flex items-center justify-center bg-[hsl(var(--muted))] p-4"
      >
        <span class="text-sm text-[hsl(var(--muted-foreground))]">Sidebar</span>
      </Panels.Panel>
      <Panels.Handle
        index={0}
        class="w-2 bg-[hsl(var(--border))] hover:bg-[hsl(var(--primary))] transition-colors cursor-col-resize"
      />
      <Panels.Panel defaultSize={70} class="flex items-center justify-center p-4">
        <span class="text-sm text-[hsl(var(--muted-foreground))]">Main Content</span>
      </Panels.Panel>
    </Panels.PanelGroup>
  )
}

export const resizablePanelsDemoCode = `import * as Panels from "@solidiom/resizable-panels"

function ResizablePanelsExample() {
  return (
    <Panels.PanelGroup direction="horizontal">
      <Panels.Panel defaultSize={30}>Sidebar</Panels.Panel>
      <Panels.Handle index={0} />
      <Panels.Panel defaultSize={70}>Main Content</Panels.Panel>
    </Panels.PanelGroup>
  )
}`
