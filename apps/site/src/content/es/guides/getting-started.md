---
contentSchemaVersion: 1
title: "Getting Started"
description: "Install Solidiom and create your first project in under 5 minutes."
keywords: [getting-started, install, quickstart, tutorial, guide]
locale: es
maturity: beta
product: "Solidiom"
productLayer: guide
status: draft
translationSourceHash: "d6676193c4bfaf794b6c9017c97481a4096aa2e950374ca66b04250ef98f3265"
translationStatus: draft
---

# Getting Started

Get up and running with Solidiom in under 5 minutes.

## Prerequisites

- Node.js 20+ (LTS recommended)
- A package manager: npm, pnpm, Yarn, or Bun

## Create a Project

```sh
npx solidiom create my-app --template saas-dashboard
cd my-app
npm install
npm run dev
```

## Choose a Template

Solidiom ships 31 templates across two portfolios:

- **Balanced Product** — SaaS dashboards, auth flows, billing, content management
- **Enterprise** — IAM, audit logs, compliance, API management, security

Browse all templates at [/templates/](/templates/).

## Add Components

Add individual components to an existing project:

```sh
npx solidiom add button
npx solidiom add dialog
npx solidiom add data-table
```

## Choose a Styling Profile

Solidiom supports three styling outputs:

- **CSS** — Plain CSS with semantic data-attribute selectors
- **Tailwind** — Tailwind CSS utility classes
- **UnoCSS** — UnoCSS atomic utilities

Set your profile during project creation or in `.solidiom/config.json`.

## Choose a Theme

Apply a preset theme or build your own:

```sh
npx solidiom add --theme ocean
```

Available presets: Ocean, Forest, Slate, Aurora.

## Next Steps

- [Browse primitives](/primitives/) — 52 headless building blocks
- [Browse components](/components/) — 52 styled recipe wrappers
- [Theme builder](/themes/builder/) — visual theme editor
- [CLI reference](/guides/cli-overview/) — full command documentation
