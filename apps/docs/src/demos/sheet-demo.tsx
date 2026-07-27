import * as Sheet from "@solidiom/sheet"

export function SheetDemo() {
  return (
    <Sheet.Root>
      <Sheet.Trigger>Open Sheet</Sheet.Trigger>
      <Sheet.Portal>
        <Sheet.Backdrop />
        <Sheet.Content>
          <Sheet.Title>Sheet Title</Sheet.Title>
          <Sheet.Description>Sheet description content.</Sheet.Description>
          <Sheet.Close>Close</Sheet.Close>
        </Sheet.Content>
      </Sheet.Portal>
    </Sheet.Root>
  )
}

export const sheetDemoCode = `import * as Sheet from "@solidiom/sheet"

function SheetExample() {
  return (
    <Sheet.Root>
      <Sheet.Trigger>Open Sheet</Sheet.Trigger>
      <Sheet.Portal>
        <Sheet.Backdrop />
        <Sheet.Content>
          <Sheet.Title>Sheet Title</Sheet.Title>
          <Sheet.Description>Sheet description content.</Sheet.Description>
          <Sheet.Close>Close</Sheet.Close>
        </Sheet.Content>
      </Sheet.Portal>
    </Sheet.Root>
  )
}`
