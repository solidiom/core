---
contentSchemaVersion: 1
title: "Billing Operations"
description: "Billing operations with invoices, reconciliation, and financial reports."
keywords: [billing-operations, template, starter, solid, billing, invoices, enterprise]
locale: en
maturity: draft
product: "Billing Operations"
productLayer: template
status: draft
package: "@solidiom/template-billing-operations"
stack: vite-solid-router
portfolios: ["enterprise-platform-governance"]
---

Billing Operations provides a production-ready starting point for building internal billing management and financial operations consoles.

## Overview

This template scaffolds a complete billing operations application with an invoice management view for creating, tracking, and resolving invoices, a reconciliation dashboard for matching payments and resolving discrepancies, and financial reporting with revenue summaries, aging reports, and dashboards.

## Stack

- **Framework:** Vite + Solid Router
- **Routing:** File-based routing with Solid Router
- **Rendering:** Client-side rendering
- **Build tool:** Vite

## Required Blocks

- BLOCK-AUTH-01 (Sign In)
- BLOCK-SHELL-01 (Navigation Layout)
- BLOCK-BILLING-01 (Plan Selection)
- BLOCK-BILLING-02 (Payment Method)
- BLOCK-BILLING-03 (Invoice History)

## Styling

The template ships with a pre-configured Tailwind styling profile. The theme system allows switching between presets without modifying component code.

## Installation

```sh
solidiom create my-app --template billing-operations
```

Pass `--yes` to skip prompts and `--styling` to select a styling profile.

## Deployment

Deploy the static output to any CDN or static hosting platform. Vercel, Netlify, and Cloudflare Pages are supported targets.
