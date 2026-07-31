import { createRootRoute, HeadContent, Outlet, Scripts } from "@tanstack/solid-router"
import "../index.css"

/**
 * Root route rendered by TanStack Start for every request. This is the
 * document shell — there is no index.html in this template (unlike the
 * client-only vite-solid-router template): TanStack Start generates its
 * own HTML shell from this component via `<HeadContent/>`/`<Scripts/>`.
 */
export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "{{projectName}}" },
    ],
  }),
  component: RootComponent,
})

function RootComponent() {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <div class="min-h-screen">
          <header class="flex items-center justify-between border-b p-4">
            <h1 class="text-lg font-semibold">Solidiom Starter (SSR)</h1>
            <nav class="flex gap-4">
              <a href="/">Home</a>
              <a href="/about">About</a>
            </nav>
          </header>
          <main class="p-4">
            <Outlet />
          </main>
        </div>
        <Scripts />
      </body>
    </html>
  )
}
