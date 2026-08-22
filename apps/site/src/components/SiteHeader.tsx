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
  docsLinks: NavLink[]
  docsLabel: string
  /** @deprecated Use docsLinks */
  resourceLinks?: NavLink[]
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
          <span class="site-header__brand-mark" aria-hidden="true">
            <svg
              class="site-header__brand-mark-color"
              viewBox="0 0 129 168"
              width="22"
              height="28"
              fill="none"
            >
              <path d="M60 0H46a46 46 0 0 0 0 92h14z" fill="#0F172A" />
              <rect x="69" y="0" width="60" height="60" fill="#5750D6" />
              <rect x="0" y="108" width="60" height="60" fill="#CBD5E1" />
              <path d="M69 76h14a46 46 0 0 1 0 92H69z" fill="#06B6D4" />
            </svg>
            <svg
              class="site-header__brand-mark-mono"
              viewBox="0 0 129 168"
              width="22"
              height="28"
              fill="none"
            >
              {/* Dark-mode mark, version C (multi-colour, retuned for dark).
                  Mirrors apps/site/src/assets/brand/symbol-color-dark.svg. */}
              <path d="M60 0H46a46 46 0 0 0 0 92h14z" fill="#F8FAFC" />
              <rect x="69" y="0" width="60" height="60" fill="#8B83F8" />
              <rect x="0" y="108" width="60" height="60" fill="#CBD5E1" />
              <path d="M69 76h14a46 46 0 0 1 0 92H69z" fill="#22D3EE" />
            </svg>
          </span>
          <span class="site-header__brand-text">Solidiom</span>
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
              <NavigationMenu.Item value="docs">
                <NavigationMenu.Trigger>{props.docsLabel}</NavigationMenu.Trigger>
                <NavigationMenu.Content>
                  <ul class="site-header__dropdown-list">
                    <For each={props.docsLinks}>
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
          <a href="/primitives/" class="site-header__cta">
            {locale() === "es" ? "Comenzar" : "Get Started"}
          </a>
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
                <p class="site-header__drawer-group-label">{props.docsLabel}</p>
                <ul>
                  <For each={props.docsLinks}>
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
