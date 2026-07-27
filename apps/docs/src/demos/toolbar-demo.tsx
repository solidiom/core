import * as Toolbar from "@solidiom/toolbar"

export function ToolbarDemo() {
  return (
    <Toolbar.Root>
      <Toolbar.Button>Bold</Toolbar.Button>
      <Toolbar.Button>Italic</Toolbar.Button>
      <Toolbar.Separator />
      <Toolbar.Button>Link</Toolbar.Button>
    </Toolbar.Root>
  )
}

export const toolbarDemoCode = `import * as Toolbar from "@solidiom/toolbar"

function ToolbarExample() {
  return (
    <Toolbar.Root>
      <Toolbar.Button>Bold</Toolbar.Button>
      <Toolbar.Button>Italic</Toolbar.Button>
      <Toolbar.Separator />
      <Toolbar.Button>Link</Toolbar.Button>
    </Toolbar.Root>
  )
}`
