import type { Element } from "solid-js"
import { Header } from "./header"
import { Sidebar } from "./sidebar"

export function Layout(props: { children?: Element }) {
  return (
    <div class="relative flex min-h-screen flex-col">
      <Header />
      <div class="flex-1">
        <div class="container mx-auto flex max-w-screen-2xl gap-0 px-4 md:px-8">
          <Sidebar />
          <main class="flex-1 overflow-hidden py-6 md:py-8 md:pl-8">{props.children}</main>
        </div>
      </div>
    </div>
  )
}
