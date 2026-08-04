---
id: block-catalog-manifest
title: "Block Catalog Manifest"
sidebar_label: Block Catalog Manifest
description: Concrete names, outcomes, required states, component dependencies, and data boundaries for all 36 block slots in the Solidiom catalog.
doc_type: reference
audience: "Solidiom contributors, block implementers, template authors"
tags: [blocks, catalog, manifest, contract, composition]
lifecycle: current
---

> **Purpose:** the normative block catalog manifest. Assigns a concrete name, product outcome, required states, component dependencies, and data boundary to every reserved slot. Supersedes placeholder category labels in `docs/plans/website-tasks.md` §9.3. No placeholder name ships per Block DoD §8.3.

**Manifest version:** 2
**Status:** approved; all 36 slots populated.
**Task:** `docs/plans/website-tasks.md` §9.3 `BLOCK-000`
**Depends on:** representative `COMP-*` components complete

> **Version 2 — component IDs corrected.** Ten citations in version 1 used `PRIM-*` numbers with a `COMP-` prefix; each matched `PRIM-<same number>` exactly, so the names in this document were the authored intent and the IDs were the defect. All ten are corrected. Two of them — `COMP-016` meaning Data Table in 19 blocks, and `COMP-014` meaning Command Palette in one — fell inside `COMP-001..021` and so resolved cleanly to the **wrong** component instead of failing validation. Nine of the intended components were absent from the approved catalog, which `website-tasks.md` §9.2 now extends from 21 to 30. `proposedComponents` is empty for every block; see the `resolution` block in the JSON for the full mapping.

---

## 1. Format

Each block entry specifies:

- **Name** — concrete, human-readable identifier. No placeholders.
- **Outcome** — what the block delivers to the user.
- **States** — loading, empty, error, and any domain-specific states required by the Block DoD.
- **COMP-\*** — component dependencies from the Solidiom component catalog.
- **Data boundary** — what data the block needs, from where, and any external service assumptions.

## 2. Authentication — AUTH

### BLOCK-AUTH-01 — Sign In

- **Outcome**: User can authenticate with email/password or OAuth and reach the authenticated application shell.
- **States**: Loading (credentials submit), Empty (no provider selected), Error (invalid credentials, network failure), Permission-restricted (account locked, MFA required), Success (redirect to post-auth destination)
- **COMP-***: COMP-001 (Button), COMP-002 (Input), COMP-003 (Field), COMP-005 (Alert), COMP-029 (Spinner)
- **Data boundary**: Authentication service via OAuth 2.0 / OIDC or credential endpoint. No persistent data at rest within the block; session token passed to application shell.

### BLOCK-AUTH-02 — Sign Up

- **Outcome**: New user can register an account with email, password, and optional OAuth, then complete email verification.
- **States**: Loading (form submit, verification email send), Empty (no registration method chosen), Error (email already taken, weak password, verification failed, network failure), Verification-pending (awaiting email confirmation), Success (redirect to onboarding)
- **COMP-***: COMP-001 (Button), COMP-002 (Input), COMP-003 (Field), COMP-005 (Alert), COMP-010 (Toast), COMP-029 (Spinner)
- **Data boundary**: User creation service and email delivery service. Temporary verification token; no PII stored within the block.

### BLOCK-AUTH-03 — Reset Password

- **Outcome**: User who has forgotten their password can request a reset link and set a new password.
- **States**: Loading (request submit, password update), Empty (initial email input), Error (email not found — generic message, expired token, network failure), Token-expired (reset link expired), Success (password updated, redirect to sign in)
- **COMP-***: COMP-001 (Button), COMP-002 (Input), COMP-003 (Field), COMP-005 (Alert), COMP-010 (Toast), COMP-029 (Spinner)
- **Data boundary**: Password reset service; time-limited tokens. Block never exposes whether an email exists in the system.

## 3. Onboarding — ONBOARD

### BLOCK-ONBOARD-01 — Welcome Wizard

- **Outcome**: New user completes a guided multi-step introduction to the platform's core features and preferences.
- **States**: Loading (step transitions), Empty (wizard not started), Error (step save failure, network failure), In-progress (current step with progress indicator), Completed (all steps finished, redirect to dashboard)
- **COMP-***: COMP-001 (Button), COMP-004 (Card), COMP-005 (Alert), COMP-009 (Tabs), COMP-012 (Avatar), COMP-013 (Checkbox), COMP-015 (Switch), COMP-020 (Breadcrumb), COMP-029 (Spinner)
- **Data boundary**: User preferences service. Skippable steps; partial progress persisted to resume later.

