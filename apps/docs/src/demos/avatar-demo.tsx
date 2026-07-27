import * as Avatar from "@solidiom/avatar"

export function AvatarDemo() {
  return (
    <Avatar.Root>
      <Avatar.Image src="https://github.com/solidiom.png" alt="Avatar" />
      <Avatar.Fallback>SD</Avatar.Fallback>
    </Avatar.Root>
  )
}

export const avatarDemoCode = `import * as Avatar from "@solidiom/avatar"

function AvatarExample() {
  return (
    <Avatar.Root>
      <Avatar.Image src="https://github.com/solidiom.png" alt="Avatar" />
      <Avatar.Fallback>SD</Avatar.Fallback>
    </Avatar.Root>
  )
}`
