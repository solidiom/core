import { A } from "@solidjs/router"
import type { RouteSectionProps } from "@solidjs/router"

/**
 * Root layout rendered by <Router root={App} />. Route children are passed
 * in via `props.children`. Registered in src/index.tsx alongside the
 * top-level <Route> definitions for Home and About.
 */
export default function App(props: RouteSectionProps) {
  return (
    <div class="min-h-screen">
      <header class="flex items-center justify-between border-b p-4">
        <h1 class="text-lg font-semibold">Solidiom Starter</h1>
        <nav class="flex gap-4">
          <A href="/" end>
            Home
          </A>
          <A href="/about">About</A>
        </nav>
      </header>
      <main class="p-4">{props.children}</main>
    </div>
  )
}