### BLOCK-ONBOARD-02 — Profile Setup

- **Outcome**: User configures display name, avatar, bio, and organizational affiliation.
- **States**: Loading (profile save, avatar upload), Empty (no profile data), Error (upload failure, validation failure, network failure), Success (profile saved)
- **COMP-***: COMP-001 (Button), COMP-002 (Input), COMP-003 (Field), COMP-005 (Alert), COMP-007 (Select), COMP-010 (Toast), COMP-012 (Avatar), COMP-029 (Spinner)
- **Data boundary**: User profile service and file storage for avatar. Block reads current user context; writes profile updates.

### BLOCK-ONBOARD-03 — Project Starter

- **Outcome**: User creates their first project by selecting a template, naming the project, and configuring initial settings.
- **States**: Loading (template fetch, project creation), Empty (no templates selected), Error (template unavailable, name conflict, network failure), In-progress (project provisioning), Success (redirect to project)
- **COMP-***: COMP-001 (Button), COMP-002 (Input), COMP-003 (Field), COMP-004 (Card), COMP-005 (Alert), COMP-007 (Select), COMP-021 (Pagination), COMP-029 (Spinner)
- **Data boundary**: Template catalog service and project creation service. Block reads available templates; creates project resource.

## 4. Settings — SETTINGS

### BLOCK-SETTINGS-01 — Account Settings

- **Outcome**: User manages profile information, email address, and password from a single settings panel.
- **States**: Loading (form loads, save in progress), Empty (no changes made), Error (save failure, validation error, network failure), Unsaved-changes (dirty form state), Success (changes persisted)
- **COMP-***: COMP-001 (Button), COMP-002 (Input), COMP-003 (Field), COMP-005 (Alert), COMP-006 (Dialog), COMP-009 (Tabs), COMP-010 (Toast), COMP-012 (Avatar), COMP-029 (Spinner)
- **Data boundary**: User profile and authentication services. Block reads current user data; writes profile and password updates. Email change requires re-verification.

### BLOCK-SETTINGS-02 — Notification Preferences

- **Outcome**: User configures which notifications they receive via email, push, and in-app channels, organized by category.
- **States**: Loading (preferences load), Empty (no notification categories), Error (save failure, network failure), Unsaved-changes (dirty form), Success (preferences saved)
- **COMP-***: COMP-001 (Button), COMP-003 (Field), COMP-004 (Card), COMP-009 (Tabs), COMP-013 (Checkbox), COMP-014 (Radio Group), COMP-015 (Switch), COMP-021 (Pagination), COMP-029 (Spinner)
- **Data boundary**: Notification preferences service. Block reads per-user notification settings; writes updated preferences.

### BLOCK-SETTINGS-03 — Danger Zone

- **Outcome**: User can deactivate account, request data export, or permanently delete account with explicit confirmation.
- **States**: Loading (deactivation, export request, deletion), Empty (no pending actions), Error (operation failed, insufficient permissions, network failure), Confirmation-required (destructive action modal), Processing (async export in progress)
- **COMP-***: COMP-001 (Button), COMP-004 (Card), COMP-005 (Alert), COMP-006 (Dialog), COMP-010 (Toast), COMP-026 (Progress), COMP-029 (Spinner)
- **Data boundary**: Account lifecycle service and data export service. Block requires re-authentication for destructive actions. Data export is async with status polling.

## 5. Billing — BILLING

### BLOCK-BILLING-01 — Subscription Plans

- **Outcome**: User can compare available subscription plans, select a plan, and upgrade or downgrade their subscription.
- **States**: Loading (plans fetch, billing transition), Empty (no plans available), Error (billing service unavailable, payment required, network failure), Current-plan-highlighted (active plan visually distinguished), Confirmation-required (plan change)
- **COMP-***: COMP-001 (Button), COMP-004 (Card), COMP-005 (Alert), COMP-006 (Dialog), COMP-009 (Tabs), COMP-010 (Toast), COMP-013 (Checkbox), COMP-029 (Spinner)
- **Data boundary**: Billing service for plan catalog and current subscription. Block reads plan metadata and user's active subscription; writes plan changes.

