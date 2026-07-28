/**
 * SiteHeader — responsive global header and primary navigation.
 *
 * Desktop (≥ the "md" breakpoint, driven by CSS): a horizontal
 * `@solidiom/navigation-menu` bar with plain links and one dropdown
 * ("Resources") built from Item/Trigger/Content.
 *
 * Mobile: a hamburger `@solidiom/button` IconButton opens a
 * `@solidiom/drawer` sliding in from the left containing the same link set
 * as a simple, flat list (no nested dropdown — flattened for a small
 * viewport per usual responsive-nav practice).
 *
 * This is a single Solid island (see SiteHeader.astro), hydrated with
 * `client:load` because the mobile drawer trigger must be interactive
 * immediately; there is no meaningful non-interactive fallback for a
 * hamburger menu.
 */
import { createSignal, For } from "solid-js"
import * as Button from "@solidiom/button"
import * as NavigationMenu from "@solidiom/navigation-menu"
import * as Drawer from "@solidiom/drawer"

export interface NavLink {
  label: string
  href: string
}

export interface SiteHeaderProps {
  /** Primary flat links, rendered before the "Resources" dropdown. */
  links: NavLink[]
  /** Links shown inside the desktop "Resources" dropdown / mobile sublist. */
  resourceLinks: NavLink[]
  /** Current pathname, used to mark the active link. */
  pathname: string
  /** Home/logo href. Defaults to "/". */
  homeHref?: string
}

export function SiteHeader(props: SiteHeaderProps) {
  const [mobileOpen, setMobileOpen] = createSignal(false)
  const homeHref = () => props.homeHref ?? "/"
  const isActive = (href: string) => props.pathname === href

  return (
    <header class="site-header">
      <div class="site-header__bar">
        <a href={homeHref()} class="site-header__brand">
          Solidiom
        </a>

        <nav class="site-header__desktop-nav" aria-hidden="false">
          <NavigationMenu.Root aria-label="Primary">
            <NavigationMenu.List>
              <For each={props.links}>
                {(link) => (
                  <li role="none">
                    <NavigationMenu.Link href={link.href} active={isActive(link.href)}>
                      {link.label}
                    </NavigationMenu.Link>
                  </li>
                )}
              </For>
              <NavigationMenu.Item value="resources">
                <NavigationMenu.Trigger>Resources</NavigationMenu.Trigger>
                <NavigationMenu.Content>
                  <ul class="site-header__dropdown-list">
                    <For each={props.resourceLinks}>
                      {(link) => (
                        <li>
                          <NavigationMenu.Link href={link.href} active={isActive(link.href)}>
                            {link.label}
                          </NavigationMenu.Link>
                        </li>
                      )}
                    </For>
                  </ul>
                </NavigationMenu.Content>
              </NavigationMenu.Item>
            </NavigationMenu.List>
          </NavigationMenu.Root>
        </nav>

        <div class="site-header__mobile-trigger">
          <Drawer.Root open={mobileOpen} onOpenChange={setMobileOpen} side="left">
            <Drawer.Trigger>
              <Button.IconButton aria-label="Open menu">
                <span class="site-header__hamburger" aria-hidden="true">
                  <span />
                  <span />
                  <span />
                </span>
              </Button.IconButton>
            </Drawer.Trigger>
            <Drawer.Backdrop class="site-header__drawer-backdrop" />
            <Drawer.Content class="site-header__drawer-content">
              <div class="site-header__drawer-header">
                <Drawer.Title class="site-header__drawer-title">Menu</Drawer.Title>
                <Drawer.Close>
                  <Button.IconButton aria-label="Close menu">
                    <span aria-hidden="true">×</span>
                  </Button.IconButton>
                </Drawer.Close>
              </div>
              <Drawer.Description class="site-header__drawer-description">
                Site navigation
              </Drawer.Description>
              <nav aria-label="Primary" class="site-header__drawer-nav">
                <ul>
                  <For each={props.links}>
                    {(link) => (
                      <li>
                        <a
                          href={link.href}
                          aria-current={isActive(link.href) ? "page" : undefined}
                          onClick={() => setMobileOpen(false)}
                        >
                          {link.label}
                        </a>
                      </li>
                    )}
                  </For>
                </ul>
                <p class="site-header__drawer-group-label">Resources</p>
                <ul>
                  <For each={props.resourceLinks}>
                    {(link) => (
                      <li>
                        <a
                          href={link.href}
                          aria-current={isActive(link.href) ? "page" : undefined}
                          onClick={() => setMobileOpen(false)}
                        >
                          {link.label}
                        </a>
                      </li>
                    )}
                  </For>
                </ul>
              </nav>
            </Drawer.Content>
          </Drawer.Root>
        </div>
      </div>
    </header>
  )
}
