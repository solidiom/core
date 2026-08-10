# Template Full Implementation Design

**Date:** 2026-08-10
**Status:** Approved
**Approach:** Parallel batches matching saas-dashboard depth

## Problem

27 of 31 templates have stub-only pages (~10 lines: `<h1>` + `<p>`). Only `saas-dashboard` is fully implemented with extracted components, AppShell navigation, rich mock data, and full `@solidiom` component composition. The 2 base scaffolds (`vite-solid-router`, `tanstack-start-solid`) are intentionally minimal and do not need changes.

## Goal

Implement all 27 domain templates to match the depth and quality of `saas-dashboard`: AppShell with navigation, 2-3 extracted components per template, 2-3 rich pages with mock data, state management, and `@solidiom` primitive composition.

## Architecture

### File Structure Per Template

```
templates/<name>/
  src/
    components/
      AppShell.tsx        # Header with logo, nav, avatar (shell templates only)
      <ComponentA>.tsx    # Domain-specific extracted component
      <ComponentB>.tsx    # Domain-specific extracted component
    pages/
      <Page1>.tsx         # Rich page (~90-130 lines)
      <Page2>.tsx         # Rich page (~90-130 lines)
      <Page3>.tsx         # Rich page (~90-130 lines)
    index.tsx             # Router + AppShell integration
    index.css             # Tailwind imports (unchanged)
  package.json            # Dependencies (unchanged)
  template.json           # Metadata (unchanged)
  vite.config.ts          # (unchanged)
  tsconfig.json           # (unchanged)
  index.html              # (unchanged)
```

### Shell vs Non-Shell Templates

**Shell templates** (23 templates with BLOCK-SHELL-01):
- `AppShell` wraps `<Router root={AppShell}>`
- Header: logo text + `NavigationMenu.Root` with nav links + avatar initial
- Main: `max-w-7xl` centered content area with `px-4 py-8`
- Active nav highlighting via `useLocation()`

**Non-shell templates** (4 templates without BLOCK-SHELL-01):
- `auth-starter`: Centered card layout (`flex min-h-screen items-center justify-center`)
- `onboarding-app`: Centered card layout with progress indicator
- `billing-portal`: Full-width layout with simple header
- `settings-portal`: Full-width layout with simple header

### Component Patterns

Each template gets 2-3 domain-specific components beyond AppShell:

| Category | Templates | Component Patterns |
|----------|-----------|-------------------|
| OBS | observability-console, incident-response, security-center | MetricCard, ActivityTable, StatusBadge |
| ADMIN | multi-tenant-admin, audit-log, compliance-center, identity-access | UserTable, StatusBadge, ActivityTable |
| AI | ai-chat, ai-operations, ai-workflow | ModelCard, PipelineStep, LogEntry |
| RESOURCE | api-management, data-governance, developer-portal, resource-manager | ResourceTable, StatusBadge, SearchBar |
| COMMERC | marketplace, storefront | ProductCard, PriceCard, CartItem |
| BILLING | billing-operations, billing-portal | InvoiceRow, PlanCard, MeterBar |
| CONTENT | content-studio, documentation-site, marketing-site | DocCard, MediaPreview, EditorToolbar |
| SUPPORT | support-operations | TicketCard, StatusBadge, MetricCard |
| SETTINGS | enterprise-settings, settings-portal | SettingGroup, ToggleRow |
| AUTH | auth-starter | FormField, SocialButton |
| ONBOARD | onboarding-app | StepIndicator, WizardCard |
| SEARCH | search-application | ResultCard, FilterBar, AnalyticsBar |

Each component:
- Uses `@solidiom` primitives (Card, Badge, etc.)
- Has typed props interface
- Returns `JSX.Element`
- Is ~20-40 lines

### Page Patterns

Each page follows the saas-dashboard page pattern:
- Breadcrumb navigation
- Page title + description
- Domain-specific data tables, cards, or forms with mock data
- `createSignal` for interactive state (search, filters, tabs)
- Full `@solidiom` component composition (Tabs, Alert, Button, Input, DataTable, etc.)
- ~90-130 lines per page

## Implementation Batches

7 batches of 3-4 templates, executed in parallel within each batch:

| Batch | Templates |
|-------|-----------|
| 1 | observability-console, incident-response, security-center |
| 2 | multi-tenant-admin, audit-log, compliance-center, identity-access |
| 3 | ai-chat, ai-operations, ai-workflow |
| 4 | api-management, data-governance, developer-portal, resource-manager |
| 5 | marketplace, storefront, billing-operations, billing-portal |
| 6 | content-studio, documentation-site, marketing-site, support-operations |
| 7 | enterprise-settings, settings-portal, auth-starter, onboarding-app, search-application |

## Scope Exclusions

- `vite-solid-router` and `tanstack-start-solid`: base scaffolds, intentionally minimal
- `saas-dashboard`: already implemented
- `package.json`, `template.json`, `vite.config.ts`, `tsconfig.json`, `index.html`: unchanged
- `index.css`: unchanged (already has correct Tailwind imports)
- `dist/`: regenerated via `vite build` after implementation

## Verification

After each batch:
- Run `vite build` for each template to verify no compilation errors
- Verify each template has: `src/components/AppShell.tsx` (or equivalent), 2+ extracted components, 3 rich pages