### BLOCK-BILLING-02 — Payment Method

- **Outcome**: User can add, manage, and remove payment methods for their account.
- **States**: Loading (payment form, method fetch), Empty (no payment methods on file), Error (payment declined, service error, network failure), Processing (payment tokenization), Success (method added/removed)
- **COMP-***: COMP-001 (Button), COMP-002 (Input), COMP-003 (Field), COMP-004 (Card), COMP-005 (Alert), COMP-006 (Dialog), COMP-007 (Select), COMP-008 (Dropdown Menu), COMP-010 (Toast), COMP-029 (Spinner)
- **Data boundary**: Payment processor via tokenization API. Block never stores raw card numbers; relies on payment provider's hosted fields or tokens.

### BLOCK-BILLING-03 — Invoice History

- **Outcome**: User can view, filter, and download past invoices and payment receipts.
- **States**: Loading (invoices fetch), Empty (no invoice history), Error (fetch failure, network failure), Filtering-active (applied date/amount filters)
- **COMP-***: COMP-001 (Button), COMP-002 (Input), COMP-004 (Card), COMP-007 (Select), COMP-017 (Popover), COMP-021 (Pagination), COMP-023 (Data Table), COMP-029 (Spinner)
- **Data boundary**: Billing service invoice endpoint. Read-only block; invoice PDFs served via pre-signed URLs from the billing provider.

## 6. Administration — ADMIN

### BLOCK-ADMIN-01 — Team Management

- **Outcome**: Admin can invite new team members, manage existing members, assign roles, and remove access.
- **States**: Loading (members fetch, invite send), Empty (no team members), Error (invite failed, permission denied, network failure), Pending-invite (invitation sent, awaiting acceptance), Success (member added/removed)
- **COMP-***: COMP-001 (Button), COMP-002 (Input), COMP-003 (Field), COMP-004 (Card), COMP-005 (Alert), COMP-006 (Dialog), COMP-007 (Select), COMP-012 (Avatar), COMP-017 (Popover), COMP-021 (Pagination), COMP-023 (Data Table), COMP-029 (Spinner)
- **Data boundary**: Team management and invitation services. Block requires admin role; reads team roster; writes invites and membership changes.

### BLOCK-ADMIN-02 — Audit Log

- **Outcome**: Admin can review a filterable log of system and user activities with timestamps, actors, and action details.
- **States**: Loading (log fetch), Empty (no events in range), Error (fetch failure, permission denied, network failure), Filtering-active (applied filters), Pagination-loading (next page)
- **COMP-***: COMP-002 (Input), COMP-004 (Card), COMP-007 (Select), COMP-013 (Checkbox), COMP-017 (Popover), COMP-020 (Breadcrumb), COMP-021 (Pagination), COMP-023 (Data Table), COMP-029 (Spinner)
- **Data boundary**: Audit event store. Read-only block; requires admin role. Events are immutable append-only records.

### BLOCK-ADMIN-03 — Role Permissions

- **Outcome**: Admin can view and edit role-permission mappings in a matrix interface to control access granularity.
- **States**: Loading (roles/permissions fetch), Empty (no custom roles), Error (save failure, permission conflict, network failure), Unsaved-changes (dirty matrix), Confirmation-required (permission revocation), Success (matrix saved)
- **COMP-***: COMP-001 (Button), COMP-003 (Field), COMP-004 (Card), COMP-005 (Alert), COMP-006 (Dialog), COMP-009 (Tabs), COMP-013 (Checkbox), COMP-015 (Switch), COMP-021 (Pagination), COMP-023 (Data Table), COMP-029 (Spinner)
- **Data boundary**: Role and permission services. Block reads role definitions and permission schema; writes role-permission mappings. Changes take effect on next authentication cycle.

## 7. Observability — OBS

### BLOCK-OBS-01 — Dashboard Overview

