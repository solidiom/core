import { useLinkState } from "@solidjs/router"
import type { RouteSectionProps } from "@solidjs/router"

/**
 * Root layout rendered as the router's render-prop child (the 2.x replacement
 * for the old `<Router root={App}>` prop). Route children are passed in via
 * `props.children`. Route definitions live in src/index.tsx.
 */
export default function App(props: RouteSectionProps) {
  const homeLink = useLinkState(() => "/")

  return (
    <div class="min-h-screen">
      <header class="flex items-center justify-between border-b p-4">
        <h1 class="text-lg font-semibold">Solidiom Starter</h1>
        <nav class="flex gap-4">
          {/* Router 2.x has no <A> component: plain anchors are claimed by the
              router, and useLinkState provides the old `end`-match state for
              conditional styling. */}
          <a
            href="/"
            class={{ "font-semibold": homeLink.current() }}
            aria-current={homeLink.current() ? "page" : undefined}
          >
            Home
          </a>
          <a href="/about">About</a>
        </nav>
      </header>
      <main class="p-4">{props.children}</main>
    </div>
  )
}
