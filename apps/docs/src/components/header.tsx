import { A } from "@solidjs/router"
import { createSignal, Show } from "solid-js"
import { ThemeToggle } from "./theme-toggle"
import { IconGithub, IconMenu, IconX } from "./icons"
import { MobileSidebar } from "./mobile-sidebar"

export function Header() {
  const [mobileOpen, setMobileOpen] = createSignal(false)

  return (
    <>
      <header class="sticky top-0 z-50 w-full border-b border-[hsl(var(--border)/0.4)] bg-[hsl(var(--background)/0.95)] backdrop-blur">
        <div class="container mx-auto flex h-14 max-w-screen-2xl items-center px-4 md:px-8">
          {/* Logo */}
          <A href="/" class="mr-6 flex items-center space-x-2">
            <span class="font-bold">Solidiom</span>
          </A>

          {/* Desktop nav */}
          <nav class="hidden items-center gap-6 text-sm md:flex">
            <A
              href="/"
              class="text-[hsl(var(--foreground)/0.6)] transition-colors hover:text-[hsl(var(--foreground))]"
            >
              Docs
            </A>
            <A
              href="/primitives/dialog"
              class="text-[hsl(var(--foreground)/0.6)] transition-colors hover:text-[hsl(var(--foreground))]"
            >
              Components
            </A>
            <A
              href="/performance"
              class="text-[hsl(var(--foreground)/0.6)] transition-colors hover:text-[hsl(var(--foreground))]"
            >
              Performance
            </A>
          </nav>

          {/* Right side */}
          <div class="ml-auto flex items-center gap-2">
            <a
              href="https://github.com/openCenter-cloud/opencenter-solidiom"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center justify-center rounded-md size-9 hover:bg-[hsl(var(--accent))] hover:text-[hsl(var(--accent-foreground))] transition-colors"
              aria-label="GitHub"
            >
              <IconGithub class="size-4" />
            </a>
            <ThemeToggle />

            {/* Mobile menu button */}
            <button
              class="inline-flex items-center justify-center rounded-md size-9 hover:bg-[hsl(var(--accent))] md:hidden"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              {mobileOpen() ? <IconX class="size-5" /> : <IconMenu class="size-5" />}
            </button>
          </div>
        </div>
      </header>

      <Show when={mobileOpen()}>
        <MobileSidebar onClose={() => setMobileOpen(false)} />
      </Show>
    </>
  )
}