- **Outcome**: User sees a high-level metrics dashboard with charts, key indicators, and trend summaries.
- **States**: Loading (metrics fetch, chart render), Empty (no data for period), Error (data source unavailable, network failure), Stale-data (metrics not recently updated), Auto-refresh-active (periodic data refresh)
- **COMP-***: COMP-004 (Card), COMP-007 (Select), COMP-009 (Tabs), COMP-011 (Tooltip), COMP-023 (Data Table), COMP-025 (Meter), COMP-026 (Progress), COMP-029 (Spinner)
- **Data boundary**: Metrics aggregation service. Read-only block; data refreshes on a configurable interval. Time-range selector controls query window.

### BLOCK-OBS-02 — Real-time Events

- **Outcome**: User monitors a live stream of system events with filtering, search, and pause/resume controls.
- **States**: Loading (initial events, connection), Empty (no events, stream disconnected), Error (connection lost, filter error, network failure), Paused (stream halted by user), Filtering-active (applied event filters)
- **COMP-***: COMP-001 (Button), COMP-002 (Input), COMP-003 (Field), COMP-004 (Card), COMP-005 (Alert), COMP-007 (Select), COMP-013 (Checkbox), COMP-015 (Switch), COMP-023 (Data Table), COMP-029 (Spinner)
- **Data boundary**: Events streaming service via WebSocket or SSE. Read-only block; events are ephemeral unless explicitly saved.

### BLOCK-OBS-03 — Alert Configuration

- **Outcome**: User creates, edits, and manages alert rules with thresholds, channels, and notification targets.
- **States**: Loading (rules fetch, channels fetch), Empty (no alert rules), Error (save failure, invalid threshold, network failure), Unsaved-changes (dirty rule form), Testing (alert test firing), Success (rule saved)
- **COMP-***: COMP-001 (Button), COMP-002 (Input), COMP-003 (Field), COMP-004 (Card), COMP-005 (Alert), COMP-006 (Dialog), COMP-007 (Select), COMP-009 (Tabs), COMP-010 (Toast), COMP-013 (Checkbox), COMP-015 (Switch), COMP-023 (Data Table), COMP-029 (Spinner)
- **Data boundary**: Alert rules service and notification channel registry. Block reads existing rules; creates/updates/deletes alert configurations.

## 8. Resource Management — RESOURCE

### BLOCK-RESOURCE-01 — Resource List

- **Outcome**: User can browse, search, filter, and sort a comprehensive list of resources with status indicators.
- **States**: Loading (resources fetch), Empty (no resources match), Error (fetch failure, network failure), Filtering-active (applied filters/sorts), Selection-active (one or more resources selected)
- **COMP-***: COMP-002 (Input), COMP-004 (Card), COMP-005 (Alert), COMP-007 (Select), COMP-008 (Dropdown Menu), COMP-012 (Avatar), COMP-013 (Checkbox), COMP-017 (Popover), COMP-021 (Pagination), COMP-023 (Data Table), COMP-029 (Spinner)
- **Data boundary**: Resource catalog service. Read-only block with bulk selection for downstream actions. Supports server-side pagination and filtering.

### BLOCK-RESOURCE-02 — Resource Detail

- **Outcome**: User views a single resource's full details, metadata, activity history, and available actions.
- **States**: Loading (resource fetch), Empty (resource not found), Error (fetch failure, access denied, network failure), Action-in-progress (operation on resource), History-visible (activity timeline expanded)
- **COMP-***: COMP-001 (Button), COMP-004 (Card), COMP-005 (Alert), COMP-006 (Dialog), COMP-008 (Dropdown Menu), COMP-009 (Tabs), COMP-010 (Toast), COMP-012 (Avatar), COMP-020 (Breadcrumb), COMP-023 (Data Table), COMP-029 (Spinner)
- **Data boundary**: Resource detail service and activity log. Block reads resource data; performs scoped actions (start/stop/delete) with confirmation.

### BLOCK-RESOURCE-03 — Resource Creator

- **Outcome**: User creates a new resource through a guided multi-step wizard with template selection, configuration, and validation.
- **States**: Loading (templates fetch, resource provisioning), Empty (step not started), Error (validation failure, quota exceeded, network failure), Step-in-progress (wizard navigation), Provisioning (async creation), Success (resource created)
- **COMP-***: COMP-001 (Button), COMP-002 (Input), COMP-003 (Field), COMP-004 (Card), COMP-005 (Alert), COMP-006 (Dialog), COMP-007 (Select), COMP-009 (Tabs), COMP-010 (Toast), COMP-013 (Checkbox), COMP-015 (Switch), COMP-020 (Breadcrumb), COMP-026 (Progress), COMP-029 (Spinner)
- **Data boundary**: Resource creation service and template catalog. Block reads templates and quota; creates resource asynchronously.

