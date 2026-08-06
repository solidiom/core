---
contentSchemaVersion: 1
title: "Billing Portal"
description: "Billing portal with subscriptions, payments, and invoices."
keywords: [billing-portal, template, starter, solid, billing]
locale: en
maturity: draft
product: "Billing Portal"
productLayer: template
status: draft
package: "@solidiom/template-billing-portal"
stack: vite-solid-router
portfolios: ["balanced-product"]
---

Billing Portal provides a production-ready starting point for subscription and payment management.

## Overview

This template scaffolds a complete billing interface with plan comparison, payment method management, and invoice history.

## Stack

- **Framework:** Vite + Solid Router
- **Routing:** File-based routing with Solid Router
- **Rendering:** Client-side rendering
- **Build tool:** Vite

## Required Blocks

- BLOCK-AUTH-01 (Sign In)
- BLOCK-BILLING-01 (Subscription Plans)
- BLOCK-BILLING-02 (Payment Method)
- BLOCK-BILLING-03 (Invoice History)

## Styling

The template ships with a pre-configured Tailwind styling profile. The theme system allows switching between presets without modifying component code.

## Installation

```sh
solidiom create my-app --template billing-portal
```

Pass `--yes` to skip prompts and `--styling` to select a styling profile.

## Deployment

Deploy the static output to any CDN or static hosting platform. Vercel, Netlify, and Cloudflare Pages are supported targets.
