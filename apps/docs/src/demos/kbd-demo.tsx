import * as Kbd from "@solidiom/kbd"

export function KbdDemo() {
  return <Kbd.Root>Ctrl+K</Kbd.Root>
}

export const kbdDemoCode = `import * as Kbd from "@solidiom/kbd"

function KbdExample() {
  return (
    <Kbd.Root>Ctrl+K</Kbd.Root>
  )
}`