## 9. AI Interfaces — AI

### BLOCK-AI-01 — Chat Interface

- **Outcome**: User engages in a conversational AI chat with message history, streaming responses, and attachment support.
- **States**: Loading (model response streaming, history fetch), Empty (no conversation started), Error (model unavailable, rate limited, network failure), Streaming (partial response rendering), Typing (user composing), Context-full (conversation history loaded)
- **COMP-***: COMP-001 (Button), COMP-002 (Input), COMP-003 (Field), COMP-004 (Card), COMP-005 (Alert), COMP-008 (Dropdown Menu), COMP-010 (Toast), COMP-017 (Popover), COMP-028 (Scroll Area), COMP-029 (Spinner)
- **Data boundary**: AI chat service with streaming responses. Block manages conversation state locally; persists messages to chat history service.

### BLOCK-AI-02 — Prompt Studio

- **Outcome**: User builds, tests, saves, and organizes AI prompts with variables, templates, and versioning.
- **States**: Loading (prompts fetch, test execution), Empty (no saved prompts), Error (save failure, test failed, network failure), Unsaved-changes (dirty prompt editor), Testing (prompt execution in progress), Success (prompt saved)
- **COMP-***: COMP-001 (Button), COMP-002 (Input), COMP-003 (Field), COMP-004 (Card), COMP-005 (Alert), COMP-006 (Dialog), COMP-007 (Select), COMP-008 (Dropdown Menu), COMP-009 (Tabs), COMP-010 (Toast), COMP-013 (Checkbox), COMP-017 (Popover), COMP-023 (Data Table), COMP-029 (Spinner)
- **Data boundary**: Prompt storage service and AI execution endpoint. Block reads/writes prompt definitions; executes test prompts against AI service.

### BLOCK-AI-03 — Workflow Builder

- **Outcome**: User orchestrates multi-step AI workflows with chained prompts, conditional logic, and external tool integrations.
- **States**: Loading (workflow fetch, step execution), Empty (no workflow steps), Error (step failure, connection error, network failure), Editing (workflow canvas active), Running (workflow execution), Success (workflow completed)
- **COMP-***: COMP-001 (Button), COMP-002 (Input), COMP-003 (Field), COMP-004 (Card), COMP-005 (Alert), COMP-006 (Dialog), COMP-007 (Select), COMP-008 (Dropdown Menu), COMP-009 (Tabs), COMP-010 (Toast), COMP-013 (Checkbox), COMP-015 (Switch), COMP-023 (Data Table), COMP-026 (Progress), COMP-029 (Spinner)
- **Data boundary**: Workflow definition service and execution engine. Block reads/writes workflow definitions; triggers async execution with status polling.

## 10. Search — SEARCH

### BLOCK-SEARCH-01 — Search Results

- **Outcome**: User performs full-text search across content with faceted filters, result highlighting, and pagination.
- **States**: Loading (query execution), Empty (no query entered, no results match), Error (search unavailable, network failure), Filtering-active (applied facets), Highlighting-active (matched terms highlighted)
- **COMP-***: COMP-002 (Input), COMP-004 (Card), COMP-005 (Alert), COMP-007 (Select), COMP-013 (Checkbox), COMP-020 (Breadcrumb), COMP-021 (Pagination), COMP-023 (Data Table), COMP-029 (Spinner)
- **Data boundary**: Search index service. Read-only block; query and filter parameters passed to search API. Results include snippet and metadata.

### BLOCK-SEARCH-02 — Saved Searches

- **Outcome**: User saves frequent search queries, sets up alert notifications for new matches, and manages saved search collections.
- **States**: Loading (saved searches fetch), Empty (no saved searches), Error (save failure, network failure), Alert-active (monitoring for new matches), Success (search saved)
- **COMP-***: COMP-001 (Button), COMP-002 (Input), COMP-003 (Field), COMP-004 (Card), COMP-005 (Alert), COMP-006 (Dialog), COMP-008 (Dropdown Menu), COMP-010 (Toast), COMP-013 (Checkbox), COMP-015 (Switch), COMP-023 (Data Table), COMP-029 (Spinner)
- **Data boundary**: Saved search storage and alert notification service. Block reads/writes saved queries; manages alert subscriptions.

