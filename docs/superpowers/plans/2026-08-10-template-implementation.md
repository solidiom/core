# Template Full Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement all 27 domain templates to match the depth and quality of `saas-dashboard` — AppShell with navigation, 2-3 extracted components, 2-3 rich pages with mock data, state management, and `@solidiom` component composition.

**Architecture:** Each template follows the saas-dashboard pattern: `src/components/AppShell.tsx` (header with logo, nav links, avatar), 2-3 domain-specific extracted components, and 3 rich pages (~90-130 lines each) with mock data, `createSignal` state, and full `@solidiom` primitive composition. Four non-shell templates (auth-starter, billing-portal, onboarding-app, settings-portal) use centered or full-width layouts without AppShell.

**Tech Stack:** SolidJS, Solid Router, Solid Web, Tailwind CSS v4, @solidiom component primitives, Vite, TypeScript

## Global Constraints

- **JSX:** `"jsx": "preserve"`, `"jsxImportSource": "solid-js"` in tsconfig
- **Router:** `@solidjs/router` with `<Router root={AppShell}>` pattern for shell templates
- **Render:** `@solidjs/web` `render()` — not `solid-js/web`
- **CSS:** `@import "tailwindcss";` + `@import "@solidiom/recipes-tailwind/styles/theme.css";`
- **Components use:** `@solidiom/button`, `@solidiom/input`, `@solidiom/card`, `@solidiom/alert`, `@solidiom/tabs`, `@solidiom/navigation-menu`, `@solidiom/breadcrumb`, `@solidiom/spinner`, `@solidiom/data-table`, `@solidiom/select`, `@solidiom/pagination`, `@solidiom/dialog`, `@solidiom/toast`, `@solidiom/tooltip`, `@solidiom/switch`, `@solidiom/progress`, `@solidiom/checkbox`, `@solidiom/field`, `@solidiom/avatar`, `@solidiom/kbd`, `@solidiom/scroll-area`, `@solidiom/resizable-panels`, `@solidiom/meter` (only those listed in each template's package.json)
- **No `@solidiom` component should be imported if it's not in the template's `package.json` dependencies**
- **AppShell pattern:** `min-h-screen bg-gray-50`, header with `border-b border-gray-200 bg-white`, `mx-auto max-w-7xl px-4 sm:px-6 lg:px-8`
- **Nav items:** Use `NavigationMenu.Root` + `NavigationMenu.List` + `NavigationMenu.Link` with active state via `useLocation()`
- **Avatar:** Rounded circle with initial letter, `bg-indigo-600 text-white`
- **Pages:** Breadcrumb, page title (text-2xl font-bold), description (text-sm text-gray-500), domain content with mock data
- **Files to NOT modify:** `package.json`, `template.json`, `vite.config.ts`, `tsconfig.json`, `index.html`, `index.css`
- **All templates are independent projects** — do not import between templates

---

### Task 1: Batch 1 — OBS Templates (observability-console, incident-response, security-center)

**Files to create/modify (9 templates × 6 files = ~54 files):**

**observability-console:**
- Create: `templates/observability-console/src/components/AppShell.tsx`
- Create: `templates/observability-console/src/components/MetricCard.tsx`
- Create: `templates/observability-console/src/components/StatusBadge.tsx`
- Modify: `templates/observability-console/src/index.tsx` — add `root={AppShell}`
- Modify: `templates/observability-console/src/pages/Overview.tsx` — rich dashboard with metric cards, alerts, tabs
- Modify: `templates/observability-console/src/pages/Events.tsx` — real-time event stream with filters
- Modify: `templates/observability-console/src/pages/Alerts.tsx` — alert configuration with thresholds

**incident-response:**
- Create: `templates/incident-response/src/components/AppShell.tsx`
- Create: `templates/incident-response/src/components/IncidentCard.tsx`
- Create: `templates/incident-response/src/components/SeverityBadge.tsx`
- Modify: `templates/incident-response/src/index.tsx` — add `root={AppShell}`
- Modify: `templates/incident-response/src/pages/ActiveIncidents.tsx` — incident list with severity, responders, timeline
- Modify: `templates/incident-response/src/pages/Runbooks.tsx` — runbook list with categories and search
- Modify: `templates/incident-response/src/pages/Postmortems.tsx` — resolved incidents with root cause analysis

**security-center:**
- Create: `templates/security-center/src/components/AppShell.tsx`
- Create: `templates/security-center/src/components/ThreatCard.tsx`
- Create: `templates/security-center/src/components/StatusBadge.tsx`
- Modify: `templates/security-center/src/index.tsx` — add `root={AppShell}`
- Modify: `templates/security-center/src/pages/ThreatDashboard.tsx` — threat overview with metric cards and active alerts
- Modify: `templates/security-center/src/pages/Vulnerabilities.tsx` — vulnerability table with CVE details and severity
- Modify: `templates/security-center/src/pages/Policies.tsx` — policy management with toggleable rules

**Shared component patterns:**
- `AppShell.tsx` — same structure as saas-dashboard, with template-specific nav items and logo
- `MetricCard.tsx` — same as saas-dashboard's MetricCard (title, value, change, changeType)
- `StatusBadge.tsx` — same as saas-dashboard's StatusBadge (status → color mapping)

- [ ] **Step 1: Implement observability-console** — Create AppShell (nav: Overview, Events, Alerts; logo: "Obs Console"), MetricCard, StatusBadge components. Rewrite 3 pages with mock data: Overview gets 4 metric cards (Uptime, Error Rate, Avg Latency, Active Alerts) + alert banner + tabbed activity; Events gets filterable event table with SeverityBadge; Alerts gets threshold rules table with enable/disable toggles. Use deps: button, card, alert, data-table, tabs, select, meter, progress, spinner, recipes-tailwind, navigation-menu, breadcrumb.

- [ ] **Step 2: Implement incident-response** — Create AppShell (nav: Incidents, Runbooks, Postmortems; logo: "IR Console"), IncidentCard, SeverityBadge components. Rewrite 3 pages: ActiveIncidents gets severity-distributed metric cards + incident cards with responders/ timeline; Runbooks gets searchable runbook list with categories; Postmortems gets timeline + action items table. Use deps: button, input, card, alert, spinner, tabs, data-table, select, dialog, toast, progress, avatar, tooltip, recipes-tailwind, navigation-menu, breadcrumb.

- [ ] **Step 3: Implement security-center** — Create AppShell (nav: Threats, Vulnerabilities, Policies; logo: "Security Center"), ThreatCard, StatusBadge components. Rewrite 3 pages: ThreatDashboard gets metric cards + threat feed + severity breakdown; Vulnerabilities gets filterable CVE table with affected assets count; Policies gets toggleable policy list with enforcement status. Use deps: button, input, card, alert, spinner, tabs, data-table, select, pagination, dialog, toast, progress, switch, recipes-tailwind, navigation-menu, breadcrumb.

- [ ] **Step 4: Verify builds** — Run `vite build` in each of the 3 templates and confirm no errors

- [ ] **Step 5: Commit** — `git add templates/observability-console/templates/incident-response/templates/security-center && git commit -m "feat: implement OBS templates — observability-console, incident-response, security-center"`

---

### Task 2: Batch 2 — ADMIN Templates (multi-tenant-admin, audit-log, compliance-center, identity-access)

**multi-tenant-admin:**
- Create: `templates/multi-tenant-admin/src/components/AppShell.tsx`
- Create: `templates/multi-tenant-admin/src/components/StatusBadge.tsx`
- Create: `templates/multi-tenant-admin/src/components/ActivityTable.tsx`
- Modify: `templates/multi-tenant-admin/src/index.tsx` — add `root={AppShell}`
- Modify: `templates/multi-tenant-admin/src/pages/Teams.tsx` — team list with member counts and invite button
- Modify: `templates/multi-tenant-admin/src/pages/Roles.tsx` — RBAC matrix with permissions
- Modify: `templates/multi-tenant-admin/src/pages/AuditLog.tsx` — searchable event timeline

**audit-log:**
- Create: `templates/audit-log/src/components/AppShell.tsx`
- Create: `templates/audit-log/src/components/EventRow.tsx`
- Create: `templates/audit-log/src/components/SeverityBadge.tsx`
- Modify: `templates/audit-log/src/index.tsx` — add `root={AppShell}`
- Modify: `templates/audit-log/src/pages/EventStream.tsx` — real-time event stream table
- Modify: `templates/audit-log/src/pages/Filters.tsx` — advanced filter builder with date range, actor, action
- Modify: `templates/audit-log/src/pages/Export.tsx` — export options with format selection and report generation

**compliance-center:**
- Create: `templates/compliance-center/src/components/AppShell.tsx`
- Create: `templates/compliance-center/src/components/FrameworkCard.tsx`
- Create: `templates/compliance-center/src/components/StatusBadge.tsx`
- Modify: `templates/compliance-center/src/index.tsx` — add `root={AppShell}`
- Modify: `templates/compliance-center/src/pages/Frameworks.tsx` — compliance framework cards with progress
- Modify: `templates/compliance-center/src/pages/Controls.tsx` — control assessments table with owners
- Modify: `templates/compliance-center/src/pages/Evidence.tsx` — evidence collection with file uploads

**identity-access:**
- Create: `templates/identity-access/src/components/AppShell.tsx`
- Create: `templates/identity-access/src/components/UserCard.tsx`
- Create: `templates/identity-access/src/components/StatusBadge.tsx`
- Modify: `templates/identity-access/src/index.tsx` — add `root={AppShell}`
- Modify: `templates/identity-access/src/pages/Users.tsx` — user directory with search and filter
- Modify: `templates/identity-access/src/pages/Roles.tsx` — role definitions with permissions matrix
- Modify: `templates/identity-access/src/pages/Sessions.tsx` — active sessions with device info

- [ ] **Step 1: Implement multi-tenant-admin** — Create AppShell (nav: Teams, Roles, Audit Log; logo: "Admin"), StatusBadge, ActivityTable components. Rewrite 3 pages: Teams gets team cards with member counts + invite dialog; Roles gets RBAC matrix with checkbox permissions; AuditLog gets searchable event table with ActivityTable. Use deps: button, input, card, alert, data-table, dialog, tabs, recipes-tailwind, navigation-menu, breadcrumb.

- [ ] **Step 2: Implement audit-log** — Create AppShell (nav: Events, Filters, Export; logo: "Audit Log"), EventRow, SeverityBadge components. Rewrite 3 pages: EventStream gets real-time event table with severity badges and actor/action/resource; Filters gets filter builder with actor/action/date/severity selects; Export gets format selection cards (CSV/JSON/Report) with date range picker. Use deps: button, input, card, alert, spinner, tabs, data-table, select, pagination, checkbox, toast, recipes-tailwind, navigation-menu, breadcrumb.

- [ ] **Step 3: Implement compliance-center** — Create AppShell (nav: Frameworks, Controls, Evidence; logo: "Compliance"), FrameworkCard, StatusBadge components. Rewrite 3 pages: Frameworks gets SOC 2/ISO 27001/HIPAA cards with compliance progress bars; Controls gets assessment table with owner assignments and StatusBadge; Evidence gets evidence list with upload buttons and verification status. Use deps: button, input, card, alert, spinner, tabs, data-table, select, pagination, dialog, toast, progress, checkbox, recipes-tailwind, navigation-menu, breadcrumb.

- [ ] **Step 4: Implement identity-access** — Create AppShell (nav: Users, Roles, Sessions; logo: "Identity"), UserCard, StatusBadge components. Rewrite 3 pages: Users gets searchable user table with avatar, email, role, status; Roles gets role definitions with permission checkboxes; Sessions gets active sessions table with device, IP, last active. Use deps: button, input, card, alert, spinner, tabs, data-table, select, dialog, toast, switch, checkbox, avatar, pagination, recipes-tailwind, navigation-menu, breadcrumb.

- [ ] **Step 5: Verify builds** — Run `vite build` in each of the 4 templates and confirm no errors

- [ ] **Step 6: Commit** — `git add templates/multi-tenant-admin templates/audit-log templates/compliance-center templates/identity-access && git commit -m "feat: implement ADMIN templates — multi-tenant-admin, audit-log, compliance-center, identity-access"`

---

### Task 3: Batch 3 — AI Templates (ai-chat, ai-operations, ai-workflow)

**ai-chat:**
- Create: `templates/ai-chat/src/components/AppShell.tsx`
- Create: `templates/ai-chat/src/components/MessageBubble.tsx`
- Create: `templates/ai-chat/src/components/ModelSelect.tsx`
- Modify: `templates/ai-chat/src/index.tsx` — add `root={AppShell}`
- Modify: `templates/ai-chat/src/pages/Chat.tsx` — conversational interface with message history
- Modify: `templates/ai-chat/src/pages/PromptStudio.tsx` — prompt editor with variable templates
- Modify: `templates/ai-chat/src/pages/Workflows.tsx` — visual workflow builder preview

**ai-operations:**
- Create: `templates/ai-operations/src/components/AppShell.tsx`
- Create: `templates/ai-operations/src/components/ModelCard.tsx`
- Create: `templates/ai-operations/src/components/MetricCard.tsx`
- Modify: `templates/ai-operations/src/index.tsx` — add `root={AppShell}`
- Modify: `templates/ai-operations/src/pages/ModelMonitoring.tsx` — model perf metrics with latency/error charts
- Modify: `templates/ai-operations/src/pages/Deployments.tsx` — deployment pipeline status table
- Modify: `templates/ai-operations/src/pages/CostTracking.tsx` — cost breakdown by model and token usage

**ai-workflow:**
- Create: `templates/ai-workflow/src/components/AppShell.tsx`
- Create: `templates/ai-workflow/src/components/PipelineStep.tsx`
- Create: `templates/ai-workflow/src/components/LogEntry.tsx`
- Modify: `templates/ai-workflow/src/index.tsx` — add `root={AppShell}`
- Modify: `templates/ai-workflow/src/pages/PipelineBuilder.tsx` — pipeline composition UI with step list
- Modify: `templates/ai-workflow/src/pages/ModelRegistry.tsx` — model registry with versions and status
- Modify: `templates/ai-workflow/src/pages/ExecutionLogs.tsx` — execution history with step-level logs

- [ ] **Step 1: Implement ai-chat** — Create AppShell (nav: Chat, Prompts, Workflows; logo: "AI Chat"), MessageBubble (user/assistant message styling), ModelSelect components. Rewrite 3 pages: Chat gets message thread with MessageBubble, input bar, model select; PromptStudio gets prompt editor with variable interpolation + saved prompts table; Workflows gets workflow cards with step counts and status. Use deps: button, input, card, alert, spinner, tabs, scroll-area, recipes-tailwind, navigation-menu, breadcrumb.

- [ ] **Step 2: Implement ai-operations** — Create AppShell (nav: Monitoring, Deployments, Costs; logo: "AI Ops"), ModelCard, MetricCard components. Rewrite 3 pages: ModelMonitoring gets 4 metric cards (Latency, Throughput, Error Rate, Drift Score) + model comparison table; Deployments gets deployment pipeline table with canary/rollout status; CostTracking gets cost breakdown by model with progress bars for budget. Use deps: button, input, card, alert, spinner, tabs, data-table, select, dialog, toast, progress, meter, recipes-tailwind, navigation-menu, breadcrumb.

- [ ] **Step 3: Implement ai-workflow** — Create AppShell (nav: Pipeline, Models, Executions; logo: "AI Workflow"), PipelineStep (step node with status icon), LogEntry components. Rewrite 3 pages: PipelineBuilder gets pipeline overview with step sequence visualization + model assignments; ModelRegistry gets model table with versions, status badges, and selection; ExecutionLogs gets run history with expandable LogEntry per step. Use deps: button, input, card, alert, spinner, tabs, data-table, select, dialog, toast, progress, tooltip, recipes-tailwind, navigation-menu, breadcrumb.

- [ ] **Step 4: Verify builds** — Run `vite build` in each of the 3 templates and confirm no errors

- [ ] **Step 5: Commit** — `git add templates/ai-chat templates/ai-operations templates/ai-workflow && git commit -m "feat: implement AI templates — ai-chat, ai-operations, ai-workflow"`

---

### Task 4: Batch 4 — RESOURCE Templates (api-management, data-governance, developer-portal, resource-manager)

**api-management:**
- Create: `templates/api-management/src/components/AppShell.tsx`
- Create: `templates/api-management/src/components/EndpointCard.tsx`
- Create: `templates/api-management/src/components/StatusBadge.tsx`
- Modify: `templates/api-management/src/index.tsx` — add `root={AppShell}`
- Modify: `templates/api-management/src/pages/EndpointCatalog.tsx` — searchable endpoint list with method badges
- Modify: `templates/api-management/src/pages/ApiKeys.tsx` — key management with create/rotate/revoke
- Modify: `templates/api-management/src/pages/UsageAnalytics.tsx` — request volume and latency metrics

**data-governance:**
- Create: `templates/data-governance/src/components/AppShell.tsx`
- Create: `templates/data-governance/src/components/DataAssetCard.tsx`
- Create: `templates/data-governance/src/components/ClassificationBadge.tsx`
- Modify: `templates/data-governance/src/index.tsx` — add `root={AppShell}`
- Modify: `templates/data-governance/src/pages/DataCatalog.tsx` — searchable data asset catalog
- Modify: `templates/data-governance/src/pages/Lineage.tsx` — data lineage visualization
- Modify: `templates/data-governance/src/pages/Classification.tsx` — classification policy rules

**developer-portal:**
- Create: `templates/developer-portal/src/components/AppShell.tsx`
- Create: `templates/developer-portal/src/components/DocCard.tsx`
- Create: `templates/developer-portal/src/components/StatusBadge.tsx`
- Modify: `templates/developer-portal/src/index.tsx` — add `root={AppShell}`
- Modify: `templates/developer-portal/src/pages/Documentation.tsx` — doc reader with sidebar TOC
- Modify: `templates/developer-portal/src/pages/Playground.tsx` — interactive API playground
- Modify: `templates/developer-portal/src/pages/Applications.tsx` — registered apps with OAuth config

**resource-manager:**
- Create: `templates/resource-manager/src/components/AppShell.tsx`
- Create: `templates/resource-manager/src/components/ResourceCard.tsx`
- Create: `templates/resource-manager/src/components/StatusBadge.tsx`
- Modify: `templates/resource-manager/src/index.tsx` — add `root={AppShell}`
- Modify: `templates/resource-manager/src/pages/ResourceList.tsx` — searchable resource grid with filters
- Modify: `templates/resource-manager/src/pages/ResourceDetail.tsx` — resource detail with edit form
- Modify: `templates/resource-manager/src/pages/ResourceCreate.tsx` — guided creation wizard

- [ ] **Step 1: Implement api-management** — Create AppShell (nav: Endpoints, Keys, Usage; logo: "API Management"), EndpointCard (method badge + path + status), StatusBadge components. Rewrite 3 pages: EndpointCatalog gets searchable endpoint table with GET/POST/PUT/DELETE badges and version info; ApiKeys gets key list with create/rotate/revoke actions and scope display; UsageAnalytics gets 4 metric cards (Requests, Latency p99, Error Rate, Bandwidth) + per-endpoint breakdown. Use deps: button, input, card, alert, spinner, tabs, data-table, select, pagination, dialog, toast, tooltip, kbd, recipes-tailwind, navigation-menu, breadcrumb.

- [ ] **Step 2: Implement data-governance** — Create AppShell (nav: Catalog, Lineage, Classification; logo: "Data Governance"), DataAssetCard, ClassificationBadge components. Rewrite 3 pages: DataCatalog gets searchable asset list with type, owner, classification badges; Lineage gets data flow visualization with source→transform→destination steps; Classification gets policy rules table with sensitivity labels and enforcement status. Use deps: button, input, card, alert, spinner, tabs, data-table, select, pagination, dialog, toast, tooltip, breadcrumb, recipes-tailwind, navigation-menu.

- [ ] **Step 3: Implement developer-portal** — Create AppShell (nav: Docs, Playground, Apps; logo: "Dev Portal"), DocCard, StatusBadge components. Rewrite 3 pages: Documentation gets categorized doc cards with version selector and search; Playground gets interactive request builder with method/path/body inputs and response display; Applications gets registered app list with client ID, OAuth scopes, and webhook endpoints. Use deps: button, input, card, alert, spinner, tabs, data-table, select, dialog, tooltip, kbd, breadcrumb, scroll-area, recipes-tailwind, navigation-menu.

- [ ] **Step 4: Implement resource-manager** — Create AppShell (nav: Resources, Create; logo: "Resources"), ResourceCard, StatusBadge components. Rewrite 3 pages: ResourceList gets searchable resource grid with type filters and pagination; ResourceDetail gets resource properties, activity log, and edit form; ResourceCreate gets multi-field creation form with type selector and region picker. Use deps: button, input, field, card, alert, data-table, dialog, pagination, breadcrumb, spinner, recipes-tailwind, navigation-menu.

- [ ] **Step 5: Verify builds** — Run `vite build` in each of the 4 templates and confirm no errors

- [ ] **Step 6: Commit** — `git add templates/api-management templates/data-governance templates/developer-portal templates/resource-manager && git commit -m "feat: implement RESOURCE templates — api-management, data-governance, developer-portal, resource-manager"`

---

### Task 5: Batch 5 — COMMERC/BILLING Templates (marketplace, storefront, billing-operations, billing-portal)

**marketplace:**
- Create: `templates/marketplace/src/components/AppShell.tsx`
- Create: `templates/marketplace/src/components/ProductCard.tsx`
- Create: `templates/marketplace/src/components/PriceBadge.tsx`
- Modify: `templates/marketplace/src/index.tsx` — add `root={AppShell}`
- Modify: `templates/marketplace/src/pages/Browse.tsx` — product grid with category filters
- Modify: `templates/marketplace/src/pages/SellerDashboard.tsx` — sales metrics and order management
- Modify: `templates/marketplace/src/pages/ListingDetail.tsx` — product detail with reviews

**storefront:**
- Create: `templates/storefront/src/components/AppShell.tsx`
- Create: `templates/storefront/src/components/ProductCard.tsx`
- Create: `templates/storefront/src/components/CartSummary.tsx`
- Modify: `templates/storefront/src/index.tsx` — add `root={AppShell}`
- Modify: `templates/storefront/src/pages/ProductListing.tsx` — product catalog with filters and sorting
- Modify: `templates/storefront/src/pages/Cart.tsx` — cart items with quantity controls
- Modify: `templates/storefront/src/pages/Checkout.tsx` — checkout form with shipping/payment

**billing-operations:**
- Create: `templates/billing-operations/src/components/AppShell.tsx`
- Create: `templates/billing-operations/src/components/InvoiceRow.tsx`
- Create: `templates/billing-operations/src/components/StatusBadge.tsx`
- Modify: `templates/billing-operations/src/index.tsx` — add `root={AppShell}`
- Modify: `templates/billing-operations/src/pages/Invoices.tsx` — invoice list with payment status
- Modify: `templates/billing-operations/src/pages/Reconciliation.tsx` — payment reconciliation table
- Modify: `templates/billing-operations/src/pages/Reports.tsx` — financial reports and dashboards

**billing-portal:** (NO AppShell — full-width layout with simple header)
- Create: `templates/billing-portal/src/components/PlanCard.tsx`
- Create: `templates/billing-portal/src/components/InvoiceRow.tsx`
- Modify: `templates/billing-portal/src/index.tsx` — no AppShell, simple header in each page
- Modify: `templates/billing-portal/src/pages/Plans.tsx` — subscription plan comparison
- Modify: `templates/billing-portal/src/pages/Payment.tsx` — payment method management
- Modify: `templates/billing-portal/src/pages/Invoices.tsx` — invoice history with download

- [ ] **Step 1: Implement marketplace** — Create AppShell (nav: Browse, Seller, Listings; logo: "Marketplace"), ProductCard (image placeholder, price, seller), PriceBadge components. Rewrite 3 pages: Browse gets product grid with category sidebar and search; SellerDashboard gets sales metric cards + order table + listing management; ListingDetail gets product details, description, reviews, and purchase CTA. Use deps: button, input, card, alert, spinner, tabs, data-table, pagination, select, avatar, toast, dialog, recipes-tailwind, navigation-menu, breadcrumb.

- [ ] **Step 2: Implement storefront** — Create AppShell (nav: Products, Cart; logo: "Store"), ProductCard, CartSummary components. Rewrite 3 pages: ProductListing gets product grid with category filters, search bar, and sort dropdown; Cart gets item list with quantity controls, discount code input, and CartSummary; Checkout gets shipping form, payment method selector, order review, and confirmation. Use deps: button, input, card, alert, spinner, select, data-table, pagination, toast, dialog, tabs, recipes-tailwind, navigation-menu, breadcrumb.

- [ ] **Step 3: Implement billing-operations** — Create AppShell (nav: Invoices, Reconciliation, Reports; logo: "Billing Ops"), InvoiceRow, StatusBadge components. Rewrite 3 pages: Invoices gets invoice table with status badges, payment dates, and bulk actions; Reconciliation gets payment matching table with discrepancy flags; Reports gets revenue metric cards + report generation with date range. Use deps: button, input, card, alert, data-table, dialog, tabs, pagination, recipes-tailwind, navigation-menu, breadcrumb.

- [ ] **Step 4: Implement billing-portal** — NO AppShell. Create PlanCard (tier, features, price), InvoiceRow components. Rewrite 3 pages: Plans gets plan comparison cards (Free/Pro/Enterprise) with feature lists and upgrade CTA; Payment gets payment method list with add/remove and default setting; Invoices gets paginated invoice history with download links. Each page has its own simple `<header>` with "Billing" logo and nav. Use deps: button, input, card, alert, data-table, dialog, tabs, pagination, recipes-tailwind.

- [ ] **Step 5: Verify builds** — Run `vite build` in each of the 4 templates and confirm no errors

- [ ] **Step 6: Commit** — `git add templates/marketplace templates/storefront templates/billing-operations templates/billing-portal && git commit -m "feat: implement COMMERC/BILLING templates — marketplace, storefront, billing-operations, billing-portal"`

---

### Task 6: Batch 6 — CONTENT/SUPPORT Templates (content-studio, documentation-site, marketing-site, support-operations)

**content-studio:**
- Create: `templates/content-studio/src/components/AppShell.tsx`
- Create: `templates/content-studio/src/components/ContentCard.tsx`
- Create: `templates/content-studio/src/components/StatusBadge.tsx`
- Modify: `templates/content-studio/src/index.tsx` — add `root={AppShell}`
- Modify: `templates/content-studio/src/pages/Editor.tsx` — rich text editor mockup with toolbar
- Modify: `templates/content-studio/src/pages/Library.tsx` — content asset library with grid view
- Modify: `templates/content-studio/src/pages/Workflow.tsx` — editorial workflow with status tracking

**documentation-site:** (NO AppShell — has BLOCK-SHELL-01 but no BLOCK-AUTH-01, public-facing)
- Actually, it HAS BLOCK-SHELL-01. Create AppShell but without avatar (public site).
- Create: `templates/documentation-site/src/components/AppShell.tsx`
- Create: `templates/documentation-site/src/components/DocCard.tsx`
- Create: `templates/documentation-site/src/components/CodeBlock.tsx`
- Modify: `templates/documentation-site/src/index.tsx` — add `root={AppShell}`
- Modify: `templates/documentation-site/src/pages/DocsReader.tsx` — docs reader with sidebar nav
- Modify: `templates/documentation-site/src/pages/ApiReference.tsx` — API reference with type signatures
- Modify: `templates/documentation-site/src/pages/Guides.tsx` — tutorial guides with code samples

**marketing-site:** (NO AppShell — has BLOCK-SHELL-01 but no BLOCK-AUTH-01, public-facing landing)
- Actually, it HAS BLOCK-SHELL-01. Create simplified AppShell (no avatar, marketing nav).
- Create: `templates/marketing-site/src/components/AppShell.tsx`
- Create: `templates/marketing-site/src/components/FeatureCard.tsx`
- Create: `templates/marketing-site/src/components/PriceCard.tsx`
- Modify: `templates/marketing-site/src/index.tsx` — add `root={AppShell}`
- Modify: `templates/marketing-site/src/pages/Landing.tsx` — hero section with CTA
- Modify: `templates/marketing-site/src/pages/Features.tsx` — feature showcase grid
- Modify: `templates/marketing-site/src/pages/Pricing.tsx` — pricing tiers with comparison

**support-operations:**
- Create: `templates/support-operations/src/components/AppShell.tsx`
- Create: `templates/support-operations/src/components/TicketCard.tsx`
- Create: `templates/support-operations/src/components/StatusBadge.tsx`
- Modify: `templates/support-operations/src/index.tsx` — add `root={AppShell}`
- Modify: `templates/support-operations/src/pages/TicketQueue.tsx` — ticket list with priority and assignment
- Modify: `templates/support-operations/src/pages/KnowledgeBase.tsx` — article library with categories
- Modify: `templates/support-operations/src/pages/Metrics.tsx` — support performance metrics

- [ ] **Step 1: Implement content-studio** — Create AppShell (nav: Editor, Library, Workflow; logo: "Content Studio"), ContentCard (title, type, status), StatusBadge components. Rewrite 3 pages: Editor gets toolbar (bold/italic/link/heading) + editable content area + version history; Library gets asset grid with type filters (image/video/document) and search; Workflow gets editorial pipeline with draft→review→approved→published stages. Use deps: button, input, card, alert, spinner, tabs, data-table, select, dialog, toast, tooltip, resizable-panels, recipes-tailwind, navigation-menu, breadcrumb.

- [ ] **Step 2: Implement documentation-site** — Create AppShell (nav: Docs, API, Guides; logo: "Docs"; no avatar — public site). Create DocCard, CodeBlock components. Rewrite 3 pages: DocsReader gets categorized doc sections with sidebar TOC and search; ApiReference gets endpoint definitions with method badges, params tables, and CodeBlock examples; Guides gets step-by-step tutorial cards with difficulty badges and estimated time. Use deps: button, input, card, tabs, breadcrumb, navigation-menu, scroll-area, tooltip, kbd, recipes-tailwind.

- [ ] **Step 3: Implement marketing-site** — Create AppShell (nav: Home, Features, Pricing; logo: "Product"; no avatar — public site). Create FeatureCard, PriceCard components. Rewrite 3 pages: Landing gets hero section with headline, subtitle, CTA buttons, and social proof stats; Features gets feature grid with FeatureCard for each capability; Pricing gets 3 tier PriceCards (Starter/Pro/Enterprise) with feature comparison and FAQ. Use deps: button, card, alert, tabs, tooltip, navigation-menu, breadcrumb, recipes-tailwind.

- [ ] **Step 4: Implement support-operations** — Create AppShell (nav: Tickets, Knowledge Base, Metrics; logo: "Support"), TicketCard (priority, assignee, status), StatusBadge components. Rewrite 3 pages: TicketQueue gets priority-sorted ticket table with assignment and SLA countdown; KnowledgeBase gets searchable article list with category filters and author info; Metrics gets 4 metric cards (Resolution Time, CSAT, Open Tickets, Agent Utilization) + agent performance table. Use deps: button, input, card, alert, spinner, tabs, data-table, select, pagination, dialog, toast, avatar, tooltip, recipes-tailwind, navigation-menu, breadcrumb.

- [ ] **Step 5: Verify builds** — Run `vite build` in each of the 4 templates and confirm no errors

- [ ] **Step 6: Commit** — `git add templates/content-studio templates/documentation-site templates/marketing-site templates/support-operations && git commit -m "feat: implement CONTENT/SUPPORT templates — content-studio, documentation-site, marketing-site, support-operations"`

---

### Task 7: Batch 7 — SETTINGS/AUTH/SEARCH/WORKFLOW Templates (enterprise-settings, settings-portal, auth-starter, onboarding-app, search-application, workflow-automation)

**enterprise-settings:**
- Create: `templates/enterprise-settings/src/components/AppShell.tsx`
- Create: `templates/enterprise-settings/src/components/SettingGroup.tsx`
- Create: `templates/enterprise-settings/src/components/ToggleRow.tsx`
- Modify: `templates/enterprise-settings/src/index.tsx` — add `root={AppShell}`
- Modify: `templates/enterprise-settings/src/pages/Organization.tsx` — org profile and branding
- Modify: `templates/enterprise-settings/src/pages/Security.tsx` — security policies and SSO config
- Modify: `templates/enterprise-settings/src/pages/Integrations.tsx` — integration management

**settings-portal:** (NO AppShell — no BLOCK-SHELL-01, simple header per page)
- Create: `templates/settings-portal/src/components/SettingGroup.tsx`
- Create: `templates/settings-portal/src/components/DangerZone.tsx`
- Modify: `templates/settings-portal/src/index.tsx` — no AppShell
- Modify: `templates/settings-portal/src/pages/Account.tsx` — profile and password management
- Modify: `templates/settings-portal/src/pages/Notifications.tsx` — notification preference toggles
- Modify: `templates/settings-portal/src/pages/DangerZone.tsx` — destructive actions with confirm dialogs

**auth-starter:** (NO AppShell — centered card layout)
- Create: `templates/auth-starter/src/components/AuthCard.tsx`
- Create: `templates/auth-starter/src/components/FormField.tsx`
- Modify: `templates/auth-starter/src/index.tsx` — no AppShell, centered layout
- Modify: `templates/auth-starter/src/pages/SignIn.tsx` — sign-in form with email/password
- Modify: `templates/auth-starter/src/pages/SignUp.tsx` — sign-up form with validation
- Modify: `templates/auth-starter/src/pages/ResetPassword.tsx` — password reset form

**onboarding-app:** (NO AppShell — centered with progress)
- Create: `templates/onboarding-app/src/components/StepIndicator.tsx`
- Create: `templates/onboarding-app/src/components/WizardCard.tsx`
- Modify: `templates/onboarding-app/src/index.tsx` — no AppShell
- Modify: `templates/onboarding-app/src/pages/Welcome.tsx` — welcome step with next button
- Modify: `templates/onboarding-app/src/pages/ProfileSetup.tsx` — profile form with avatar upload
- Modify: `templates/onboarding-app/src/pages/ProjectStarter.tsx` — project creation wizard

**search-application:**
- Create: `templates/search-application/src/components/AppShell.tsx`
- Create: `templates/search-application/src/components/ResultCard.tsx`
- Create: `templates/search-application/src/components/FilterBar.tsx`
- Modify: `templates/search-application/src/index.tsx` — add `root={AppShell}`
- Modify: `templates/search-application/src/pages/SearchResults.tsx` — search results with facets
- Modify: `templates/search-application/src/pages/SavedSearches.tsx` — saved search queries list
- Modify: `templates/search-application/src/pages/SearchAnalytics.tsx` — search performance metrics

**workflow-automation:**
- Create: `templates/workflow-automation/src/components/AppShell.tsx`
- Create: `templates/workflow-automation/src/components/WorkflowCard.tsx`
- Create: `templates/workflow-automation/src/components/StatusBadge.tsx`
- Modify: `templates/workflow-automation/src/index.tsx` — add `root={AppShell}`
- Modify: `templates/workflow-automation/src/pages/Designer.tsx` — workflow designer with trigger/action steps
- Modify: `templates/workflow-automation/src/pages/Runs.tsx` — execution history with status
- Modify: `templates/workflow-automation/src/pages/Integrations.tsx` — connector configuration

- [ ] **Step 1: Implement enterprise-settings** — Create AppShell (nav: Organization, Security, Integrations; logo: "Settings"), SettingGroup (section header + divider), ToggleRow (label + switch) components. Rewrite 3 pages: Organization gets profile form, branding upload, domain verification; Security gets SSO config, MFA enforcement toggles, session policies, IP allowlist; Integrations gets SCIM/SAML/webhook config cards with enable/disable. Use deps: button, input, card, alert, spinner, tabs, select, dialog, switch, toast, field, checkbox, recipes-tailwind, navigation-menu, breadcrumb.

- [ ] **Step 2: Implement settings-portal** — NO AppShell. Create SettingGroup, DangerZone (destructive action card with confirm dialog) components. Rewrite 3 pages: Account gets profile fields, email change, password update with simple header nav; Notifications gets category toggles (email/push/sms) per notification type with SettingGroup; DangerZone gets DangerZone cards for delete account, transfer ownership, etc. Each page has `<header>` with "Settings" link + nav. Use deps: button, input, field, card, alert, switch, dialog, tabs, recipes-tailwind.

- [ ] **Step 3: Implement auth-starter** — NO AppShell; centered `flex min-h-screen items-center justify-center bg-gray-50` layout. Create AuthCard (card wrapper with logo), FormField (label + input + error) components. Rewrite 3 pages: SignIn gets email/password form with remember me and forgot password link; SignUp gets name/email/password/confirm form with validation states; ResetPassword gets email input with success state. Use deps: button, input, field, card, alert, recipes-tailwind.

- [ ] **Step 4: Implement onboarding-app** — NO AppShell; centered layout. Create StepIndicator (progress bar with steps), WizardCard (card with step title and content) components. Rewrite 3 pages: Welcome gets welcome message, feature highlights, StepIndicator showing step 1/3; ProfileSetup gets name/avatar/org fields with StepIndicator 2/3; ProjectStarter gets project name/description/template selector with StepIndicator 3/3. Use deps: button, input, field, card, alert, progress, recipes-tailwind.

- [ ] **Step 5: Implement search-application** — Create AppShell (nav: Search, Saved, Analytics; logo: "Search"), ResultCard (title, snippet, metadata), FilterBar (checkbox facets + date range) components. Rewrite 3 pages: SearchResults gets search bar, FilterBar with category/type/date facets, and ResultCard list with pagination; SavedSearches gets saved query list with edit/delete and alert subscription toggle; SearchAnalytics gets 4 metric cards (Total Searches, Zero Results, Avg Latency, Top Query) + popular queries table. Use deps: button, input, card, alert, spinner, tabs, data-table, pagination, select, checkbox, recipes-tailwind, navigation-menu, breadcrumb.

- [ ] **Step 6: Implement workflow-automation** — Create AppShell (nav: Designer, Runs, Integrations; logo: "Workflows"), WorkflowCard (name, triggers, status), StatusBadge components. Rewrite 3 pages: Designer gets workflow overview with trigger→action step sequence and scheduling options; Runs gets execution history table with status, duration, and retry actions; Integrations gets connector cards (Slack, GitHub, AWS, etc.) with configuration status and auth state. Use deps: button, input, card, alert, spinner, tabs, data-table, select, dialog, toast, tooltip, progress, switch, recipes-tailwind, navigation-menu, breadcrumb.

- [ ] **Step 7: Verify builds** — Run `vite build` in each of the 6 templates and confirm no errors

- [ ] **Step 8: Commit** — `git add templates/enterprise-settings templates/settings-portal templates/auth-starter templates/onboarding-app templates/search-application templates/workflow-automation && git commit -m "feat: implement SETTINGS/AUTH/SEARCH/WORKFLOW templates — enterprise-settings, settings-portal, auth-starter, onboarding-app, search-application, workflow-automation"`

---

### Task 8: Final verification

- [ ] **Step 1: Run vite build on all 27 implemented templates** — Confirm no build errors across all templates
- [ ] **Step 2: Verify file counts** — Each of the 27 templates should have: `src/components/AppShell.tsx` (or equivalent for non-shell), 2+ extracted components, 3 rich pages (each 90+ lines), updated `index.tsx`
- [ ] **Step 3: Commit** — `git add -A && git commit -m "feat: all 27 templates fully implemented with saas-dashboard pattern"`
