/**
 * BETA-002: Beta acceptance matrix definition.
 *
 * Defines the acceptance areas, routes, and checks that must pass for beta
 * readiness. The matrix is consumed by both the Playwright E2E runner and
 * the static build report script.
 */

export interface AcceptanceCheck {
  id: string
  description: string
}

export interface AcceptanceArea {
  name: string
  routes: string[]
  checks: AcceptanceCheck[]
}

export const BETA_ACCEPTANCE_MATRIX: AcceptanceArea[] = [
  {
    name: "locales",
    routes: [
      "/",
      "/primitives/",
      "/themes/builder/",
      "/privacy/",
      "/trademark/",
      "/es/",
      "/es/primitives/",
      "/es/themes/builder/",
      "/es/privacy/",
      "/es/trademark/",
    ],
    checks: [
      { id: "route_exists", description: "Route responds with 200" },
      { id: "renders_html", description: "Page contains valid HTML with <html> root" },
      { id: "has_locale_attr", description: "HTML element has correct lang attribute" },
      { id: "has_hreflang", description: "Page emits alternate hreflang links" },
      { id: "has_canonical", description: "Page has a canonical link" },
    ],
  },
  {
    name: "themes",
    routes: ["/", "/primitives/", "/themes/builder/"],
    checks: [
      { id: "light_mode", description: "Light theme renders correctly" },
      { id: "dark_mode", description: "Dark theme renders correctly" },
      { id: "no_flash", description: "No theme preference flash (bootstrap sets data-theme before paint)" },
    ],
  },
  {
    name: "search",
    routes: ["/primitives/dialog/examples/"],
    checks: [
      { id: "search_dialog_opens", description: "Search dialog opens via keyboard shortcut" },
      { id: "keyboard_accessible", description: "Search is fully keyboard navigable" },
    ],
  },
  {
    name: "tools",
    routes: ["/themes/builder/", "/es/themes/builder/"],
    checks: [
      { id: "builder_loads", description: "Theme builder page loads" },
      { id: "editor_panel", description: "Editor panel renders" },
      { id: "preview_panel", description: "Preview panel renders" },
      { id: "export_button", description: "Export button is visible" },
    ],
  },
  {
    name: "a11y",
    routes: ["/", "/primitives/", "/themes/builder/", "/privacy/"],
    checks: [
      { id: "no_critical_violations", description: "No critical or serious Axe violations" },
      { id: "has_skip_link", description: "Skip to main content link is present" },
      { id: "landmarks_present", description: "Page has banner, main, and contentinfo landmarks" },
    ],
  },
]

/**
 * Routes that must exist in the static build output (dist/).
 * Used by the static report script to verify build completeness.
 */
export const EXPECTED_STATIC_ROUTES = [
  "/",
  "/404.html",
  "/500.html",
  "/es/",
  "/primitives/",
  "/privacy/",
  "/trademark/",
  "/themes/builder/",
  "/es/primitives/",
  "/es/privacy/",
  "/es/trademark/",
  "/es/themes/builder/",
  "/robots.txt",
  "/sitemap-index.xml",
]

/**
 * Pairs of English/Spanish routes that must have parity.
 */
export const LOCALE_PAIRS: { en: string; es: string }[] = [
  { en: "/", es: "/es/" },
  { en: "/primitives/", es: "/es/primitives/" },
  { en: "/themes/builder/", es: "/es/themes/builder/" },
  { en: "/privacy/", es: "/es/privacy/" },
  { en: "/trademark/", es: "/es/trademark/" },
]