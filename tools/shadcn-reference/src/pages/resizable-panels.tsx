import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"

export default function ResizablePage() {
  return (
    <ResizablePanelGroup direction="horizontal" className="w-full max-w-md rounded-lg border">
      <ResizablePanel defaultSize={50} minSize={20}>
        <div className="flex h-full items-center justify-center p-4 text-sm font-medium">
          Panel 1
        </div>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={50} minSize={20}>
        <div className="flex h-full items-center justify-center p-4 text-sm font-medium">
          Panel 2
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}
