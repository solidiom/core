---
contentSchemaVersion: 1
title: "Getting Started"
description: "Install Solidiom and create your first project in under 5 minutes."
keywords: [getting-started, install, quickstart, tutorial, guide]
locale: en
maturity: beta
product: "Solidiom"
productLayer: guide
status: draft
---

# Getting Started

Get up and running with Solidiom in under 5 minutes.

## Prerequisites

- Node.js 24+ (the workspace requires Node 24)
- A package manager: npm, pnpm, Yarn, or Bun

## Create a Project

```sh
npx @solidiom/cli create my-app --template saas-dashboard
cd my-app
pnpm install
pnpm run dev
```

## Choose a Template

Solidiom ships 31 templates across two portfolios:

- **Balanced Product** — SaaS dashboards, auth flows, billing, content management
- **Enterprise** — IAM, audit logs, compliance, API management, security

Browse all templates at [/templates/](/templates/).

## Add Components

Add individual components to an existing project:

```sh
npx @solidiom/cli add button
npx @solidiom/cli add dialog
npx @solidiom/cli add data-table
```

## Choose a Styling Profile

Solidiom supports three styling outputs:

- **CSS** — Plain CSS with semantic data-attribute selectors
- **Tailwind** — Tailwind CSS utility classes
- **UnoCSS** — UnoCSS atomic utilities

Set your profile during project creation or in `.solidiom/config.json`.

## Choose a Theme

Install the theme package and import one of its CSS or Tailwind entrypoints:

```sh
pnpm add @solidiom/themes
```

```css
@import "@solidiom/themes/css/ocean.css";
```

Available package themes: Solidiom Default, Ocean, Forest, Slate, and Aurora.

## Next Steps

- [Browse primitives](/primitives/) — 86 headless building blocks
- [Browse components](/components/) — 32 styled catalog components
- [Theme builder](/themes/builder/) — visual theme editor
- [CLI reference](/guides/cli-overview/) — full command documentation