### BLOCK-SEARCH-03 — Search Analytics

- **Outcome**: User views search usage statistics including popular queries, zero-result rates, and search behavior trends.
- **States**: Loading (analytics fetch), Empty (no search data for period), Error (data unavailable, network failure), Date-range-selected (custom period active)
- **COMP-***: COMP-004 (Card), COMP-007 (Select), COMP-009 (Tabs), COMP-011 (Tooltip), COMP-023 (Data Table), COMP-025 (Meter), COMP-026 (Progress), COMP-029 (Spinner)
- **Data boundary**: Search analytics aggregation service. Read-only block; aggregates anonymized search metrics. No individual query content exposed.

## 11. Commerce — COMMERCE

### BLOCK-COMMERCE-01 — Product Catalog

- **Outcome**: User browses a product catalog with grid/list views, category filtering, sorting, and product detail previews.
- **States**: Loading (products fetch), Empty (no products in category), Error (catalog unavailable, network failure), Filtering-active (applied filters/sorts), Loading-more (infinite scroll pagination)
- **COMP-***: COMP-001 (Button), COMP-002 (Input), COMP-004 (Card), COMP-005 (Alert), COMP-007 (Select), COMP-012 (Avatar), COMP-013 (Checkbox), COMP-017 (Popover), COMP-021 (Pagination), COMP-029 (Spinner)
- **Data boundary**: Product catalog service. Read-only block; product images served via CDN. Price and availability cached with TTL.

### BLOCK-COMMERCE-02 — Shopping Cart

- **Outcome**: User manages cart items with quantity adjustments, coupon application, and checkout initiation.
- **States**: Loading (cart fetch, totals calculation), Empty (no items in cart), Error (item unavailable, coupon invalid, network failure), Updating (quantity change in progress), Checkout-ready (cart validated), Success (item added/removed)
- **COMP-***: COMP-001 (Button), COMP-002 (Input), COMP-003 (Field), COMP-004 (Card), COMP-005 (Alert), COMP-006 (Dialog), COMP-008 (Dropdown Menu), COMP-010 (Toast), COMP-015 (Switch), COMP-023 (Data Table), COMP-029 (Spinner)
- **Data boundary**: Cart service and pricing service. Block reads cart state; updates quantities and coupons. Checkout transitions to billing flow.

### BLOCK-COMMERCE-03 — Order Tracking

- **Outcome**: User views order status, tracking information, delivery timeline, and order history.
- **States**: Loading (orders fetch, tracking update), Empty (no orders placed), Error (tracking unavailable, network failure), Order-in-transit (tracking timeline active), Order-completed (fulfillment confirmed)
- **COMP-***: COMP-001 (Button), COMP-002 (Input), COMP-004 (Card), COMP-005 (Alert), COMP-009 (Tabs), COMP-011 (Tooltip), COMP-020 (Breadcrumb), COMP-021 (Pagination), COMP-023 (Data Table), COMP-026 (Progress), COMP-029 (Spinner)
- **Data boundary**: Order management and shipping tracking services. Read-only block; tracking data polled from carrier APIs.

## 12. Content — CONTENT

### BLOCK-CONTENT-01 — Content Editor

- **Outcome**: User creates and edits rich content with a WYSIWYG or markdown editor, formatting toolbar, and preview.
- **States**: Loading (document fetch, editor init), Empty (blank document), Error (save failure, conflict detected, network failure), Unsaved-changes (dirty editor), Preview-active (split preview mode), Autosaved (background save confirmation)
- **COMP-***: COMP-001 (Button), COMP-002 (Input), COMP-003 (Field), COMP-004 (Card), COMP-005 (Alert), COMP-007 (Select), COMP-008 (Dropdown Menu), COMP-009 (Tabs), COMP-010 (Toast), COMP-015 (Switch), COMP-017 (Popover), COMP-029 (Spinner), COMP-030 (Toolbar)
- **Data boundary**: Content storage service. Block reads document content; writes incremental saves with conflict detection.

### BLOCK-CONTENT-02 — Content Library

