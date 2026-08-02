import { type JSX } from "@solidjs/web"

interface BuilderLayoutProps {
  header: JSX.Element
  children: JSX.Element
}

export function BuilderLayout(props: BuilderLayoutProps) {
  return (
    <div class="theme-builder">
      {props.header}
      <div class="theme-builder__body">{props.children}</div>
    </div>
  )
}
