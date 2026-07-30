/** Responsive global header and explicit locale-aware primary navigation. */
import { createSignal, For } from "solid-js"
import * as NavigationMenu from "@solidiom/navigation-menu"
import * as Drawer from "@solidiom/drawer"
import { ThemeToggle } from "./ThemeToggle"
import { LanguageSwitcher } from "./LanguageSwitcher"
import { SiteSearch } from "./SiteSearch"
import type { Locale } from "../lib/locale"

export interface NavLink {
  label: string
  href: string
}

export interface SiteHeaderProps {
  links: NavLink[]
  resourceLinks: NavLink[]
  pathname: string
  homeHref?: string
  locale?: Locale
  /** Verified equivalent route for the opposite locale. */
  alternatePath?: string
}

export function SiteHeader(props: SiteHeaderProps) {
  const [mobileOpen, setMobileOpen] = createSignal(false)
  const homeHref = () => props.homeHref ?? "/"
  const locale = () => props.locale ?? "en"
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

        <div class="site-header__actions">
          <SiteSearch locale={locale()} />
          <LanguageSwitcher locale={locale()} targetPath={props.alternatePath} />
          <ThemeToggle />
        </div>

        <div class="site-header__mobile-trigger">
          <Drawer.Root open={mobileOpen} onOpenChange={setMobileOpen} side="left">
            <Drawer.Trigger class="site-header__hamburger-button" aria-label="Open menu">
              <span class="site-header__hamburger" aria-hidden="true">
                <span />
                <span />
                <span />
              </span>
            </Drawer.Trigger>
            <Drawer.Backdrop class="site-header__drawer-backdrop" />
            <Drawer.Content class="site-header__drawer-content">
              <div class="site-header__drawer-header">
                <Drawer.Title class="site-header__drawer-title">Menu</Drawer.Title>
                <Drawer.Close class="site-header__hamburger-button" aria-label="Close menu">
                  <span aria-hidden="true">×</span>
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
