import * as Input from "@solidiom/input"

export function InputDemo() {
  return (
    <div>
      <Input.Root placeholder="Type here..." />
      <Input.Textarea placeholder="Enter text..." rows={3} />
    </div>
  )
}

export const inputDemoCode = `import * as Input from "@solidiom/input"

function InputExample() {
  return (
    <div>
      <Input.Root placeholder="Type here..." />
      <Input.Textarea placeholder="Enter text..." rows={3} />
    </div>
  )
}`
