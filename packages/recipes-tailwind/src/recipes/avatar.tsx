/**
 * Styled Avatar — Tailwind recipe wrapper.
 * Import stylesheet: `import "@solidiom/recipes-tailwind/styles/avatar.css"`
 */
import { type JSX } from "@solidjs/web"
import * as Avatar from "@solidiom/avatar"

export function StyledAvatar(props: {
  src?: string
  alt?: string
  fallback?: string
  children?: JSX.Element
}) {
  return (
    <Avatar.Root>
      {props.src && <Avatar.Image src={props.src} alt={props.alt} />}
      {(props.fallback || props.children) && (
        <Avatar.Fallback>{props.fallback || props.children}</Avatar.Fallback>
      )}
    </Avatar.Root>
  )
}
