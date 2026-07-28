/**
 * DocsMobileNav — hamburger-triggered drawer exposing the docs sidebar on
 * viewports below the desktop breakpoint (768px, matching SiteHeader).
 *
 * Mirrors SiteHeader.tsx's mobile pattern (a `@solidiom/drawer` Trigger,
 * styled directly via its own `class` prop, sliding a panel in from the
 * left) rather than introducing a new interaction, per the Global DoD's
 * expectation of using Solidiom primitives consistently across the shell.
 * `Drawer.Trigger`/`Drawer.Close` render their own `<button>` — they are
 * NOT wrapped in a `@solidiom/button` `IconButton`, since a `<button>`
 * cannot contain another `<button>` (the browser's HTML parser splits
 * nested buttons into siblings, silently breaking the outer one's click
 * handling). This is a separate island from the desktop sidebar (rendered
 * statically in DocsLayout.astro) rather than one island rendering both:
 * the desktop sidebar has no interactivity of its own today, so hydrating
 * it would cost JS for no behavior.
 */
import { createSignal, For, Show } from "solid-js"
import * as Drawer from "@solidiom/drawer"
import type { DocsSidebarGroup } from "../lib/docs-nav"

export interface DocsMobileNavProps {
  groups: DocsSidebarGroup[]
  pathname: string
}

export function DocsMobileNav(props: DocsMobileNavProps) {
  const [open, setOpen] = createSignal(false)
  const isActive = (href: string) => props.pathname === href

  return (
    <Drawer.Root open={open} onOpenChange={setOpen} side="left">
      <Drawer.Trigger class="docs-mobile-nav__trigger" aria-label="Open documentation navigation">
        <span class="docs-mobile-nav__hamburger" aria-hidden="true">
          <span />
          <span />
          <span />
        </span>
      </Drawer.Trigger>
      <Drawer.Backdrop class="docs-mobile-nav__drawer-backdrop" />
      <Drawer.Content class="docs-mobile-nav__drawer-content">
        <div class="docs-mobile-nav__drawer-header">
          <Drawer.Title class="docs-mobile-nav__drawer-title">Documentation</Drawer.Title>
          <Drawer.Close
            class="docs-mobile-nav__trigger"
            aria-label="Close documentation navigation"
          >
            <span aria-hidden="true">×</span>
          </Drawer.Close>
        </div>
        <Drawer.Description class="docs-mobile-nav__drawer-description">
          Browse documentation sections
        </Drawer.Description>
        <nav aria-label="Documentation" class="docs-mobile-nav__nav">
          <For each={props.groups}>
            {(group) => (
              <div class="docs-mobile-nav__group">
                <p class="docs-mobile-nav__group-label">{group.label}</p>
                <ul>
                  <For each={group.links}>
                    {(link) => (
                      <li>
                        <a
                          href={link.href}
                          aria-current={isActive(link.href) ? "page" : undefined}
                          onClick={() => setOpen(false)}
                        >
                          {link.label}
                        </a>
                      </li>
                    )}
                  </For>
                </ul>
              </div>
            )}
          </For>
          <Show when={props.groups.length === 0}>
            <p class="docs-mobile-nav__empty">No documentation sections yet.</p>
          </Show>
        </nav>
      </Drawer.Content>
    </Drawer.Root>
  )
}