- **Outcome**: User manages a library of content assets including documents, images, and files with search, folders, and metadata.
- **States**: Loading (assets fetch), Empty (library empty, no matches), Error (fetch failure, upload failed, network failure), Upload-in-progress (file transfer), Selection-active (assets selected for action)
- **COMP-***: COMP-001 (Button), COMP-002 (Input), COMP-004 (Card), COMP-005 (Alert), COMP-006 (Dialog), COMP-007 (Select), COMP-008 (Dropdown Menu), COMP-012 (Avatar), COMP-013 (Checkbox), COMP-017 (Popover), COMP-021 (Pagination), COMP-023 (Data Table), COMP-026 (Progress), COMP-029 (Spinner)
- **Data boundary**: Asset storage and metadata service. Block reads asset listing; supports upload and deletion with confirmation.

### BLOCK-CONTENT-03 — Content Workflow

- **Outcome**: User manages content through a draft-review-publish pipeline with status tracking, assignments, and approval gates.
- **States**: Loading (pipeline fetch), Empty (no items in stage), Error (transition failed, permission denied, network failure), Draft (unsubmitted content), Review (awaiting approval), Published (live content), Archived (deprecated content)
- **COMP-***: COMP-001 (Button), COMP-002 (Input), COMP-003 (Field), COMP-004 (Card), COMP-005 (Alert), COMP-006 (Dialog), COMP-007 (Select), COMP-008 (Dropdown Menu), COMP-009 (Tabs), COMP-010 (Toast), COMP-012 (Avatar), COMP-013 (Checkbox), COMP-017 (Popover), COMP-020 (Breadcrumb), COMP-021 (Pagination), COMP-023 (Data Table), COMP-029 (Spinner)
- **Data boundary**: Content workflow and approval services. Block reads pipeline state; transitions items between stages with permission checks.

## 13. Application Shell — SHELL

### BLOCK-SHELL-01 — Navigation Layout

- **Outcome**: User navigates the application via a responsive sidebar with collapsible menu sections, breadcrumbs, and current-route highlighting.
- **States**: Loading (nav items fetch), Empty (no navigation items), Error (nav service unavailable), Collapsed (minimized sidebar), Expanded (full sidebar), Mobile-overlay (sidebar as overlay on small screens)
- **COMP-***: COMP-001 (Button), COMP-005 (Alert), COMP-008 (Dropdown Menu), COMP-009 (Tabs), COMP-012 (Avatar), COMP-013 (Checkbox), COMP-017 (Popover), COMP-019 (Navigation Menu), COMP-020 (Breadcrumb), COMP-027 (Resizable Panels), COMP-029 (Spinner)
- **Data boundary**: Navigation configuration service and user permissions. Block reads menu structure; highlights active route. Sidebar state persisted in local storage.

### BLOCK-SHELL-02 — Command Palette

- **Outcome**: User accesses a global keyboard-driven command menu for quick navigation, search, and action execution.
- **States**: Loading (commands fetch, search execute), Empty (no matching commands), Error (search unavailable, network failure), Open (palette visible), Filtering-active (search narrowed results), Category-selected (results scoped to section)
- **COMP-***: COMP-002 (Input), COMP-004 (Card), COMP-007 (Select), COMP-008 (Dropdown Menu), COMP-022 (Command Palette), COMP-023 (Data Table), COMP-024 (Kbd), COMP-029 (Spinner)
- **Data boundary**: Command registry service. Block reads available commands scoped to user permissions; executes actions via command handlers.

### BLOCK-SHELL-03 — Notifications Center

- **Outcome**: User views, manages, and dismisses notifications from a unified panel with categorization, read/unread states, and mark-all-read.
- **States**: Loading (notifications fetch), Empty (no notifications), Error (fetch failure, network failure), Unread-count (badge with count), Filtering-active (scoped by type), Marking-read (bulk action in progress)
- **COMP-***: COMP-001 (Button), COMP-004 (Card), COMP-005 (Alert), COMP-007 (Select), COMP-008 (Dropdown Menu), COMP-010 (Toast), COMP-012 (Avatar), COMP-013 (Checkbox), COMP-015 (Switch), COMP-017 (Popover), COMP-021 (Pagination), COMP-029 (Spinner)
- **Data boundary**: Notification service with real-time updates. Block reads notification feed; writes read/dismiss states. Supports WebSocket push for new notifications.
