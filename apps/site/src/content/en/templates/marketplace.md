---
contentSchemaVersion: 1
title: "Marketplace"
description: "Multi-vendor marketplace with browsing, seller dashboard, and listing detail."
keywords: [marketplace, template, starter, solid, ecommerce, vendors, listings]
locale: en
maturity: beta
product: "Marketplace"
productLayer: template
status: published
package: "@solidiom/template-marketplace"
stack: vite-solid-router
portfolios: ["balanced-product"]
---

Marketplace provides a production-ready starting point for building multi-vendor commerce platforms with product discovery and seller tools.

## Overview

This template scaffolds a complete marketplace application with a product browsing experience across multiple vendors, a seller dashboard for managing listings and viewing analytics, and a listing detail page with images, reviews, and purchase options.

## Stack

- **Framework:** Vite + Solid Router
- **Routing:** File-based routing with Solid Router
- **Rendering:** Client-side rendering
- **Build tool:** Vite

## Required Blocks

- BLOCK-AUTH-01 (Sign In)
- BLOCK-SHELL-01 (Navigation Layout)
- BLOCK-COMMERCE-01 (Product Catalog)
- BLOCK-COMMERCE-02 (Shopping Cart)
- BLOCK-COMMERCE-03 (Order Tracking)

## Styling

The template ships with a pre-configured Tailwind styling profile. The theme system allows switching between presets without modifying component code.

## Installation

```sh
solidiom create my-app --template marketplace
```

Pass `--yes` to skip prompts and `--styling` to select a styling profile.

## Deployment

Deploy the static output to any CDN or static hosting platform. Vercel, Netlify, and Cloudflare Pages are supported targets.
